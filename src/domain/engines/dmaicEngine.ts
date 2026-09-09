import type { Cause, DmaicProject, FMEAItem } from '@/domain/types';
import { clamp, ratio } from '@/lib/format';

export interface ParetoSlice {
  causeId: string;
  label: string;
  frequency: number;
  sharePct: number;
  cumulativePct: number;
  /** True while cumulative share is at or below 80%: the vital few. */
  isVitalFew: boolean;
}

/**
 * Pareto analysis over cause frequency. The 80% cut is applied to the
 * cumulative share so the boundary slice that crosses 80% is included.
 */
export function computePareto(causes: Cause[]): ParetoSlice[] {
  const sorted = [...causes].filter((c) => c.frequency > 0).sort((a, b) => b.frequency - a.frequency);
  const total = sorted.reduce((s, c) => s + c.frequency, 0);
  let cumulative = 0;
  let crossed = false;
  return sorted.map((c) => {
    const share = ratio(c.frequency, total);
    cumulative += share;
    const isVitalFew = !crossed;
    if (cumulative >= 0.8) crossed = true;
    return {
      causeId: c.id,
      label: c.title,
      frequency: c.frequency,
      sharePct: share,
      cumulativePct: cumulative,
      isVitalFew,
    };
  });
}

export type SigmaAssessment = {
  defectRate: number;
  dpmo: number;
  /** Long-term process sigma, the conventional 1.5-shift short-term figure. */
  sigmaLevel: number;
  yieldPct: number;
};

/**
 * Process sigma from a defect rate. Uses the standard normal quantile via a
 * rational approximation (Acklam), then adds the 1.5 sigma shift convention.
 */
export function computeSigma(defectRate: number): SigmaAssessment {
  const p = clamp(defectRate, 0, 1);
  const dpmo = p * 1_000_000;
  const yieldPct = 1 - p;
  if (p <= 0) return { defectRate: 0, dpmo: 0, sigmaLevel: 6, yieldPct: 1 };
  if (p >= 1) return { defectRate: 1, dpmo: 1_000_000, sigmaLevel: 0, yieldPct: 0 };
  const z = normalQuantile(yieldPct);
  return { defectRate: p, dpmo, sigmaLevel: clamp(z + 1.5, 0, 6), yieldPct };
}

/** Inverse standard normal CDF, Acklam's algorithm. Accurate to ~1e-9. */
export function normalQuantile(p: number): number {
  if (p <= 0 || p >= 1) return 0;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q: number;
  let r: number;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

export interface DmaicAssessment {
  projectId: string;
  ref: string;
  name: string;
  phase: DmaicProject['phase'];
  /** Phase progress 0..1, derived from the phase itself. */
  phaseProgress: number;
  sigma: SigmaAssessment;
  baseline: number;
  /** Baseline improved by the expected effect of implemented countermeasures. */
  projected: number;
  expectedImprovementPct: number;
  implementedCountermeasures: number;
  plannedCountermeasures: number;
  /** Annualised value of removing the modelled share of poor-quality cost. */
  projectedSavings: number;
  gateReadiness: { gate: string; ready: boolean; reason: string }[];
  drivers: string[];
}

const PHASE_ORDER: DmaicProject['phase'][] = ['define', 'measure', 'analyze', 'improve', 'control'];

export function assessDmaic(project: DmaicProject, causes: Cause[], fmea: FMEAItem[]): DmaicAssessment {
  const phaseIndex = PHASE_ORDER.indexOf(project.phase);
  const phaseProgress = ratio(phaseIndex + 1, PHASE_ORDER.length);
  const sigma = computeSigma(project.measure.defectRate);

  const implemented = project.improve.countermeasures.filter((c) => c.status === 'implemented');
  const piloting = project.improve.countermeasures.filter((c) => c.status === 'piloting');
  // Implemented countermeasures count fully; pilots at half weight.
  const combinedRemaining = [...implemented.map((c) => c.expectedImprovementPct), ...piloting.map((c) => c.expectedImprovementPct / 2)]
    .reduce((acc, pct) => acc * (1 - clamp(pct, 0, 1)), 1);
  const expectedImprovementPct = clamp(1 - combinedRemaining, 0, 0.95);
  const projected = project.measure.baseline * (1 - expectedImprovementPct);
  const projectedSavings = project.measure.costOfPoorQuality * expectedImprovementPct;

  const linkedCauses = causes.filter((c) => project.analyze.causeIds.includes(c.id));
  const linkedFmea = fmea.filter((f) => project.analyze.fmeaIds.includes(f.id));

  const gateReadiness = [
    {
      gate: 'Define',
      ready: project.define.problemStatement.length > 20 && project.define.ctq.length > 0,
      reason: project.define.ctq.length > 0 ? 'Problem statement and CTQs are defined' : 'CTQs are not defined',
    },
    {
      gate: 'Measure',
      ready: project.measure.baseline > 0 && project.measure.trend.length >= 3,
      reason: project.measure.trend.length >= 3 ? 'Baseline established over ' + project.measure.trend.length + ' periods' : 'Fewer than 3 baseline periods captured',
    },
    {
      gate: 'Analyze',
      ready: linkedCauses.some((c) => c.isRootCause) && linkedFmea.length > 0,
      reason: linkedCauses.some((c) => c.isRootCause)
        ? linkedCauses.length + ' cause(s) analysed, ' + linkedFmea.length + ' FMEA line(s) linked'
        : 'No validated root cause is linked yet',
    },
    {
      gate: 'Improve',
      ready: implemented.length > 0,
      reason: implemented.length > 0 ? implemented.length + ' countermeasure(s) implemented' : 'No countermeasure implemented yet',
    },
    {
      gate: 'Control',
      ready: project.control.controlMetric.length > 0 && project.control.linkedControlIds.length > 0,
      reason: project.control.linkedControlIds.length > 0
        ? 'Control metric and ' + project.control.linkedControlIds.length + ' standing control(s) in place'
        : 'No standing control is linked, improvement will not hold',
    },
  ];

  const drivers: string[] = [];
  drivers.push('Baseline ' + project.measure.baseline + ' ' + project.measure.unit + ', sigma ' + sigma.sigmaLevel.toFixed(2));
  if (expectedImprovementPct > 0)
    drivers.push('Modelled improvement of ' + Math.round(expectedImprovementPct * 100) + '% from ' + implemented.length + ' implemented and ' + piloting.length + ' piloting countermeasure(s)');
  const blockedGate = gateReadiness.find((g) => !g.ready);
  if (blockedGate) drivers.push(blockedGate.gate + ' gate not met: ' + blockedGate.reason);

  return {
    projectId: project.id,
    ref: project.ref,
    name: project.name,
    phase: project.phase,
    phaseProgress,
    sigma,
    baseline: project.measure.baseline,
    projected,
    expectedImprovementPct,
    implementedCountermeasures: implemented.length,
    plannedCountermeasures: project.improve.countermeasures.length,
    projectedSavings,
    gateReadiness,
    drivers,
  };
}

export interface FishboneGroup {
  category: Cause['category'];
  causes: Cause[];
  totalFrequency: number;
  rootCauseCount: number;
}

export function groupFishbone(causes: Cause[]): FishboneGroup[] {
  const categories: Cause['category'][] = ['people', 'process', 'technology', 'policy', 'environment', 'measurement', 'management'];
  return categories.map((category) => {
    const group = causes.filter((c) => c.category === category);
    return {
      category,
      causes: group.sort((a, b) => b.frequency - a.frequency),
      totalFrequency: group.reduce((s, c) => s + c.frequency, 0),
      rootCauseCount: group.filter((c) => c.isRootCause).length,
    };
  });
}

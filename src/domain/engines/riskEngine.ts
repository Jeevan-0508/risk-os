import type {
  Control,
  ExposureSample,
  ISODate,
  Likert5,
  RagStatus,
  Risk,
  RiskTrend,
} from '@/domain/types';
import { clamp, nonNegative, ratio } from '@/lib/format';
import { daysBetween } from '@/lib/dates';
import { combineControls, type CombinedControlEffect } from './controlEngine';
import type { ToleranceAssessment } from './toleranceEngine';

/** Probability bands used for the 5x5 matrix. Boundaries are inclusive upper. */
export const PROBABILITY_BANDS: { band: Likert5; max: number; label: string }[] = [
  { band: 1, max: 0.1, label: 'Rare' },
  { band: 2, max: 0.3, label: 'Unlikely' },
  { band: 3, max: 0.5, label: 'Possible' },
  { band: 4, max: 0.75, label: 'Likely' },
  { band: 5, max: 1, label: 'Almost certain' },
];

export const IMPACT_LABELS: Record<Likert5, string> = {
  1: 'Negligible',
  2: 'Minor',
  3: 'Moderate',
  4: 'Major',
  5: 'Severe',
};

export function probabilityBand(p: number): Likert5 {
  const v = clamp(p, 0, 1);
  for (const b of PROBABILITY_BANDS) {
    if (v <= b.max) return b.band;
  }
  return 5;
}

export function probabilityLabel(p: number): string {
  const band = probabilityBand(p);
  return PROBABILITY_BANDS.find((b) => b.band === band)?.label ?? 'Unknown';
}

/** 5x5 matrix score. Kept separate from financial exposure on purpose. */
export function matrixScore(probability: number, impact: Likert5): number {
  return probabilityBand(probability) * clamp(impact, 1, 5);
}

export function severityFromScore(score: number): RagStatus {
  if (score >= 15) return 'red';
  if (score >= 8) return 'amber';
  return 'green';
}

/**
 * Velocity: percentage change in financial exposure normalised to a 14-day
 * window, computed from the recorded history rather than asserted.
 * Positive means the risk is growing.
 */
export function computeVelocity(history: ExposureSample[], statusDate: ISODate, windowDays = 28): number {
  const samples = [...history].sort((a, b) => a.date.localeCompare(b.date));
  if (samples.length < 2) return 0;
  const latest = samples[samples.length - 1];
  // Earliest sample still inside the window, else the second-to-last point.
  let baseline = samples[0];
  for (const s of samples) {
    const age = daysBetween(s.date, statusDate);
    if (age !== null && age <= windowDays) {
      baseline = s;
      break;
    }
  }
  if (baseline === latest) baseline = samples[samples.length - 2];
  const span = daysBetween(baseline.date, latest.date);
  if (span === null || span <= 0) return 0;
  if (baseline.financialExposure <= 0) return latest.financialExposure > 0 ? 1 : 0;
  const change = ratio(latest.financialExposure - baseline.financialExposure, baseline.financialExposure);
  return (change / span) * 14;
}

export function classifyTrend(history: ExposureSample[], velocity: number, statusDate: ISODate): RiskTrend {
  if (history.length < 2) return 'new';
  const first = history[0];
  const age = daysBetween(first.date, statusDate);
  if (age !== null && age <= 14 && history.length < 3) return 'new';
  if (velocity >= 0.15) return 'accelerating';
  if (velocity > 0.03) return 'deteriorating';
  if (velocity <= -0.05) return 'improving';
  return 'stagnant';
}

export const TREND_LABEL: Record<RiskTrend, string> = {
  accelerating: 'Accelerating',
  deteriorating: 'Deteriorating',
  stagnant: 'Stagnant',
  improving: 'Improving',
  new: 'Newly raised',
};

export interface RiskAssessment {
  riskId: string;
  ref: string;
  title: string;
  status: Risk['status'];

  inherentProbability: number;
  inherentImpact: Likert5;
  inherentScore: number;
  inherentSeverity: RagStatus;
  inherentFinancialExposure: number;
  inherentScheduleExposureDays: number;

  controlEffect: CombinedControlEffect;
  controlEffectiveness: number;

  residualProbability: number;
  residualImpact: number;
  residualImpactBand: Likert5;
  residualScore: number;
  residualSeverity: RagStatus;
  residualFinancialExposure: number;
  residualScheduleExposureDays: number;

  /** Money removed by the control set. */
  exposureReduced: number;
  reductionPct: number;

  velocity: number;
  trend: RiskTrend;
  /** Composite 0..100 used for ranking; blends exposure, velocity and confidence. */
  priorityIndex: number;
  strategicExposure: number;
  reputationExposure: number;
  isCritical: boolean;
  drivers: string[];
  /** Populated by healthEngine as a post-processing enrichment step, never by assessRisk itself: see toleranceEngine.ts. Undefined until enriched. */
  tolerance?: ToleranceAssessment;
}

const HORIZON_WEIGHT = { immediate: 1.15, near: 1.05, mid: 0.95, far: 0.85 } as const;

/**
 * Core risk computation. Deliberately explicit so every number shown in the UI
 * can be traced back to an input.
 */
export function assessRisk(risk: Risk, controls: Control[], statusDate: ISODate): RiskAssessment {
  const linked = controls.filter((c) => risk.controlIds.includes(c.id));
  const controlEffect = combineControls(linked, statusDate, risk.evidenceConfidence);

  const inherentProbability = clamp(risk.inherentProbability, 0, 1);
  const inherentImpact = clamp(risk.inherentImpact, 1, 5) as Likert5;
  const inherentScore = matrixScore(inherentProbability, inherentImpact);
  const inherentFinancialExposure = nonNegative(risk.inherentFinancialImpact) * inherentProbability;
  const inherentScheduleExposureDays = nonNegative(risk.inherentScheduleImpactDays) * inherentProbability;

  const residualProbability = clamp(inherentProbability * (1 - controlEffect.probabilityReduction), 0, 1);
  const residualImpactMoney = nonNegative(risk.inherentFinancialImpact) * (1 - controlEffect.impactReduction);
  const residualImpact = clamp(inherentImpact * (1 - controlEffect.impactReduction), 0.2, 5);
  const residualImpactBand = Math.max(1, Math.round(residualImpact)) as Likert5;
  const residualScore = matrixScore(residualProbability, residualImpactBand);
  const residualFinancialExposure = residualProbability * residualImpactMoney;
  const residualScheduleExposureDays =
    residualProbability * nonNegative(risk.inherentScheduleImpactDays) * (1 - controlEffect.impactReduction);

  const exposureReduced = Math.max(0, inherentFinancialExposure - residualFinancialExposure);
  const reductionPct = ratio(exposureReduced, inherentFinancialExposure);

  const velocity = computeVelocity(risk.history, statusDate);
  const trend = classifyTrend(risk.history, velocity, statusDate);

  const horizon = HORIZON_WEIGHT[risk.timeHorizon] ?? 1;
  // Normalised exposure term uses a soft log scale so one huge risk does not
  // flatten the ranking of everything else.
  const exposureTerm = clamp(Math.log10(1 + residualFinancialExposure) / 7, 0, 1);
  const scoreTerm = residualScore / 25;
  const velocityTerm = clamp(0.5 + velocity, 0, 1.5) / 1.5;
  const priorityIndex = clamp(
    (exposureTerm * 0.4 + scoreTerm * 0.4 + velocityTerm * 0.2) * horizon * 100,
    0,
    100,
  );

  const residualSeverity = severityFromScore(residualScore);
  const isCritical =
    risk.status !== 'closed' &&
    (residualSeverity === 'red' || (trend === 'accelerating' && residualScore >= 12) || priorityIndex >= 70);

  const drivers: string[] = [];
  drivers.push(
    'Inherent exposure is ' +
      Math.round(inherentProbability * 100) +
      '% x ' +
      Math.round(nonNegative(risk.inherentFinancialImpact)).toLocaleString('en-GB'),
  );
  if (linked.length === 0) drivers.push('No controls are linked, so residual equals inherent');
  else
    drivers.push(
      linked.length +
        ' control(s) remove ' +
        Math.round(controlEffect.probabilityReduction * 100) +
        '% of likelihood and ' +
        Math.round(controlEffect.impactReduction * 100) +
        '% of consequence',
    );
  if (trend === 'accelerating') drivers.push('Exposure is accelerating at ' + Math.round(velocity * 100) + '% per fortnight');
  if (risk.evidenceConfidence === 'anecdotal') drivers.push('Assessment rests on anecdotal evidence only');
  if (risk.timeHorizon === 'immediate') drivers.push('Immediate time horizon raises priority');
  if (risk.affectedBenefitIds.length > 0) drivers.push(risk.affectedBenefitIds.length + ' benefit(s) are threatened');
  if (risk.affectedMilestoneIds.length > 0) drivers.push(risk.affectedMilestoneIds.length + ' milestone(s) are exposed');

  return {
    riskId: risk.id,
    ref: risk.ref,
    title: risk.title,
    status: risk.status,
    inherentProbability,
    inherentImpact,
    inherentScore,
    inherentSeverity: severityFromScore(inherentScore),
    inherentFinancialExposure,
    inherentScheduleExposureDays,
    controlEffect,
    controlEffectiveness: controlEffect.overallEffectiveness,
    residualProbability,
    residualImpact,
    residualImpactBand,
    residualScore,
    residualSeverity,
    residualFinancialExposure,
    residualScheduleExposureDays,
    exposureReduced,
    reductionPct,
    velocity,
    trend,
    priorityIndex,
    strategicExposure: clamp(risk.strategicImpact, 1, 5) * residualProbability,
    reputationExposure: clamp(risk.reputationImpact, 1, 5) * residualProbability,
    isCritical,
    drivers,
  };
}

export interface PortfolioRiskSummary {
  assessments: RiskAssessment[];
  byId: Record<string, RiskAssessment>;
  openCount: number;
  criticalCount: number;
  acceleratingCount: number;
  acceptedCount: number;
  closedCount: number;
  totalInherentExposure: number;
  totalResidualExposure: number;
  totalExposureReduced: number;
  averageControlEffectiveness: number;
  /** Residual exposure attributable to risks with no controls at all. */
  uncontrolledExposure: number;
  topRisks: RiskAssessment[];
}

export function assessPortfolio(risks: Risk[], controls: Control[], statusDate: ISODate): PortfolioRiskSummary {
  const assessments = risks.map((r) => assessRisk(r, controls, statusDate));
  const byId: Record<string, RiskAssessment> = {};
  for (const a of assessments) byId[a.riskId] = a;

  const live = assessments.filter((a) => a.status !== 'closed');
  const totalInherentExposure = live.reduce((s, a) => s + a.inherentFinancialExposure, 0);
  const totalResidualExposure = live.reduce((s, a) => s + a.residualFinancialExposure, 0);
  const effs = live.filter((a) => a.controlEffect.assessments.length > 0).map((a) => a.controlEffectiveness);

  const uncontrolledExposure = live
    .filter((a) => a.controlEffect.assessments.length === 0)
    .reduce((s, a) => s + a.residualFinancialExposure, 0);

  return {
    assessments,
    byId,
    openCount: assessments.filter((a) => a.status === 'open' || a.status === 'monitoring' || a.status === 'escalated').length,
    criticalCount: assessments.filter((a) => a.isCritical).length,
    acceleratingCount: live.filter((a) => a.trend === 'accelerating').length,
    acceptedCount: assessments.filter((a) => a.status === 'accepted').length,
    closedCount: assessments.filter((a) => a.status === 'closed').length,
    totalInherentExposure,
    totalResidualExposure,
    totalExposureReduced: Math.max(0, totalInherentExposure - totalResidualExposure),
    averageControlEffectiveness: effs.length === 0 ? 0 : effs.reduce((a, b) => a + b, 0) / effs.length,
    uncontrolledExposure,
    topRisks: [...live].sort((a, b) => b.priorityIndex - a.priorityIndex).slice(0, 10),
  };
}

export interface BurndownPoint {
  date: ISODate;
  open: number;
  critical: number;
  accepted: number;
  closed: number;
  residualExposure: number;
  inherentExposure: number;
}

/**
 * Reconstructs the register at each month end from the risk histories. The
 * point of the chart is falling exposure, not a falling count, so both series
 * are returned.
 */
export function computeBurndown(risks: Risk[], controls: Control[], months: ISODate[]): BurndownPoint[] {
  return months.map((monthStart) => {
    const cutoff = monthStart;
    let open = 0;
    let critical = 0;
    let accepted = 0;
    let closed = 0;
    let residualExposure = 0;
    let inherentExposure = 0;

    for (const risk of risks) {
      if (risk.dateIdentified > cutoff) continue;
      const samplesToDate = risk.history.filter((h) => h.date <= cutoff);
      if (samplesToDate.length === 0) continue;
      const latest = samplesToDate[samplesToDate.length - 1];
      const snapshot: Risk = {
        ...risk,
        inherentProbability: latest.probability,
        inherentImpact: latest.impactScore,
        inherentFinancialImpact: latest.financialExposure,
        history: samplesToDate,
      };
      const a = assessRisk(snapshot, controls, cutoff);
      const isClosedByThen = risk.status === 'closed' && risk.reviewDate <= cutoff;
      const isAcceptedByThen = risk.status === 'accepted' && risk.reviewDate <= cutoff;
      if (isClosedByThen) {
        closed += 1;
        continue;
      }
      if (isAcceptedByThen) accepted += 1;
      else open += 1;
      if (a.isCritical) critical += 1;
      residualExposure += a.residualFinancialExposure;
      inherentExposure += a.inherentFinancialExposure;
    }

    return { date: monthStart, open, critical, accepted, closed, residualExposure, inherentExposure };
  });
}

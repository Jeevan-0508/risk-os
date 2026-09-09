import type { Control, Program, Risk, Treatment } from '@/domain/types';
import { assessRisk, type RiskAssessment } from './riskEngine';
import { ratio } from '@/lib/format';
import { daysBetween } from '@/lib/dates';

/**
 * A treatment needs both time and post-start evidence before any claim about
 * its effect is trustworthy. Below this, the engine reports NOT_MEASURABLE
 * rather than guessing: see the module doc on causality.
 */
export const MIN_MEASUREMENT_DAYS = 14;

export type EffectivenessStatus = 'effective' | 'partially-effective' | 'underperforming' | 'failed' | 'not-measurable';

export interface ResponseEffectiveness {
  treatmentId: string;
  riskId: string;
  strategy: Treatment['strategy'];
  status: EffectivenessStatus;
  baselineExposure: number;
  expectedResidual: number;
  expectedReductionPct: number;
  expectedReductionAmount: number;
  /** Null while not measurable. Deliberately called "observed", never "caused": see module doc. */
  observedResidual: number | null;
  observedReductionPct: number | null;
  observedReductionAmount: number | null;
  /** observedReductionPct - expectedReductionPct. Negative means underperforming plan. */
  variance: number | null;
  measurable: boolean;
  daysSinceStart: number | null;
  headline: string;
}

/**
 * Residual exposure at treatment start, reconstructed the same way
 * computeBurndown reconstructs a historical register: swap in the nearest
 * exposure-history sample on or before the start date as the risk's inherent
 * position at that moment, then run it through the real control set at that
 * date. This keeps baseline and observed on the same footing (both residual,
 * both control-adjusted) so the comparison measures the treatment's own
 * contribution rather than picking up the controls' effect twice.
 */
function baselineExposureFor(risk: Risk, treatment: Treatment, controls: Control[]): number {
  const sorted = [...risk.history].sort((a, b) => a.date.localeCompare(b.date));
  const onOrBefore = sorted.filter((s) => s.date <= treatment.startDate);
  const sample = onOrBefore.length > 0 ? onOrBefore[onOrBefore.length - 1] : sorted[0];
  if (!sample) return assessRisk(risk, controls, treatment.startDate).residualFinancialExposure;

  const snapshot: Risk = {
    ...risk,
    inherentProbability: sample.probability,
    inherentImpact: sample.impactScore,
    inherentFinancialImpact: sample.financialExposure,
    history: onOrBefore.length > 0 ? onOrBefore : [sample],
  };
  return assessRisk(snapshot, controls, treatment.startDate).residualFinancialExposure;
}

/**
 * Deterministic response-effectiveness engine. Compares baseline exposure at
 * treatment start against the exposure reduction the plan expected and the
 * exposure actually observed since. See module doc: never claims causation
 * without enough post-start evidence to support it.
 */
export function assessResponseEffectiveness(
  risk: Risk,
  treatment: Treatment,
  assessment: RiskAssessment,
  controls: Control[],
  statusDate: string,
): ResponseEffectiveness {
  const baselineExposure = baselineExposureFor(risk, treatment, controls);
  const expectedReductionPct = treatment.expectedExposureReductionPct;
  const expectedReductionAmount = baselineExposure * expectedReductionPct;
  const expectedResidual = baselineExposure - expectedReductionAmount;

  const daysSinceStart = daysBetween(treatment.startDate, statusDate);
  const hasPostStartEvidence = risk.history.some((s) => s.date > treatment.startDate);
  const measurable = hasPostStartEvidence && daysSinceStart !== null && daysSinceStart >= MIN_MEASUREMENT_DAYS;

  if (!measurable) {
    return {
      treatmentId: treatment.id,
      riskId: risk.id,
      strategy: treatment.strategy,
      status: 'not-measurable',
      baselineExposure,
      expectedResidual,
      expectedReductionPct,
      expectedReductionAmount,
      observedResidual: null,
      observedReductionPct: null,
      observedReductionAmount: null,
      variance: null,
      measurable,
      daysSinceStart,
      headline: 'Not enough post-start evidence yet to measure this treatment; no effectiveness claim is made.',
    };
  }

  const observedResidual = assessment.residualFinancialExposure;
  const observedReductionAmount = baselineExposure - observedResidual;
  const observedReductionPct = ratio(observedReductionAmount, baselineExposure);
  const variance = observedReductionPct - expectedReductionPct;
  const performanceRatio = expectedReductionPct > 0 ? observedReductionPct / expectedReductionPct : observedReductionPct >= 0 ? 1 : 0;

  let status: EffectivenessStatus;
  if (observedReductionAmount <= 0) status = 'failed';
  else if (performanceRatio >= 0.85) status = 'effective';
  else if (performanceRatio >= 0.5) status = 'partially-effective';
  else status = 'underperforming';

  const headline =
    status === 'failed'
      ? `Exposure has grown by ${Math.round(-observedReductionAmount).toLocaleString('en-GB')} since treatment start rather than reducing.`
      : `Observed reduction of ${Math.round(observedReductionPct * 100)}% against an expected ${Math.round(expectedReductionPct * 100)}%.`;

  return {
    treatmentId: treatment.id,
    riskId: risk.id,
    strategy: treatment.strategy,
    status,
    baselineExposure,
    expectedResidual,
    expectedReductionPct,
    expectedReductionAmount,
    observedResidual,
    observedReductionPct,
    observedReductionAmount,
    variance,
    measurable,
    daysSinceStart,
    headline,
  };
}

export interface TreatmentSummary {
  assessments: ResponseEffectiveness[];
  byId: Record<string, ResponseEffectiveness>;
  byRiskId: Record<string, ResponseEffectiveness[]>;
  effectiveCount: number;
  partiallyEffectiveCount: number;
  underperformingCount: number;
  failedCount: number;
  notMeasurableCount: number;
}

export function summariseTreatments(program: Program, assessmentById: Record<string, RiskAssessment>): TreatmentSummary {
  const riskById: Record<string, Risk> = {};
  for (const r of program.risks) riskById[r.id] = r;

  const assessments: ResponseEffectiveness[] = [];
  for (const t of program.treatments) {
    const risk = riskById[t.riskId];
    const assessment = assessmentById[t.riskId];
    if (!risk || !assessment) continue;
    assessments.push(assessResponseEffectiveness(risk, t, assessment, program.controls, program.statusDate));
  }

  const byId: Record<string, ResponseEffectiveness> = {};
  const byRiskId: Record<string, ResponseEffectiveness[]> = {};
  for (const a of assessments) {
    byId[a.treatmentId] = a;
    (byRiskId[a.riskId] ??= []).push(a);
  }

  return {
    assessments,
    byId,
    byRiskId,
    effectiveCount: assessments.filter((a) => a.status === 'effective').length,
    partiallyEffectiveCount: assessments.filter((a) => a.status === 'partially-effective').length,
    underperformingCount: assessments.filter((a) => a.status === 'underperforming').length,
    failedCount: assessments.filter((a) => a.status === 'failed').length,
    notMeasurableCount: assessments.filter((a) => a.status === 'not-measurable').length,
  };
}

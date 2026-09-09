import type { Benefit, ISODate, Program } from '@/domain/types';
import { clamp, nonNegative, ratio } from '@/lib/format';
import { daysBetween } from '@/lib/dates';
import { assessPortfolio } from './riskEngine';

export interface BenefitAssessment {
  benefitId: string;
  ref: string;
  name: string;
  expectedValue: number;
  realisedValue: number;
  /** realised / expected, 0..1+ */
  realisationPct: number;
  /** How far through the delivery window we are, 0..1. */
  timeElapsedPct: number;
  /** realisationPct - timeElapsedPct: positive means ahead of curve. */
  paceVariance: number;
  unrealisedValue: number;
  /** Residual exposure of the risks that threaten this benefit. */
  threatExposure: number;
  /** Probability-weighted value we expect to lose, capped at the unrealised amount. */
  valueAtRisk: number;
  confidence: 'high' | 'medium' | 'low';
  enablingMilestonesAtRisk: string[];
  daysToTarget: number | null;
  isOverdue: boolean;
  status: Benefit['status'];
  drivers: string[];
}

export function assessBenefit(benefit: Benefit, program: Program): BenefitAssessment {
  const portfolio = assessPortfolio(program.risks, program.controls, program.statusDate);
  return assessBenefitWith(benefit, program, portfolio.byId);
}

/** Variant that reuses an existing portfolio assessment to avoid recomputation. */
export function assessBenefitWith(
  benefit: Benefit,
  program: Program,
  riskById: Record<string, { residualFinancialExposure: number; residualProbability: number; isCritical: boolean }>,
): BenefitAssessment {
  const expected = nonNegative(benefit.expectedValue);
  const realised = nonNegative(benefit.realisedValue);
  const realisationPct = ratio(realised, expected);

  const totalWindow = daysBetween(benefit.startDate, benefit.targetDate) ?? 0;
  const elapsed = daysBetween(benefit.startDate, program.statusDate) ?? 0;
  const timeElapsedPct = totalWindow <= 0 ? 1 : clamp(ratio(elapsed, totalWindow), 0, 1);

  const threats = benefit.threateningRiskIds.map((id) => riskById[id]).filter(Boolean);
  const threatExposure = threats.reduce((s, r) => s + r.residualFinancialExposure, 0);
  // Combined probability that at least one threat lands, as independent events.
  const combinedProbability = clamp(1 - threats.reduce((p, r) => p * (1 - clamp(r.residualProbability, 0, 1)), 1), 0, 1);
  const unrealisedValue = Math.max(0, expected - realised);
  const valueAtRisk = Math.min(unrealisedValue, unrealisedValue * combinedProbability);

  const atRiskMilestones = program.milestones
    .filter((m) => benefit.enablingMilestoneIds.includes(m.id))
    .filter((m) => m.status === 'at-risk' || m.status === 'blocked' || (daysBetween(m.baselineDate, m.forecastDate) ?? 0) > 5)
    .map((m) => m.id);

  const daysToTarget = daysBetween(program.statusDate, benefit.targetDate);
  const isOverdue = daysToTarget !== null && daysToTarget < 0 && realisationPct < 0.95;

  const paceVariance = realisationPct - timeElapsedPct;
  let confidence: BenefitAssessment['confidence'] = 'high';
  if (paceVariance < -0.25 || atRiskMilestones.length > 0 || combinedProbability > 0.5) confidence = 'medium';
  if (paceVariance < -0.45 || (atRiskMilestones.length > 1 && combinedProbability > 0.4) || isOverdue) confidence = 'low';

  const drivers: string[] = [];
  drivers.push(Math.round(realisationPct * 100) + '% realised against ' + Math.round(timeElapsedPct * 100) + '% of the window elapsed');
  if (paceVariance < -0.15) drivers.push('Realisation is behind the delivery curve');
  if (atRiskMilestones.length > 0) drivers.push(atRiskMilestones.length + ' enabling milestone(s) are at risk');
  if (threats.length > 0)
    drivers.push(
      threats.length + ' risk(s) threaten this benefit, combined likelihood ' + Math.round(combinedProbability * 100) + '%',
    );
  if (isOverdue) drivers.push('Target date has passed without full realisation');

  return {
    benefitId: benefit.id,
    ref: benefit.ref,
    name: benefit.name,
    expectedValue: expected,
    realisedValue: realised,
    realisationPct,
    timeElapsedPct,
    paceVariance,
    unrealisedValue,
    threatExposure,
    valueAtRisk,
    confidence,
    enablingMilestonesAtRisk: atRiskMilestones,
    daysToTarget,
    isOverdue,
    status: benefit.status,
    drivers,
  };
}

export interface BenefitSummary {
  assessments: BenefitAssessment[];
  byId: Record<string, BenefitAssessment>;
  totalExpected: number;
  totalRealised: number;
  totalUnrealised: number;
  totalValueAtRisk: number;
  realisationPct: number;
  atRiskCount: number;
  lostCount: number;
  realisedCount: number;
  lowConfidenceCount: number;
  /** Net expected value after deducting value at risk. */
  confidenceAdjustedValue: number;
}

export function summariseBenefits(program: Program): BenefitSummary {
  const portfolio = assessPortfolio(program.risks, program.controls, program.statusDate);
  const assessments = program.benefits.map((b) => assessBenefitWith(b, program, portfolio.byId));
  const byId: Record<string, BenefitAssessment> = {};
  for (const a of assessments) byId[a.benefitId] = a;
  const totalExpected = assessments.reduce((s, a) => s + a.expectedValue, 0);
  const totalRealised = assessments.reduce((s, a) => s + a.realisedValue, 0);
  const totalValueAtRisk = assessments.reduce((s, a) => s + a.valueAtRisk, 0);
  return {
    assessments,
    byId,
    totalExpected,
    totalRealised,
    totalUnrealised: Math.max(0, totalExpected - totalRealised),
    totalValueAtRisk,
    realisationPct: ratio(totalRealised, totalExpected),
    atRiskCount: assessments.filter((a) => a.status === 'at-risk').length,
    lostCount: assessments.filter((a) => a.status === 'lost').length,
    realisedCount: assessments.filter((a) => a.status === 'realised').length,
    lowConfidenceCount: assessments.filter((a) => a.confidence === 'low').length,
    confidenceAdjustedValue: Math.max(0, totalExpected - totalValueAtRisk),
  };
}

export interface BenefitCurvePoint {
  date: ISODate;
  expected: number;
  realised: number;
}

/** Cumulative expected vs realised curve. Expected ramps linearly per benefit. */
export function computeRealisationCurve(program: Program, months: ISODate[]): BenefitCurvePoint[] {
  return months.map((month) => {
    let expected = 0;
    let realised = 0;
    for (const b of program.benefits) {
      const window = daysBetween(b.startDate, b.targetDate) ?? 0;
      const elapsed = daysBetween(b.startDate, month) ?? -1;
      if (elapsed >= 0) {
        const share = window <= 0 ? 1 : clamp(ratio(elapsed, window), 0, 1);
        expected += b.expectedValue * share;
      }
      const samples = b.history.filter((h) => h.date <= month);
      if (samples.length > 0) realised += samples[samples.length - 1].realisedValue;
    }
    return { date: month, expected, realised };
  });
}

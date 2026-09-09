import type { Risk, RiskAppetite, ToleranceDimension, ToleranceThreshold } from '@/domain/types';
import type { RiskAssessment } from './riskEngine';

export type ToleranceStatus = 'within' | 'near' | 'breach';

/**
 * Applied whenever a programme has not set an explicit appetite. Deliberately
 * conservative so a risk is never silently exempt from tolerance checking;
 * see domain/types.ts RiskAppetite for why this is never derived from
 * probability x impact.
 */
export const DEFAULT_RISK_APPETITE: RiskAppetite = {
  id: 'appetite-default',
  statement:
    'No explicit appetite has been set for this programme. A conservative default boundary is applied so no risk goes unexamined.',
  thresholds: [
    { dimension: 'financial', unit: 'currency', nearLimit: 150_000, breachLimit: 250_000 },
    { dimension: 'schedule', unit: 'days', nearLimit: 7, breachLimit: 14 },
    { dimension: 'benefit', unit: 'currency', nearLimit: 150_000, breachLimit: 250_000 },
    { dimension: 'severity', unit: 'score', nearLimit: 8, breachLimit: 15 },
  ],
};

export interface DimensionToleranceResult {
  dimension: ToleranceDimension;
  value: number;
  unit: string;
  nearLimit: number;
  breachLimit: number;
  status: ToleranceStatus;
  /** How far the value sits past the limit that decided its status. 0 when within. */
  overBy: number;
}

export type BreachSeverity = 'none' | 'minor' | 'moderate' | 'severe';

export interface ToleranceAssessment {
  riskId: string;
  status: ToleranceStatus;
  dimensionResults: DimensionToleranceResult[];
  breachedDimensions: ToleranceDimension[];
  nearDimensions: ToleranceDimension[];
  breachSeverity: BreachSeverity;
  /** True once a breach is severe, spans more than one dimension, or is moderate. Feeds the decision queue. */
  escalationRequired: boolean;
  /** One sentence naming the worst dimension and the amount it is over, so the status is always explainable. */
  headline: string;
}

function statusFor(value: number, limit: ToleranceThreshold): ToleranceStatus {
  if (value > limit.breachLimit) return 'breach';
  if (value > limit.nearLimit) return 'near';
  return 'within';
}

function dimensionValue(dimension: ToleranceDimension, assessment: RiskAssessment, benefitValueAtRisk: number): number {
  switch (dimension) {
    case 'financial':
      return assessment.residualFinancialExposure;
    case 'schedule':
      return assessment.residualScheduleExposureDays;
    case 'benefit':
      return benefitValueAtRisk;
    case 'severity':
      return assessment.residualScore;
  }
}

const STATUS_RANK: Record<ToleranceStatus, number> = { within: 0, near: 1, breach: 2 };

/**
 * Compares a risk's current residual position against its programme's
 * explicit appetite, one dimension at a time. The worst dimension decides the
 * overall status: a risk that breaches on any one axis is in breach overall,
 * regardless of how comfortable the others look.
 */
export function assessTolerance(
  risk: Risk,
  assessment: RiskAssessment,
  appetite: RiskAppetite,
  benefitValueAtRisk: number,
): ToleranceAssessment {
  const dimensionResults: DimensionToleranceResult[] = appetite.thresholds.map((limit) => {
    const value = dimensionValue(limit.dimension, assessment, benefitValueAtRisk);
    const status = statusFor(value, limit);
    const overBy = status === 'within' ? 0 : Math.max(0, value - (status === 'breach' ? limit.breachLimit : limit.nearLimit));
    return { dimension: limit.dimension, value, unit: limit.unit, nearLimit: limit.nearLimit, breachLimit: limit.breachLimit, status, overBy };
  });

  const worst = dimensionResults.reduce((a, b) => (STATUS_RANK[b.status] > STATUS_RANK[a.status] ? b : a));
  const status = worst.status;
  const breachedDimensions = dimensionResults.filter((d) => d.status === 'breach').map((d) => d.dimension);
  const nearDimensions = dimensionResults.filter((d) => d.status === 'near').map((d) => d.dimension);

  let breachSeverity: BreachSeverity = 'none';
  if (status === 'breach') {
    const worstBreach = dimensionResults.filter((d) => d.status === 'breach').reduce((a, b) => (b.overBy / Math.max(1, b.breachLimit) > a.overBy / Math.max(1, a.breachLimit) ? b : a));
    const overRatio = worstBreach.overBy / Math.max(1, worstBreach.breachLimit);
    breachSeverity = overRatio >= 1 ? 'severe' : overRatio >= 0.5 ? 'moderate' : 'minor';
  }

  const escalationRequired = status === 'breach' && (breachSeverity !== 'minor' || breachedDimensions.length > 1);

  const headline =
    status === 'within'
      ? 'All tolerance dimensions are within the programme appetite.'
      : `${status === 'breach' ? 'Tolerance breached' : 'Approaching tolerance'} on ${worst.dimension} (${formatDimensionValue(worst)} against a ${status === 'breach' ? 'breach' : 'near'} limit of ${formatLimit(worst, status === 'breach' ? worst.breachLimit : worst.nearLimit)}).`;

  return { riskId: risk.id, status, dimensionResults, breachedDimensions, nearDimensions, breachSeverity, escalationRequired, headline };
}

function formatDimensionValue(d: DimensionToleranceResult): string {
  return d.unit === 'currency' ? Math.round(d.value).toLocaleString('en-GB') : `${Math.round(d.value)} ${d.unit}`;
}

function formatLimit(d: DimensionToleranceResult, limit: number): string {
  return d.unit === 'currency' ? Math.round(limit).toLocaleString('en-GB') : `${Math.round(limit)} ${d.unit}`;
}

export interface ToleranceSummary {
  appetite: RiskAppetite;
  byId: Record<string, ToleranceAssessment>;
  breachCount: number;
  nearCount: number;
  withinCount: number;
  escalationRequiredCount: number;
  /** Breached risks only, worst first by breach severity then total over-by across dimensions. */
  breachedRisks: ToleranceAssessment[];
}

export function summariseTolerance(
  risks: Risk[],
  assessmentById: Record<string, RiskAssessment>,
  appetite: RiskAppetite,
  benefitAtRiskByRiskId: Record<string, number>,
): ToleranceSummary {
  const live = risks.filter((r) => r.status !== 'closed');
  const byId: Record<string, ToleranceAssessment> = {};
  for (const r of live) {
    const assessment = assessmentById[r.id];
    if (!assessment) continue;
    byId[r.id] = assessTolerance(r, assessment, appetite, benefitAtRiskByRiskId[r.id] ?? 0);
  }
  const all = Object.values(byId);
  const severityRank: Record<BreachSeverity, number> = { none: 0, minor: 1, moderate: 2, severe: 3 };
  const breachedRisks = all
    .filter((a) => a.status === 'breach')
    .sort((a, b) => {
      const bySeverity = severityRank[b.breachSeverity] - severityRank[a.breachSeverity];
      if (bySeverity !== 0) return bySeverity;
      const totalOverA = a.dimensionResults.reduce((s, d) => s + d.overBy, 0);
      const totalOverB = b.dimensionResults.reduce((s, d) => s + d.overBy, 0);
      return totalOverB - totalOverA;
    });

  return {
    appetite,
    byId,
    breachCount: all.filter((a) => a.status === 'breach').length,
    nearCount: all.filter((a) => a.status === 'near').length,
    withinCount: all.filter((a) => a.status === 'within').length,
    escalationRequiredCount: all.filter((a) => a.escalationRequired).length,
    breachedRisks,
  };
}

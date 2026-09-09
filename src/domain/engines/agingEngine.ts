import type { Action, Program, ReassessmentFrequency, Risk, RiskTrend, Treatment } from '@/domain/types';
import { daysBetween } from '@/lib/dates';

export type AgingClass = 'fresh' | 'aging' | 'stale' | 'critical-aging';

/**
 * Nominal days between assessments for calendar-driven frequencies. The
 * three event/milestone/change-based frequencies have no calendar due date
 * by design: they are triggered by conditions changing, not the clock, but
 * still use this as the aging-class denominator so a risk on one of them is
 * not exempt from ever looking stale.
 */
export const REASSESSMENT_INTERVAL_DAYS: Record<ReassessmentFrequency, number> = {
  weekly: 7,
  monthly: 30,
  quarterly: 90,
  'event-based': 30,
  'milestone-based': 30,
  'change-based': 30,
};

const CALENDAR_DRIVEN: ReassessmentFrequency[] = ['weekly', 'monthly', 'quarterly'];

/** A calendar-driven reassessment is flagged "due soon" once it is inside this window, not only once it is overdue. */
const DUE_SOON_DAYS = 7;
/** A condition-triggered reassessment that has sat untouched this long becomes overdue rather than merely due. */
const CONDITION_GRACE_DAYS = 14;

export interface RiskAgingContext {
  trend: RiskTrend;
  toleranceBreached: boolean;
  treatments: Treatment[];
  actions: Action[];
}

export interface RiskAging {
  riskId: string;
  daysOpen: number;
  lastAssessmentDate: string;
  daysSinceLastAssessment: number;
  nextAssessmentDate: string;
  reassessmentFrequency: ReassessmentFrequency;
  /** True when a condition change (accelerating trend, tolerance breach) forces reassessment ahead of the calendar. */
  conditionChangeTriggered: boolean;
  reassessmentDue: boolean;
  reassessmentOverdue: boolean;
  daysOverdue: number;
  lastActionDate: string | null;
  lastEvidenceDate: string | null;
  treatmentAgeDays: number | null;
  agingClass: AgingClass;
  headline: string;
}

export function assessAging(risk: Risk, statusDate: string, context: RiskAgingContext): RiskAging {
  const lastAssessmentDate = risk.lastAssessmentDate ?? risk.dateIdentified;
  const frequency = risk.reassessmentFrequency ?? 'monthly';
  const daysOpen = daysBetween(risk.dateIdentified, statusDate) ?? 0;
  const daysSinceLastAssessment = daysBetween(lastAssessmentDate, statusDate) ?? 0;
  const daysToNext = daysBetween(statusDate, risk.reviewDate);

  const conditionChangeTriggered = context.trend === 'accelerating' || context.toleranceBreached;
  const calendarDriven = CALENDAR_DRIVEN.includes(frequency);
  const calendarOverdue = calendarDriven && daysToNext !== null && daysToNext < 0;
  const calendarDueSoon = calendarDriven && daysToNext !== null && daysToNext >= 0 && daysToNext <= DUE_SOON_DAYS;

  const reassessmentOverdue = calendarOverdue || (conditionChangeTriggered && daysSinceLastAssessment > CONDITION_GRACE_DAYS);
  const reassessmentDue = reassessmentOverdue || calendarDueSoon || conditionChangeTriggered;
  const daysOverdue = calendarOverdue ? -(daysToNext as number) : reassessmentOverdue ? daysSinceLastAssessment - CONDITION_GRACE_DAYS : 0;

  const linkedActions = context.actions.filter((a) => risk.actionIds.includes(a.id));
  const lastActionDate =
    linkedActions.length === 0
      ? null
      : [...linkedActions].map((a) => a.completedDate ?? a.dueDate).sort((a, b) => b.localeCompare(a))[0];

  const activeTreatments = context.treatments.filter((t) => t.riskId === risk.id && t.status !== 'complete' && t.status !== 'cancelled');
  const treatmentAgeDays =
    activeTreatments.length === 0
      ? null
      : Math.max(...activeTreatments.map((t) => daysBetween(t.startDate, statusDate) ?? 0));

  const lastEvidenceDate = risk.evidence.length === 0 ? null : [...risk.evidence].sort((a, b) => b.date.localeCompare(a.date))[0].date;

  const intervalDays = REASSESSMENT_INTERVAL_DAYS[frequency];
  const ageRatio = daysSinceLastAssessment / intervalDays;
  let agingClass: AgingClass;
  if (ageRatio <= 1) agingClass = 'fresh';
  else if (ageRatio <= 2) agingClass = 'aging';
  else if (ageRatio <= 3) agingClass = 'stale';
  else agingClass = 'critical-aging';
  if (context.toleranceBreached && reassessmentOverdue) agingClass = 'critical-aging';

  const headline = reassessmentOverdue
    ? `Reassessment is overdue: last looked at ${daysSinceLastAssessment} day(s) ago${conditionChangeTriggered && !calendarOverdue ? ' and risk conditions have changed since' : ''}.`
    : reassessmentDue
      ? conditionChangeTriggered
        ? 'Risk conditions have changed since the last assessment; a reassessment is due now.'
        : `Reassessment is due within ${DUE_SOON_DAYS} day(s).`
      : `Last assessed ${daysSinceLastAssessment} day(s) ago, within the ${frequency} cadence.`;

  return {
    riskId: risk.id,
    daysOpen,
    lastAssessmentDate,
    daysSinceLastAssessment,
    nextAssessmentDate: risk.reviewDate,
    reassessmentFrequency: frequency,
    conditionChangeTriggered,
    reassessmentDue,
    reassessmentOverdue,
    daysOverdue: Math.max(0, daysOverdue),
    lastActionDate,
    lastEvidenceDate,
    treatmentAgeDays,
    agingClass,
    headline,
  };
}

export interface AgingSummary {
  assessments: RiskAging[];
  byId: Record<string, RiskAging>;
  freshCount: number;
  agingCount: number;
  staleCount: number;
  criticalAgingCount: number;
  reassessmentDueCount: number;
  reassessmentOverdueCount: number;
}

export function summariseAging(
  program: Program,
  trendByRiskId: Record<string, RiskTrend>,
  toleranceBreachedByRiskId: Record<string, boolean>,
): AgingSummary {
  const openRisks = program.risks.filter((r) => r.status !== 'closed');
  const assessments = openRisks.map((r) =>
    assessAging(r, program.statusDate, {
      trend: trendByRiskId[r.id] ?? 'stagnant',
      toleranceBreached: toleranceBreachedByRiskId[r.id] ?? false,
      treatments: program.treatments,
      actions: program.actions,
    }),
  );
  const byId: Record<string, RiskAging> = {};
  for (const a of assessments) byId[a.riskId] = a;
  return {
    assessments,
    byId,
    freshCount: assessments.filter((a) => a.agingClass === 'fresh').length,
    agingCount: assessments.filter((a) => a.agingClass === 'aging').length,
    staleCount: assessments.filter((a) => a.agingClass === 'stale').length,
    criticalAgingCount: assessments.filter((a) => a.agingClass === 'critical-aging').length,
    reassessmentDueCount: assessments.filter((a) => a.reassessmentDue).length,
    reassessmentOverdueCount: assessments.filter((a) => a.reassessmentOverdue).length,
  };
}

import type { Action, ISODate, Milestone, Program } from '@/domain/types';
import { clamp, nonNegative, ratio } from '@/lib/format';
import { daysBetween } from '@/lib/dates';

export interface MilestoneAssessment {
  milestoneId: string;
  name: string;
  workstreamId: string;
  baselineDate: ISODate;
  forecastDate: ISODate;
  /** forecast - baseline. Positive is late. */
  varianceDays: number;
  daysToForecast: number | null;
  isOverdue: boolean;
  isAtRisk: boolean;
  isComplete: boolean;
  isGate: boolean;
  /** Residual exposure of risks pointed at this milestone. */
  riskExposure: number;
  linkedRiskIds: string[];
  /** Dependencies whose expected slip lands on this milestone. */
  dependencyPressureDays: number;
  blockingDependencyIds: string[];
  /** Benefits that cannot start realising until this lands. */
  enabledBenefitIds: string[];
  benefitValueGated: number;
  deliverableCompletion: number;
  drivers: string[];
}

/**
 * A milestone is treated as at risk once its forecast slips two working weeks
 * against baseline. Anything tighter flags normal re-planning noise on a
 * fourteen-month programme and the signal stops meaning anything.
 */
const AT_RISK_VARIANCE_DAYS = 10;

export function assessMilestone(milestone: Milestone, program: Program): MilestoneAssessment {
  const varianceDays = daysBetween(milestone.baselineDate, milestone.forecastDate) ?? 0;
  const daysToForecast = daysBetween(program.statusDate, milestone.forecastDate);
  const isComplete = milestone.status === 'complete' || Boolean(milestone.actualDate);
  const isOverdue = !isComplete && daysToForecast !== null && daysToForecast < 0;

  const linkedRisks = program.risks.filter(
    (r) => r.affectedMilestoneIds.includes(milestone.id) && r.status !== 'closed',
  );
  const riskExposure = linkedRisks.reduce(
    (s, r) => s + clamp(r.inherentProbability, 0, 1) * nonNegative(r.inherentFinancialImpact),
    0,
  );

  const blocking = program.dependencies.filter(
    (d) => d.affectedMilestoneIds.includes(milestone.id) && d.status !== 'delivered' && d.status !== 'cancelled',
  );
  const dependencyPressureDays = Math.round(
    blocking.reduce((s, d) => s + clamp(d.delayProbability, 0, 1) * nonNegative(d.potentialDelayDays), 0),
  );

  const enabledBenefits = program.benefits.filter((b) => b.enablingMilestoneIds.includes(milestone.id));
  const benefitValueGated = enabledBenefits.reduce((s, b) => s + Math.max(0, nonNegative(b.expectedValue) - nonNegative(b.realisedValue)), 0);

  const deliverables = program.deliverables.filter((d) => d.milestoneId === milestone.id);
  const deliverableCompletion =
    deliverables.length === 0 ? (isComplete ? 1 : 0) : ratio(deliverables.reduce((s, d) => s + d.percentComplete, 0), deliverables.length * 100);

  const isAtRisk =
    !isComplete &&
    (milestone.status === 'at-risk' ||
      milestone.status === 'blocked' ||
      varianceDays >= AT_RISK_VARIANCE_DAYS ||
      isOverdue ||
      dependencyPressureDays >= 7 ||
      (linkedRisks.length > 0 && riskExposure > 250_000));

  const drivers: string[] = [];
  if (varianceDays > 0) drivers.push('Forecast is ' + varianceDays + ' days behind baseline');
  if (isOverdue) drivers.push('Forecast date has already passed');
  if (dependencyPressureDays > 0) drivers.push(blocking.length + ' open dependency(ies) carry ' + dependencyPressureDays + ' days of expected slip');
  if (linkedRisks.length > 0) drivers.push(linkedRisks.length + ' open risk(s) target this milestone');
  if (deliverables.length > 0 && deliverableCompletion < 0.5 && (daysToForecast ?? 99) < 30)
    drivers.push('Deliverables are ' + Math.round(deliverableCompletion * 100) + '% complete with ' + daysToForecast + ' days remaining');
  if (enabledBenefits.length > 0) drivers.push(enabledBenefits.length + ' benefit(s) are gated behind this milestone');
  if (milestone.isGate) drivers.push('Stage gate: downstream work cannot start until this closes');

  return {
    milestoneId: milestone.id,
    name: milestone.name,
    workstreamId: milestone.workstreamId,
    baselineDate: milestone.baselineDate,
    forecastDate: milestone.forecastDate,
    varianceDays,
    daysToForecast,
    isOverdue,
    isAtRisk,
    isComplete,
    isGate: milestone.isGate,
    riskExposure,
    linkedRiskIds: linkedRisks.map((r) => r.id),
    dependencyPressureDays,
    blockingDependencyIds: blocking.map((d) => d.id),
    enabledBenefitIds: enabledBenefits.map((b) => b.id),
    benefitValueGated,
    deliverableCompletion,
    drivers,
  };
}

export interface ActionSummary {
  total: number;
  open: number;
  overdue: number;
  completed: number;
  completionRate: number;
  /** Residual reduction promised by actions that are late. */
  atRiskReduction: number;
  overdueActions: Action[];
}

export function summariseActions(actions: Action[], statusDate: ISODate): ActionSummary {
  const isOverdue = (a: Action) =>
    a.status !== 'complete' && a.status !== 'cancelled' && (daysBetween(statusDate, a.dueDate) ?? 1) < 0;
  const overdueActions = actions.filter(isOverdue);
  const completed = actions.filter((a) => a.status === 'complete').length;
  const live = actions.filter((a) => a.status !== 'cancelled');
  return {
    total: actions.length,
    open: live.filter((a) => a.status !== 'complete').length,
    overdue: overdueActions.length,
    completed,
    completionRate: ratio(completed, live.length),
    atRiskReduction: overdueActions.reduce((s, a) => s + clamp(a.expectedRiskReduction, 0, 1), 0),
    overdueActions,
  };
}

export interface ScheduleSummary {
  assessments: MilestoneAssessment[];
  byId: Record<string, MilestoneAssessment>;
  total: number;
  complete: number;
  atRisk: number;
  overdue: number;
  gatesAtRisk: number;
  averageVarianceDays: number;
  worstVarianceDays: number;
  percentComplete: number;
  /** Schedule performance proxy: complete / expected-complete by now. */
  schedulePerformanceIndex: number;
  benefitValueGated: number;
}

export function summariseSchedule(program: Program): ScheduleSummary {
  const assessments = program.milestones.map((m) => assessMilestone(m, program));
  const byId: Record<string, MilestoneAssessment> = {};
  for (const a of assessments) byId[a.milestoneId] = a;

  const complete = assessments.filter((a) => a.isComplete).length;
  const dueByNow = program.milestones.filter((m) => (daysBetween(m.baselineDate, program.statusDate) ?? -1) >= 0).length;
  const variances = assessments.filter((a) => !a.isComplete).map((a) => a.varianceDays);

  return {
    assessments,
    byId,
    total: assessments.length,
    complete,
    atRisk: assessments.filter((a) => a.isAtRisk).length,
    overdue: assessments.filter((a) => a.isOverdue).length,
    gatesAtRisk: assessments.filter((a) => a.isGate && a.isAtRisk).length,
    averageVarianceDays: variances.length === 0 ? 0 : variances.reduce((a, b) => a + b, 0) / variances.length,
    worstVarianceDays: variances.length === 0 ? 0 : Math.max(...variances),
    percentComplete: ratio(complete, assessments.length),
    schedulePerformanceIndex: dueByNow === 0 ? 1 : clamp(ratio(complete, dueByNow), 0, 2),
    benefitValueGated: assessments.filter((a) => a.isAtRisk).reduce((s, a) => s + a.benefitValueGated, 0),
  };
}

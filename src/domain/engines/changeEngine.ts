import type { ChangeRequest, Decision, Program } from '@/domain/types';
import { clamp, nonNegative, ratio } from '@/lib/format';
import { daysBetween } from '@/lib/dates';

export interface ChangeAssessment {
  changeId: string;
  ref: string;
  title: string;
  decision: ChangeRequest['decision'];
  status: ChangeRequest['status'];
  costImpact: number;
  scheduleImpactDays: number;
  benefitImpact: number;
  /** Benefit gained minus cost incurred. Positive is value accretive. */
  netValue: number;
  /** benefitImpact / costImpact where cost is positive. */
  returnRatio: number;
  /** 0..100 blend of cost, schedule and reach. */
  impactIndex: number;
  reach: number;
  daysAwaitingDecision: number | null;
  isStale: boolean;
  requiresSteerCo: boolean;
  drivers: string[];
}

/** Changes above these thresholds cannot be approved inside the program. */
export const STEERCO_THRESHOLDS = { cost: 250_000, scheduleDays: 21, benefit: 500_000 };

export function assessChange(change: ChangeRequest, program: Program): ChangeAssessment {
  const cost = change.costImpact;
  const schedule = change.scheduleImpactDays;
  const benefit = change.benefitImpact;
  const netValue = benefit - cost;
  const returnRatio = cost > 0 ? ratio(benefit, cost) : benefit > 0 ? Infinity : 0;

  const reach =
    change.affectedWorkstreamIds.length +
    change.affectedMilestoneIds.length +
    change.affectedDependencyIds.length +
    change.affectedBenefitIds.length;

  const impactIndex = clamp(
    (clamp(ratio(Math.abs(cost), program.budget * 0.05), 0, 1) * 0.4 +
      clamp(ratio(Math.abs(schedule), 30), 0, 1) * 0.3 +
      clamp(ratio(reach, 10), 0, 1) * 0.3) *
      100,
    0,
    100,
  );

  const daysAwaitingDecision = change.decision === 'pending' || change.decision === 'escalated'
    ? daysBetween(change.raisedDate, program.statusDate)
    : null;
  const isStale = daysAwaitingDecision !== null && daysAwaitingDecision > 21;

  const requiresSteerCo =
    Math.abs(cost) >= STEERCO_THRESHOLDS.cost ||
    Math.abs(schedule) >= STEERCO_THRESHOLDS.scheduleDays ||
    Math.abs(benefit) >= STEERCO_THRESHOLDS.benefit;

  const drivers: string[] = [];
  if (cost !== 0) drivers.push('Cost impact of ' + Math.round(cost).toLocaleString('en-GB'));
  if (schedule !== 0) drivers.push('Schedule impact of ' + schedule + ' days');
  if (benefit !== 0) drivers.push('Benefit impact of ' + Math.round(benefit).toLocaleString('en-GB'));
  if (requiresSteerCo) drivers.push('Exceeds delegated authority, requires Steering Committee');
  if (isStale && daysAwaitingDecision !== null) drivers.push('Awaiting decision for ' + daysAwaitingDecision + ' days');
  if (change.affectedDependencyIds.length > 0) drivers.push(change.affectedDependencyIds.length + ' dependency(ies) affected');
  if (netValue < 0 && change.decision === 'approved') drivers.push('Approved despite negative net value, check the rationale');

  return {
    changeId: change.id,
    ref: change.ref,
    title: change.title,
    decision: change.decision,
    status: change.status,
    costImpact: cost,
    scheduleImpactDays: schedule,
    benefitImpact: benefit,
    netValue,
    returnRatio,
    impactIndex,
    reach,
    daysAwaitingDecision,
    isStale,
    requiresSteerCo,
    drivers,
  };
}

export interface ChangeSummary {
  assessments: ChangeAssessment[];
  byId: Record<string, ChangeAssessment>;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  deferred: number;
  escalated: number;
  /** Approved cost only: what the program has actually committed. */
  approvedCostImpact: number;
  approvedScheduleImpactDays: number;
  approvedBenefitImpact: number;
  /** Everything still in play, the decision-risk overhang. */
  pendingCostExposure: number;
  pendingScheduleExposureDays: number;
  budgetErosionPct: number;
  staleCount: number;
  steerCoCount: number;
}

export function summariseChanges(program: Program): ChangeSummary {
  const assessments = program.changes.map((c) => assessChange(c, program));
  const byId: Record<string, ChangeAssessment> = {};
  for (const a of assessments) byId[a.changeId] = a;
  const approved = assessments.filter((a) => a.decision === 'approved');
  const inPlay = assessments.filter((a) => a.decision === 'pending' || a.decision === 'escalated' || a.decision === 'deferred');
  const approvedCostImpact = approved.reduce((s, a) => s + a.costImpact, 0);
  return {
    assessments,
    byId,
    total: assessments.length,
    pending: assessments.filter((a) => a.decision === 'pending').length,
    approved: approved.length,
    rejected: assessments.filter((a) => a.decision === 'rejected').length,
    deferred: assessments.filter((a) => a.decision === 'deferred').length,
    escalated: assessments.filter((a) => a.decision === 'escalated').length,
    approvedCostImpact,
    approvedScheduleImpactDays: approved.reduce((s, a) => s + a.scheduleImpactDays, 0),
    approvedBenefitImpact: approved.reduce((s, a) => s + a.benefitImpact, 0),
    pendingCostExposure: inPlay.reduce((s, a) => s + nonNegative(a.costImpact), 0),
    pendingScheduleExposureDays: inPlay.reduce((s, a) => s + nonNegative(a.scheduleImpactDays), 0),
    budgetErosionPct: ratio(approvedCostImpact, program.budget),
    staleCount: assessments.filter((a) => a.isStale).length,
    steerCoCount: assessments.filter((a) => a.requiresSteerCo && a.decision === 'pending').length,
  };
}

// ------------------------------------------------------------ decision quality

export interface DecisionAssessment {
  decisionId: string;
  ref: string;
  title: string;
  status: Decision['status'];
  optionsConsidered: number;
  /** A decision with one option was not really a decision. */
  hasGenuineChoice: boolean;
  hasRationale: boolean;
  evidenceCount: number;
  daysToDecide: number | null;
  isOverdue: boolean;
  reviewDue: boolean;
  outcomeKnown: boolean;
  outcomeScore?: number;
  /** 0..100 process-quality score, independent of the outcome. */
  processQuality: number;
  drivers: string[];
}

export function assessDecision(decision: Decision, statusDate: string): DecisionAssessment {
  const optionsConsidered = decision.options.length;
  const hasGenuineChoice = optionsConsidered >= 2;
  const hasRationale = Boolean(decision.rationale && decision.rationale.length > 20);
  const evidenceCount = decision.evidence.length;
  const daysToDecide = decision.dateDecided ? daysBetween(decision.dateRequired, decision.dateDecided) : null;
  const isOverdue = decision.status !== 'decided' && daysBetween(statusDate, decision.dateRequired) !== null
    ? (daysBetween(statusDate, decision.dateRequired) as number) < 0
    : false;
  const reviewDue = Boolean(
    decision.reviewDate && decision.status === 'decided' && !decision.actualOutcome && decision.reviewDate <= statusDate,
  );

  const processQuality = clamp(
    (hasGenuineChoice ? 30 : 5) +
      (hasRationale ? 25 : 0) +
      clamp(evidenceCount, 0, 3) * 8 +
      (decision.expectedOutcome.length > 10 ? 12 : 0) +
      (decision.reviewDate ? 9 : 0),
    0,
    100,
  );

  const drivers: string[] = [];
  if (!hasGenuineChoice) drivers.push('Only ' + optionsConsidered + ' option recorded, no real alternative was weighed');
  if (!hasRationale) drivers.push('No written rationale');
  if (evidenceCount === 0) drivers.push('No evidence attached');
  if (isOverdue) drivers.push('Decision is past its required-by date');
  if (reviewDue) drivers.push('Review date has passed without an outcome being recorded');
  if (decision.outcomeScore !== undefined && decision.outcomeScore <= 2)
    drivers.push('Outcome scored ' + decision.outcomeScore + '/5 at review');

  return {
    decisionId: decision.id,
    ref: decision.ref,
    title: decision.title,
    status: decision.status,
    optionsConsidered,
    hasGenuineChoice,
    hasRationale,
    evidenceCount,
    daysToDecide,
    isOverdue,
    reviewDue,
    outcomeKnown: Boolean(decision.actualOutcome),
    outcomeScore: decision.outcomeScore,
    processQuality,
    drivers,
  };
}

export interface DecisionSummary {
  assessments: DecisionAssessment[];
  byId: Record<string, DecisionAssessment>;
  total: number;
  required: number;
  decided: number;
  overdue: number;
  reviewsDue: number;
  averageProcessQuality: number;
  averageDaysToDecide: number;
  /** Of reviewed decisions, share that scored 4 or 5. */
  goodOutcomeRate: number;
  reviewedCount: number;
  singleOptionCount: number;
}

export function summariseDecisions(program: Program): DecisionSummary {
  const assessments = program.decisions.map((d) => assessDecision(d, program.statusDate));
  const byId: Record<string, DecisionAssessment> = {};
  for (const a of assessments) byId[a.decisionId] = a;
  const decided = assessments.filter((a) => a.status === 'decided');
  const timed = decided.filter((a) => a.daysToDecide !== null);
  const reviewed = assessments.filter((a) => a.outcomeScore !== undefined);
  return {
    assessments,
    byId,
    total: assessments.length,
    required: assessments.filter((a) => a.status === 'required' || a.status === 'scheduled').length,
    decided: decided.length,
    overdue: assessments.filter((a) => a.isOverdue).length,
    reviewsDue: assessments.filter((a) => a.reviewDue).length,
    averageProcessQuality: assessments.length === 0 ? 0 : assessments.reduce((s, a) => s + a.processQuality, 0) / assessments.length,
    averageDaysToDecide: timed.length === 0 ? 0 : timed.reduce((s, a) => s + (a.daysToDecide as number), 0) / timed.length,
    goodOutcomeRate: reviewed.length === 0 ? 0 : reviewed.filter((a) => (a.outcomeScore as number) >= 4).length / reviewed.length,
    reviewedCount: reviewed.length,
    singleOptionCount: assessments.filter((a) => !a.hasGenuineChoice).length,
  };
}

import type { Program, Risk } from '@/domain/types';
import { daysBetween } from '@/lib/dates';
import type { RiskAssessment } from './riskEngine';
import type { ToleranceSummary } from './toleranceEngine';
import type { TreatmentSummary } from './treatmentEngine';
import type { AcceptanceSummary } from './acceptanceEngine';
import type { AgingSummary } from './agingEngine';
import type { DependencySummary } from './dependencyEngine';
import type { BenefitSummary } from './benefitEngine';
import type { ScheduleSummary } from './scheduleEngine';

/**
 * All twelve signals the specification requires. The last two,
 * cross-program-propagation and material-concentration, are portfolio-level
 * and are never emitted by buildDecisionQueue below (a single programme
 * cannot see across programmes); state/selectors.ts constructs items with
 * these two codes using the same shape so the queue UI treats every reason
 * uniformly.
 */
export type DecisionReasonCode =
  | 'tolerance-breach'
  | 'acceptance-expired'
  | 'acceptance-near-expiry'
  | 'critical-aging'
  | 'reassessment-overdue'
  | 'treatment-underperforming'
  | 'control-failure'
  | 'critical-dependency'
  | 'benefit-at-risk'
  | 'milestone-threat'
  | 'cross-program-propagation'
  | 'material-concentration';

/** Lower fires first when a risk has more than one live reason; decides the primary reason and headline. */
const REASON_PRIORITY: DecisionReasonCode[] = [
  'tolerance-breach',
  'acceptance-expired',
  'treatment-underperforming',
  'control-failure',
  'critical-dependency',
  'milestone-threat',
  'material-concentration',
  'cross-program-propagation',
  'reassessment-overdue',
  'critical-aging',
  'benefit-at-risk',
  'acceptance-near-expiry',
];

const SEVERITY_BY_REASON: Record<DecisionReasonCode, DecisionSeverity> = {
  'tolerance-breach': 'critical',
  'acceptance-expired': 'critical',
  'treatment-underperforming': 'high',
  'control-failure': 'high',
  'critical-dependency': 'high',
  'milestone-threat': 'high',
  'material-concentration': 'high',
  'cross-program-propagation': 'high',
  'reassessment-overdue': 'medium',
  'critical-aging': 'medium',
  'benefit-at-risk': 'medium',
  'acceptance-near-expiry': 'low',
};

/**
 * Deterministic, table-driven: every recommendation traces back to exactly
 * one reason code. No free text is generated from anything but this table
 * and the failed-treatment refinement below.
 */
const ACTION_BY_REASON: Record<DecisionReasonCode, string> = {
  'tolerance-breach': 'Escalate remediation plan',
  'acceptance-expired': 'Renew or revoke acceptance',
  'acceptance-near-expiry': 'Schedule acceptance renewal review',
  'critical-aging': 'Prioritise reassessment',
  'reassessment-overdue': 'Reassess risk now',
  'treatment-underperforming': 'Escalate remediation plan',
  'control-failure': 'Remediate or replace failed control',
  'critical-dependency': 'Escalate dependency to programme board',
  'benefit-at-risk': 'Review benefit realisation plan',
  'milestone-threat': 'Escalate remediation plan',
  'cross-program-propagation': 'Coordinate cross-programme response',
  'material-concentration': 'Review concentrated exposure with risk owner',
};

export type DecisionSeverity = 'critical' | 'high' | 'medium' | 'low';
export type DecisionUrgency = 'immediate' | 'this-week' | 'this-month' | 'monitor';

interface DetectedReason {
  code: DecisionReasonCode;
  detail: string;
  deadline: string | null;
}

export interface DecisionQueueItem {
  id: string;
  programId: string;
  riskId: string | null;
  riskRef: string | null;
  riskTitle: string | null;
  reasons: DecisionReasonCode[];
  primaryReason: DecisionReasonCode;
  problem: string;
  exposure: number;
  severity: DecisionSeverity;
  urgency: DecisionUrgency;
  ownerId: string | null;
  recommendedAction: string;
  deadline: string | null;
  evidence: string[];
  affectedMilestoneIds: string[];
  affectedBenefitIds: string[];
}

function urgencyFor(deadline: string | null, statusDate: string, severity: DecisionSeverity, hasOverdueReason: boolean): DecisionUrgency {
  if (hasOverdueReason) return 'immediate';
  if (deadline) {
    const days = daysBetween(statusDate, deadline);
    if (days !== null) {
      if (days < 0) return 'immediate';
      if (days <= 7) return 'this-week';
      if (days <= 30) return 'this-month';
    }
  }
  return severity === 'critical' ? 'this-week' : severity === 'high' ? 'this-month' : 'monitor';
}

export interface DecisionQueueContext {
  tolerance: ToleranceSummary;
  treatments: TreatmentSummary;
  acceptances: AcceptanceSummary;
  aging: AgingSummary;
  dependencies: DependencySummary;
  benefits: BenefitSummary;
  schedule: ScheduleSummary;
  assessmentById: Record<string, RiskAssessment>;
}

function detectReasons(risk: Risk, program: Program, ctx: DecisionQueueContext): DetectedReason[] {
  const reasons: DetectedReason[] = [];

  const tol = ctx.tolerance.byId[risk.id];
  if (tol && tol.status === 'breach') {
    reasons.push({ code: 'tolerance-breach', detail: tol.headline, deadline: null });
  }

  for (const acc of ctx.acceptances.byRiskId[risk.id] ?? []) {
    if (acc.effectiveStatus === 'expired') {
      reasons.push({ code: 'acceptance-expired', detail: acc.headline, deadline: null });
    } else if (acc.nearingExpiry) {
      reasons.push({ code: 'acceptance-near-expiry', detail: acc.headline, deadline: null });
    }
  }

  for (const eff of ctx.treatments.byRiskId[risk.id] ?? []) {
    if (eff.status === 'underperforming' || eff.status === 'failed') {
      const treatment = program.treatments.find((t) => t.id === eff.treatmentId);
      reasons.push({
        code: 'treatment-underperforming',
        detail: `Treatment ${treatment?.ref ?? eff.treatmentId} is ${eff.status}: ${eff.headline}`,
        deadline: treatment?.targetDate ?? null,
      });
    }
  }

  const failedControls = risk.controlIds.filter((cid) => program.controls.find((c) => c.id === cid)?.status === 'failed');
  if (failedControls.length > 0) {
    reasons.push({ code: 'control-failure', detail: `${failedControls.length} linked control(s) have failed`, deadline: null });
  }

  const criticalDeps = risk.dependencyIds
    .map((did) => ctx.dependencies.byId[did])
    .filter((d) => d && d.criticality === 'critical' && (d.status === 'at-risk' || d.status === 'late'));
  if (criticalDeps.length > 0) {
    reasons.push({
      code: 'critical-dependency',
      detail: `${criticalDeps.length} critical dependency(ies) are ${criticalDeps.some((d) => d.status === 'late') ? 'late' : 'at risk'}`,
      deadline: null,
    });
  }

  const threatenedMilestones = risk.affectedMilestoneIds
    .map((mid) => ctx.schedule.byId[mid])
    .filter((m) => m && (m.isAtRisk || m.isOverdue));
  if (threatenedMilestones.length > 0) {
    reasons.push({
      code: 'milestone-threat',
      detail: `${threatenedMilestones.length} milestone(s) at risk, including ${threatenedMilestones[0].name}`,
      deadline: threatenedMilestones[0].forecastDate,
    });
  }

  const atRiskBenefits = risk.affectedBenefitIds.map((bid) => ctx.benefits.byId[bid]).filter((b) => b && b.status === 'at-risk');
  if (atRiskBenefits.length > 0) {
    reasons.push({
      code: 'benefit-at-risk',
      detail: `${atRiskBenefits.length} benefit(s) at risk, ${Math.round(atRiskBenefits.reduce((s, b) => s + b.valueAtRisk, 0)).toLocaleString('en-GB')} of value exposed`,
      deadline: null,
    });
  }

  const ag = ctx.aging.byId[risk.id];
  if (ag?.reassessmentOverdue) {
    reasons.push({ code: 'reassessment-overdue', detail: ag.headline, deadline: null });
  }
  if (ag?.agingClass === 'critical-aging') {
    reasons.push({ code: 'critical-aging', detail: `Risk has not been reassessed in ${ag.daysSinceLastAssessment} days`, deadline: null });
  }

  return reasons;
}

/**
 * Programme-scoped decision queue. Every item is built from reasons detected
 * against real programme data via detectReasons above; nothing here is
 * inferred or generated. See state/selectors.ts for the two portfolio-level
 * reasons (cross-program-propagation, material-concentration) added on top.
 */
export function buildDecisionQueue(program: Program, ctx: DecisionQueueContext): DecisionQueueItem[] {
  const items: DecisionQueueItem[] = [];

  for (const risk of program.risks) {
    if (risk.status === 'closed') continue;
    const reasons = detectReasons(risk, program, ctx);
    if (reasons.length === 0) continue;

    reasons.sort((a, b) => REASON_PRIORITY.indexOf(a.code) - REASON_PRIORITY.indexOf(b.code));
    const primary = reasons[0];
    const severity = reasons.reduce<DecisionSeverity>((worst, r) => (rank(SEVERITY_BY_REASON[r.code]) > rank(worst) ? SEVERITY_BY_REASON[r.code] : worst), 'low');
    const deadlines = reasons.map((r) => r.deadline).filter((d): d is string => d !== null);
    const deadline = deadlines.length === 0 ? null : deadlines.sort()[0];
    const hasOverdueReason = reasons.some((r) => r.code === 'acceptance-expired' || r.code === 'reassessment-overdue');
    const assessment = ctx.assessmentById[risk.id];

    const failedTreatment = reasons.find((r) => r.code === 'treatment-underperforming' && r.detail.includes(' failed:'));
    const recommendedAction = failedTreatment ? 'Replace or strengthen treatment' : ACTION_BY_REASON[primary.code];

    items.push({
      id: `${program.id}:${risk.id}`,
      programId: program.id,
      riskId: risk.id,
      riskRef: risk.ref,
      riskTitle: risk.title,
      reasons: reasons.map((r) => r.code),
      primaryReason: primary.code,
      problem: primary.detail,
      exposure: assessment?.residualFinancialExposure ?? 0,
      severity,
      urgency: urgencyFor(deadline, program.statusDate, severity, hasOverdueReason),
      ownerId: risk.ownerId,
      recommendedAction,
      deadline,
      evidence: reasons.map((r) => r.detail),
      affectedMilestoneIds: reasons.some((r) => r.code === 'milestone-threat') ? risk.affectedMilestoneIds : [],
      affectedBenefitIds: reasons.some((r) => r.code === 'benefit-at-risk') ? risk.affectedBenefitIds : [],
    });
  }

  return items.sort((a, b) => rank(b.severity) - rank(a.severity) || b.exposure - a.exposure);
}

function rank(s: DecisionSeverity): number {
  return s === 'critical' ? 3 : s === 'high' ? 2 : s === 'medium' ? 1 : 0;
}

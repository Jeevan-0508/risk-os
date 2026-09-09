import type { Acceptance, AcceptanceStatus, Program } from '@/domain/types';
import { daysBetween, isBefore } from '@/lib/dates';

/**
 * The last recorded human decision is only the starting point. An ACCEPTED
 * acceptance past its expiry date is EXPIRED regardless of what was last
 * written to storage: this is what stops a risk acceptance from silently
 * living forever. Every other status is returned unchanged.
 */
export function effectiveAcceptanceStatus(acceptance: Acceptance, statusDate: string): AcceptanceStatus {
  if (acceptance.status === 'accepted' && acceptance.expiryDate && isBefore(acceptance.expiryDate, statusDate)) {
    return 'expired';
  }
  return acceptance.status;
}

/** Surfaced once an accepted risk's expiry is close enough to need a renewal decision, not just a diary note. */
export const NEAR_EXPIRY_DAYS = 21;

export interface AcceptanceAssessment {
  acceptanceId: string;
  riskId: string;
  recordedStatus: AcceptanceStatus;
  effectiveStatus: AcceptanceStatus;
  /** True the moment recordedStatus and effectiveStatus disagree, i.e. expiry was computed rather than recorded. */
  autoExpired: boolean;
  daysToExpiry: number | null;
  nearingExpiry: boolean;
  /** True while this acceptance needs a human decision now: expired, nearing expiry, or already under review. */
  requiresDecision: boolean;
  headline: string;
}

export function assessAcceptance(acceptance: Acceptance, statusDate: string): AcceptanceAssessment {
  const effectiveStatus = effectiveAcceptanceStatus(acceptance, statusDate);
  const autoExpired = effectiveStatus === 'expired' && acceptance.status !== 'expired';
  const daysToExpiry = acceptance.expiryDate ? daysBetween(statusDate, acceptance.expiryDate) : null;
  const nearingExpiry = effectiveStatus === 'accepted' && daysToExpiry !== null && daysToExpiry <= NEAR_EXPIRY_DAYS && daysToExpiry >= 0;
  const requiresDecision = effectiveStatus === 'expired' || nearingExpiry || effectiveStatus === 'under-review';

  const headline = autoExpired
    ? `Acceptance expired on ${acceptance.expiryDate} and has not been renewed or revoked.`
    : nearingExpiry
      ? `Acceptance expires in ${daysToExpiry} day(s) and needs a renewal decision.`
      : effectiveStatus === 'under-review'
        ? 'Acceptance is awaiting a decision.'
        : `Acceptance is ${effectiveStatus}.`;

  return { acceptanceId: acceptance.id, riskId: acceptance.riskId, recordedStatus: acceptance.status, effectiveStatus, autoExpired, daysToExpiry, nearingExpiry, requiresDecision, headline };
}

export interface AcceptanceSummary {
  assessments: AcceptanceAssessment[];
  byId: Record<string, AcceptanceAssessment>;
  byRiskId: Record<string, AcceptanceAssessment[]>;
  acceptedCount: number;
  expiredCount: number;
  nearingExpiryCount: number;
  requiresDecisionCount: number;
}

export function summariseAcceptances(program: Program): AcceptanceSummary {
  const assessments = program.acceptances.map((a) => assessAcceptance(a, program.statusDate));
  const byId: Record<string, AcceptanceAssessment> = {};
  const byRiskId: Record<string, AcceptanceAssessment[]> = {};
  for (const a of assessments) {
    byId[a.acceptanceId] = a;
    (byRiskId[a.riskId] ??= []).push(a);
  }
  return {
    assessments,
    byId,
    byRiskId,
    acceptedCount: assessments.filter((a) => a.effectiveStatus === 'accepted').length,
    expiredCount: assessments.filter((a) => a.effectiveStatus === 'expired').length,
    nearingExpiryCount: assessments.filter((a) => a.nearingExpiry).length,
    requiresDecisionCount: assessments.filter((a) => a.requiresDecision).length,
  };
}

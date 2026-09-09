import { describe, expect, it } from 'vitest';
import { effectiveAcceptanceStatus, assessAcceptance, summariseAcceptances, NEAR_EXPIRY_DAYS } from './acceptanceEngine';
import { makeAcceptance, makeProgram } from '@/test/factories';

const STATUS = '2026-09-09';

describe('effectiveAcceptanceStatus', () => {
  it('leaves a non-accepted status untouched regardless of expiry date', () => {
    const proposed = makeAcceptance({ status: 'proposed', expiryDate: '2020-01-01' });
    expect(effectiveAcceptanceStatus(proposed, STATUS)).toBe('proposed');
  });

  it('returns ACCEPTED while the expiry date has not yet passed', () => {
    const acc = makeAcceptance({ status: 'accepted', expiryDate: '2026-12-31' });
    expect(effectiveAcceptanceStatus(acc, STATUS)).toBe('accepted');
  });

  it('computes EXPIRED once the status date passes the expiry date, regardless of the stored status', () => {
    const acc = makeAcceptance({ status: 'accepted', expiryDate: '2026-08-01' });
    expect(effectiveAcceptanceStatus(acc, STATUS)).toBe('expired');
  });

  it('never permanently silently accepts: an accepted risk with no expiry date is treated as still accepted, not exempt', () => {
    const acc = makeAcceptance({ status: 'accepted', expiryDate: undefined });
    expect(effectiveAcceptanceStatus(acc, STATUS)).toBe('accepted');
  });
});

describe('assessAcceptance', () => {
  it('flags autoExpired only when the recorded status disagrees with the computed one', () => {
    const acc = makeAcceptance({ status: 'accepted', expiryDate: '2026-08-01' });
    const result = assessAcceptance(acc, STATUS);
    expect(result.effectiveStatus).toBe('expired');
    expect(result.autoExpired).toBe(true);
    expect(result.requiresDecision).toBe(true);
  });

  it('does not flag autoExpired when the acceptance was already recorded as expired', () => {
    const acc = makeAcceptance({ status: 'expired', expiryDate: '2026-08-01' });
    const result = assessAcceptance(acc, STATUS);
    expect(result.autoExpired).toBe(false);
  });

  it('flags nearingExpiry inside the near-expiry window and requires a decision', () => {
    const soon = new Date(new Date(STATUS).getTime() + (NEAR_EXPIRY_DAYS - 1) * 86_400_000).toISOString().slice(0, 10);
    const acc = makeAcceptance({ status: 'accepted', expiryDate: soon });
    const result = assessAcceptance(acc, STATUS);
    expect(result.nearingExpiry).toBe(true);
    expect(result.requiresDecision).toBe(true);
  });

  it('does not flag nearingExpiry well outside the window', () => {
    const acc = makeAcceptance({ status: 'accepted', expiryDate: '2027-06-01' });
    const result = assessAcceptance(acc, STATUS);
    expect(result.nearingExpiry).toBe(false);
    expect(result.requiresDecision).toBe(false);
  });
});

describe('summariseAcceptances', () => {
  it('counts expired, accepted and requires-decision acceptances across the programme', () => {
    const expired = makeAcceptance({ id: 'a1', riskId: 'r1', status: 'accepted', expiryDate: '2026-08-01' });
    const accepted = makeAcceptance({ id: 'a2', riskId: 'r2', status: 'accepted', expiryDate: '2027-06-01' });
    const program = makeProgram({ acceptances: [expired, accepted], statusDate: STATUS });
    const summary = summariseAcceptances(program);
    expect(summary.expiredCount).toBe(1);
    expect(summary.acceptedCount).toBe(1);
    expect(summary.requiresDecisionCount).toBe(1);
    expect(summary.byRiskId['r1']).toHaveLength(1);
  });
});

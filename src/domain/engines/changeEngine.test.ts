import { describe, expect, it } from 'vitest';
import { STEERCO_THRESHOLDS, assessChange, assessDecision, summariseChanges, summariseDecisions } from './changeEngine';
import { makeChange, makeDecision, makeProgram } from '@/test/factories';

const STATUS = '2026-06-30';

describe('assessChange', () => {
  const program = makeProgram({ statusDate: STATUS, budget: 8_400_000 });

  it('computes net value and return ratio', () => {
    const a = assessChange(makeChange({ costImpact: 200_000, benefitImpact: 600_000 }), program);
    expect(a.netValue).toBe(400_000);
    expect(a.returnRatio).toBeCloseTo(3, 6);
  });

  it('reports an infinite return for a zero-cost change that adds benefit', () => {
    const a = assessChange(makeChange({ costImpact: 0, benefitImpact: 100_000 }), program);
    expect(a.returnRatio).toBe(Infinity);
  });

  it('reports a zero return when there is neither cost nor benefit', () => {
    const a = assessChange(makeChange({ costImpact: 0, benefitImpact: 0 }), program);
    expect(a.returnRatio).toBe(0);
  });

  it('escalates to SteerCo above the cost threshold', () => {
    expect(assessChange(makeChange({ costImpact: STEERCO_THRESHOLDS.cost }), program).requiresSteerCo).toBe(true);
    expect(assessChange(makeChange({ costImpact: STEERCO_THRESHOLDS.cost - 1, benefitImpact: 0, scheduleImpactDays: 0 }), program).requiresSteerCo).toBe(false);
  });

  it('escalates on schedule or benefit even when cost is small', () => {
    expect(assessChange(makeChange({ costImpact: 0, benefitImpact: 0, scheduleImpactDays: 21 }), program).requiresSteerCo).toBe(true);
    expect(assessChange(makeChange({ costImpact: 0, scheduleImpactDays: 0, benefitImpact: 500_000 }), program).requiresSteerCo).toBe(true);
  });

  it('escalates on a large negative impact as well as a positive one', () => {
    expect(assessChange(makeChange({ costImpact: -400_000, benefitImpact: 0, scheduleImpactDays: 0 }), program).requiresSteerCo).toBe(true);
  });

  it('counts days awaiting a decision only while it is still open', () => {
    const pending = assessChange(makeChange({ raisedDate: '2026-06-01', decision: 'pending' }), program);
    expect(pending.daysAwaitingDecision).toBe(29);
    const approved = assessChange(makeChange({ raisedDate: '2026-06-01', decision: 'approved' }), program);
    expect(approved.daysAwaitingDecision).toBeNull();
    expect(approved.isStale).toBe(false);
  });

  it('marks a change stale after 21 days without a decision', () => {
    expect(assessChange(makeChange({ raisedDate: '2026-06-01', decision: 'pending' }), program).isStale).toBe(true);
    expect(assessChange(makeChange({ raisedDate: '2026-06-20', decision: 'pending' }), program).isStale).toBe(false);
  });

  it('flags an approved change with negative net value', () => {
    const a = assessChange(makeChange({ costImpact: 300_000, benefitImpact: 0, decision: 'approved' }), program);
    expect(a.drivers.some((d) => d.includes('negative net value'))).toBe(true);
  });

  it('sums reach across every affected object type', () => {
    const a = assessChange(
      makeChange({
        affectedWorkstreamIds: ['w1'],
        affectedMilestoneIds: ['m1', 'm2'],
        affectedDependencyIds: ['d1'],
        affectedBenefitIds: ['b1'],
      }),
      program,
    );
    expect(a.reach).toBe(5);
    expect(a.impactIndex).toBeGreaterThan(0);
    expect(a.impactIndex).toBeLessThanOrEqual(100);
  });
});

describe('summariseChanges', () => {
  const program = makeProgram({
    statusDate: STATUS,
    budget: 8_400_000,
    changes: [
      makeChange({ id: 'c1', decision: 'approved', costImpact: 300_000, scheduleImpactDays: 10, benefitImpact: 500_000 }),
      makeChange({ id: 'c2', decision: 'pending', costImpact: 150_000, raisedDate: '2026-06-25' }),
      makeChange({ id: 'c3', decision: 'rejected', costImpact: 900_000 }),
      makeChange({ id: 'c4', decision: 'escalated', costImpact: 200_000, raisedDate: '2026-05-01' }),
      makeChange({ id: 'c5', decision: 'deferred', costImpact: 50_000 }),
    ],
  });

  it('counts each decision state', () => {
    const s = summariseChanges(program);
    expect(s.total).toBe(5);
    expect(s.approved).toBe(1);
    expect(s.pending).toBe(1);
    expect(s.rejected).toBe(1);
    expect(s.escalated).toBe(1);
    expect(s.deferred).toBe(1);
  });

  it('counts only approved cost as committed', () => {
    const s = summariseChanges(program);
    expect(s.approvedCostImpact).toBe(300_000);
    expect(s.approvedScheduleImpactDays).toBe(10);
    expect(s.approvedBenefitImpact).toBe(500_000);
  });

  it('separates the pending overhang from committed cost', () => {
    const s = summariseChanges(program);
    expect(s.pendingCostExposure).toBe(150_000 + 200_000 + 50_000);
  });

  it('expresses committed change as budget erosion', () => {
    expect(summariseChanges(program).budgetErosionPct).toBeCloseTo(300_000 / 8_400_000, 6);
  });

  it('counts stale changes', () => {
    expect(summariseChanges(program).staleCount).toBe(1);
  });

  it('handles a program with no changes', () => {
    const s = summariseChanges(makeProgram());
    expect(s.total).toBe(0);
    expect(s.budgetErosionPct).toBe(0);
  });
});

describe('assessDecision', () => {
  it('treats a single-option decision as no real choice', () => {
    const a = assessDecision(makeDecision({ options: [{ id: 'o1', label: 'Only way', pros: [], cons: [], estimatedCost: 0, estimatedScheduleDays: 0, residualRiskNote: 'None' }] }), STATUS);
    expect(a.hasGenuineChoice).toBe(false);
    expect(a.drivers.some((d) => d.includes('no real alternative'))).toBe(true);
  });

  it('scores process quality higher when the decision is well documented', () => {
    const bare = assessDecision(makeDecision(), STATUS);
    const good = assessDecision(
      makeDecision({
        options: [
          { id: 'o1', label: 'A', pros: ['fast'], cons: ['cost'], estimatedCost: 100, estimatedScheduleDays: 0, residualRiskNote: 'Vendor still owns delivery' },
          { id: 'o2', label: 'B', pros: [], cons: [], estimatedCost: 0, estimatedScheduleDays: 5, residualRiskNote: 'Slips the gate' },
        ],
        chosenOptionId: 'o1',
        rationale: 'Option A protects the go-live date at acceptable cost.',
        evidence: [
          { id: 'e1', label: 'Vendor plan', kind: 'document', date: '2026-05-01', source: 'Vendor', confidence: 'measured' },
          { id: 'e2', label: 'Test report', kind: 'test-result', date: '2026-05-15', source: 'QA', confidence: 'verified' },
        ],
        reviewDate: '2026-08-01',
      }),
      STATUS,
    );
    expect(good.processQuality).toBeGreaterThan(bare.processQuality);
    expect(good.processQuality).toBeLessThanOrEqual(100);
  });

  it('flags an undecided decision past its required-by date', () => {
    const a = assessDecision(makeDecision({ dateRequired: '2026-06-01', status: 'required' }), STATUS);
    expect(a.isOverdue).toBe(true);
  });

  it('flags a decided decision whose review passed with no outcome recorded', () => {
    const a = assessDecision(makeDecision({ status: 'decided', dateDecided: '2026-05-01', reviewDate: '2026-06-01' }), STATUS);
    expect(a.reviewDue).toBe(true);
    expect(a.outcomeKnown).toBe(false);
  });

  it('measures days to decide against the required-by date', () => {
    const a = assessDecision(makeDecision({ status: 'decided', dateRequired: '2026-06-01', dateDecided: '2026-06-11' }), STATUS);
    expect(a.daysToDecide).toBe(10);
  });
});

describe('summariseDecisions', () => {
  const program = makeProgram({
    statusDate: STATUS,
    decisions: [
      makeDecision({ id: 'd1', status: 'decided', dateRequired: '2026-04-01', dateDecided: '2026-04-05', outcomeScore: 5, actualOutcome: 'Worked' }),
      makeDecision({ id: 'd2', status: 'decided', dateRequired: '2026-05-01', dateDecided: '2026-05-11', outcomeScore: 2, actualOutcome: 'Did not hold' }),
      makeDecision({ id: 'd3', status: 'required', dateRequired: '2026-06-01' }),
    ],
  });

  it('reports the share of reviewed decisions that scored well', () => {
    const s = summariseDecisions(program);
    expect(s.reviewedCount).toBe(2);
    expect(s.goodOutcomeRate).toBeCloseTo(0.5, 6);
  });

  it('averages days to decide over decided decisions only', () => {
    expect(summariseDecisions(program).averageDaysToDecide).toBeCloseTo(7, 6);
  });

  it('counts outstanding and overdue decisions', () => {
    const s = summariseDecisions(program);
    expect(s.required).toBe(1);
    expect(s.decided).toBe(2);
    expect(s.overdue).toBe(1);
  });

  it('handles a program with no decisions', () => {
    const s = summariseDecisions(makeProgram());
    expect(s.total).toBe(0);
    expect(s.goodOutcomeRate).toBe(0);
    expect(s.averageDaysToDecide).toBe(0);
  });
});

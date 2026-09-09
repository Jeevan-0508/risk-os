import { describe, expect, it } from 'vitest';
import { assessMilestone, summariseActions, summariseSchedule } from './scheduleEngine';
import { makeAction, makeBenefit, makeDependency, makeMilestone, makeProgram, makeRisk } from '@/test/factories';
import type { Deliverable } from '@/domain/types';

const STATUS = '2026-06-30';

function makeDeliverable(over: Partial<Deliverable> = {}): Deliverable {
  return {
    id: 'del-t1',
    name: 'Test deliverable',
    milestoneId: 'ms-t1',
    ownerId: 'own-1',
    dueDate: '2026-06-01',
    status: 'in-progress',
    percentComplete: 50,
    acceptanceCriteria: 'Signed off by the process owner.',
    ...over,
  };
}

describe('assessMilestone', () => {
  it('reports variance as forecast minus baseline', () => {
    const ms = makeMilestone({ baselineDate: '2026-08-01', forecastDate: '2026-08-15' });
    const a = assessMilestone(ms, makeProgram({ statusDate: STATUS, milestones: [ms] }));
    expect(a.varianceDays).toBe(14);
    expect(a.drivers[0]).toContain('14 days behind baseline');
  });

  it('marks a milestone at risk once variance reaches the 10 day threshold', () => {
    const late = makeMilestone({ id: 'm1', baselineDate: '2026-08-01', forecastDate: '2026-08-11' });
    const ok = makeMilestone({ id: 'm2', baselineDate: '2026-08-01', forecastDate: '2026-08-10' });
    const program = makeProgram({ statusDate: STATUS, milestones: [late, ok] });
    expect(assessMilestone(late, program).isAtRisk).toBe(true);
    expect(assessMilestone(ok, program).isAtRisk).toBe(false);
  });

  it('treats a completed milestone as neither overdue nor at risk', () => {
    const ms = makeMilestone({ status: 'complete', baselineDate: '2026-01-01', forecastDate: '2026-02-01', actualDate: '2026-02-01' });
    const a = assessMilestone(ms, makeProgram({ statusDate: STATUS, milestones: [ms] }));
    expect(a.isComplete).toBe(true);
    expect(a.isOverdue).toBe(false);
    expect(a.isAtRisk).toBe(false);
  });

  it('flags an overdue milestone whose forecast date has passed', () => {
    const ms = makeMilestone({ baselineDate: '2026-06-01', forecastDate: '2026-06-01', status: 'in-progress' });
    const a = assessMilestone(ms, makeProgram({ statusDate: STATUS, milestones: [ms] }));
    expect(a.isOverdue).toBe(true);
    expect(a.isAtRisk).toBe(true);
  });

  it('accumulates probability-weighted dependency pressure', () => {
    const ms = makeMilestone({ id: 'm1' });
    const program = makeProgram({
      statusDate: STATUS,
      milestones: [ms],
      dependencies: [
        makeDependency({ id: 'd1', affectedMilestoneIds: ['m1'], delayProbability: 0.5, potentialDelayDays: 20, status: 'at-risk' }),
        makeDependency({ id: 'd2', affectedMilestoneIds: ['m1'], delayProbability: 0.5, potentialDelayDays: 10, status: 'delivered' }),
      ],
    });
    const a = assessMilestone(ms, program);
    expect(a.blockingDependencyIds).toEqual(['d1']);
    expect(a.dependencyPressureDays).toBe(10);
    expect(a.isAtRisk).toBe(true);
  });

  it('excludes closed risks from milestone exposure', () => {
    const ms = makeMilestone({ id: 'm1' });
    const program = makeProgram({
      statusDate: STATUS,
      milestones: [ms],
      risks: [
        makeRisk({ id: 'r1', affectedMilestoneIds: ['m1'], inherentProbability: 0.5, inherentFinancialImpact: 1_000_000 }),
        makeRisk({ id: 'r2', affectedMilestoneIds: ['m1'], status: 'closed', inherentProbability: 1, inherentFinancialImpact: 9_000_000 }),
      ],
    });
    const a = assessMilestone(ms, program);
    expect(a.linkedRiskIds).toEqual(['r1']);
    expect(a.riskExposure).toBe(500_000);
  });

  it('reports the unrealised benefit gated behind the milestone', () => {
    const ms = makeMilestone({ id: 'm1' });
    const program = makeProgram({
      statusDate: STATUS,
      milestones: [ms],
      benefits: [makeBenefit({ id: 'b1', expectedValue: 1_200_000, realisedValue: 200_000, enablingMilestoneIds: ['m1'] })],
    });
    const a = assessMilestone(ms, program);
    expect(a.enabledBenefitIds).toEqual(['b1']);
    expect(a.benefitValueGated).toBe(1_000_000);
  });

  it('averages deliverable completion', () => {
    const ms = makeMilestone({ id: 'm1' });
    const program = makeProgram({
      statusDate: STATUS,
      milestones: [ms],
      deliverables: [
        makeDeliverable({ id: 'dl1', milestoneId: 'm1', percentComplete: 100 }),
        makeDeliverable({ id: 'dl2', milestoneId: 'm1', percentComplete: 0 }),
      ],
    });
    expect(assessMilestone(ms, program).deliverableCompletion).toBeCloseTo(0.5, 6);
  });

  it('falls back to the milestone status when it has no deliverables', () => {
    const ms = makeMilestone({ id: 'm1', status: 'complete' });
    expect(assessMilestone(ms, makeProgram({ statusDate: STATUS, milestones: [ms] })).deliverableCompletion).toBe(1);
  });

  it('tolerates unparseable dates instead of throwing', () => {
    const ms = makeMilestone({ baselineDate: 'nope', forecastDate: 'also-nope' });
    const a = assessMilestone(ms, makeProgram({ statusDate: STATUS, milestones: [ms] }));
    expect(a.varianceDays).toBe(0);
    expect(a.daysToForecast).toBeNull();
  });
});

describe('summariseActions', () => {
  const actions = [
    makeAction({ id: 'a1', dueDate: '2026-06-01', status: 'open' }),
    makeAction({ id: 'a2', dueDate: '2026-06-01', status: 'complete' }),
    makeAction({ id: 'a3', dueDate: '2026-08-01', status: 'in-progress' }),
    makeAction({ id: 'a4', dueDate: '2026-01-01', status: 'cancelled' }),
  ];

  it('counts only live overdue actions', () => {
    const s = summariseActions(actions, STATUS);
    expect(s.overdue).toBe(1);
    expect(s.overdueActions.map((a) => a.id)).toEqual(['a1']);
  });

  it('excludes cancelled actions from the completion rate', () => {
    const s = summariseActions(actions, STATUS);
    expect(s.completed).toBe(1);
    expect(s.open).toBe(2);
    expect(s.completionRate).toBeCloseTo(1 / 3, 6);
  });

  it('sums the risk reduction promised by late actions', () => {
    expect(summariseActions(actions, STATUS).atRiskReduction).toBeCloseTo(0.2, 6);
  });

  it('handles an empty action list', () => {
    const s = summariseActions([], STATUS);
    expect(s.total).toBe(0);
    expect(s.completionRate).toBe(0);
  });
});

describe('summariseSchedule', () => {
  const program = makeProgram({
    statusDate: STATUS,
    milestones: [
      makeMilestone({ id: 'm1', status: 'complete', baselineDate: '2026-02-01', forecastDate: '2026-02-01', actualDate: '2026-02-01' }),
      makeMilestone({ id: 'm2', status: 'in-progress', baselineDate: '2026-05-01', forecastDate: '2026-07-15' }),
      makeMilestone({ id: 'm3', status: 'not-started', baselineDate: '2026-09-01', forecastDate: '2026-09-01', isGate: true }),
      makeMilestone({ id: 'm4', status: 'blocked', baselineDate: '2026-10-01', forecastDate: '2026-10-01', isGate: true }),
    ],
  });

  it('counts complete, at-risk and overdue milestones', () => {
    const s = summariseSchedule(program);
    expect(s.total).toBe(4);
    expect(s.complete).toBe(1);
    expect(s.atRisk).toBe(2);
    expect(s.percentComplete).toBeCloseTo(0.25, 6);
  });

  it('counts gates at risk separately', () => {
    expect(summariseSchedule(program).gatesAtRisk).toBe(1);
  });

  it('ignores completed milestones when measuring variance', () => {
    const s = summariseSchedule(program);
    expect(s.worstVarianceDays).toBe(75);
  });

  it('derives a schedule performance index against milestones due by the status date', () => {
    const s = summariseSchedule(program);
    expect(s.schedulePerformanceIndex).toBeCloseTo(0.5, 6);
  });

  it('returns a neutral index for a program with no milestones due yet', () => {
    const s = summariseSchedule(makeProgram({ statusDate: '2026-01-01' }));
    expect(s.schedulePerformanceIndex).toBe(1);
    expect(s.total).toBe(0);
  });
});

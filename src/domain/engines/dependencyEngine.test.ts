import { describe, expect, it } from 'vitest';
import {
  assessDependency,
  cascadeMilestones,
  chainDepth,
  computeCriticalChain,
  simulateSlip,
  summariseDependencies,
} from './dependencyEngine';
import { makeBenefit, makeDependency, makeMilestone, makeProgram } from '@/test/factories';

describe('chainDepth', () => {
  it('is 1 for a dependency with no predecessor', () => {
    const d = makeDependency({ id: 'd1' });
    expect(chainDepth(d, [d])).toBe(1);
  });

  it('counts the longest predecessor path', () => {
    const a = makeDependency({ id: 'a' });
    const b = makeDependency({ id: 'b', predecessorIds: ['a'] });
    const c = makeDependency({ id: 'c', predecessorIds: ['b'] });
    expect(chainDepth(c, [a, b, c])).toBe(3);
  });

  it('does not hang on a cycle', () => {
    const a = makeDependency({ id: 'a', predecessorIds: ['b'] });
    const b = makeDependency({ id: 'b', predecessorIds: ['a'] });
    expect(chainDepth(a, [a, b])).toBeGreaterThan(0);
  });

  it('ignores a predecessor id that does not resolve', () => {
    const a = makeDependency({ id: 'a', predecessorIds: ['ghost'] });
    expect(chainDepth(a, [a])).toBe(1);
  });
});

describe('cascadeMilestones', () => {
  const milestones = [
    makeMilestone({ id: 'm1' }),
    makeMilestone({ id: 'm2', predecessorIds: ['m1'] }),
    makeMilestone({ id: 'm3', predecessorIds: ['m2'] }),
    makeMilestone({ id: 'm9' }),
  ];

  it('walks the whole transitive downstream chain', () => {
    expect(cascadeMilestones(['m1'], milestones).sort()).toEqual(['m2', 'm3']);
  });

  it('excludes the seed milestones from the cascade', () => {
    expect(cascadeMilestones(['m1'], milestones)).not.toContain('m1');
  });

  it('returns nothing for an unconnected milestone', () => {
    expect(cascadeMilestones(['m9'], milestones)).toEqual([]);
  });

  it('does not hang on a milestone cycle', () => {
    const cyclic = [makeMilestone({ id: 'a', predecessorIds: ['b'] }), makeMilestone({ id: 'b', predecessorIds: ['a'] })];
    expect(cascadeMilestones(['a'], cyclic)).toEqual(['b']);
  });
});

describe('assessDependency', () => {
  const program = makeProgram({
    statusDate: '2026-06-30',
    milestones: [makeMilestone({ id: 'm1', name: 'API integration complete' }), makeMilestone({ id: 'm2', predecessorIds: ['m1'] })],
    benefits: [makeBenefit({ id: 'b1', expectedValue: 1_200_000, realisedValue: 200_000, enablingMilestoneIds: ['m2'] })],
  });

  it('weights the potential slip by its probability', () => {
    const a = assessDependency(makeDependency({ delayProbability: 0.6, potentialDelayDays: 20 }), program);
    expect(a.expectedDelayDays).toBeCloseTo(12, 6);
  });

  it('treats a late dependency as at least 95pct likely to slip', () => {
    const a = assessDependency(makeDependency({ status: 'late', delayProbability: 0.2 }), program);
    expect(a.delayProbability).toBeGreaterThanOrEqual(0.95);
  });

  it('marks an overdue dependency and reports the days late', () => {
    const a = assessDependency(makeDependency({ dueDate: '2026-06-01', status: 'at-risk' }), program);
    expect(a.isOverdue).toBe(true);
    expect(a.daysToDue).toBe(-29);
    expect(a.drivers.some((d) => d.includes('Overdue by 29 days'))).toBe(true);
  });

  it('does not call a delivered dependency overdue', () => {
    const a = assessDependency(makeDependency({ dueDate: '2026-06-01', status: 'delivered' }), program);
    expect(a.isOverdue).toBe(false);
  });

  it('picks up a benefit reached only through a cascaded milestone', () => {
    const a = assessDependency(makeDependency({ affectedMilestoneIds: ['m1'], delayProbability: 0.5 }), program);
    expect(a.cascadedMilestoneIds).toEqual(['m2']);
    expect(a.affectedBenefitIds).toContain('b1');
    expect(a.benefitValueAtRisk).toBeCloseTo(500_000, 6);
  });

  it('writes a plain-language impact narrative', () => {
    const a = assessDependency(
      makeDependency({ name: 'Vendor API delivery', affectedMilestoneIds: ['m1'], potentialDelayDays: 14, delayProbability: 0.5 }),
      program,
    );
    expect(a.narrative).toContain('If Vendor API delivery slips 14 days');
    expect(a.narrative).toContain('API integration complete');
    expect(a.narrative).toContain('unrealised benefit');
  });

  it('says so plainly when no slip is forecast', () => {
    const a = assessDependency(makeDependency({ potentialDelayDays: 0 }), program);
    expect(a.narrative).toBe('No slip is currently forecast for this dependency.');
  });

  it('keeps the criticality index inside 0..100', () => {
    const a = assessDependency(
      makeDependency({ criticality: 'critical', status: 'late', potentialDelayDays: 400, affectedMilestoneIds: ['m1'] }),
      program,
    );
    expect(a.criticalityIndex).toBeLessThanOrEqual(100);
    expect(a.criticalityIndex).toBeGreaterThan(0);
  });

  it('tolerates an unparseable due date instead of throwing', () => {
    const a = assessDependency(makeDependency({ dueDate: 'not-a-date' }), program);
    expect(a.daysToDue).toBeNull();
    expect(a.isOverdue).toBe(false);
  });
});

describe('computeCriticalChain', () => {
  it('picks the path carrying the most probability-weighted slip, not the longest by count', () => {
    const program = makeProgram({
      dependencies: [
        makeDependency({ id: 'a', delayProbability: 0.1, potentialDelayDays: 2 }),
        makeDependency({ id: 'b', predecessorIds: ['a'], delayProbability: 0.1, potentialDelayDays: 2 }),
        makeDependency({ id: 'c', predecessorIds: ['b'], delayProbability: 0.1, potentialDelayDays: 2 }),
        makeDependency({ id: 'x', delayProbability: 0.9, potentialDelayDays: 30 }),
        makeDependency({ id: 'y', predecessorIds: ['x'], delayProbability: 0.9, potentialDelayDays: 30 }),
      ],
    });
    const chain = computeCriticalChain(program);
    expect(chain.dependencyIds).toEqual(['x', 'y']);
    expect(chain.totalExpectedDelayDays).toBe(54);
  });

  it('returns an empty chain for a program with no dependencies', () => {
    const chain = computeCriticalChain(makeProgram());
    expect(chain.dependencyIds).toEqual([]);
    expect(chain.totalExpectedDelayDays).toBe(0);
  });

  it('does not hang on a dependency cycle', () => {
    const program = makeProgram({
      dependencies: [
        makeDependency({ id: 'a', predecessorIds: ['b'] }),
        makeDependency({ id: 'b', predecessorIds: ['a'] }),
      ],
    });
    expect(computeCriticalChain(program).totalExpectedDelayDays).toBeGreaterThanOrEqual(0);
  });

  it('sums unrealised benefit along the chain', () => {
    const program = makeProgram({
      dependencies: [makeDependency({ id: 'a', affectedBenefitIds: ['b1'], delayProbability: 1, potentialDelayDays: 10 })],
      benefits: [makeBenefit({ id: 'b1', expectedValue: 900_000, realisedValue: 400_000 })],
    });
    expect(computeCriticalChain(program).benefitValueAtRisk).toBe(500_000);
  });
});

describe('summariseDependencies', () => {
  const program = makeProgram({
    dependencies: [
      makeDependency({ id: 'a', status: 'at-risk', criticality: 'critical', type: 'vendor' }),
      makeDependency({ id: 'b', status: 'late', criticality: 'critical', type: 'external' }),
      makeDependency({ id: 'c', status: 'delivered', criticality: 'low', type: 'internal' }),
    ],
  });

  it('counts each status bucket', () => {
    const s = summariseDependencies(program);
    expect(s.total).toBe(3);
    expect(s.atRisk).toBe(1);
    expect(s.late).toBe(1);
    expect(s.delivered).toBe(1);
  });

  it('counts only open critical dependencies', () => {
    expect(summariseDependencies(program).criticalOpen).toBe(2);
  });

  it('reports the share outside the program', () => {
    expect(summariseDependencies(program).externalShare).toBeCloseTo(2 / 3, 6);
  });

  it('excludes delivered dependencies from expected delay', () => {
    const s = summariseDependencies(program);
    expect(s.totalExpectedDelayDays).toBeGreaterThan(0);
  });

  it('handles an empty program without dividing by zero', () => {
    const s = summariseDependencies(makeProgram());
    expect(s.total).toBe(0);
    expect(s.externalShare).toBe(0);
    expect(s.totalExpectedDelayDays).toBe(0);
  });
});

describe('simulateSlip', () => {
  const program = makeProgram({
    milestones: [
      makeMilestone({ id: 'm1', name: 'Security testing', baselineDate: '2026-06-01', forecastDate: '2026-06-06' }),
      makeMilestone({ id: 'm2', name: 'Go live', predecessorIds: ['m1'] }),
    ],
    dependencies: [makeDependency({ id: 'd1', name: 'Vendor API', affectedMilestoneIds: ['m1'] })],
    benefits: [makeBenefit({ id: 'b1', expectedValue: 1_200_000, realisedValue: 0, enablingMilestoneIds: ['m2'] })],
  });

  it('shifts the forecast date and adds to the existing variance', () => {
    const impact = simulateSlip(program, 'd1', 14);
    expect(impact?.directMilestones[0].newForecast).toBe('2026-06-20');
    expect(impact?.directMilestones[0].slip).toBe(19);
  });

  it('surfaces the benefit threatened through the cascade', () => {
    const impact = simulateSlip(program, 'd1', 14);
    expect(impact?.cascadedMilestoneIds).toEqual(['m2']);
    expect(impact?.totalBenefitExposure).toBe(1_200_000);
  });

  it('returns null for an unknown dependency instead of throwing', () => {
    expect(simulateSlip(program, 'nope', 5)).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { assessDmaic, computePareto, computeSigma, correctiveActionsForCause, groupFishbone, normalQuantile, summariseSystemicRootCauses } from './dmaicEngine';
import { makeAction, makeFmea, makeRisk } from '@/test/factories';
import type { Cause, DmaicProject } from '@/domain/types';

function makeCause(over: Partial<Cause> = {}): Cause {
  return {
    id: 'cau-t1',
    ref: 'CAU-T1',
    title: 'Test cause',
    description: 'Cause used in unit tests.',
    category: 'process',
    isRootCause: false,
    whyChain: ['Why one', 'Why two'],
    frequency: 10,
    linkedRiskIds: [],
    linkedIssueIds: [],
    ownerId: 'own-1',
    ...over,
  };
}

function makeDmaic(over: Partial<DmaicProject> = {}): DmaicProject {
  return {
    id: 'dmc-t1',
    ref: 'DMAIC-T1',
    name: 'Test improvement',
    ownerId: 'own-1',
    phase: 'improve',
    startDate: '2026-01-01',
    targetDate: '2026-09-01',
    define: {
      problemStatement: 'Order data is rejected at the integration boundary too often.',
      businessImpact: 'Rework cost',
      customerImpact: 'Late deliveries',
      ctq: ['First pass yield'],
      inScope: ['EU lanes'],
      outOfScope: ['NA lanes'],
      goalStatement: 'Cut rejects by half.',
    },
    measure: {
      metricName: 'Reject rate',
      unit: 'pct',
      baseline: 12,
      volume: 10000,
      defectRate: 0.12,
      cycleTimeDays: 4,
      costOfPoorQuality: 800000,
      dataSource: 'Warehouse extract',
      trend: [
        { date: '2026-03-01', value: 13 },
        { date: '2026-04-01', value: 12.5 },
        { date: '2026-05-01', value: 12 },
      ],
    },
    analyze: { causeIds: ['cau-1'], fmeaIds: ['fma-1'], hypothesis: 'Mapping gaps', finding: 'Confirmed' },
    improve: { countermeasures: [] },
    control: {
      controlMetric: 'Weekly reject rate',
      upperControlLimit: 6,
      lowerControlLimit: 0,
      monitoringFrequency: 'weekly',
      escalationTrigger: 'Two consecutive weeks above 6pct',
      ownerId: 'own-1',
      linkedControlIds: ['ctl-1'],
    },
    linkedRiskIds: [],
    ...over,
  };
}

describe('computePareto', () => {
  it('sorts descending and accumulates share to 100pct', () => {
    const slices = computePareto([
      makeCause({ id: 'a', frequency: 10 }),
      makeCause({ id: 'b', frequency: 50 }),
      makeCause({ id: 'c', frequency: 40 }),
    ]);
    expect(slices.map((s) => s.causeId)).toEqual(['b', 'c', 'a']);
    expect(slices[slices.length - 1].cumulativePct).toBeCloseTo(1, 6);
  });

  it('includes the slice that crosses 80pct in the vital few', () => {
    const slices = computePareto([
      makeCause({ id: 'a', frequency: 50 }),
      makeCause({ id: 'b', frequency: 40 }),
      makeCause({ id: 'c', frequency: 10 }),
    ]);
    expect(slices.filter((s) => s.isVitalFew).map((s) => s.causeId)).toEqual(['a', 'b']);
  });

  it('drops causes with no observed frequency', () => {
    const slices = computePareto([makeCause({ id: 'a', frequency: 0 }), makeCause({ id: 'b', frequency: 5 })]);
    expect(slices.map((s) => s.causeId)).toEqual(['b']);
  });

  it('returns an empty list rather than dividing by zero', () => {
    expect(computePareto([])).toEqual([]);
  });
});

describe('computeSigma', () => {
  it('converts a defect rate to DPMO', () => {
    expect(computeSigma(0.0034).dpmo).toBeCloseTo(3400, 6);
  });

  it('places 3400 DPMO at roughly 4.5 sigma long term', () => {
    expect(computeSigma(0.0034).sigmaLevel).toBeGreaterThan(4.1);
    expect(computeSigma(0.0034).sigmaLevel).toBeLessThan(4.4);
  });

  it('improves sigma as the defect rate falls', () => {
    expect(computeSigma(0.001).sigmaLevel).toBeGreaterThan(computeSigma(0.05).sigmaLevel);
  });

  it('handles the degenerate ends without producing NaN', () => {
    expect(computeSigma(0).sigmaLevel).toBe(6);
    expect(computeSigma(1).sigmaLevel).toBe(0);
    expect(Number.isNaN(computeSigma(Number.NaN).sigmaLevel)).toBe(false);
  });
});

describe('normalQuantile', () => {
  it('is zero at the median', () => {
    expect(normalQuantile(0.5)).toBeCloseTo(0, 6);
  });

  it('matches the textbook 1.6449 at the 95th percentile', () => {
    expect(normalQuantile(0.95)).toBeCloseTo(1.6449, 3);
  });

  it('is antisymmetric', () => {
    expect(normalQuantile(0.01)).toBeCloseTo(-normalQuantile(0.99), 4);
  });
});

describe('assessDmaic', () => {
  const causes = [makeCause({ id: 'cau-1', isRootCause: true })];
  const fmea = [makeFmea({ id: 'fma-1' })];

  it('combines countermeasures multiplicatively, not additively', () => {
    const a = assessDmaic(
      makeDmaic({
        improve: {
          countermeasures: [
            { id: 'cm1', description: 'A', expectedImprovementPct: 0.5, ownerId: 'own-1', pilotScope: '', dueDate: '2026-06-01', status: 'implemented' },
            { id: 'cm2', description: 'B', expectedImprovementPct: 0.5, ownerId: 'own-1', pilotScope: '', dueDate: '2026-06-01', status: 'implemented' },
          ],
        },
      }),
      causes,
      fmea,
    );
    expect(a.expectedImprovementPct).toBeCloseTo(0.75, 6);
    expect(a.projected).toBeCloseTo(3, 6);
  });

  it('weights a piloting countermeasure at half', () => {
    const a = assessDmaic(
      makeDmaic({
        improve: {
          countermeasures: [
            { id: 'cm1', description: 'A', expectedImprovementPct: 0.4, ownerId: 'own-1', pilotScope: 'One site', dueDate: '2026-06-01', status: 'piloting' },
          ],
        },
      }),
      causes,
      fmea,
    );
    expect(a.expectedImprovementPct).toBeCloseTo(0.2, 6);
  });

  it('ignores planned and rejected countermeasures entirely', () => {
    const a = assessDmaic(
      makeDmaic({
        improve: {
          countermeasures: [
            { id: 'cm1', description: 'A', expectedImprovementPct: 0.9, ownerId: 'own-1', pilotScope: '', dueDate: '2026-06-01', status: 'planned' },
            { id: 'cm2', description: 'B', expectedImprovementPct: 0.9, ownerId: 'own-1', pilotScope: '', dueDate: '2026-06-01', status: 'rejected' },
          ],
        },
      }),
      causes,
      fmea,
    );
    expect(a.expectedImprovementPct).toBe(0);
    expect(a.projectedSavings).toBe(0);
  });

  it('blocks the Improve gate until something is implemented', () => {
    const a = assessDmaic(makeDmaic(), causes, fmea);
    const gate = a.gateReadiness.find((g) => g.gate === 'Improve');
    expect(gate?.ready).toBe(false);
  });

  it('blocks the Analyze gate when no validated root cause is linked', () => {
    const a = assessDmaic(makeDmaic(), [makeCause({ id: 'cau-1', isRootCause: false })], fmea);
    expect(a.gateReadiness.find((g) => g.gate === 'Analyze')?.ready).toBe(false);
  });

  it('passes the Control gate only when a standing control is linked', () => {
    const ok = assessDmaic(makeDmaic(), causes, fmea);
    expect(ok.gateReadiness.find((g) => g.gate === 'Control')?.ready).toBe(true);
    const bad = assessDmaic(
      makeDmaic({ control: { ...makeDmaic().control, linkedControlIds: [] } }),
      causes,
      fmea,
    );
    expect(bad.gateReadiness.find((g) => g.gate === 'Control')?.ready).toBe(false);
  });

  it('derives phase progress from the phase', () => {
    expect(assessDmaic(makeDmaic({ phase: 'define' }), causes, fmea).phaseProgress).toBeCloseTo(0.2, 6);
    expect(assessDmaic(makeDmaic({ phase: 'control' }), causes, fmea).phaseProgress).toBeCloseTo(1, 6);
  });
});

describe('groupFishbone', () => {
  it('returns all seven Ishikawa categories even when empty', () => {
    const groups = groupFishbone([]);
    expect(groups.map((g) => g.category)).toEqual(['people', 'process', 'technology', 'policy', 'environment', 'measurement', 'management']);
    expect(groups.every((g) => g.causes.length === 0)).toBe(true);
  });

  it('sorts causes inside a category by frequency and counts root causes', () => {
    const groups = groupFishbone([
      makeCause({ id: 'a', category: 'people', frequency: 3 }),
      makeCause({ id: 'b', category: 'people', frequency: 9, isRootCause: true }),
    ]);
    const people = groups.find((g) => g.category === 'people');
    expect(people?.causes.map((c) => c.id)).toEqual(['b', 'a']);
    expect(people?.totalFrequency).toBe(12);
    expect(people?.rootCauseCount).toBe(1);
  });
});

describe('summariseSystemicRootCauses', () => {
  it('only ever includes causes explicitly marked isRootCause, never by frequency alone', () => {
    const frequent = makeCause({ id: 'c1', isRootCause: false, frequency: 999, linkedRiskIds: ['r1', 'r2', 'r3'] });
    const rare = makeCause({ id: 'c2', isRootCause: true, frequency: 1, linkedRiskIds: ['r1'] });
    const summary = summariseSystemicRootCauses([frequent, rare]);
    expect(summary.map((s) => s.causeId)).toEqual(['c2']);
  });

  it('flags isSystemic once a root cause reaches two or more risks, not on frequency', () => {
    const systemic = makeCause({ id: 'c1', isRootCause: true, frequency: 2, linkedRiskIds: ['r1', 'r2'] });
    const isolated = makeCause({ id: 'c2', isRootCause: true, frequency: 500, linkedRiskIds: ['r3'] });
    const summary = summariseSystemicRootCauses([systemic, isolated]);
    expect(summary.find((s) => s.causeId === 'c1')?.isSystemic).toBe(true);
    expect(summary.find((s) => s.causeId === 'c2')?.isSystemic).toBe(false);
  });

  it('orders root causes by how many risks they reach, worst first', () => {
    const small = makeCause({ id: 'c1', isRootCause: true, linkedRiskIds: ['r1'] });
    const large = makeCause({ id: 'c2', isRootCause: true, linkedRiskIds: ['r1', 'r2', 'r3', 'r4'] });
    const summary = summariseSystemicRootCauses([small, large]);
    expect(summary[0].causeId).toBe('c2');
  });
});

describe('correctiveActionsForCause', () => {
  it('collects corrective actions from every risk the cause is linked to', () => {
    const cause = makeCause({ id: 'c1', isRootCause: true, linkedRiskIds: ['r1', 'r2'] });
    const risks = [
      makeRisk({ id: 'r1', actionIds: ['a1'] }),
      makeRisk({ id: 'r2', actionIds: ['a2'] }),
    ];
    const actions = [makeAction({ id: 'a1', ref: 'ACT-1' }), makeAction({ id: 'a2', ref: 'ACT-2' })];
    const result = correctiveActionsForCause(cause, risks, actions);
    expect(result.map((r) => r.ref).sort()).toEqual(['ACT-1', 'ACT-2']);
  });

  it('reports one entry, with both risks named, when the same corrective action serves two risks under one cause', () => {
    const cause = makeCause({ id: 'c1', isRootCause: true, linkedRiskIds: ['r1', 'r2'] });
    const risks = [
      makeRisk({ id: 'r1', actionIds: ['a1'] }),
      makeRisk({ id: 'r2', actionIds: ['a1'] }),
    ];
    const actions = [makeAction({ id: 'a1' })];
    const result = correctiveActionsForCause(cause, risks, actions);
    expect(result).toHaveLength(1);
    expect(result[0].viaRiskIds.sort()).toEqual(['r1', 'r2']);
  });

  it('ignores risks the cause is not linked to', () => {
    const cause = makeCause({ id: 'c1', isRootCause: true, linkedRiskIds: ['r1'] });
    const risks = [makeRisk({ id: 'r1', actionIds: ['a1'] }), makeRisk({ id: 'r2', actionIds: ['a2'] })];
    const actions = [makeAction({ id: 'a1' }), makeAction({ id: 'a2' })];
    const result = correctiveActionsForCause(cause, risks, actions);
    expect(result.map((r) => r.actionId)).toEqual(['a1']);
  });
});

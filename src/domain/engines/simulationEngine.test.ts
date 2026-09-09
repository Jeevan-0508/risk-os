import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SIMULATION_CONFIG,
  PERT_LAMBDA,
  SIMULATION_ASSUMPTIONS,
  deriveTasks,
  explainPercentile,
  runSimulation,
  samplePert,
} from './simulationEngine';
import { createRng } from '@/lib/random';
import { makeMilestone, makeProgram, makeRisk } from '@/test/factories';
import type { SimulationTask } from '@/domain/types';

function task(over: Partial<SimulationTask> = {}): SimulationTask {
  return {
    id: 'sim-1',
    name: 'Test task',
    milestoneId: 'ms-t1',
    optimisticDays: 10,
    mostLikelyDays: 20,
    pessimisticDays: 40,
    optimisticCost: 80_000,
    mostLikelyCost: 100_000,
    pessimisticCost: 160_000,
    riskIds: [],
    ...over,
  };
}

describe('samplePert', () => {
  it('never samples outside the optimistic to pessimistic range', () => {
    const rng = createRng(1);
    for (let i = 0; i < 2000; i += 1) {
      const v = samplePert(rng, 10, 20, 40);
      expect(v).toBeGreaterThanOrEqual(10);
      expect(v).toBeLessThanOrEqual(40);
    }
  });

  it('centres near the PERT mean rather than the midpoint', () => {
    const rng = createRng(7);
    const samples = Array.from({ length: 5000 }, () => samplePert(rng, 10, 20, 40));
    const average = samples.reduce((a, b) => a + b, 0) / samples.length;
    const pertMean = (10 + PERT_LAMBDA * 20 + 40) / (PERT_LAMBDA + 2);
    expect(average).toBeCloseTo(pertMean, 0);
  });

  it('returns the mode when the range has collapsed', () => {
    expect(samplePert(createRng(3), 20, 20, 20)).toBe(20);
  });
});

describe('runSimulation', () => {
  const tasks = [task({ id: 't1' }), task({ id: 't2', name: 'Second task' })];

  it('is deterministic for a given seed', () => {
    const a = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 500, seed: 42 });
    const b = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 500, seed: 42 });
    expect(a.schedule.percentiles['0.8']).toBe(b.schedule.percentiles['0.8']);
    expect(a.cost.mean).toBe(b.cost.mean);
  });

  it('produces a different distribution for a different seed', () => {
    const a = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 500, seed: 42 });
    const b = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 500, seed: 43 });
    expect(a.schedule.mean).not.toBe(b.schedule.mean);
  });

  it('orders percentiles monotonically', () => {
    const r = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 1000 });
    const levels = DEFAULT_SIMULATION_CONFIG.confidenceLevels;
    for (let i = 1; i < levels.length; i += 1) {
      expect(r.schedule.percentiles[String(levels[i])]).toBeGreaterThanOrEqual(r.schedule.percentiles[String(levels[i - 1])]);
      expect(r.cost.percentiles[String(levels[i])]).toBeGreaterThanOrEqual(r.cost.percentiles[String(levels[i - 1])]);
    }
  });

  it('reports the deterministic most-likely plan alongside the distribution', () => {
    const r = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 500, includeRiskEvents: false });
    expect(r.schedule.deterministic).toBe(40);
    expect(r.cost.deterministic).toBe(200_000);
    expect(r.schedule.contingencyAtP80).toBeCloseTo(r.schedule.percentiles['0.8'] - 40, 6);
  });

  it('fires risk events at approximately their residual probability', () => {
    const risk = makeRisk({ id: 'r1', inherentScheduleImpactDays: 30, inherentFinancialImpact: 500_000 });
    const r = runSimulation(
      [task({ riskIds: ['r1'] })],
      [risk],
      { r1: 0.3 },
      { ...DEFAULT_SIMULATION_CONFIG, iterations: 4000, seed: 11 },
    );
    const rate = r.riskFireRates.find((f) => f.riskId === 'r1');
    expect(rate?.expectedRate).toBe(0.3);
    expect(rate?.fireRate).toBeGreaterThan(0.26);
    expect(rate?.fireRate).toBeLessThan(0.34);
  });

  it('produces a longer schedule when risk events are switched on', () => {
    const risk = makeRisk({ id: 'r1', inherentScheduleImpactDays: 30 });
    const on = runSimulation([task({ riskIds: ['r1'] })], [risk], { r1: 0.8 }, { ...DEFAULT_SIMULATION_CONFIG, iterations: 1000, seed: 5 });
    const off = runSimulation([task({ riskIds: ['r1'] })], [risk], { r1: 0.8 }, { ...DEFAULT_SIMULATION_CONFIG, iterations: 1000, seed: 5, includeRiskEvents: false });
    expect(on.schedule.mean).toBeGreaterThan(off.schedule.mean);
    expect(off.riskFireRates).toEqual([]);
  });

  it('ignores a risk id that does not resolve', () => {
    const r = runSimulation([task({ riskIds: ['ghost'] })], [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 200 });
    expect(r.riskFireRates).toEqual([]);
    expect(Number.isFinite(r.schedule.mean)).toBe(true);
  });

  it('warns and returns an empty distribution when there are no usable tasks', () => {
    const r = runSimulation([], [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 200 });
    expect(r.warnings.some((w) => w.includes('No usable tasks'))).toBe(true);
    expect(r.schedule.mean).toBe(0);
  });

  it('skips a task with non-numeric estimates and says so', () => {
    const r = runSimulation(
      [task({ id: 'bad', name: 'Broken', optimisticDays: Number.NaN }), task({ id: 'good' })],
      [],
      {},
      { ...DEFAULT_SIMULATION_CONFIG, iterations: 200 },
    );
    expect(r.warnings.some((w) => w.includes('Broken'))).toBe(true);
    expect(r.schedule.deterministic).toBe(20);
  });

  it('warns when three-point estimates are out of order but still samples', () => {
    const r = runSimulation(
      [task({ optimisticDays: 40, mostLikelyDays: 20, pessimisticDays: 10 })],
      [],
      {},
      { ...DEFAULT_SIMULATION_CONFIG, iterations: 200 },
    );
    expect(r.warnings.some((w) => w.includes('out of order'))).toBe(true);
    expect(r.schedule.min).toBeGreaterThanOrEqual(10);
    expect(r.schedule.max).toBeLessThanOrEqual(40);
  });

  it('clamps an absurd iteration count and reports the clamp', () => {
    const low = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 5 });
    expect(low.iterations).toBe(100);
    expect(low.warnings.some((w) => w.includes('clamped'))).toBe(true);
    const high = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 900_000 });
    expect(high.iterations).toBe(50_000);
  });

  it('builds a histogram whose counts sum to the iteration count', () => {
    const r = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 1000, seed: 9 });
    const total = r.schedule.histogram.reduce((s, b) => s + b.count, 0);
    expect(total).toBe(1000);
    expect(r.schedule.histogram[r.schedule.histogram.length - 1].cumulative).toBeCloseTo(1, 6);
  });

  it('always publishes its assumptions, including that it is not a forecast', () => {
    const r = runSimulation(tasks, [], {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 200 });
    expect(r.assumptions).toBe(SIMULATION_ASSUMPTIONS);
    expect(r.assumptions.some((a) => a.label === 'Not a forecast')).toBe(true);
  });

  it('ranks schedule drivers by their share of sampled duration', () => {
    const r = runSimulation(
      [task({ id: 'small', mostLikelyDays: 5, optimisticDays: 4, pessimisticDays: 6 }), task({ id: 'big', mostLikelyDays: 60, optimisticDays: 50, pessimisticDays: 80 })],
      [],
      {},
      { ...DEFAULT_SIMULATION_CONFIG, iterations: 500 },
    );
    expect(r.scheduleDrivers[0].taskId).toBe('big');
    const shares = r.scheduleDrivers.reduce((s, d) => s + d.contributionPct, 0);
    expect(shares).toBeCloseTo(1, 6);
  });
});

describe('deriveTasks', () => {
  it('creates one task per incomplete milestone', () => {
    const program = makeProgram({
      milestones: [
        makeMilestone({ id: 'm1', status: 'in-progress' }),
        makeMilestone({ id: 'm2', status: 'complete' }),
        makeMilestone({ id: 'm3', status: 'not-started' }),
      ],
    });
    const tasks = deriveTasks(program);
    expect(tasks.map((t) => t.milestoneId)).toEqual(['m1', 'm3']);
  });

  it('widens the pessimistic estimate for a milestone carrying more risk', () => {
    const program = makeProgram({
      milestones: [makeMilestone({ id: 'm1' }), makeMilestone({ id: 'm2' })],
      risks: [makeRisk({ id: 'r1', affectedMilestoneIds: ['m2'] }), makeRisk({ id: 'r2', affectedMilestoneIds: ['m2'] })],
    });
    const tasks = deriveTasks(program);
    const bare = tasks.find((t) => t.milestoneId === 'm1');
    const risky = tasks.find((t) => t.milestoneId === 'm2');
    expect(risky?.pessimisticDays).toBeGreaterThan(bare?.pessimisticDays ?? 0);
    expect(risky?.riskIds).toEqual(['r1', 'r2']);
  });

  it('returns no tasks for a programme with no milestones', () => {
    expect(deriveTasks(makeProgram())).toEqual([]);
  });

  it('produces estimates the simulator accepts without warnings', () => {
    const program = makeProgram({ milestones: [makeMilestone({ id: 'm1' })] });
    const r = runSimulation(deriveTasks(program), program.risks, {}, { ...DEFAULT_SIMULATION_CONFIG, iterations: 200 });
    expect(r.warnings).toEqual([]);
  });
});

describe('explainPercentile', () => {
  it('states the reading in plain language and refuses to call it a forecast', () => {
    const text = explainPercentile(0.8, 240, 'days', 200);
    expect(text).toContain('80% of the sampled outcomes');
    expect(text).toContain('240 days');
    expect(text).toContain('40 days more');
    expect(text).toContain('not a forecast');
  });

  it('handles a percentile below the deterministic plan', () => {
    expect(explainPercentile(0.1, 180, 'days', 200)).toContain('20 days less');
  });
});

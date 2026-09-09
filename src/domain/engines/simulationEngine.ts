import type { Program, Risk, SimulationConfig, SimulationTask } from '@/domain/types';
import { clamp, nonNegative } from '@/lib/format';
import { createRng, mean, percentileSorted, stdev } from '@/lib/random';

/**
 * Monte Carlo over a three-point estimate per task.
 *
 * This is NOT a prediction. It is a sampling of the estimate ranges that were
 * entered, plus optional discrete risk events. If the inputs are wrong the
 * output is wrong with more decimal places. Every consumer of this module must
 * surface the assumption list alongside the numbers.
 */

/** PERT shape parameter. 4 is the standard Beta-PERT weighting of most likely. */
export const PERT_LAMBDA = 4;

export interface SimulationAssumption {
  label: string;
  detail: string;
}

export const SIMULATION_ASSUMPTIONS: SimulationAssumption[] = [
  { label: 'Distribution', detail: 'Each task duration and cost is sampled from a Beta-PERT distribution defined by its optimistic, most likely and pessimistic estimate.' },
  { label: 'Independence', detail: 'Task samples are drawn independently. Real programmes have correlated delays, so the spread here is likely to be narrower than reality.' },
  { label: 'Summation', detail: 'Durations are summed along the modelled task sequence. There is no resource levelling and no parallel-path merge bias correction.' },
  { label: 'Risk events', detail: 'When enabled, each linked risk is treated as a Bernoulli trial at its residual probability, adding its full schedule and cost impact if it fires.' },
  { label: 'Determinism', detail: 'The generator is seeded, so the same seed and iteration count always produce the same result. Change the seed to see sampling noise.' },
  { label: 'Not a forecast', detail: 'A P80 of 240 days means 80% of sampled outcomes finished within 240 days given these inputs. It is a statement about the model, not a promise about the programme.' },
];

/** Beta-PERT sample via a two-gamma construction, using the seeded RNG. */
export function samplePert(rng: () => number, min: number, mode: number, max: number): number {
  if (!(max > min)) return mode;
  const m = clamp(mode, min, max);
  const alpha = 1 + (PERT_LAMBDA * (m - min)) / (max - min);
  const beta = 1 + (PERT_LAMBDA * (max - m)) / (max - min);
  const x = sampleGamma(rng, alpha);
  const y = sampleGamma(rng, beta);
  const denom = x + y;
  const unit = denom === 0 ? 0.5 : x / denom;
  return min + unit * (max - min);
}

/** Marsaglia-Tsang gamma sampler for shape >= 1, with Johnk boost below 1. */
function sampleGamma(rng: () => number, shape: number): number {
  if (shape < 1) {
    const u = Math.max(rng(), 1e-12);
    return sampleGamma(rng, shape + 1) * Math.pow(u, 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (let i = 0; i < 500; i += 1) {
    let x = 0;
    let v = 0;
    do {
      x = sampleNormal(rng);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.max(rng(), 1e-12);
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
  return d;
}

/** Box-Muller. */
function sampleNormal(rng: () => number): number {
  const u1 = Math.max(rng(), 1e-12);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export interface HistogramBin {
  from: number;
  to: number;
  count: number;
  /** Cumulative share of iterations at or below this bin's upper edge. */
  cumulative: number;
}

export interface SimulationOutcome {
  samples: number[];
  min: number;
  max: number;
  mean: number;
  stdev: number;
  /** Keyed by confidence level, e.g. 0.8 -> value. */
  percentiles: Record<string, number>;
  histogram: HistogramBin[];
  /** Deterministic sum of most-likely values, for comparison. */
  deterministic: number;
  /** How much contingency P80 implies over the deterministic plan. */
  contingencyAtP80: number;
}

export interface SimulationResult {
  iterations: number;
  seed: number;
  includeRiskEvents: boolean;
  schedule: SimulationOutcome;
  cost: SimulationOutcome;
  /** Share of iterations in which each risk fired. Sanity-checks the sampler. */
  riskFireRates: { riskId: string; ref: string; title: string; fireRate: number; expectedRate: number }[];
  /** Ranked by correlation of the risk firing with total duration. */
  scheduleDrivers: { taskId: string; name: string; contributionPct: number }[];
  assumptions: SimulationAssumption[];
  warnings: string[];
}

function buildOutcome(samples: number[], levels: number[], deterministic: number): SimulationOutcome {
  const sorted = [...samples].sort((a, b) => a - b);
  const percentiles: Record<string, number> = {};
  for (const l of levels) percentiles[String(l)] = percentileSorted(sorted, l);
  const lo = sorted[0] ?? 0;
  const hi = sorted[sorted.length - 1] ?? 0;
  const binCount = 24;
  const width = hi > lo ? (hi - lo) / binCount : 1;
  // Bin by index rather than by comparing against float edges: recomputing the
  // upper edge as lo + n * width loses the topmost sample to rounding.
  const counts = new Array<number>(binCount).fill(0);
  for (const v of sorted) {
    const idx = width === 0 ? 0 : Math.floor((v - lo) / width);
    counts[clamp(idx, 0, binCount - 1)] += 1;
  }
  const histogram: HistogramBin[] = [];
  let cumulativeCount = 0;
  for (let i = 0; i < binCount; i += 1) {
    cumulativeCount += counts[i];
    histogram.push({
      from: lo + i * width,
      to: lo + (i + 1) * width,
      count: counts[i],
      cumulative: sorted.length === 0 ? 0 : cumulativeCount / sorted.length,
    });
  }
  const p80 = percentileSorted(sorted, 0.8);
  return {
    samples,
    min: lo,
    max: hi,
    mean: mean(samples),
    stdev: stdev(samples),
    percentiles,
    histogram,
    deterministic,
    contingencyAtP80: p80 - deterministic,
  };
}

export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  iterations: 5000,
  seed: 20260909,
  includeRiskEvents: true,
  confidenceLevels: [0.1, 0.5, 0.8, 0.9, 0.95],
};

/**
 * Derives simulation tasks from the programme when none are supplied: one task
 * per incomplete milestone, with ranges inferred from its baseline-to-forecast
 * variance and the risks pointed at it.
 */
export function deriveTasks(program: Program): SimulationTask[] {
  const remaining = program.milestones.filter((m) => m.status !== 'complete' && m.status !== 'cancelled');
  const budgetPerMilestone = program.milestones.length === 0 ? 0 : (program.budget - program.spendToDate) / Math.max(1, remaining.length);
  return remaining.map((m) => {
    const risks = program.risks.filter((r) => r.affectedMilestoneIds.includes(m.id) && r.status !== 'closed');
    const base = 20;
    return {
      id: 'sim-' + m.id,
      name: m.name,
      milestoneId: m.id,
      optimisticDays: Math.max(1, Math.round(base * 0.7)),
      mostLikelyDays: base,
      pessimisticDays: Math.round(base * (1.6 + risks.length * 0.15)),
      optimisticCost: Math.round(budgetPerMilestone * 0.85),
      mostLikelyCost: Math.round(budgetPerMilestone),
      pessimisticCost: Math.round(budgetPerMilestone * 1.35),
      riskIds: risks.map((r) => r.id),
    };
  });
}

export function runSimulation(
  tasks: SimulationTask[],
  risks: Risk[],
  residualProbabilityById: Record<string, number>,
  config: SimulationConfig = DEFAULT_SIMULATION_CONFIG,
): SimulationResult {
  const warnings: string[] = [];
  const iterations = clamp(Math.round(config.iterations), 100, 50_000);
  if (iterations !== config.iterations) warnings.push('Iterations clamped to ' + iterations + ' (allowed range 100 to 50,000).');

  const usable = tasks.filter((t) => {
    const ok = Number.isFinite(t.optimisticDays) && Number.isFinite(t.mostLikelyDays) && Number.isFinite(t.pessimisticDays);
    if (!ok) warnings.push('Task ' + t.name + ' has non-numeric estimates and was skipped.');
    return ok;
  });
  for (const t of usable) {
    if (t.optimisticDays > t.mostLikelyDays || t.mostLikelyDays > t.pessimisticDays) {
      warnings.push('Task ' + t.name + ' has estimates out of order; values were sorted before sampling.');
    }
  }

  if (usable.length === 0) {
    warnings.push('No usable tasks were supplied, so the simulation returned an empty distribution.');
    const empty = buildOutcome([0], config.confidenceLevels, 0);
    return {
      iterations,
      seed: config.seed,
      includeRiskEvents: config.includeRiskEvents,
      schedule: empty,
      cost: empty,
      riskFireRates: [],
      scheduleDrivers: [],
      assumptions: SIMULATION_ASSUMPTIONS,
      warnings,
    };
  }

  const rng = createRng(config.seed);
  const riskById = new Map(risks.map((r) => [r.id, r]));
  const fireCounts = new Map<string, number>();
  const taskDaySums = new Map<string, number>();

  const scheduleSamples: number[] = [];
  const costSamples: number[] = [];

  for (let i = 0; i < iterations; i += 1) {
    let totalDays = 0;
    let totalCost = 0;
    const firedThisIteration = new Set<string>();

    for (const t of usable) {
      const d = [t.optimisticDays, t.mostLikelyDays, t.pessimisticDays].sort((a, b) => a - b);
      const c = [t.optimisticCost, t.mostLikelyCost, t.pessimisticCost].sort((a, b) => a - b);
      let days = samplePert(rng, d[0], d[1], d[2]);
      let cost = samplePert(rng, c[0], c[1], c[2]);

      if (config.includeRiskEvents) {
        for (const riskId of t.riskIds) {
          if (firedThisIteration.has(riskId)) continue;
          const risk = riskById.get(riskId);
          if (!risk) continue;
          const p = clamp(residualProbabilityById[riskId] ?? risk.inherentProbability, 0, 1);
          if (rng() < p) {
            firedThisIteration.add(riskId);
            fireCounts.set(riskId, (fireCounts.get(riskId) ?? 0) + 1);
            days += nonNegative(risk.inherentScheduleImpactDays);
            cost += nonNegative(risk.inherentFinancialImpact);
          }
        }
      }

      totalDays += days;
      totalCost += cost;
      taskDaySums.set(t.id, (taskDaySums.get(t.id) ?? 0) + days);
    }

    scheduleSamples.push(totalDays);
    costSamples.push(totalCost);
  }

  const deterministicDays = usable.reduce((s, t) => s + t.mostLikelyDays, 0);
  const deterministicCost = usable.reduce((s, t) => s + t.mostLikelyCost, 0);

  const totalDaysAcrossRuns = [...taskDaySums.values()].reduce((a, b) => a + b, 0);
  const scheduleDrivers = usable
    .map((t) => ({
      taskId: t.id,
      name: t.name,
      contributionPct: totalDaysAcrossRuns === 0 ? 0 : (taskDaySums.get(t.id) ?? 0) / totalDaysAcrossRuns,
    }))
    .sort((a, b) => b.contributionPct - a.contributionPct)
    .slice(0, 10);

  const riskFireRates = [...fireCounts.entries()]
    .map(([riskId, count]) => {
      const risk = riskById.get(riskId);
      return {
        riskId,
        ref: risk ? risk.ref : riskId,
        title: risk ? risk.title : 'Unknown risk',
        fireRate: count / iterations,
        expectedRate: clamp(residualProbabilityById[riskId] ?? (risk ? risk.inherentProbability : 0), 0, 1),
      };
    })
    .sort((a, b) => b.fireRate - a.fireRate);

  return {
    iterations,
    seed: config.seed,
    includeRiskEvents: config.includeRiskEvents,
    schedule: buildOutcome(scheduleSamples, config.confidenceLevels, deterministicDays),
    cost: buildOutcome(costSamples, config.confidenceLevels, deterministicCost),
    riskFireRates,
    scheduleDrivers,
    assumptions: SIMULATION_ASSUMPTIONS,
    warnings,
  };
}

/** Plain-language reading of a percentile, used verbatim in the UI. */
export function explainPercentile(level: number, value: number, unit: string, deterministic: number): string {
  const pct = Math.round(level * 100);
  const delta = value - deterministic;
  const direction = delta >= 0 ? 'more' : 'less';
  return (
    'In ' +
    pct +
    '% of the sampled outcomes the programme finished within ' +
    Math.round(value).toLocaleString('en-GB') +
    ' ' +
    unit +
    ', which is ' +
    Math.abs(Math.round(delta)).toLocaleString('en-GB') +
    ' ' +
    unit +
    ' ' +
    direction +
    ' than the deterministic most-likely plan. This describes the estimate ranges that were entered, not a forecast of what will happen.'
  );
}

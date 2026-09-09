import type { Portfolio, Priority, Program } from '@/domain/types';
import { DIMENSION_WEIGHTS, ragFromScore, type DimensionHealth, type HealthDriver, type ProgramHealth } from './healthEngine';
import { clamp } from '@/lib/format';

/**
 * Cross-programme impact, attributed. A dependency link only ever produces
 * one of these when the upstream side is actually behind schedule; an
 * unrelated programme's crossLinkImpacts array stays empty, so its health
 * is byte-identical to computeProgramHealth's own answer.
 */
export interface CrossLinkImpact {
  linkId: string;
  fromProgramId: string;
  fromProgramName: string;
  label: string;
  /** Score points removed from the receiving programme's dependency dimension. */
  penaltyPoints: number;
  detail: string;
}

const days = (a: string, b: string) => Math.round((new Date(a).getTime() - new Date(b).getTime()) / 86_400_000);

/**
 * Walks the declared cross-programme links and, for each one whose upstream
 * milestone is genuinely late (forecast past baseline), produces an impact on
 * the downstream programme. Vendor/resource links produce an impact whenever
 * the shared vendor or owner is itself carrying open critical risk in the
 * "from" programme, so a link that exists on paper but has nothing wrong
 * upstream never touches the downstream programme's numbers.
 */
function milestoneKey(programId: string, milestoneId: string): string {
  return programId + '::' + milestoneId;
}

/**
 * A milestone's "effective" slip is its own real slip plus whatever slip it
 * inherited through upstream cross-programme links. This is what makes a
 * chain like ATLAS milestone -> ORION milestone -> NOVA milestone cascade
 * transitively: ORION's effective slip already includes ATLAS's, so the link
 * onward to NOVA carries both. Fixed-point iteration over a handful of links
 * converges in one or two passes; four passes is a comfortable margin at any
 * realistic portfolio size and terminates deterministically either way.
 */
function computeEffectiveSlipByMilestone(portfolio: Portfolio): Map<string, number> {
  const byId = new Map(portfolio.programs.map((p) => [p.id, p]));
  const effective = new Map<string, number>();

  const ownSlip = (programId: string, milestoneId: string): number => {
    const program = byId.get(programId);
    const milestone = program?.milestones.find((m) => m.id === milestoneId);
    if (!milestone || milestone.status === 'complete') return 0;
    return Math.max(0, days(milestone.forecastDate, milestone.baselineDate));
  };

  const dependencyLinks = portfolio.crossLinks.filter((l) => l.kind === 'dependency' && l.fromMilestoneId && l.toMilestoneId);
  for (const link of dependencyLinks) {
    effective.set(milestoneKey(link.fromProgramId, link.fromMilestoneId!), ownSlip(link.fromProgramId, link.fromMilestoneId!));
    effective.set(milestoneKey(link.toProgramId, link.toMilestoneId!), ownSlip(link.toProgramId, link.toMilestoneId!));
  }

  for (let pass = 0; pass < 4; pass += 1) {
    for (const link of dependencyLinks) {
      const fromKey = milestoneKey(link.fromProgramId, link.fromMilestoneId!);
      const toKey = milestoneKey(link.toProgramId, link.toMilestoneId!);
      const inherited = (effective.get(fromKey) ?? 0) * link.passThroughPct;
      const ownDownstreamSlip = ownSlip(link.toProgramId, link.toMilestoneId!);
      effective.set(toKey, Math.max(ownDownstreamSlip, inherited, effective.get(toKey) ?? 0));
    }
  }
  return effective;
}

export function computeCrossLinkImpacts(portfolio: Portfolio): Record<string, CrossLinkImpact[]> {
  const byId = new Map(portfolio.programs.map((p) => [p.id, p]));
  const out: Record<string, CrossLinkImpact[]> = {};
  for (const program of portfolio.programs) out[program.id] = [];
  const effectiveSlip = computeEffectiveSlipByMilestone(portfolio);

  for (const link of portfolio.crossLinks) {
    const from = byId.get(link.fromProgramId);
    const to = byId.get(link.toProgramId);
    if (!from || !to) continue;

    if (link.kind === 'dependency' && link.fromMilestoneId) {
      const milestone = from.milestones.find((m) => m.id === link.fromMilestoneId);
      if (!milestone) continue;
      const fromEffectiveSlip = effectiveSlip.get(milestoneKey(from.id, link.fromMilestoneId)) ?? 0;
      if (fromEffectiveSlip <= 0) continue;
      const ownSlipDays = Math.max(0, days(milestone.forecastDate, milestone.baselineDate));
      const inheritedDays = fromEffectiveSlip - ownSlipDays;
      const badness = clamp(fromEffectiveSlip / 30, 0, 1) * link.passThroughPct;
      const penaltyPoints = badness * 25;
      out[to.id].push({
        linkId: link.id,
        fromProgramId: from.id,
        fromProgramName: from.codename,
        label: link.label,
        penaltyPoints,
        detail:
          from.codename + ' "' + milestone.name + '" carries ' + Math.round(fromEffectiveSlip) + ' effective day(s) of slip' +
          (inheritedDays > 0.5 ? ' (' + Math.round(ownSlipDays) + ' own + ' + Math.round(inheritedDays) + ' inherited)' : '') +
          '; ' + Math.round(link.passThroughPct * 100) + '% of that transfers through "' + link.label + '" onto ' + to.codename + '.',
      });
    }

    if (link.kind === 'vendor' && link.vendorName) {
      const vendorRisks = from.risks.filter((r) => r.vendor === link.vendorName && r.status !== 'closed');
      const critical = vendorRisks.filter((r) => r.inherentImpact >= 4 && r.inherentProbability >= 0.5);
      if (critical.length === 0) continue;
      const penaltyPoints = clamp(critical.length / 3, 0, 1) * link.passThroughPct * 15;
      out[to.id].push({
        linkId: link.id,
        fromProgramId: from.id,
        fromProgramName: from.codename,
        label: link.label,
        penaltyPoints,
        detail:
          critical.length + ' critical open risk(s) against shared vendor "' + link.vendorName + '" in ' + from.codename +
          ' also expose ' + to.codename + ' through "' + link.label + '".',
      });
    }

    if (link.kind === 'resource' && link.resourceName) {
      const overloaded = from.owners.some((o) => o.name === link.resourceName) && to.owners.some((o) => o.name === link.resourceName);
      if (!overloaded) continue;
      const openActions = from.actions.filter((a) => a.status !== 'complete' && a.status !== 'cancelled').length;
      if (openActions < 3) continue;
      const penaltyPoints = clamp((openActions - 2) / 6, 0, 1) * link.passThroughPct * 10;
      out[to.id].push({
        linkId: link.id,
        fromProgramId: from.id,
        fromProgramName: from.codename,
        label: link.label,
        penaltyPoints,
        detail:
          link.resourceName + ' is carrying ' + openActions + ' open action(s) in ' + from.codename +
          ', which shares them with ' + to.codename + ' through "' + link.label + '".',
      });
    }
  }
  return out;
}

/**
 * Applies already-computed cross-link impacts onto a programme's own health.
 * Pure: healthEngine.ts never sees another programme, only this composition
 * step does, so program isolation is structural rather than a rule someone
 * has to remember to respect. An empty impacts array returns dimensions and
 * overall recomputed from identical inputs, so the result is value-equal to
 * the unadjusted health.
 */
export function applyCrossLinkPenalties(health: ProgramHealth, impacts: CrossLinkImpact[]): ProgramHealth {
  if (impacts.length === 0) return health;

  const extraDrivers: HealthDriver[] = impacts.map((impact) => ({
    label: 'Cross-programme: ' + impact.fromProgramName,
    contribution: -impact.penaltyPoints,
    detail: impact.detail,
  }));

  const dependency: DimensionHealth = {
    ...health.dimensions.dependency,
    score: clamp(health.dimensions.dependency.score - impacts.reduce((s, i) => s + i.penaltyPoints, 0), 0, 100),
    drivers: [...health.dimensions.dependency.drivers, ...extraDrivers],
  };
  dependency.status = ragFromScore(dependency.score);

  const dimensions = { ...health.dimensions, dependency };
  const overallScore = clamp(
    (Object.keys(DIMENSION_WEIGHTS) as (keyof typeof DIMENSION_WEIGHTS)[]).reduce(
      (sum, key) => sum + dimensions[key].score * DIMENSION_WEIGHTS[key],
      0,
    ),
    0,
    100,
  );
  const worstDimensions = Object.values(dimensions).sort((a, b) => a.score - b.score);
  let overallStatus = ragFromScore(overallScore);
  const redCount = worstDimensions.filter((d) => d.status === 'red').length;
  if (overallStatus === 'green' && redCount > 0) overallStatus = 'amber';
  if (redCount >= 2) overallStatus = 'red';

  const overall: DimensionHealth = {
    ...health.overall,
    score: overallScore,
    status: overallStatus,
    drivers: [
      ...health.overall.drivers,
      ...extraDrivers.map((d) => ({ ...d, contribution: d.contribution * DIMENSION_WEIGHTS.dependency })),
    ],
  };

  return { ...health, dimensions, overall, worstDimensions };
}

export interface ProgramPortfolioEntry {
  program: Program;
  health: ProgramHealth;
  crossLinkImpacts: CrossLinkImpact[];
}

export interface PortfolioHealth {
  score: number;
  status: 'green' | 'amber' | 'red';
  headline: string;
  drivers: HealthDriver[];
  /** Per-programme weight actually used, so the number is explainable. */
  weightByProgramId: Record<string, number>;
}

const PRIORITY_WEIGHT: Record<Priority, number> = { critical: 4, high: 3, medium: 2, low: 1 };

/**
 * Portfolio health is a weighted composition, never a naive average: weight
 * is strategic priority times budget share, so a small critical-priority
 * programme cannot be diluted away by several large healthy ones, and a
 * strategically-critical programme that turns red always caps the overall
 * status the same way healthEngine caps a programme on one red dimension.
 */
export function computePortfolioHealth(entries: ProgramPortfolioEntry[]): PortfolioHealth {
  const active = entries.filter((e) => (e.program.programStatus ?? 'active') === 'active');
  const pool = active.length > 0 ? active : entries;
  if (pool.length === 0) {
    return { score: 100, status: 'green', headline: 'No active programmes.', drivers: [], weightByProgramId: {} };
  }

  const totalBudget = pool.reduce((s, e) => s + e.program.budget, 0) || 1;
  const rawWeights = pool.map((e) => {
    const priorityWeight = PRIORITY_WEIGHT[e.program.strategicPriority ?? 'medium'];
    const budgetShare = e.program.budget / totalBudget;
    return priorityWeight * (0.4 + 0.6 * budgetShare);
  });
  const totalWeight = rawWeights.reduce((s, w) => s + w, 0) || 1;
  const weightByProgramId: Record<string, number> = {};
  pool.forEach((e, i) => (weightByProgramId[e.program.id] = rawWeights[i] / totalWeight));

  const score = clamp(
    pool.reduce((sum, e, i) => sum + e.health.overall.score * (rawWeights[i] / totalWeight), 0),
    0,
    100,
  );

  const criticalRed = pool.filter((e) => (e.program.strategicPriority ?? 'medium') === 'critical' && e.health.overall.status === 'red');
  const anyRed = pool.filter((e) => e.health.overall.status === 'red');

  let status = ragFromScore(score);
  // A critical-priority programme in red caps the portfolio at amber even if the
  // weighted score looks healthy; two or more force red outright. This mirrors
  // healthEngine's own red-dimension override so the same idea holds at both levels.
  if (criticalRed.length >= 1 && status === 'green') status = 'amber';
  if (criticalRed.length >= 2) status = 'red';
  if (anyRed.length >= Math.ceil(pool.length / 2) && anyRed.length > 1) status = 'red';

  const drivers: HealthDriver[] = pool
    .map((e, i) => ({
      label: e.program.codename,
      contribution: (e.health.overall.score - 100) * (rawWeights[i] / totalWeight),
      detail:
        e.program.codename + ' is ' + e.health.overall.status + ' at ' + Math.round(e.health.overall.score) + '/100, weight ' +
        Math.round((rawWeights[i] / totalWeight) * 100) + '% (' + (e.program.strategicPriority ?? 'medium') + ' priority, ' +
        Math.round((e.program.budget / totalBudget) * 100) + '% of portfolio budget).',
    }))
    .sort((a, b) => a.contribution - b.contribution);

  const headline =
    'Weighted portfolio health ' + Math.round(score) + '/100 across ' + pool.length + ' active programme(s). ' +
    (criticalRed.length > 0
      ? criticalRed.length + ' critical-priority programme(s) red: ' + criticalRed.map((e) => e.program.codename).join(', ') + '.'
      : anyRed.length > 0
        ? anyRed.length + ' programme(s) red.'
        : 'No programme is red.');

  return { score, status, headline, drivers, weightByProgramId };
}

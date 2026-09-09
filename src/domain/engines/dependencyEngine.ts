import type { Benefit, Dependency, ISODate, Milestone, Priority, Program } from '@/domain/types';
import { clamp, nonNegative, ratio } from '@/lib/format';
import { daysBetween } from '@/lib/dates';

const CRITICALITY_WEIGHT: Record<Priority, number> = { critical: 1, high: 0.75, medium: 0.45, low: 0.2 };

export interface DependencyAssessment {
  dependencyId: string;
  ref: string;
  name: string;
  status: Dependency['status'];
  criticality: Priority;
  /** Days late against the due date at the status date, negative if not yet due. */
  daysToDue: number | null;
  isOverdue: boolean;
  delayProbability: number;
  potentialDelayDays: number;
  /** probability-weighted slip in days */
  expectedDelayDays: number;
  affectedMilestoneIds: string[];
  /** Milestones reached through the milestone predecessor chain as well. */
  cascadedMilestoneIds: string[];
  affectedBenefitIds: string[];
  benefitValueAtRisk: number;
  /** 0..100 composite for ranking. */
  criticalityIndex: number;
  chainDepth: number;
  isOnCriticalChain: boolean;
  narrative: string;
  drivers: string[];
}

/** Depth of this dependency in the predecessor graph. Cycle-safe. */
export function chainDepth(dependency: Dependency, all: Dependency[], seen: Set<string> = new Set()): number {
  if (seen.has(dependency.id)) return 0;
  seen.add(dependency.id);
  if (dependency.predecessorIds.length === 0) return 1;
  let deepest = 0;
  for (const pid of dependency.predecessorIds) {
    const parent = all.find((d) => d.id === pid);
    if (!parent) continue;
    deepest = Math.max(deepest, chainDepth(parent, all, new Set(seen)));
  }
  return deepest + 1;
}

/** Milestones downstream of a set of milestones via predecessorIds. Cycle-safe. */
export function cascadeMilestones(seedIds: string[], milestones: Milestone[]): string[] {
  const out = new Set<string>(seedIds);
  let changed = true;
  let guard = 0;
  while (changed && guard < 50) {
    changed = false;
    guard += 1;
    for (const m of milestones) {
      if (out.has(m.id)) continue;
      if (m.predecessorIds.some((p) => out.has(p))) {
        out.add(m.id);
        changed = true;
      }
    }
  }
  for (const s of seedIds) out.delete(s);
  return [...out];
}

export function assessDependency(
  dependency: Dependency,
  program: Program,
  criticalChainIds: string[] = [],
): DependencyAssessment {
  const daysToDue = daysBetween(program.statusDate, dependency.dueDate);
  const isOverdue = dependency.status !== 'delivered' && dependency.status !== 'cancelled' && daysToDue !== null && daysToDue < 0;
  const delayProbability = clamp(dependency.status === 'late' ? Math.max(dependency.delayProbability, 0.95) : dependency.delayProbability, 0, 1);
  const potentialDelayDays = nonNegative(dependency.potentialDelayDays);
  const expectedDelayDays = delayProbability * potentialDelayDays;

  const cascaded = cascadeMilestones(dependency.affectedMilestoneIds, program.milestones);
  const benefitIds = new Set<string>(dependency.affectedBenefitIds);
  for (const b of program.benefits) {
    if (b.enablingMilestoneIds.some((m) => dependency.affectedMilestoneIds.includes(m) || cascaded.includes(m))) {
      benefitIds.add(b.id);
    }
  }
  const benefits: Benefit[] = program.benefits.filter((b) => benefitIds.has(b.id));
  const benefitValueAtRisk = benefits.reduce(
    (sum, b) => sum + Math.max(0, nonNegative(b.expectedValue) - nonNegative(b.realisedValue)) * delayProbability,
    0,
  );

  const depth = chainDepth(dependency, program.dependencies);
  const reach = dependency.affectedMilestoneIds.length + cascaded.length;
  const criticalityIndex = clamp(
    (CRITICALITY_WEIGHT[dependency.criticality] * 0.35 +
      delayProbability * 0.25 +
      clamp(ratio(expectedDelayDays, 30), 0, 1) * 0.2 +
      clamp(ratio(reach, 8), 0, 1) * 0.1 +
      clamp(ratio(benefitValueAtRisk, 3_000_000), 0, 1) * 0.1) *
      100,
    0,
    100,
  );

  const milestoneNames = program.milestones
    .filter((m) => dependency.affectedMilestoneIds.includes(m.id))
    .map((m) => m.name);

  const narrative = buildDependencyNarrative(dependency, potentialDelayDays, milestoneNames, cascaded.length, benefitValueAtRisk, program.currency);

  const drivers: string[] = [];
  if (isOverdue && daysToDue !== null) drivers.push('Overdue by ' + Math.abs(daysToDue) + ' days');
  if (dependency.type === 'vendor' || dependency.type === 'external')
    drivers.push('Outside direct program control (' + dependency.type + ')');
  if (delayProbability >= 0.5) drivers.push('Delay probability assessed at ' + Math.round(delayProbability * 100) + '%');
  if (depth >= 3) drivers.push('Sits ' + depth + ' levels deep in the dependency chain');
  if (dependency.linkedRiskIds.length > 0) drivers.push(dependency.linkedRiskIds.length + ' linked risk(s)');

  return {
    dependencyId: dependency.id,
    ref: dependency.ref,
    name: dependency.name,
    status: dependency.status,
    criticality: dependency.criticality,
    daysToDue,
    isOverdue,
    delayProbability,
    potentialDelayDays,
    expectedDelayDays,
    affectedMilestoneIds: dependency.affectedMilestoneIds,
    cascadedMilestoneIds: cascaded,
    affectedBenefitIds: [...benefitIds],
    benefitValueAtRisk,
    criticalityIndex,
    chainDepth: depth,
    isOnCriticalChain: criticalChainIds.includes(dependency.id),
    narrative,
    drivers,
  };
}

/** Plain-language impact statement, as required of the dependency view. */
export function buildDependencyNarrative(
  dependency: Dependency,
  slipDays: number,
  milestoneNames: string[],
  cascadeCount: number,
  benefitValue: number,
  currency: string,
): string {
  if (slipDays <= 0) return 'No slip is currently forecast for this dependency.';
  const parts: string[] = [];
  parts.push('If ' + dependency.name + ' slips ' + slipDays + ' days');
  if (milestoneNames.length > 0) {
    parts.push(
      ', ' +
        milestoneNames.length +
        ' milestone' +
        (milestoneNames.length === 1 ? '' : 's') +
        ' are directly affected (' +
        milestoneNames.slice(0, 3).join(', ') +
        (milestoneNames.length > 3 ? ' and others' : '') +
        ')',
    );
  }
  if (cascadeCount > 0) parts.push(' and ' + cascadeCount + ' further milestone(s) cascade');
  if (benefitValue > 0) {
    const money = currency === 'EUR' ? '\u20ac' : '';
    parts.push(', which threatens ' + money + (benefitValue / 1_000_000).toFixed(1) + 'M of unrealised benefit');
  }
  parts.push('.');
  return parts.join('');
}

export interface DependencyChain {
  dependencyIds: string[];
  totalExpectedDelayDays: number;
  terminalMilestoneIds: string[];
  benefitValueAtRisk: number;
}

/**
 * Longest expected-delay path through the dependency predecessor graph. This is
 * the "critical dependency chain": not the longest path by count, but the one
 * carrying the most probability-weighted slip.
 */
export function computeCriticalChain(program: Program): DependencyChain {
  const deps = program.dependencies;
  const byId = new Map(deps.map((d) => [d.id, d]));
  const memo = new Map<string, { days: number; path: string[] }>();

  const weight = (d: Dependency) => clamp(d.delayProbability, 0, 1) * nonNegative(d.potentialDelayDays);

  function best(id: string, stack: Set<string>): { days: number; path: string[] } {
    const cached = memo.get(id);
    if (cached) return cached;
    if (stack.has(id)) return { days: 0, path: [] };
    const dep = byId.get(id);
    if (!dep) return { days: 0, path: [] };
    stack.add(id);
    let bestParent = { days: 0, path: [] as string[] };
    for (const pid of dep.predecessorIds) {
      const candidate = best(pid, new Set(stack));
      if (candidate.days > bestParent.days) bestParent = candidate;
    }
    const result = { days: bestParent.days + weight(dep), path: [...bestParent.path, id] };
    memo.set(id, result);
    return result;
  }

  let winner = { days: 0, path: [] as string[] };
  for (const d of deps) {
    const r = best(d.id, new Set());
    if (r.days > winner.days) winner = r;
  }

  const terminal = winner.path.length > 0 ? byId.get(winner.path[winner.path.length - 1]) : undefined;
  const terminalMilestoneIds = terminal ? terminal.affectedMilestoneIds : [];
  const benefitIds = new Set<string>();
  for (const id of winner.path) {
    const d = byId.get(id);
    if (!d) continue;
    for (const b of d.affectedBenefitIds) benefitIds.add(b);
  }
  const benefitValueAtRisk = program.benefits
    .filter((b) => benefitIds.has(b.id))
    .reduce((s, b) => s + Math.max(0, nonNegative(b.expectedValue) - nonNegative(b.realisedValue)), 0);

  return {
    dependencyIds: winner.path,
    totalExpectedDelayDays: Math.round(winner.days),
    terminalMilestoneIds,
    benefitValueAtRisk,
  };
}

export interface DependencySummary {
  assessments: DependencyAssessment[];
  byId: Record<string, DependencyAssessment>;
  total: number;
  atRisk: number;
  late: number;
  delivered: number;
  criticalOpen: number;
  externalShare: number;
  totalExpectedDelayDays: number;
  benefitValueAtRisk: number;
  criticalChain: DependencyChain;
}

export function summariseDependencies(program: Program): DependencySummary {
  const criticalChain = computeCriticalChain(program);
  const assessments = program.dependencies.map((d) => assessDependency(d, program, criticalChain.dependencyIds));
  const byId: Record<string, DependencyAssessment> = {};
  for (const a of assessments) byId[a.dependencyId] = a;
  const open = assessments.filter((a) => a.status !== 'delivered' && a.status !== 'cancelled');
  const externals = program.dependencies.filter((d) => d.type !== 'internal').length;
  return {
    assessments,
    byId,
    total: program.dependencies.length,
    atRisk: assessments.filter((a) => a.status === 'at-risk').length,
    late: assessments.filter((a) => a.status === 'late').length,
    delivered: assessments.filter((a) => a.status === 'delivered').length,
    criticalOpen: open.filter((a) => a.criticality === 'critical').length,
    externalShare: ratio(externals, program.dependencies.length),
    totalExpectedDelayDays: Math.round(open.reduce((s, a) => s + a.expectedDelayDays, 0)),
    benefitValueAtRisk: open.reduce((s, a) => s + a.benefitValueAtRisk, 0),
    criticalChain,
  };
}

/** What-if: propagate an explicit slip on one dependency through the milestone graph. */
export interface SlipImpact {
  dependencyId: string;
  slipDays: number;
  directMilestones: { id: string; name: string; newForecast: ISODate; baseline: ISODate; slip: number }[];
  cascadedMilestoneIds: string[];
  benefitsThreatened: { id: string; name: string; unrealised: number }[];
  totalBenefitExposure: number;
  narrative: string;
}

export function simulateSlip(program: Program, dependencyId: string, slipDays: number): SlipImpact | null {
  const dep = program.dependencies.find((d) => d.id === dependencyId);
  if (!dep) return null;
  const direct = program.milestones
    .filter((m) => dep.affectedMilestoneIds.includes(m.id))
    .map((m) => ({
      id: m.id,
      name: m.name,
      baseline: m.baselineDate,
      newForecast: shiftDate(m.forecastDate, slipDays),
      slip: (daysBetween(m.baselineDate, m.forecastDate) ?? 0) + slipDays,
    }));
  const cascaded = cascadeMilestones(dep.affectedMilestoneIds, program.milestones);
  const benefits = program.benefits.filter(
    (b) =>
      dep.affectedBenefitIds.includes(b.id) ||
      b.enablingMilestoneIds.some((m) => dep.affectedMilestoneIds.includes(m) || cascaded.includes(m)),
  );
  const threatened = benefits.map((b) => ({ id: b.id, name: b.name, unrealised: Math.max(0, nonNegative(b.expectedValue) - nonNegative(b.realisedValue)) }));
  const total = threatened.reduce((s, b) => s + b.unrealised, 0);
  return {
    dependencyId,
    slipDays,
    directMilestones: direct,
    cascadedMilestoneIds: cascaded,
    benefitsThreatened: threatened,
    totalBenefitExposure: total,
    narrative: buildDependencyNarrative(dep, slipDays, direct.map((d) => d.name), cascaded.length, total, program.currency),
  };
}

function shiftDate(value: ISODate, days: number): ISODate {
  const d = new Date(value.length === 10 ? value + 'T00:00:00Z' : value);
  if (Number.isNaN(d.getTime())) return value;
  return new Date(d.getTime() + days * 86_400_000).toISOString().slice(0, 10);
}

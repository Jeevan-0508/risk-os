import { describe, expect, it } from 'vitest';
import { orionProgram } from './orion';
import { assessPortfolio } from '@/domain/engines/riskEngine';
import { computeProgramHealth } from '@/domain/engines/healthEngine';
import { buildTwinGraph } from '@/domain/engines/graphEngine';
import { summariseDependencies } from '@/domain/engines/dependencyEngine';

const p = orionProgram;

/**
 * The demo programme is the product's shop window, so its shape is asserted
 * rather than trusted. Every count quoted in the README is checked here.
 */
describe('ORION demo programme shape', () => {
  it('matches the documented headline figures', () => {
    expect(p.codename).toBe('ORION');
    expect(p.name).toBe('European Logistics Transformation');
    expect(p.budget).toBe(8_400_000);
    expect(p.currency).toBe('EUR');
    expect(p.workstreams).toHaveLength(7);
    expect(p.milestones).toHaveLength(32);
    expect(p.risks).toHaveLength(41);
    expect(p.dependencies).toHaveLength(67);
    expect(p.changes).toHaveLength(13);
  });

  it('spans 14 calendar months from start to end', () => {
    // 1 Sep 2025 to 31 Oct 2026 inclusive.
    const months =
      (new Date(p.endDate).getFullYear() - new Date(p.startDate).getFullYear()) * 12 +
      (new Date(p.endDate).getMonth() - new Date(p.startDate).getMonth()) +
      1;
    expect(months).toBe(14);
    expect(p.startDate).toBe('2025-09-01');
    expect(p.endDate).toBe('2026-10-31');
  });

  it('expects exactly 14.2M of benefit', () => {
    const expected = p.benefits.reduce((s, b) => s + b.expectedValue, 0);
    expect(expected).toBe(14_200_000);
  });

  it('has a status date inside the programme window', () => {
    expect(p.statusDate >= p.startDate).toBe(true);
    expect(p.statusDate <= p.endDate).toBe(true);
  });

  it('carries the Six Sigma and root-cause content the studios need', () => {
    expect(p.fmea.length).toBeGreaterThanOrEqual(18);
    expect(p.dmaic.length).toBeGreaterThanOrEqual(2);
    expect(p.causes.length).toBeGreaterThanOrEqual(20);
    expect(p.causes.some((c) => c.isRootCause)).toBe(true);
    expect(p.causes.every((c) => c.whyChain.length >= 3)).toBe(true);
  });
});

describe('ORION referential integrity', () => {
  const ids = {
    owner: new Set(p.owners.map((o) => o.id)),
    workstream: new Set(p.workstreams.map((w) => w.id)),
    milestone: new Set(p.milestones.map((m) => m.id)),
    risk: new Set(p.risks.map((r) => r.id)),
    cause: new Set(p.causes.map((c) => c.id)),
    control: new Set(p.controls.map((c) => c.id)),
    action: new Set(p.actions.map((a) => a.id)),
    issue: new Set(p.issues.map((i) => i.id)),
    dependency: new Set(p.dependencies.map((d) => d.id)),
    benefit: new Set(p.benefits.map((b) => b.id)),
    change: new Set(p.changes.map((c) => c.id)),
    decision: new Set(p.decisions.map((d) => d.id)),
    fmea: new Set(p.fmea.map((f) => f.id)),
  };

  const expectAll = (values: string[], pool: Set<string>, what: string) => {
    const missing = values.filter((v) => !pool.has(v));
    expect(missing, what + ' referenced ids that do not exist: ' + missing.join(', ')).toEqual([]);
  };

  it('gives every object a unique id', () => {
    const all = [
      ...p.owners.map((o) => o.id),
      ...p.workstreams.map((w) => w.id),
      ...p.milestones.map((m) => m.id),
      ...p.deliverables.map((d) => d.id),
      ...p.risks.map((r) => r.id),
      ...p.causes.map((c) => c.id),
      ...p.controls.map((c) => c.id),
      ...p.actions.map((a) => a.id),
      ...p.issues.map((i) => i.id),
      ...p.assumptions.map((a) => a.id),
      ...p.dependencies.map((d) => d.id),
      ...p.changes.map((c) => c.id),
      ...p.decisions.map((d) => d.id),
      ...p.benefits.map((b) => b.id),
      ...p.fmea.map((f) => f.id),
    ];
    expect(all.length).toBe(new Set(all).size);
  });

  it('assigns every object to an owner that exists', () => {
    expectAll(p.workstreams.map((w) => w.leadOwnerId), ids.owner, 'workstream lead');
    expectAll(p.milestones.map((m) => m.ownerId), ids.owner, 'milestone owner');
    expectAll(p.risks.map((r) => r.ownerId), ids.owner, 'risk owner');
    expectAll(p.controls.map((c) => c.ownerId), ids.owner, 'control owner');
    expectAll(p.actions.map((a) => a.ownerId), ids.owner, 'action owner');
    expectAll(p.benefits.map((b) => b.ownerId), ids.owner, 'benefit owner');
    expectAll(p.fmea.map((f) => f.ownerId), ids.owner, 'FMEA owner');
  });

  it('resolves every risk relationship', () => {
    expectAll(p.risks.flatMap((r) => r.controlIds), ids.control, 'risk control links');
    expectAll(p.risks.flatMap((r) => r.causeIds), ids.cause, 'risk cause links');
    expectAll(p.risks.flatMap((r) => r.actionIds), ids.action, 'risk action links');
    expectAll(p.risks.flatMap((r) => r.affectedMilestoneIds), ids.milestone, 'risk milestone links');
    expectAll(p.risks.flatMap((r) => r.affectedBenefitIds), ids.benefit, 'risk benefit links');
    expectAll(p.risks.flatMap((r) => r.dependencyIds), ids.dependency, 'risk dependency links');
    expectAll(p.risks.flatMap((r) => r.issueIds), ids.issue, 'risk issue links');
    expectAll(p.risks.map((r) => r.workstreamId), ids.workstream, 'risk workstream');
  });

  it('resolves every dependency, change, decision and benefit relationship', () => {
    expectAll(p.dependencies.flatMap((d) => d.affectedMilestoneIds), ids.milestone, 'dependency milestones');
    expectAll(p.dependencies.flatMap((d) => d.affectedBenefitIds), ids.benefit, 'dependency benefits');
    expectAll(p.dependencies.flatMap((d) => d.predecessorIds), ids.dependency, 'dependency predecessors');
    expectAll(p.dependencies.flatMap((d) => d.linkedRiskIds), ids.risk, 'dependency risks');
    expectAll(p.changes.flatMap((c) => c.affectedMilestoneIds), ids.milestone, 'change milestones');
    expectAll(p.changes.flatMap((c) => c.affectedBenefitIds), ids.benefit, 'change benefits');
    expectAll(p.changes.flatMap((c) => c.affectedDependencyIds), ids.dependency, 'change dependencies');
    expectAll(p.changes.flatMap((c) => c.linkedRiskIds), ids.risk, 'change risks');
    expectAll(p.decisions.flatMap((d) => d.linkedRiskIds), ids.risk, 'decision risks');
    expectAll(p.decisions.flatMap((d) => d.linkedChangeIds), ids.change, 'decision changes');
    expectAll(p.decisions.flatMap((d) => d.linkedBenefitIds), ids.benefit, 'decision benefits');
    expectAll(p.benefits.flatMap((b) => b.enablingMilestoneIds), ids.milestone, 'benefit milestones');
    expectAll(p.benefits.flatMap((b) => b.threateningRiskIds), ids.risk, 'benefit risks');
    expectAll(p.deliverables.map((d) => d.milestoneId), ids.milestone, 'deliverable milestone');
    expectAll(p.milestones.flatMap((m) => m.predecessorIds), ids.milestone, 'milestone predecessors');
    expectAll(p.fmea.flatMap((f) => f.linkedRiskIds), ids.risk, 'FMEA risks');
    expectAll(p.dmaic.flatMap((d) => d.analyze.causeIds), ids.cause, 'DMAIC causes');
    expectAll(p.dmaic.flatMap((d) => d.analyze.fmeaIds), ids.fmea, 'DMAIC FMEA lines');
    expectAll(p.dmaic.flatMap((d) => d.control.linkedControlIds), ids.control, 'DMAIC controls');
  });

  it('connects every risk to at least one other object', () => {
    const orphans = p.risks.filter(
      (r) =>
        r.affectedMilestoneIds.length === 0 &&
        r.affectedBenefitIds.length === 0 &&
        r.dependencyIds.length === 0 &&
        r.controlIds.length === 0,
    );
    expect(orphans.map((r) => r.ref)).toEqual([]);
  });

  it('gives every workstream at least one milestone', () => {
    for (const ws of p.workstreams) {
      expect(p.milestones.some((m) => m.workstreamId === ws.id), ws.code + ' has no milestone').toBe(true);
    }
  });
});

describe('ORION named scenarios', () => {
  it('wires the vendor delay chain through to the benefit it threatens', () => {
    const vendor = p.dependencies.find((d) => d.ref === 'DEP-01');
    expect(vendor).toBeDefined();
    const chainRisk = p.risks.find((r) => r.dependencyIds.includes(vendor?.id ?? ''));
    expect(chainRisk).toBeDefined();
    expect(chainRisk?.affectedBenefitIds.length ?? 0).toBeGreaterThan(0);
    expect(vendor?.affectedMilestoneIds.length ?? 0).toBeGreaterThan(0);
  });

  it('wires the data quality issue through to a decision and a change', () => {
    const issue = p.issues.find((i) => i.ref === 'ISS-01');
    expect(issue).toBeDefined();
    expect(p.decisions.some((d) => d.context.length > 0 && d.linkedRiskIds.length > 0)).toBe(true);
    const linkedChange = p.changes.find((c) => c.linkedRiskIds.length > 0 && c.affectedBenefitIds.length > 0);
    expect(linkedChange).toBeDefined();
  });

  it('has exactly three risks recorded as accelerating', () => {
    const portfolio = assessPortfolio(p.risks, p.controls, p.statusDate);
    expect(portfolio.acceleratingCount).toBe(3);
  });
});

describe('ORION engine output', () => {
  it('computes a health that is explainable and not green', () => {
    const health = computeProgramHealth(p);
    expect(['amber', 'red']).toContain(health.overall.status);
    expect(health.overall.drivers.length).toBeGreaterThan(0);
    for (const dim of Object.values(health.dimensions)) expect(dim.drivers.length).toBeGreaterThan(0);
  });

  it('produces a non-trivial residual exposure below the inherent exposure', () => {
    const portfolio = assessPortfolio(p.risks, p.controls, p.statusDate);
    expect(portfolio.totalResidualExposure).toBeGreaterThan(0);
    expect(portfolio.totalResidualExposure).toBeLessThan(portfolio.totalInherentExposure);
  });

  it('finds a multi-link critical dependency chain', () => {
    const deps = summariseDependencies(p);
    expect(deps.criticalChain.dependencyIds.length).toBeGreaterThan(1);
    expect(deps.criticalChain.totalExpectedDelayDays).toBeGreaterThan(0);
  });

  it('builds a fully connected twin graph with no dangling edges', () => {
    const graph = buildTwinGraph(p);
    expect(graph.nodes.length).toBeGreaterThan(200);
    for (const edge of graph.edges) {
      expect(graph.nodeById[edge.source]).toBeDefined();
      expect(graph.nodeById[edge.target]).toBeDefined();
    }
    const connected = new Set<string>();
    for (const e of graph.edges) {
      connected.add(e.source);
      connected.add(e.target);
    }
    const isolated = graph.nodes.filter((n) => !connected.has(n.id));
    expect(isolated.map((n) => n.id)).toEqual([]);
  });
});

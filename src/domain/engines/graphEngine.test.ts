import { describe, expect, it } from 'vitest';
import { buildTwinGraph, summariseChain, traceImpactChain } from './graphEngine';
import { makeBenefit, makeControl, makeDependency, makeMilestone, makeProgram, makeRisk } from '@/test/factories';
import type { Workstream } from '@/domain/types';

function makeWorkstream(over: Partial<Workstream> = {}): Workstream {
  return {
    id: 'ws-1',
    code: 'WS1',
    name: 'Test workstream',
    description: 'Workstream used in unit tests.',
    leadOwnerId: 'own-1',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    budget: 1_000_000,
    spendToDate: 400_000,
    percentComplete: 45,
    status: 'in-progress',
    ...over,
  };
}

const program = makeProgram({
  workstreams: [makeWorkstream({ id: 'ws-1' })],
  milestones: [
    makeMilestone({ id: 'm1', name: 'API integration', workstreamId: 'ws-1' }),
    makeMilestone({ id: 'm2', name: 'Go live', workstreamId: 'ws-1', predecessorIds: ['m1'] }),
  ],
  risks: [makeRisk({ id: 'r1', affectedMilestoneIds: ['m1'], controlIds: ['c1'], affectedBenefitIds: ['b1'] })],
  controls: [makeControl({ id: 'c1', linkedRiskIds: ['r1'] })],
  dependencies: [makeDependency({ id: 'd1', affectedMilestoneIds: ['m1'], linkedRiskIds: ['r1'] })],
  benefits: [makeBenefit({ id: 'b1', expectedValue: 1_200_000, enablingMilestoneIds: ['m2'], threateningRiskIds: ['r1'] })],
});

describe('buildTwinGraph', () => {
  it('creates one node per programme object', () => {
    const graph = buildTwinGraph(program);
    const ids = graph.nodes.map((n) => n.id);
    for (const id of ['prog-t1', 'ws-1', 'm1', 'm2', 'r1', 'c1', 'd1', 'b1']) expect(ids).toContain(id);
    expect(graph.nodes.length).toBe(new Set(ids).size);
  });

  it('never emits an edge that references a node it did not create', () => {
    const graph = buildTwinGraph(program);
    for (const edge of graph.edges) {
      expect(graph.nodeById[edge.source]).toBeDefined();
      expect(graph.nodeById[edge.target]).toBeDefined();
    }
  });

  it('drops edges pointing at ids that do not exist in the data', () => {
    const broken = makeProgram({
      milestones: [makeMilestone({ id: 'm1' })],
      risks: [makeRisk({ id: 'r1', affectedMilestoneIds: ['ghost'], controlIds: ['ghost-control'] })],
    });
    const graph = buildTwinGraph(broken);
    expect(graph.edges.every((e) => e.source !== 'ghost' && e.target !== 'ghost')).toBe(true);
  });

  it('derives the containment, threat, mitigation and enablement edges', () => {
    const graph = buildTwinGraph(program);
    const kinds = new Set(graph.edges.map((e) => e.kind));
    expect(kinds.has('contains')).toBe(true);
    expect(kinds.has('threatens')).toBe(true);
    expect(kinds.has('mitigates')).toBe(true);
    expect(kinds.has('precedes')).toBe(true);
  });

  it('deduplicates a relationship declared from both ends', () => {
    const graph = buildTwinGraph(program);
    const ids = graph.edges.map((e) => e.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('indexes adjacency consistently with the edge list', () => {
    const graph = buildTwinGraph(program);
    const outCount = Object.values(graph.outgoing).reduce((s, list) => s + list.length, 0);
    const inCount = Object.values(graph.incoming).reduce((s, list) => s + list.length, 0);
    expect(outCount).toBe(graph.edges.length);
    expect(inCount).toBe(graph.edges.length);
  });

  it('applies an externally supplied severity to risk nodes', () => {
    const graph = buildTwinGraph(program, { risk: { r1: 'red' }, program: 'amber' });
    expect(graph.nodeById['r1'].severity).toBe('red');
    expect(graph.nodeById['prog-t1'].severity).toBe('amber');
  });

  it('builds an almost empty graph for an empty programme', () => {
    const graph = buildTwinGraph(makeProgram());
    expect(graph.nodes.length).toBe(1);
    expect(graph.edges).toEqual([]);
  });
});

describe('traceImpactChain', () => {
  const graph = buildTwinGraph(program);

  it('includes the root and reaches downstream nodes with increasing depth', () => {
    const chain = traceImpactChain(graph, 'r1');
    expect(chain.nodeIds).toContain('r1');
    expect(chain.downstream.some((d) => d.id === 'm1' && d.depth === 1)).toBe(true);
    expect(chain.downstream.some((d) => d.depth > 1)).toBe(true);
  });

  it('finds the upstream nodes that reach the root', () => {
    const chain = traceImpactChain(graph, 'm1');
    expect(chain.upstream.map((u) => u.id)).toContain('ws-1');
  });

  it('respects the depth cap', () => {
    const shallow = traceImpactChain(graph, 'prog-t1', 1);
    expect(shallow.downstream.every((d) => d.depth <= 1)).toBe(true);
    const deep = traceImpactChain(graph, 'prog-t1', 4);
    expect(deep.nodeIds.length).toBeGreaterThanOrEqual(shallow.nodeIds.length);
  });

  it('visits every node at most once, so a cycle cannot loop forever', () => {
    const chain = traceImpactChain(graph, 'r1', 10);
    expect(chain.nodeIds.length).toBe(new Set(chain.nodeIds).size);
  });

  it('returns just the root for an id with no edges', () => {
    const lone = buildTwinGraph(makeProgram());
    const chain = traceImpactChain(lone, 'prog-t1');
    expect(chain.nodeIds).toEqual(['prog-t1']);
    expect(chain.edgeIds).toEqual([]);
  });

  it('returns an empty chain for an unknown root instead of throwing', () => {
    const chain = traceImpactChain(graph, 'nope');
    expect(chain.downstream).toEqual([]);
    expect(chain.upstream).toEqual([]);
  });
});

describe('summariseChain', () => {
  const graph = buildTwinGraph(program);

  it('separates direct from indirect impact', () => {
    const summary = summariseChain(graph, traceImpactChain(graph, 'r1'));
    expect(summary.directImpact.length).toBeGreaterThan(0);
    expect(summary.directImpact.every((n) => n !== undefined)).toBe(true);
    const directIds = summary.directImpact.map((n) => n.id);
    expect(summary.indirectImpact.every((n) => !directIds.includes(n.id))).toBe(true);
  });

  it('collects affected owners, dates and benefits', () => {
    const summary = summariseChain(graph, traceImpactChain(graph, 'r1'));
    expect(summary.affectedOwnerIds).toContain('own-1');
    expect(summary.affectedDates.length).toBeGreaterThan(0);
    expect(summary.affectedBenefits.map((b) => b.id)).toContain('b1');
    expect(summary.totalBenefitValue).toBe(1_200_000);
  });

  it('lists the controls and actions that mitigate the chain, without duplicates', () => {
    const summary = summariseChain(graph, traceImpactChain(graph, 'r1'));
    const ids = summary.mitigations.map((m) => m.id);
    expect(ids).toContain('c1');
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('summarises an empty chain to empty lists and zero value', () => {
    const summary = summariseChain(graph, traceImpactChain(graph, 'nope'));
    expect(summary.directImpact).toEqual([]);
    expect(summary.totalBenefitValue).toBe(0);
  });
});

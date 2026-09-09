import type { Program } from '@/domain/types';

export type TwinNodeKind =
  | 'program'
  | 'workstream'
  | 'milestone'
  | 'deliverable'
  | 'dependency'
  | 'risk'
  | 'cause'
  | 'control'
  | 'action'
  | 'issue'
  | 'change'
  | 'decision'
  | 'benefit';

export interface TwinNode {
  id: string;
  kind: TwinNodeKind;
  label: string;
  sublabel: string;
  ownerId?: string;
  /** Severity used for colour: red threat, amber attention, green controlled, neutral otherwise. */
  severity: 'red' | 'amber' | 'green' | 'neutral';
  /** Money attached to the node, if any. */
  value?: number;
  date?: string;
}

export type TwinEdgeKind =
  | 'contains'
  | 'precedes'
  | 'threatens'
  | 'causes'
  | 'mitigates'
  | 'delivers'
  | 'enables'
  | 'decides'
  | 'changes'
  | 'blocks'
  | 'escalates';

export interface TwinEdge {
  id: string;
  source: string;
  target: string;
  kind: TwinEdgeKind;
  label: string;
}

export interface TwinGraph {
  nodes: TwinNode[];
  edges: TwinEdge[];
  nodeById: Record<string, TwinNode>;
  outgoing: Record<string, TwinEdge[]>;
  incoming: Record<string, TwinEdge[]>;
}

const EDGE_LABEL: Record<TwinEdgeKind, string> = {
  contains: 'contains',
  precedes: 'precedes',
  threatens: 'threatens',
  causes: 'causes',
  mitigates: 'mitigates',
  delivers: 'delivers',
  enables: 'enables',
  decides: 'decides',
  changes: 'changes',
  blocks: 'blocks',
  escalates: 'escalates',
};

/**
 * Builds the digital twin graph from the programme. Every edge is derived from a
 * declared relationship in the data, so a node with no edges means the data is
 * genuinely disconnected rather than the view being incomplete.
 */
export function buildTwinGraph(program: Program, severity: SeverityLookup = {}): TwinGraph {
  const nodes: TwinNode[] = [];
  const edges: TwinEdge[] = [];
  const seenEdges = new Set<string>();

  const push = (n: TwinNode) => nodes.push(n);
  const link = (source: string, target: string, kind: TwinEdgeKind) => {
    const id = kind + ':' + source + '->' + target;
    if (seenEdges.has(id)) return;
    seenEdges.add(id);
    edges.push({ id, source, target, kind, label: EDGE_LABEL[kind] });
  };

  push({
    id: program.id,
    kind: 'program',
    label: program.codename,
    sublabel: program.name,
    severity: severity.program ?? 'neutral',
    value: program.budget,
    date: program.endDate,
  });

  for (const ws of program.workstreams) {
    push({
      id: ws.id,
      kind: 'workstream',
      label: ws.code,
      sublabel: ws.name,
      ownerId: ws.leadOwnerId,
      severity: ws.status === 'at-risk' || ws.status === 'blocked' ? 'amber' : ws.status === 'complete' ? 'green' : 'neutral',
      value: ws.budget,
      date: ws.endDate,
    });
    link(program.id, ws.id, 'contains');
  }

  for (const m of program.milestones) {
    push({
      id: m.id,
      kind: 'milestone',
      label: m.name,
      sublabel: m.isGate ? 'Stage gate' : 'Milestone',
      ownerId: m.ownerId,
      severity: severity.milestone?.[m.id] ?? 'neutral',
      date: m.forecastDate,
    });
    link(m.workstreamId, m.id, 'contains');
    for (const p of m.predecessorIds) link(p, m.id, 'precedes');
  }

  for (const d of program.deliverables) {
    push({
      id: d.id,
      kind: 'deliverable',
      label: d.name,
      sublabel: d.percentComplete + '% complete',
      ownerId: d.ownerId,
      severity: d.status === 'at-risk' || d.status === 'blocked' ? 'amber' : d.status === 'complete' ? 'green' : 'neutral',
      date: d.dueDate,
    });
    link(d.id, d.milestoneId, 'delivers');
  }

  for (const dep of program.dependencies) {
    push({
      id: dep.id,
      kind: 'dependency',
      label: dep.name,
      sublabel: dep.upstream + ' to ' + dep.downstream,
      ownerId: dep.upstreamOwnerId,
      severity: dep.status === 'late' ? 'red' : dep.status === 'at-risk' ? 'amber' : dep.status === 'delivered' ? 'green' : 'neutral',
      date: dep.dueDate,
    });
    for (const p of dep.predecessorIds) link(p, dep.id, 'precedes');
    for (const m of dep.affectedMilestoneIds) link(dep.id, m, 'blocks');
    for (const b of dep.affectedBenefitIds) link(dep.id, b, 'threatens');
  }

  for (const c of program.causes) {
    push({
      id: c.id,
      kind: 'cause',
      label: c.title,
      sublabel: c.isRootCause ? 'Root cause / ' + c.category : c.category,
      ownerId: c.ownerId,
      severity: c.isRootCause ? 'amber' : 'neutral',
    });
  }

  for (const r of program.risks) {
    push({
      id: r.id,
      kind: 'risk',
      label: r.ref,
      sublabel: r.title,
      ownerId: r.ownerId,
      severity: severity.risk?.[r.id] ?? 'neutral',
      value: r.inherentFinancialImpact,
      date: r.reviewDate,
    });
    link(r.workstreamId, r.id, 'contains');
    for (const cid of r.causeIds) link(cid, r.id, 'causes');
    for (const mid of r.affectedMilestoneIds) link(r.id, mid, 'threatens');
    for (const bid of r.affectedBenefitIds) link(r.id, bid, 'threatens');
    for (const did of r.dependencyIds) link(did, r.id, 'causes');
    for (const iid of r.issueIds) link(r.id, iid, 'escalates');
  }

  for (const ctl of program.controls) {
    push({
      id: ctl.id,
      kind: 'control',
      label: ctl.ref,
      sublabel: ctl.name,
      ownerId: ctl.ownerId,
      severity: ctl.status === 'failed' ? 'red' : ctl.status === 'degraded' ? 'amber' : ctl.status === 'active' ? 'green' : 'neutral',
      date: ctl.nextTest,
    });
    for (const rid of ctl.linkedRiskIds) link(ctl.id, rid, 'mitigates');
  }

  for (const a of program.actions) {
    push({
      id: a.id,
      kind: 'action',
      label: a.ref,
      sublabel: a.title,
      ownerId: a.ownerId,
      severity: a.status === 'overdue' ? 'red' : a.status === 'complete' ? 'green' : 'neutral',
      date: a.dueDate,
    });
    for (const rid of a.linkedRiskIds) link(a.id, rid, 'mitigates');
    for (const iid of a.linkedIssueIds) link(a.id, iid, 'mitigates');
    for (const did of a.linkedDependencyIds) link(a.id, did, 'mitigates');
  }

  for (const i of program.issues) {
    push({
      id: i.id,
      kind: 'issue',
      label: i.ref,
      sublabel: i.title,
      ownerId: i.ownerId,
      severity: i.status === 'escalated' ? 'red' : i.status === 'open' || i.status === 'in-progress' ? 'amber' : 'green',
      value: i.actualCostImpact,
      date: i.targetResolution,
    });
    link(i.workstreamId, i.id, 'contains');
    for (const cid of i.causeIds) link(cid, i.id, 'causes');
    for (const mid of i.affectedMilestoneIds) link(i.id, mid, 'threatens');
  }

  for (const ch of program.changes) {
    push({
      id: ch.id,
      kind: 'change',
      label: ch.ref,
      sublabel: ch.title,
      ownerId: ch.requesterId,
      severity: ch.decision === 'escalated' ? 'red' : ch.decision === 'pending' ? 'amber' : 'neutral',
      value: ch.costImpact,
      date: ch.decisionDate ?? ch.raisedDate,
    });
    for (const wid of ch.affectedWorkstreamIds) link(ch.id, wid, 'changes');
    for (const mid of ch.affectedMilestoneIds) link(ch.id, mid, 'changes');
    for (const did of ch.affectedDependencyIds) link(ch.id, did, 'changes');
    for (const bid of ch.affectedBenefitIds) link(ch.id, bid, 'changes');
    for (const rid of ch.linkedRiskIds) link(rid, ch.id, 'causes');
  }

  for (const d of program.decisions) {
    push({
      id: d.id,
      kind: 'decision',
      label: d.ref,
      sublabel: d.title,
      ownerId: d.decisionMakerId,
      severity: d.status === 'required' ? 'amber' : 'neutral',
      date: d.dateDecided ?? d.dateRequired,
    });
    for (const cid of d.linkedChangeIds) link(d.id, cid, 'decides');
    for (const rid of d.linkedRiskIds) link(d.id, rid, 'decides');
    for (const bid of d.linkedBenefitIds) link(d.id, bid, 'enables');
    for (const mid of d.linkedMilestoneIds) link(d.id, mid, 'decides');
  }

  for (const b of program.benefits) {
    push({
      id: b.id,
      kind: 'benefit',
      label: b.ref,
      sublabel: b.name,
      ownerId: b.ownerId,
      severity: b.status === 'lost' ? 'red' : b.status === 'at-risk' ? 'amber' : b.status === 'realised' ? 'green' : 'neutral',
      value: b.expectedValue,
      date: b.targetDate,
    });
    for (const mid of b.enablingMilestoneIds) link(mid, b.id, 'enables');
  }

  const nodeById: Record<string, TwinNode> = {};
  for (const n of nodes) nodeById[n.id] = n;
  const outgoing: Record<string, TwinEdge[]> = {};
  const incoming: Record<string, TwinEdge[]> = {};
  for (const e of edges) {
    // Drop edges that reference a node we never created, rather than rendering a ghost.
    if (!nodeById[e.source] || !nodeById[e.target]) continue;
    (outgoing[e.source] = outgoing[e.source] ?? []).push(e);
    (incoming[e.target] = incoming[e.target] ?? []).push(e);
  }
  const validEdges = edges.filter((e) => nodeById[e.source] && nodeById[e.target]);

  return { nodes, edges: validEdges, nodeById, outgoing, incoming };
}

export interface SeverityLookup {
  program?: TwinNode['severity'];
  risk?: Record<string, TwinNode['severity']>;
  milestone?: Record<string, TwinNode['severity']>;
}

export interface ImpactChain {
  rootId: string;
  /** Nodes reachable following edges forward, with their distance. */
  downstream: { id: string; depth: number }[];
  /** Nodes that reach the root, with their distance. */
  upstream: { id: string; depth: number }[];
  /** All node ids in the chain including the root. */
  nodeIds: string[];
  edgeIds: string[];
}

/** Breadth-first traversal in both directions. Cycle-safe and depth-capped. */
export function traceImpactChain(graph: TwinGraph, rootId: string, maxDepth = 4): ImpactChain {
  const downstream = traverse(graph.outgoing, rootId, maxDepth, (e) => e.target);
  const upstream = traverse(graph.incoming, rootId, maxDepth, (e) => e.source);
  const nodeIds = new Set<string>([rootId]);
  for (const d of downstream) nodeIds.add(d.id);
  for (const u of upstream) nodeIds.add(u.id);
  const edgeIds = graph.edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target)).map((e) => e.id);
  return { rootId, downstream, upstream, nodeIds: [...nodeIds], edgeIds };
}

function traverse(
  adjacency: Record<string, TwinEdge[]>,
  rootId: string,
  maxDepth: number,
  pick: (e: TwinEdge) => string,
): { id: string; depth: number }[] {
  const out: { id: string; depth: number }[] = [];
  const seen = new Set<string>([rootId]);
  let frontier = [rootId];
  for (let depth = 1; depth <= maxDepth && frontier.length > 0; depth += 1) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const edge of adjacency[id] ?? []) {
        const other = pick(edge);
        if (seen.has(other)) continue;
        seen.add(other);
        out.push({ id: other, depth });
        next.push(other);
      }
    }
    frontier = next;
  }
  return out;
}

export interface ChainSummary {
  directImpact: TwinNode[];
  indirectImpact: TwinNode[];
  affectedOwnerIds: string[];
  affectedDates: { nodeId: string; label: string; date: string }[];
  affectedBenefits: TwinNode[];
  mitigations: TwinNode[];
  totalBenefitValue: number;
}

/** Reduces a chain into the five things the twin panel must answer. */
export function summariseChain(graph: TwinGraph, chain: ImpactChain): ChainSummary {
  const node = (id: string) => graph.nodeById[id];
  const direct = chain.downstream.filter((d) => d.depth === 1).map((d) => node(d.id)).filter(Boolean);
  const indirect = chain.downstream.filter((d) => d.depth > 1).map((d) => node(d.id)).filter(Boolean);
  const all = [...direct, ...indirect];
  const owners = new Set<string>();
  for (const n of all) if (n.ownerId) owners.add(n.ownerId);
  const benefits = all.filter((n) => n.kind === 'benefit');
  const mitigations = [...chain.upstream.map((u) => node(u.id)), ...all].filter(
    (n) => n && (n.kind === 'control' || n.kind === 'action'),
  );
  const uniqueMitigations = mitigations.filter((n, i, arr) => arr.findIndex((m) => m.id === n.id) === i);
  return {
    directImpact: direct,
    indirectImpact: indirect,
    affectedOwnerIds: [...owners],
    affectedDates: all.filter((n) => n.date).map((n) => ({ nodeId: n.id, label: n.label, date: n.date as string })),
    affectedBenefits: benefits,
    mitigations: uniqueMitigations,
    totalBenefitValue: benefits.reduce((s, b) => s + (b.value ?? 0), 0),
  };
}

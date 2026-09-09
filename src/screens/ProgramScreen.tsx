import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Background, Controls, MiniMap, ReactFlow, Handle, Position, type Edge, type Node, type NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '@/state/store';
import { traceImpactChain, summariseChain, type TwinGraph, type TwinNode, type TwinNodeKind } from '@/domain/engines/graphEngine';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat, Meter, EmptyState } from '@/ui/primitives';
import { DataTable, type Column, type FilterGroup } from '@/ui/DataTable';
import { Section } from '@/ui/SlideOver';
import { useFocusParam } from '@/ui/useFocusParam';
import { cx } from '@/lib/cx';
import { formatCurrency, formatPercent, titleCase } from '@/lib/format';
import { formatDate } from '@/lib/dates';
import { ROUTES } from '@/nav';
import type { Milestone, Workstream } from '@/domain/types';

const meta = ROUTES.find((r) => r.code === '02')!;

const KIND_LABEL: Record<TwinNodeKind, string> = {
  program: 'Program',
  workstream: 'Workstream',
  milestone: 'Milestone',
  deliverable: 'Deliverable',
  dependency: 'Dependency',
  cause: 'Cause',
  risk: 'Risk',
  issue: 'Issue',
  control: 'Control',
  action: 'Action',
  change: 'Change',
  decision: 'Decision',
  benefit: 'Benefit',
};

/** Column order follows the causal chain in the product philosophy: programme
 * down to workstreams and delivery, across to risk and its mitigations, on to
 * benefits. It is a reading order, not a physics layout. */
const COLUMN: Record<TwinNodeKind, number> = {
  program: 0,
  workstream: 1,
  milestone: 2,
  deliverable: 3,
  dependency: 4,
  cause: 5,
  risk: 6,
  issue: 7,
  control: 8,
  action: 9,
  change: 10,
  decision: 11,
  benefit: 12,
};

const KIND_ROUTE: Partial<Record<TwinNodeKind, string>> = {
  risk: '/risk',
  control: '/risk',
  issue: '/raid',
  dependency: '/dependencies',
  cause: '/root-cause',
  change: '/change',
  decision: '/decisions',
  benefit: '/benefits',
};

const TOGGLE_KINDS: TwinNodeKind[] = [
  'workstream',
  'milestone',
  'deliverable',
  'dependency',
  'cause',
  'risk',
  'issue',
  'control',
  'action',
  'change',
  'decision',
  'benefit',
];

const DEFAULT_KINDS: TwinNodeKind[] = ['workstream', 'milestone', 'risk', 'benefit'];

const SEVERITY_RANK: Record<TwinNode['severity'], number> = { red: 0, amber: 1, green: 2, neutral: 3 };
const SEVERITY_TONE: Record<TwinNode['severity'], 'threat' | 'attention' | 'controlled' | 'neutral'> = {
  red: 'threat',
  amber: 'attention',
  green: 'controlled',
  neutral: 'neutral',
};
const SEVERITY_STYLE: Record<TwinNode['severity'], string> = {
  red: 'border-threat/50 bg-threat/10',
  amber: 'border-attention/50 bg-attention/10',
  green: 'border-controlled/50 bg-controlled/10',
  neutral: 'border-base-400 bg-base-700/70',
};

type TwinState = 'root' | 'chain' | 'dim' | 'normal';

function TwinNodeCard({ data }: NodeProps) {
  const { node, state } = data as unknown as { node: TwinNode; state: TwinState };
  return (
    <div
      className={cx(
        'w-[186px] rounded-md border px-2.5 py-1.5 transition-opacity duration-200',
        SEVERITY_STYLE[node.severity],
        state === 'root' && 'ring-2 ring-strategic',
        state === 'dim' && 'opacity-[0.15]',
      )}
    >
      <Handle type="target" position={Position.Left} className="!h-1.5 !w-1.5 !border-none !bg-ink-500" />
      <Handle type="source" position={Position.Right} className="!h-1.5 !w-1.5 !border-none !bg-ink-500" />
      <div className="flex items-center justify-between gap-1 text-[10px] uppercase tracking-wide text-ink-500">
        <span>{KIND_LABEL[node.kind]}</span>
        {typeof node.value === 'number' && node.value > 0 && <span className="num">{Math.round(node.value / 1000)}k</span>}
      </div>
      <div className="truncate text-xs font-medium text-ink-100">{node.label}</div>
      <div className="truncate text-2xs text-ink-400">{node.sublabel}</div>
    </div>
  );
}

const NODE_TYPES = { twin: TwinNodeCard };

function layoutNodes(nodes: TwinNode[], visible: Set<TwinNodeKind>) {
  const columns = new Map<number, TwinNode[]>();
  for (const n of nodes) {
    if (n.kind !== 'program' && !visible.has(n.kind)) continue;
    const col = COLUMN[n.kind];
    if (!columns.has(col)) columns.set(col, []);
    columns.get(col)!.push(n);
  }
  const positioned: { node: TwinNode; x: number; y: number }[] = [];
  for (const [col, list] of columns) {
    list.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || a.label.localeCompare(b.label));
    list.forEach((node, i) => positioned.push({ node, x: col * 224, y: i * 52 }));
  }
  return positioned;
}

export function ProgramScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const [focus, setFocus] = useFocusParam();

  const money = (n: number) => formatCurrency(n, program.currency);
  const graph = analytics.graph;
  const schedule = analytics.health.schedule;

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <ProgramOverview program={program} schedule={schedule} money={money} onFocusWorkstream={setFocus} />

      <Panel dense className="mb-4" subtitle="Baseline vs forecast, and everything currently threatening each milestone.">
        <MilestoneTable program={program} schedule={schedule} onOpen={setFocus} />
      </Panel>

      <ProgramDigitalTwin graph={graph} program={program} selectedId={focus} onSelect={setFocus} />
    </>
  );
}

function ProgramOverview({
  program,
  schedule,
  money,
  onFocusWorkstream,
}: {
  program: import('@/domain/types').Program;
  schedule: import('@/domain/engines/scheduleEngine').ScheduleSummary;
  money: (n: number) => string;
  onFocusWorkstream: (id: string) => void;
}) {
  const spendVariance = program.forecastSpend - program.budget;
  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Workstreams" value={program.workstreams.length} hint={program.workstreams.filter((w) => w.status === 'at-risk' || w.status === 'blocked').length + ' at risk'} tone="strategic" />
        <Stat label="Milestones at risk" value={schedule.atRisk} hint={schedule.overdue + ' overdue of ' + schedule.total} tone="threat" />
        <Stat label="Delivery complete" value={formatPercent(schedule.percentComplete, 0)} hint={schedule.gatesAtRisk + ' stage gate(s) at risk'} tone="info" />
        <Stat
          label="Budget forecast"
          value={money(program.forecastSpend)}
          hint={(spendVariance >= 0 ? '+' : '') + money(spendVariance) + ' vs ' + money(program.budget) + ' budget'}
          tone={spendVariance > 0 ? 'attention' : 'controlled'}
        />
      </div>

      <Panel dense className="mb-4" subtitle="Each workstream carries its own budget, owner and delivery status; click one to trace it in the digital twin below.">
        <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {program.workstreams.map((ws) => (
            <WorkstreamCard key={ws.id} workstream={ws} program={program} onClick={() => onFocusWorkstream(ws.id)} />
          ))}
        </div>
      </Panel>
    </>
  );
}

function WorkstreamCard({ workstream, program, onClick }: { workstream: Workstream; program: import('@/domain/types').Program; onClick: () => void }) {
  const owner = program.owners.find((o) => o.id === workstream.leadOwnerId);
  const milestoneCount = program.milestones.filter((m) => m.workstreamId === workstream.id).length;
  const tone = workstream.status === 'at-risk' || workstream.status === 'blocked' ? 'threat' : workstream.status === 'complete' ? 'controlled' : 'neutral';
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-base-500 bg-base-800/60 p-3 text-left transition-colors hover:border-strategic/50 hover:bg-base-700/60"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="num text-2xs text-ink-500">{workstream.code}</span>
        <Chip tone={tone}>{titleCase(workstream.status)}</Chip>
      </div>
      <div className="mt-1.5 truncate text-xs font-medium text-ink-100">{workstream.name}</div>
      <div className="mt-2">
        <Meter value={workstream.percentComplete} max={100} tone={tone === 'threat' ? 'threat' : 'info'} label={workstream.percentComplete + '% complete'} />
      </div>
      <div className="mt-2 flex items-center justify-between text-2xs text-ink-500">
        <span>{owner?.name ?? 'Unassigned'}</span>
        <span>{milestoneCount} milestone(s)</span>
      </div>
    </button>
  );
}

function MilestoneTable({
  program,
  schedule,
  onOpen,
}: {
  program: import('@/domain/types').Program;
  schedule: import('@/domain/engines/scheduleEngine').ScheduleSummary;
  onOpen: (id: string) => void;
}) {
  const workstreamName = (id: string) => program.workstreams.find((w) => w.id === id)?.name ?? id;
  const ownerName = (id: string) => program.owners.find((o) => o.id === id)?.name ?? id;

  const columns: Column<Milestone>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Milestone',
        render: (m) => (
          <span className="inline-flex items-center gap-1.5">
            {m.isGate && <Chip tone="strategic">Gate</Chip>}
            {m.name}
          </span>
        ),
        sortValue: (m) => m.name,
        searchValue: (m) => m.name + ' ' + m.description,
      },
      { key: 'workstream', header: 'Workstream', render: (m) => workstreamName(m.workstreamId), sortValue: (m) => workstreamName(m.workstreamId), optional: true },
      { key: 'owner', header: 'Owner', render: (m) => ownerName(m.ownerId), sortValue: (m) => ownerName(m.ownerId), optional: true },
      { key: 'baseline', header: 'Baseline', render: (m) => formatDate(m.baselineDate), sortValue: (m) => m.baselineDate, optional: true },
      { key: 'forecast', header: 'Forecast', render: (m) => formatDate(m.forecastDate), sortValue: (m) => m.forecastDate },
      {
        key: 'variance',
        header: 'Variance',
        render: (m) => {
          const v = schedule.byId[m.id]?.varianceDays ?? 0;
          return <span className={cx('num', v > 10 ? 'text-threat' : v > 0 ? 'text-attention' : 'text-controlled')}>{v > 0 ? '+' : ''}{v}d</span>;
        },
        sortValue: (m) => schedule.byId[m.id]?.varianceDays ?? 0,
        align: 'right',
      },
      {
        key: 'status',
        header: 'Status',
        render: (m) => (
          <Chip tone={schedule.byId[m.id]?.isOverdue ? 'threat' : schedule.byId[m.id]?.isAtRisk ? 'attention' : m.status === 'complete' ? 'controlled' : 'neutral'}>
            {titleCase(m.status)}
          </Chip>
        ),
        sortValue: (m) => m.status,
      },
    ],
    [schedule],
  );

  const filters: FilterGroup<Milestone>[] = [
    {
      key: 'status',
      label: 'Status',
      options: (['not-started', 'in-progress', 'blocked', 'complete', 'at-risk'] as Milestone['status'][]).map((s) => ({
        value: s,
        label: titleCase(s),
        match: (m) => m.status === s,
      })),
    },
    {
      key: 'risk',
      label: 'Risk flag',
      options: [
        { value: 'at-risk', label: 'At risk', match: (m: Milestone) => Boolean(schedule.byId[m.id]?.isAtRisk) },
        { value: 'overdue', label: 'Overdue', match: (m: Milestone) => Boolean(schedule.byId[m.id]?.isOverdue) },
        { value: 'gate', label: 'Stage gate', match: (m: Milestone) => m.isGate },
      ],
    },
  ];

  return (
    <DataTable
      rows={program.milestones}
      columns={columns}
      filters={filters}
      onRowClick={(m) => onOpen(m.id)}
      caption="Milestone plan"
      searchPlaceholder="Search milestones"
      initialSort={{ key: 'forecast', direction: 'asc' }}
    />
  );
}

function ProgramDigitalTwin({
  graph,
  program,
  selectedId,
  onSelect,
}: {
  graph: TwinGraph;
  program: import('@/domain/types').Program;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [visible, setVisibleState] = useState<Set<TwinNodeKind>>(() => new Set(DEFAULT_KINDS));

  const selectedNode = selectedId ? graph.nodeById[selectedId] : null;
  const chain = useMemo(() => (selectedNode ? traceImpactChain(graph, selectedNode.id, 4) : null), [graph, selectedNode]);

  const rfNodes: Node[] = useMemo(() => {
    const positioned = layoutNodes(graph.nodes, visible);
    return positioned.map(({ node, x, y }) => {
      let state: TwinState = 'normal';
      if (selectedNode) {
        if (node.id === selectedNode.id) state = 'root';
        else if (chain?.nodeIds.includes(node.id)) state = 'chain';
        else state = 'dim';
      }
      return { id: node.id, type: 'twin', position: { x, y }, data: { node, state }, draggable: false, selectable: true };
    });
  }, [graph, visible, selectedNode, chain]);

  const rfEdges: Edge[] = useMemo(() => {
    const shown = new Set(rfNodes.map((n) => n.id));
    return graph.edges
      .filter((e) => shown.has(e.source) && shown.has(e.target))
      .map((e) => {
        const inChain = chain?.edgeIds.includes(e.id) ?? false;
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: 'smoothstep',
          animated: inChain,
          style: inChain ? { stroke: '#a970ff', strokeWidth: 2 } : { stroke: '#3a4152', strokeWidth: 1, opacity: selectedNode ? 0.12 : 0.35 },
          zIndex: inChain ? 10 : 0,
        };
      });
  }, [graph, rfNodes, chain, selectedNode]);

  const toggleKind = (kind: TwinNodeKind) => {
    setVisibleState((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  };

  return (
    <Panel
      title="Program Digital Twin"
      subtitle="Every object in the delivery chain, one graph. Click a node to trace its full causal and impact chain."
      className="mb-4"
      actions={
        selectedNode && (
          <button type="button" className="btn" onClick={() => onSelect(null)}>
            Clear selection
          </button>
        )
      }
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {TOGGLE_KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => toggleKind(k)}
            className={cx('chip border transition-colors', visible.has(k) ? 'border-strategic/50 bg-strategic/10 text-strategic' : 'border-base-500 bg-base-800 text-ink-500')}
            aria-pressed={visible.has(k)}
          >
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <div className="h-[640px] overflow-hidden rounded-md border border-base-500 bg-base-900">
          <ReactFlow
            key={[...visible].sort().join(",")}
            nodes={rfNodes}
            edges={rfEdges}
            nodeTypes={NODE_TYPES}
            onNodeClick={(_, node) => onSelect(node.id)}
            onPaneClick={() => onSelect(null)}
            defaultViewport={{ x: 80, y: 40, zoom: 0.62 }}
            minZoom={0.1}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            onlyRenderVisibleElements
          >
            <Background color="#2a3040" gap={24} />
            <Controls showInteractive={false} position="bottom-right" />
            <MiniMap pannable zoomable style={{ background: '#12151c' }} maskColor="rgba(10,12,16,0.75)" nodeColor={(n) => nodeColour(n)} />
          </ReactFlow>
        </div>
        <div className="max-h-[640px] overflow-y-auto rounded-md border border-base-500 bg-base-800/40 p-3">
          <TwinInfoPanel graph={graph} program={program} selected={selectedNode} onSelect={onSelect} />
        </div>
      </div>
    </Panel>
  );
}

function nodeColour(node: Node) {
  const data = node.data as unknown as { node: TwinNode };
  const map: Record<TwinNode['severity'], string> = { red: '#ff4d5e', amber: '#ffb020', green: '#00d68f', neutral: '#5b6577' };
  return map[data.node.severity];
}

function TwinInfoPanel({
  graph,
  program,
  selected,
  onSelect,
}: {
  graph: TwinGraph;
  program: import('@/domain/types').Program;
  selected: TwinNode | null;
  onSelect: (id: string) => void;
}) {
  const analytics = useStore((s) => s.analytics);
  const money = (n: number) => formatCurrency(n, program.currency);

  if (!selected) {
    return (
      <EmptyState
        title="Select a node"
        hint="Click any node in the twin to trace its full causal and impact chain: direct impact, indirect impact, affected owners, dates, benefits and the mitigations already in place."
      />
    );
  }

  const chain = traceImpactChain(graph, selected.id, 4);
  const summary = summariseChain(graph, chain);
  const route = KIND_ROUTE[selected.kind];
  const ownerName = (id: string) => analytics.ownerById[id] ?? id;

  return (
    <div className="text-xs">
      <div className="text-2xs uppercase tracking-wide text-ink-500">{KIND_LABEL[selected.kind]}</div>
      <div className="mt-0.5 text-sm font-semibold leading-snug text-ink-50">{selected.label}</div>
      {selected.sublabel && <div className="mt-0.5 text-2xs text-ink-400">{selected.sublabel}</div>}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Chip tone={SEVERITY_TONE[selected.severity]}>{titleCase(selected.severity)}</Chip>
        {typeof selected.value === 'number' && selected.value > 0 && <Chip tone="info">{money(selected.value)}</Chip>}
        {selected.date && <Chip>{formatDate(selected.date)}</Chip>}
        {selected.ownerId && <Chip>{ownerName(selected.ownerId)}</Chip>}
      </div>
      {route && (
        <Link to={route + '?focus=' + selected.id} className="mt-2 inline-block text-2xs font-medium text-strategic hover:underline">
          Open full record &rarr;
        </Link>
      )}

      <Section title={'Direct impact (' + summary.directImpact.length + ')'}>
        {summary.directImpact.length === 0 ? (
          <p className="text-2xs text-ink-500">No direct downstream links.</p>
        ) : (
          <ul className="space-y-1">
            {summary.directImpact.map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => onSelect(n.id)} className="block w-full rounded px-1 py-0.5 text-left text-2xs text-ink-300 hover:bg-base-700/60">
                  <span className="text-ink-500">{KIND_LABEL[n.kind]}</span> &middot; {n.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={'Indirect impact (' + summary.indirectImpact.length + ')'}>
        {summary.indirectImpact.length === 0 ? (
          <p className="text-2xs text-ink-500">No further reach beyond direct impact.</p>
        ) : (
          <ul className="space-y-1">
            {summary.indirectImpact.slice(0, 8).map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => onSelect(n.id)} className="block w-full rounded px-1 py-0.5 text-left text-2xs text-ink-300 hover:bg-base-700/60">
                  <span className="text-ink-500">{KIND_LABEL[n.kind]}</span> &middot; {n.label}
                </button>
              </li>
            ))}
            {summary.indirectImpact.length > 8 && <li className="text-2xs text-ink-500">+{summary.indirectImpact.length - 8} more</li>}
          </ul>
        )}
      </Section>

      {summary.affectedOwnerIds.length > 0 && (
        <Section title="Affected owners">
          <div className="flex flex-wrap gap-1.5">
            {summary.affectedOwnerIds.map((id) => (
              <Chip key={id}>{ownerName(id)}</Chip>
            ))}
          </div>
        </Section>
      )}

      {summary.affectedDates.length > 0 && (
        <Section title="Affected dates">
          <ul className="space-y-1">
            {summary.affectedDates.slice(0, 6).map((d) => (
              <li key={d.nodeId} className="flex items-center justify-between gap-2 text-2xs text-ink-300">
                <span className="truncate">{d.label}</span>
                <span className="num shrink-0 text-ink-400">{formatDate(d.date)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {summary.affectedBenefits.length > 0 && (
        <Section title={'Benefits threatened \u2014 ' + money(summary.totalBenefitValue)}>
          <ul className="space-y-1">
            {summary.affectedBenefits.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-2 text-2xs text-ink-300">
                <span className="truncate">{b.label}</span>
                <span className="num shrink-0 text-threat">{money(b.value ?? 0)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {summary.mitigations.length > 0 && (
        <Section title="Mitigations in place">
          <ul className="space-y-1">
            {summary.mitigations.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => onSelect(m.id)} className="block w-full rounded px-1 py-0.5 text-left text-2xs text-controlled hover:bg-base-700/60">
                  {KIND_LABEL[m.kind]} &middot; {m.label}
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

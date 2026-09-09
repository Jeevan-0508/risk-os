import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, HelpCircle, ShieldAlert, Share2 } from 'lucide-react';
import { useStore } from '@/state/store';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, RagBadge, EmptyState } from '@/ui/primitives';
import { DataTable, type Column, type FilterGroup } from '@/ui/DataTable';
import { SlideOver, Section, Field } from '@/ui/SlideOver';
import { useFocusParam } from '@/ui/useFocusParam';
import { formatCurrency, formatNumber, titleCase } from '@/lib/format';
import { formatDate } from '@/lib/dates';
import { ROUTE_BY_PATH } from '@/nav';
import { summariseSystemicRootCauses, correctiveActionsForCause } from '@/domain/engines/dmaicEngine';
import type { Assumption, Dependency, Issue, Risk, FishboneCategory, AcceptanceStatus } from '@/domain/types';
import type { ToleranceStatus } from '@/domain/engines/toleranceEngine';
import type { EffectivenessStatus } from '@/domain/engines/treatmentEngine';
import type { AgingClass } from '@/domain/engines/agingEngine';
import type { DecisionSeverity } from '@/domain/engines/decisionQueueEngine';

type ChipTone = 'neutral' | 'info' | 'strategic' | 'controlled' | 'attention' | 'threat';

const CATEGORY_LABEL: Record<FishboneCategory, string> = {
  people: 'People',
  process: 'Process',
  technology: 'Technology',
  policy: 'Policy',
  environment: 'Environment',
  measurement: 'Measurement',
  management: 'Management',
};

const meta = ROUTE_BY_PATH['/raid'];

type Tab = 'risks' | 'assumptions' | 'issues' | 'dependencies';

const TABS: { id: Tab; label: string; icon: typeof ShieldAlert }[] = [
  { id: 'risks', label: 'Risks', icon: ShieldAlert },
  { id: 'assumptions', label: 'Assumptions', icon: HelpCircle },
  { id: 'issues', label: 'Issues', icon: AlertTriangle },
  { id: 'dependencies', label: 'Dependencies', icon: Share2 },
];

/**
 * RAID++ is one register with relationships between its four item types, not
 * four disconnected lists: every detail panel below shows what an item links to
 * across the other three tabs.
 */
export function RaidScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const [tab, setTab] = useState<Tab>('risks');
  const [focus, setFocus] = useFocusParam();

  const nameOf = (id: string) => analytics.ownerById[id] ?? 'Unassigned';
  const money = (n: number) => formatCurrency(n, program.currency);

  const risk = program.risks.find((r) => r.id === focus);
  const assumption = program.assumptions.find((a) => a.id === focus);
  const issue = program.issues.find((i) => i.id === focus);
  const dependency = program.dependencies.find((d) => d.id === focus);

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="mb-4 flex gap-1 border-b border-base-600">
        {TABS.map((t) => {
          const Icon = t.icon;
          const count =
            t.id === 'risks'
              ? program.risks.length
              : t.id === 'assumptions'
                ? program.assumptions.length
                : t.id === 'issues'
                  ? program.issues.length
                  : program.dependencies.length;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              className={
                'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors ' +
                (tab === t.id ? 'border-threat text-ink-100' : 'border-transparent text-ink-400 hover:text-ink-200')
              }
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {t.label}
              <span className="num rounded-full bg-base-600 px-1.5 py-0.5 text-2xs text-ink-300">{count}</span>
            </button>
          );
        })}
      </div>

      {tab === 'risks' && <RisksTable risks={program.risks} nameOf={nameOf} money={money} onOpen={setFocus} />}
      {tab === 'assumptions' && <AssumptionsTable rows={program.assumptions} nameOf={nameOf} onOpen={setFocus} />}
      {tab === 'issues' && <IssuesTable rows={program.issues} nameOf={nameOf} money={money} onOpen={setFocus} />}
      {tab === 'dependencies' && <DependenciesTable rows={program.dependencies} nameOf={nameOf} onOpen={setFocus} />}

      <SlideOver open={Boolean(risk)} onClose={() => setFocus(null)} title={risk ? risk.ref + '  ' + risk.title : ''} width="wider" badge={risk && <RagBadge status={program.risks.find((r) => r.id === risk.id) ? analytics.health.risk.byId[risk.id]?.residualSeverity ?? 'amber' : 'amber'} />}>
        {risk && <RiskDetail risk={risk} onNavigate={setFocus} />}
      </SlideOver>

      <SlideOver open={Boolean(assumption)} onClose={() => setFocus(null)} title={assumption ? assumption.ref + '  Assumption' : ''}>
        {assumption && <AssumptionDetail assumption={assumption} onNavigate={setFocus} />}
      </SlideOver>

      <SlideOver open={Boolean(issue)} onClose={() => setFocus(null)} title={issue ? issue.ref + '  ' + issue.title : ''}>
        {issue && <IssueDetail issue={issue} onNavigate={setFocus} />}
      </SlideOver>

      <SlideOver open={Boolean(dependency)} onClose={() => setFocus(null)} title={dependency ? dependency.ref + '  ' + dependency.name : ''}>
        {dependency && <DependencyDetail dependency={dependency} onNavigate={setFocus} />}
      </SlideOver>
    </>
  );
}

function RisksTable({
  risks,
  nameOf,
  money,
  onOpen,
}: {
  risks: Risk[];
  nameOf: (id: string) => string;
  money: (n: number) => string;
  onOpen: (id: string) => void;
}) {
  const analytics = useStore((s) => s.analytics);
  const columns: Column<Risk>[] = useMemo(
    () => [
      { key: 'ref', header: 'ID', render: (r) => <span className="num text-2xs text-ink-500">{r.ref}</span>, sortValue: (r) => r.ref, width: '4.5rem' },
      {
        key: 'title',
        header: 'Title',
        render: (r) => (
          <div>
            <div className="truncate text-ink-100">{r.title}</div>
            <div className="truncate text-2xs text-ink-500">{titleCase(r.category)}</div>
          </div>
        ),
        sortValue: (r) => r.title,
        searchValue: (r) => r.title + ' ' + r.description + ' ' + r.ref,
      },
      { key: 'owner', header: 'Owner', render: (r) => nameOf(r.ownerId), sortValue: (r) => nameOf(r.ownerId), searchValue: (r) => nameOf(r.ownerId) },
      {
        key: 'status',
        header: 'Status',
        render: (r) => <Chip>{titleCase(r.status)}</Chip>,
        sortValue: (r) => r.status,
      },
      {
        key: 'severity',
        header: 'Residual',
        render: (r) => {
          const a = analytics.health.risk.byId[r.id];
          return a ? <RagBadge status={a.residualSeverity} /> : '--';
        },
        sortValue: (r) => analytics.health.risk.byId[r.id]?.residualScore ?? 0,
      },
      {
        key: 'exposure',
        header: 'Residual exposure',
        render: (r) => money(analytics.health.risk.byId[r.id]?.residualFinancialExposure ?? 0),
        sortValue: (r) => analytics.health.risk.byId[r.id]?.residualFinancialExposure ?? 0,
        align: 'right',
      },
      {
        key: 'trend',
        header: 'Trend',
        render: (r) => {
          const t = analytics.health.risk.byId[r.id]?.trend ?? 'new';
          return <span className={t === 'accelerating' ? 'text-threat' : t === 'deteriorating' ? 'text-attention' : t === 'improving' ? 'text-controlled' : 'text-ink-400'}>{titleCase(t)}</span>;
        },
        sortValue: (r) => analytics.health.risk.byId[r.id]?.velocity ?? 0,
      },
      { key: 'due', header: 'Review', render: (r) => formatDate(r.reviewDate), sortValue: (r) => r.reviewDate, optional: true },
    ],
    [analytics, nameOf, money],
  );

  const filters: FilterGroup<Risk>[] = [
    {
      key: 'status',
      label: 'Status',
      options: ['open', 'monitoring', 'escalated', 'accepted', 'materialised', 'closed'].map((s) => ({
        value: s,
        label: titleCase(s),
        match: (r) => r.status === s,
      })),
    },
    {
      key: 'severity',
      label: 'Residual',
      options: (['red', 'amber', 'green'] as const).map((s) => ({
        value: s,
        label: titleCase(s),
        match: (r) => analytics.health.risk.byId[r.id]?.residualSeverity === s,
      })),
    },
    {
      key: 'trend',
      label: 'Trend',
      options: ['accelerating', 'deteriorating', 'stagnant', 'improving', 'new'].map((t) => ({
        value: t,
        label: titleCase(t),
        match: (r) => analytics.health.risk.byId[r.id]?.trend === t,
      })),
    },
  ];

  return (
    <Panel dense>
      <DataTable
        rows={risks}
        columns={columns}
        filters={filters}
        onRowClick={(r) => onOpen(r.id)}
        caption="Risk register"
        searchPlaceholder="Search risks"
        initialSort={{ key: 'exposure', direction: 'desc' }}
      />
    </Panel>
  );
}

function AssumptionsTable({ rows, nameOf, onOpen }: { rows: Assumption[]; nameOf: (id: string) => string; onOpen: (id: string) => void }) {
  const columns: Column<Assumption>[] = [
    { key: 'ref', header: 'ID', render: (a) => <span className="num text-2xs text-ink-500">{a.ref}</span>, width: '4.5rem' },
    { key: 'statement', header: 'Statement', render: (a) => a.statement, sortValue: (a) => a.statement, searchValue: (a) => a.statement + ' ' + a.note },
    { key: 'owner', header: 'Owner', render: (a) => nameOf(a.ownerId), sortValue: (a) => nameOf(a.ownerId) },
    { key: 'confidence', header: 'Confidence', render: (a) => <Chip>{titleCase(a.confidence)}</Chip>, sortValue: (a) => a.confidence },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <Chip tone={a.status === 'invalidated' ? 'threat' : a.status === 'validated' ? 'controlled' : 'neutral'}>{titleCase(a.status)}</Chip>
      ),
      sortValue: (a) => a.status,
    },
    { key: 'validation', header: 'Validation due', render: (a) => formatDate(a.validationDate), sortValue: (a) => a.validationDate },
    { key: 'risk', header: 'Risk if false', render: (a) => (a.riskIfFalseId ? a.riskIfFalseId.toUpperCase() : '--'), optional: true },
  ];
  const filters: FilterGroup<Assumption>[] = [
    {
      key: 'status',
      label: 'Status',
      options: ['unvalidated', 'validating', 'validated', 'invalidated'].map((s) => ({ value: s, label: titleCase(s), match: (a) => a.status === s })),
    },
  ];
  return (
    <Panel dense>
      <DataTable rows={rows} columns={columns} filters={filters} onRowClick={(a) => onOpen(a.id)} caption="Assumption log" searchPlaceholder="Search assumptions" />
    </Panel>
  );
}

function IssuesTable({
  rows,
  nameOf,
  money,
  onOpen,
}: {
  rows: Issue[];
  nameOf: (id: string) => string;
  money: (n: number) => string;
  onOpen: (id: string) => void;
}) {
  const columns: Column<Issue>[] = [
    { key: 'ref', header: 'ID', render: (i) => <span className="num text-2xs text-ink-500">{i.ref}</span>, width: '4.5rem' },
    { key: 'title', header: 'Title', render: (i) => i.title, sortValue: (i) => i.title, searchValue: (i) => i.title + ' ' + i.description },
    { key: 'owner', header: 'Owner', render: (i) => nameOf(i.ownerId), sortValue: (i) => nameOf(i.ownerId) },
    { key: 'priority', header: 'Priority', render: (i) => <Chip tone={i.priority === 'critical' ? 'threat' : i.priority === 'high' ? 'attention' : 'neutral'}>{titleCase(i.priority)}</Chip>, sortValue: (i) => i.priority },
    { key: 'status', header: 'Status', render: (i) => <Chip>{titleCase(i.status)}</Chip>, sortValue: (i) => i.status },
    { key: 'cost', header: 'Realised cost', render: (i) => money(i.actualCostImpact), sortValue: (i) => i.actualCostImpact, align: 'right' },
    { key: 'days', header: 'Days lost', render: (i) => formatNumber(i.actualScheduleImpactDays), sortValue: (i) => i.actualScheduleImpactDays, align: 'right', optional: true },
    { key: 'target', header: 'Target', render: (i) => formatDate(i.targetResolution), sortValue: (i) => i.targetResolution, optional: true },
  ];
  const filters: FilterGroup<Issue>[] = [
    {
      key: 'status',
      label: 'Status',
      options: ['open', 'in-progress', 'escalated', 'resolved', 'closed'].map((s) => ({ value: s, label: titleCase(s), match: (i) => i.status === s })),
    },
    {
      key: 'priority',
      label: 'Priority',
      options: ['critical', 'high', 'medium', 'low'].map((p) => ({ value: p, label: titleCase(p), match: (i) => i.priority === p })),
    },
  ];
  return (
    <Panel dense>
      <DataTable
        rows={rows}
        columns={columns}
        filters={filters}
        onRowClick={(i) => onOpen(i.id)}
        caption="Issue log"
        searchPlaceholder="Search issues"
        initialSort={{ key: 'cost', direction: 'desc' }}
      />
    </Panel>
  );
}

function DependenciesTable({ rows, nameOf, onOpen }: { rows: Dependency[]; nameOf: (id: string) => string; onOpen: (id: string) => void }) {
  const analytics = useStore((s) => s.analytics);
  const columns: Column<Dependency>[] = [
    { key: 'ref', header: 'ID', render: (d) => <span className="num text-2xs text-ink-500">{d.ref}</span>, width: '4.5rem' },
    { key: 'name', header: 'Dependency', render: (d) => d.name, sortValue: (d) => d.name, searchValue: (d) => d.name + ' ' + d.description },
    { key: 'type', header: 'Type', render: (d) => <Chip>{titleCase(d.type)}</Chip>, sortValue: (d) => d.type },
    { key: 'owner', header: 'Downstream owner', render: (d) => nameOf(d.downstreamOwnerId), sortValue: (d) => nameOf(d.downstreamOwnerId) },
    {
      key: 'status',
      header: 'Status',
      render: (d) => <Chip tone={d.status === 'late' ? 'threat' : d.status === 'at-risk' ? 'attention' : d.status === 'delivered' ? 'controlled' : 'neutral'}>{titleCase(d.status)}</Chip>,
      sortValue: (d) => d.status,
    },
    { key: 'criticality', header: 'Criticality', render: (d) => <Chip tone={d.criticality === 'critical' ? 'threat' : 'neutral'}>{titleCase(d.criticality)}</Chip>, sortValue: (d) => d.criticality },
    { key: 'due', header: 'Due', render: (d) => formatDate(d.dueDate), sortValue: (d) => d.dueDate },
    {
      key: 'expected',
      header: 'Expected slip',
      render: (d) => formatNumber(Math.round(analytics.health.dependencies.byId[d.id]?.expectedDelayDays ?? 0)) + 'd',
      sortValue: (d) => analytics.health.dependencies.byId[d.id]?.expectedDelayDays ?? 0,
      align: 'right',
    },
  ];
  const filters: FilterGroup<Dependency>[] = [
    {
      key: 'status',
      label: 'Status',
      options: ['on-track', 'at-risk', 'late', 'delivered', 'cancelled'].map((s) => ({ value: s, label: titleCase(s), match: (d) => d.status === s })),
    },
    {
      key: 'criticality',
      label: 'Criticality',
      options: ['critical', 'high', 'medium', 'low'].map((p) => ({ value: p, label: titleCase(p), match: (d) => d.criticality === p })),
    },
  ];
  return (
    <Panel dense>
      <DataTable rows={rows} columns={columns} filters={filters} onRowClick={(d) => onOpen(d.id)} caption="Dependency register" searchPlaceholder="Search dependencies" />
    </Panel>
  );
}

function toneForTolerance(status: ToleranceStatus): ChipTone {
  return status === 'breach' ? 'threat' : status === 'near' ? 'attention' : 'controlled';
}

function toneForEffectiveness(status: EffectivenessStatus): ChipTone {
  if (status === 'effective') return 'controlled';
  if (status === 'partially-effective' || status === 'underperforming') return 'attention';
  if (status === 'failed') return 'threat';
  return 'neutral';
}

function toneForAcceptance(status: AcceptanceStatus): ChipTone {
  if (status === 'accepted') return 'controlled';
  if (status === 'expired' || status === 'rejected') return 'threat';
  if (status === 'under-review') return 'info';
  return 'neutral';
}

function toneForAging(cls: AgingClass): ChipTone {
  if (cls === 'fresh') return 'controlled';
  if (cls === 'aging') return 'neutral';
  if (cls === 'stale') return 'attention';
  return 'threat';
}

function toneForSeverity(severity: DecisionSeverity): ChipTone {
  return severity === 'critical' ? 'threat' : severity === 'high' ? 'attention' : severity === 'medium' ? 'info' : 'neutral';
}

function RiskDetail({ risk, onNavigate }: { risk: Risk; onNavigate: (id: string) => void }) {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const h = analytics.health;
  const a = h.risk.byId[risk.id];
  const nameOf = (id: string) => analytics.ownerById[id] ?? id;
  const money = (n: number) => formatCurrency(n, program.currency);
  const linkedIssues = program.issues.filter((i) => risk.issueIds.includes(i.id));
  const linkedDeps = program.dependencies.filter((d) => risk.dependencyIds.includes(d.id));
  const linkedControls = program.controls.filter((c) => risk.controlIds.includes(c.id));
  const linkedActions = program.actions.filter((x) => risk.actionIds.includes(x.id));
  const linkedCauses = program.causes.filter((c) => risk.causeIds.includes(c.id));
  const linkedTreatments = program.treatments.filter((t) => t.riskId === risk.id);
  const linkedAcceptances = program.acceptances.filter((acc) => acc.riskId === risk.id);
  const linkedBenefits = program.benefits.filter((b) => risk.affectedBenefitIds.includes(b.id));
  const linkedDecisions = program.decisions.filter((d) => d.linkedRiskIds.includes(risk.id));

  const tolerance = h.tolerance.byId[risk.id];
  const effectiveness = h.treatments.byRiskId[risk.id] ?? [];
  const acceptanceAssessments = h.acceptances.byRiskId[risk.id] ?? [];
  const aging = h.aging.byId[risk.id];
  const systemicByCauseId = useMemo(() => new Map(summariseSystemicRootCauses(program.causes).map((s) => [s.causeId, s])), [program.causes]);
  const queueItem = h.decisionQueue.find((d) => d.riskId === risk.id);

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{risk.description}</p>

      {queueItem && (
        <div className="rounded-md border border-threat/40 bg-threat/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-threat">Decision required</span>
            <Chip tone={toneForSeverity(queueItem.severity)}>
              {titleCase(queueItem.severity)} &middot; {titleCase(queueItem.urgency)}
            </Chip>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-200">{queueItem.problem}</p>
          <p className="mt-1 text-2xs text-ink-400">
            Recommended: {queueItem.recommendedAction}
            {queueItem.deadline ? ' by ' + formatDate(queueItem.deadline) : ''}
          </p>
        </div>
      )}

      <Section title="1. Exposure">
        {a ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Inherent exposure">{money(a.inherentFinancialExposure)}</Field>
              <Field label="Residual exposure">{money(a.residualFinancialExposure)}</Field>
              <Field label="Control effectiveness">{Math.round(a.controlEffectiveness * 100)}%</Field>
              <Field label="Trend">
                {titleCase(a.trend)} ({a.velocity.toFixed(2)} pts/fortnight)
              </Field>
              <Field label="Owner">{nameOf(risk.ownerId)}</Field>
              <Field label="Strategy">{titleCase(risk.strategy)}</Field>
            </div>
            {a.drivers.length > 0 && (
              <div className="mt-3">
                <div className="label mb-1.5">Why this score</div>
                <ul className="space-y-1.5">
                  {a.drivers.map((d) => (
                    <li key={d} className="text-xs text-ink-300">
                      &bull; {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <EmptyState title="This risk has no current assessment." />
        )}
      </Section>

      <Section title="2. Tolerance">
        {tolerance ? (
          <>
            <div className="flex items-center gap-2">
              <Chip tone={toneForTolerance(tolerance.status)}>{tolerance.status.toUpperCase()} TOLERANCE</Chip>
              {tolerance.escalationRequired && <Chip tone="threat">Escalation required</Chip>}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-300">{tolerance.headline}</p>
            <div className="mt-3 space-y-1.5">
              {tolerance.dimensionResults.map((d) => (
                <div key={d.dimension} className="flex items-center justify-between rounded border border-base-600 px-2.5 py-1.5 text-xs">
                  <span className="text-ink-300">{titleCase(d.dimension)}</span>
                  <span className="num text-ink-400">
                    {d.unit === 'currency' ? money(d.value) : Math.round(d.value) + ' ' + d.unit}
                    <span className="mx-1.5 text-ink-600">/</span>
                    near {d.unit === 'currency' ? money(d.nearLimit) : Math.round(d.nearLimit)}, breach {d.unit === 'currency' ? money(d.breachLimit) : Math.round(d.breachLimit)}
                  </span>
                  <Chip tone={toneForTolerance(d.status)}>{titleCase(d.status)}</Chip>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState title="Tolerance is not assessed for a closed risk." />
        )}
      </Section>

      <Section title={'3. Cause / Root Cause (' + linkedCauses.length + ')'}>
        {linkedCauses.length === 0 ? (
          <EmptyState title="No cause is linked to this risk." />
        ) : (
          <div className="space-y-3">
            {linkedCauses.map((c) => {
              const systemic = systemicByCauseId.get(c.id);
              const otherAffected = systemic ? systemic.affectedRiskIds.filter((id) => id !== risk.id) : [];
              const correctiveActions = correctiveActionsForCause(c, program.risks, program.actions);
              return (
                <div key={c.id} className="rounded-md border border-base-500 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-ink-100">{c.title}</span>
                    {c.isRootCause ? <Chip tone="threat">Root cause</Chip> : <Chip tone="neutral">Contributing factor</Chip>}
                  </div>
                  <p className="mt-1 text-2xs text-ink-500">{CATEGORY_LABEL[c.category]}</p>
                  {systemic?.isSystemic && (
                    <p className="mt-1.5 text-2xs text-threat">
                      Systemic &mdash; also affects {otherAffected.length} other risk(s): {otherAffected.join(', ')}
                    </p>
                  )}
                  {c.whyChain.length > 0 && (
                    <ol className="mt-2 space-y-1 border-l border-base-500 pl-3">
                      {c.whyChain.map((why, i) => (
                        <li key={i} className="text-2xs text-ink-400">
                          {i === c.whyChain.length - 1 && c.isRootCause ? <span className="text-threat">Root cause: </span> : i === 0 ? <span className="text-ink-500">Symptom: </span> : null}
                          {why}
                        </li>
                      ))}
                    </ol>
                  )}
                  {correctiveActions.length > 0 && (
                    <div className="mt-2">
                      <div className="label mb-1">Corrective actions</div>
                      {correctiveActions.map((ca) => (
                        <p key={ca.actionId} className="text-2xs text-ink-300">
                          &bull; {ca.ref} {ca.title} &mdash; {titleCase(ca.status)}
                          {ca.viaRiskIds.length > 1 ? ' (shared across ' + ca.viaRiskIds.length + ' risks)' : ''}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="4. Impact">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">{titleCase(risk.category)}</Field>
          <Field label="Inherent probability">{Math.round(risk.inherentProbability * 100)}%</Field>
          <Field label="Inherent impact">{risk.inherentImpact} / 5</Field>
          <Field label="Inherent financial impact">{money(risk.inherentFinancialImpact)}</Field>
          <Field label="Inherent schedule impact">{risk.inherentScheduleImpactDays} days</Field>
          <Field label="Strategic impact">{risk.strategicImpact} / 5</Field>
          <Field label="Reputation impact">{risk.reputationImpact} / 5</Field>
          <Field label="Time horizon">{titleCase(risk.timeHorizon)}</Field>
          <Field label="Evidence confidence">{titleCase(risk.evidenceConfidence)}</Field>
        </div>
      </Section>

      <Section title={'5. Treatment (' + linkedTreatments.length + ')'}>
        {linkedTreatments.length === 0 ? (
          <EmptyState title="No formal treatment plan exists for this risk." />
        ) : (
          <div className="space-y-3">
            {linkedTreatments.map((t) => (
              <div key={t.id} className="rounded-md border border-base-500 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-ink-100">{t.title}</span>
                  <Chip tone="strategic">{titleCase(t.strategy)}</Chip>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-2xs text-ink-400">
                  <span>Owner: {nameOf(t.ownerId)}</span>
                  <span>Status: {titleCase(t.status)}</span>
                  <span>Start: {formatDate(t.startDate)}</span>
                  <span>Target: {formatDate(t.targetDate)}</span>
                  <span>Expected reduction: {Math.round(t.expectedExposureReductionPct * 100)}%</span>
                  <span>Confidence: {titleCase(t.evidenceConfidence)}</span>
                </div>
                {t.notes && <p className="mt-2 text-2xs text-ink-500">{t.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={'6. Controls (' + linkedControls.length + ')'}>
        {linkedControls.length === 0 ? (
          <EmptyState title="No control assigned to this risk." />
        ) : (
          <ul className="space-y-1.5">
            {linkedControls.map((c) => (
              <li key={c.id} className="flex items-center justify-between text-xs text-ink-300">
                <span>{c.name}</span>
                <Chip>{titleCase(c.status)}</Chip>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={'7. Actions (' + linkedActions.length + ')'}>
        {linkedActions.length === 0 ? (
          <EmptyState title="No action is open against this risk." />
        ) : (
          linkedActions.map((act) => (
            <p key={act.id} className="text-xs text-ink-300">
              &bull; {act.title} &mdash; {titleCase(act.status)}, due {formatDate(act.dueDate)}
            </p>
          ))
        )}
      </Section>

      <Section title="8. Response Effectiveness">
        {effectiveness.length === 0 ? (
          <EmptyState title="No treatment has enough evidence to assess yet." />
        ) : (
          <div className="space-y-3">
            {effectiveness.map((e) => (
              <div key={e.treatmentId} className="rounded-md border border-base-500 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-ink-100">{titleCase(e.strategy)}</span>
                  <Chip tone={toneForEffectiveness(e.status)}>{titleCase(e.status)}</Chip>
                </div>
                <p className="mt-1.5 text-2xs leading-relaxed text-ink-300">{e.headline}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-2xs text-ink-400">
                  <span>Baseline: {money(e.baselineExposure)}</span>
                  <span>Expected residual: {money(e.expectedResidual)}</span>
                  <span>Observed residual: {e.observedResidual === null ? 'Not yet measurable' : money(e.observedResidual)}</span>
                  <span>Variance: {e.variance === null ? '--' : (e.variance >= 0 ? '+' : '') + Math.round(e.variance * 100) + 'pp'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="9. Acceptance">
        {linkedAcceptances.length === 0 ? (
          <EmptyState title="This risk has no formal acceptance recorded." />
        ) : (
          <div className="space-y-3">
            {linkedAcceptances.map((acc) => {
              const assessment = acceptanceAssessments.find((x) => x.acceptanceId === acc.id);
              return (
                <div key={acc.id} className="rounded-md border border-base-500 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-ink-100">{acc.ref}</span>
                    {assessment && <Chip tone={toneForAcceptance(assessment.effectiveStatus)}>{titleCase(assessment.effectiveStatus)}</Chip>}
                  </div>
                  {assessment && <p className="mt-1.5 text-2xs leading-relaxed text-ink-300">{assessment.headline}</p>}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-2xs text-ink-400">
                    <span>Approver: {nameOf(acc.approverId)}</span>
                    <span>Approved: {formatDate(acc.approvalDate)}</span>
                    <span>Expires: {formatDate(acc.expiryDate)}</span>
                    <span>Review: {formatDate(acc.reviewDate)}</span>
                  </div>
                  <p className="mt-2 text-2xs text-ink-500">{acc.rationale}</p>
                  {acc.conditions.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {acc.conditions.map((cond, i) => (
                        <li key={i} className="text-2xs text-ink-500">
                          &bull; {cond}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="10. Reassessment">
        {aging ? (
          <>
            <div className="flex items-center gap-2">
              <Chip tone={toneForAging(aging.agingClass)}>{titleCase(aging.agingClass)}</Chip>
              {aging.reassessmentOverdue ? (
                <Chip tone="threat">Reassessment overdue</Chip>
              ) : aging.reassessmentDue ? (
                <Chip tone="attention">Reassessment due</Chip>
              ) : null}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-300">{aging.headline}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Last assessed">{formatDate(aging.lastAssessmentDate)}</Field>
              <Field label="Next due">{formatDate(aging.nextAssessmentDate)}</Field>
              <Field label="Frequency">{titleCase(aging.reassessmentFrequency)}</Field>
              <Field label="Days since last assessment">{aging.daysSinceLastAssessment}</Field>
              <Field label="Last action">{aging.lastActionDate ? formatDate(aging.lastActionDate) : '--'}</Field>
              <Field label="Last evidence">{aging.lastEvidenceDate ? formatDate(aging.lastEvidenceDate) : '--'}</Field>
              {aging.treatmentAgeDays !== null && <Field label="Treatment age">{aging.treatmentAgeDays} days</Field>}
            </div>
          </>
        ) : (
          <EmptyState title="Aging is not tracked for a closed risk." />
        )}
      </Section>

      <Section title={'11. Dependencies (' + linkedDeps.length + ')'}>
        {linkedDeps.length === 0 ? (
          <EmptyState title="No dependency is linked to this risk." />
        ) : (
          linkedDeps.map((d) => (
            <button key={d.id} type="button" onClick={() => onNavigate(d.id)} className="block text-xs text-info hover:underline">
              {d.ref} {d.name}
            </button>
          ))
        )}
      </Section>

      <Section title={'12. Benefits (' + linkedBenefits.length + ')'}>
        {linkedBenefits.length === 0 ? (
          <EmptyState title="No benefit is threatened by this risk." />
        ) : (
          <div className="space-y-2">
            {linkedBenefits.map((b) => {
              const ba = h.benefits.byId[b.id];
              return (
                <Link key={b.id} to={'/benefits?focus=' + b.id} className="block rounded-md border border-base-500 p-2.5 hover:border-base-400">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-ink-100">{b.name}</span>
                    {ba && <Chip tone={ba.valueAtRisk > 0 ? 'attention' : 'neutral'}>{money(ba.valueAtRisk)} at risk</Chip>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      <Section title={'13. Decision History (' + linkedDecisions.length + ')'}>
        {linkedDecisions.length === 0 ? (
          <EmptyState title="No formal decision has been logged against this risk." />
        ) : (
          <div className="space-y-1.5">
            {linkedDecisions.map((d) => (
              <Link key={d.id} to={'/decisions?focus=' + d.id} className="flex items-center justify-between gap-2 rounded px-1.5 py-1 text-xs text-ink-200 hover:bg-base-700/60">
                <span>
                  {d.ref} {d.title}
                </span>
                <Chip tone={d.status === 'decided' ? 'controlled' : d.status === 'reversed' ? 'threat' : 'neutral'}>{titleCase(d.status)}</Chip>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {linkedIssues.length > 0 && (
        <Section title="Materialised as">
          {linkedIssues.map((i) => (
            <button key={i.id} type="button" onClick={() => onNavigate(i.id)} className="block text-xs text-info hover:underline">
              {i.ref} {i.title}
            </button>
          ))}
        </Section>
      )}

      {risk.affectedMilestoneIds.length > 0 && (
        <Section title="Threatens">
          <div className="flex flex-wrap gap-1.5">
            {risk.affectedMilestoneIds.map((id) => (
              <Chip key={id} tone="attention">
                {analytics.milestoneById[id] ?? id}
              </Chip>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function AssumptionDetail({ assumption, onNavigate }: { assumption: Assumption; onNavigate: (id: string) => void }) {
  const analytics = useStore((s) => s.analytics);
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{assumption.statement}</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Owner">{analytics.ownerById[assumption.ownerId] ?? assumption.ownerId}</Field>
        <Field label="Confidence">{titleCase(assumption.confidence)}</Field>
        <Field label="Status">{titleCase(assumption.status)}</Field>
        <Field label="Validation date">{formatDate(assumption.validationDate)}</Field>
      </div>
      {assumption.note && (
        <Section title="Note">
          <p className="text-xs text-ink-300">{assumption.note}</p>
        </Section>
      )}
      {assumption.riskIfFalseId && (
        <Section title="If this proves false">
          <button type="button" onClick={() => onNavigate(assumption.riskIfFalseId as string)} className="text-xs text-info hover:underline">
            {assumption.riskIfFalseId.toUpperCase()} is raised
          </button>
        </Section>
      )}
      {assumption.linkedMilestoneIds.length > 0 && (
        <Section title="Depends on this holding">
          <div className="flex flex-wrap gap-1.5">
            {assumption.linkedMilestoneIds.map((id) => (
              <Chip key={id}>{analytics.milestoneById[id] ?? id}</Chip>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function IssueDetail({ issue, onNavigate }: { issue: Issue; onNavigate: (id: string) => void }) {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const money = (n: number) => formatCurrency(n, program.currency);
  const linkedActions = program.actions.filter((a) => issue.actionIds.includes(a.id));
  const linkedCauses = program.causes.filter((c) => issue.causeIds.includes(c.id));
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{issue.description}</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Owner">{analytics.ownerById[issue.ownerId] ?? issue.ownerId}</Field>
        <Field label="Priority">{titleCase(issue.priority)}</Field>
        <Field label="Realised cost">{money(issue.actualCostImpact)}</Field>
        <Field label="Days lost">{issue.actualScheduleImpactDays}</Field>
        <Field label="Raised">{formatDate(issue.dateRaised)}</Field>
        <Field label="Target resolution">{formatDate(issue.targetResolution)}</Field>
      </div>
      {issue.originRiskId && (
        <Section title="Materialised from">
          <button type="button" onClick={() => onNavigate(issue.originRiskId as string)} className="text-xs text-info hover:underline">
            {issue.originRiskId.toUpperCase()}
          </button>
        </Section>
      )}
      {linkedCauses.length > 0 && (
        <Section title="Root causes">
          {linkedCauses.map((c) => (
            <p key={c.id} className="text-xs text-ink-300">
              &bull; {c.title}
            </p>
          ))}
        </Section>
      )}
      {linkedActions.length > 0 && (
        <Section title="Actions">
          {linkedActions.map((a) => (
            <p key={a.id} className="text-xs text-ink-300">
              &bull; {a.title} &mdash; {titleCase(a.status)}
            </p>
          ))}
        </Section>
      )}
    </div>
  );
}

function DependencyDetail({ dependency, onNavigate }: { dependency: Dependency; onNavigate: (id: string) => void }) {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const a = analytics.health.dependencies.byId[dependency.id];
  const linkedRisks = program.risks.filter((r) => dependency.linkedRiskIds.includes(r.id));
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{dependency.description}</p>
      {a && <p className="rounded-md border border-base-500 bg-base-700/50 p-3 text-xs leading-relaxed text-ink-200">{a.narrative}</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Upstream">{dependency.upstream}</Field>
        <Field label="Downstream">{dependency.downstream}</Field>
        <Field label="Due">{formatDate(dependency.dueDate)}</Field>
        <Field label="Delay probability">{Math.round(dependency.delayProbability * 100)}%</Field>
        <Field label="Potential delay">{dependency.potentialDelayDays} days</Field>
        <Field label="Criticality">{titleCase(dependency.criticality)}</Field>
      </div>
      {linkedRisks.length > 0 && (
        <Section title="Linked risks">
          {linkedRisks.map((r) => (
            <button key={r.id} type="button" onClick={() => onNavigate(r.id)} className="block text-xs text-info hover:underline">
              {r.ref} {r.title}
            </button>
          ))}
        </Section>
      )}
      {dependency.affectedMilestoneIds.length > 0 && (
        <Section title="Affected milestones">
          <div className="flex flex-wrap gap-1.5">
            {dependency.affectedMilestoneIds.map((id) => (
              <Chip key={id} tone="attention">
                {analytics.milestoneById[id] ?? id}
              </Chip>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

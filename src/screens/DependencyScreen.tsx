import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/state/store';
import { simulateSlip } from '@/domain/engines/dependencyEngine';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat, EmptyState } from '@/ui/primitives';
import { DataTable, type Column, type FilterGroup } from '@/ui/DataTable';
import { SlideOver, Section, Field } from '@/ui/SlideOver';
import { useFocusParam } from '@/ui/useFocusParam';
import { formatCurrency, formatNumber, formatPercent, titleCase } from '@/lib/format';
import { formatDate } from '@/lib/dates';
import { ROUTES } from '@/nav';
import type { Dependency } from '@/domain/types';

const meta = ROUTES.find((r) => r.code === '07')!;

export function DependencyScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const [focus, setFocus] = useFocusParam();
  const summary = analytics.health.dependencies;
  const dependency = program.dependencies.find((d) => d.id === focus);
  const money = (n: number) => formatCurrency(n, program.currency);

  const chainDeps = summary.criticalChain.dependencyIds.map((id) => program.dependencies.find((d) => d.id === id)).filter(Boolean) as Dependency[];

  const columns: Column<Dependency>[] = useMemo(
    () => [
      { key: 'ref', header: 'ID', render: (d) => <span className="num text-2xs text-ink-500">{d.ref}</span>, width: '4.5rem' },
      { key: 'name', header: 'Dependency', render: (d) => d.name, sortValue: (d) => d.name, searchValue: (d) => d.name + ' ' + d.description + ' ' + d.upstream + ' ' + d.downstream },
      { key: 'upstream', header: 'Upstream', render: (d) => d.upstream, sortValue: (d) => d.upstream, optional: true },
      { key: 'downstream', header: 'Downstream', render: (d) => d.downstream, sortValue: (d) => d.downstream },
      { key: 'type', header: 'Type', render: (d) => <Chip>{titleCase(d.type)}</Chip>, sortValue: (d) => d.type },
      {
        key: 'status',
        header: 'Status',
        render: (d) => (
          <Chip tone={d.status === 'late' ? 'threat' : d.status === 'at-risk' ? 'attention' : d.status === 'delivered' ? 'controlled' : 'neutral'}>{titleCase(d.status)}</Chip>
        ),
        sortValue: (d) => d.status,
      },
      { key: 'criticality', header: 'Criticality', render: (d) => <Chip tone={d.criticality === 'critical' ? 'threat' : 'neutral'}>{titleCase(d.criticality)}</Chip>, sortValue: (d) => d.criticality },
      { key: 'due', header: 'Due', render: (d) => formatDate(d.dueDate), sortValue: (d) => d.dueDate },
      {
        key: 'expected',
        header: 'Expected slip',
        render: (d) => formatNumber(Math.round(summary.byId[d.id]?.expectedDelayDays ?? 0)) + 'd',
        sortValue: (d) => summary.byId[d.id]?.expectedDelayDays ?? 0,
        align: 'right',
      },
      {
        key: 'chain',
        header: 'Critical chain',
        render: (d) => (summary.byId[d.id]?.isOnCriticalChain ? <Chip tone="strategic">On chain</Chip> : ''),
        sortValue: (d) => (summary.byId[d.id]?.isOnCriticalChain ? 1 : 0),
      },
    ],
    [summary],
  );

  const filters: FilterGroup<Dependency>[] = [
    {
      key: 'status',
      label: 'Status',
      options: ['on-track', 'at-risk', 'late', 'delivered', 'cancelled'].map((s) => ({ value: s, label: titleCase(s), match: (d) => d.status === s })),
    },
    {
      key: 'type',
      label: 'Type',
      options: ['internal', 'external', 'vendor', 'regulatory', 'cross-program'].map((t) => ({ value: t, label: titleCase(t), match: (d) => d.type === t })),
    },
    {
      key: 'criticality',
      label: 'Criticality',
      options: ['critical', 'high', 'medium', 'low'].map((p) => ({ value: p, label: titleCase(p), match: (d) => d.criticality === p })),
    },
  ];

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Dependencies" value={summary.total} hint={summary.atRisk + ' at risk, ' + summary.late + ' late'} tone="threat" />
        <Stat label="Critical, open" value={summary.criticalOpen} tone="attention" />
        <Stat label="Expected slip (all open)" value={formatNumber(summary.totalExpectedDelayDays) + ' days'} tone="strategic" />
        <Stat label="Benefit value at risk" value={money(summary.benefitValueAtRisk)} tone="info" />
      </div>

      <Panel
        title="Critical dependency chain"
        subtitle="The predecessor path carrying the most probability-weighted slip, not simply the longest chain by number of links."
        className="mb-4"
      >
        {chainDeps.length === 0 ? (
          <EmptyState title="No dependency chain carries meaningful expected delay." />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {chainDeps.map((d, i) => (
                <div key={d.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFocus(d.id)}
                    className="rounded-md border border-strategic/40 bg-strategic/10 px-3 py-2 text-left hover:bg-strategic/20"
                  >
                    <div className="num text-2xs text-ink-500">{d.ref}</div>
                    <div className="max-w-[11rem] truncate text-xs text-ink-100">{d.name}</div>
                  </button>
                  {i < chainDeps.length - 1 && <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-500" />}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-300">
              {summary.criticalChain.dependencyIds.length} links, {summary.criticalChain.totalExpectedDelayDays} probability-weighted days of expected slip,
              threatening {summary.criticalChain.terminalMilestoneIds.map((id) => analytics.milestoneById[id] ?? id).join(', ') || 'no specific milestone'} and{' '}
              {money(summary.criticalChain.benefitValueAtRisk)} of benefit.
            </p>
          </>
        )}
      </Panel>

      <Panel dense subtitle="Every row states in plain language what a slip would mean, not just its raw fields.">
        <DataTable
          rows={program.dependencies}
          columns={columns}
          filters={filters}
          onRowClick={(d) => setFocus(d.id)}
          caption="Dependency register"
          searchPlaceholder="Search dependencies"
          initialSort={{ key: 'expected', direction: 'desc' }}
        />
      </Panel>

      <SlideOver open={Boolean(dependency)} onClose={() => setFocus(null)} title={dependency ? dependency.ref + '  ' + dependency.name : ''} width="wider">
        {dependency && <DependencyDeepDive dependency={dependency} />}
      </SlideOver>
    </>
  );
}

function DependencyDeepDive({ dependency }: { dependency: Dependency }) {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const a = analytics.health.dependencies.byId[dependency.id];
  const money = (n: number) => formatCurrency(n, program.currency);
  const [slip, setSlip] = useState(Math.max(7, dependency.potentialDelayDays));
  const impact = useMemo(() => simulateSlip(program, dependency.id, slip), [program, dependency.id, slip]);

  const linkedRisks = program.risks.filter((r) => dependency.linkedRiskIds.includes(r.id));

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{dependency.description}</p>

      {a && <p className="rounded-md border border-base-500 bg-base-700/50 p-3 text-xs leading-relaxed text-ink-200">{a.narrative}</p>}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Upstream">{dependency.upstream}</Field>
        <Field label="Downstream">{dependency.downstream}</Field>
        <Field label="Due">{formatDate(dependency.dueDate)}</Field>
        <Field label="Delay probability">{formatPercent(dependency.delayProbability, 0)}</Field>
        <Field label="Potential delay">{dependency.potentialDelayDays} days</Field>
        <Field label="Chain depth">{a?.chainDepth ?? 1}</Field>
      </div>

      <Section title="What if this slips?">
        <label className="flex items-center justify-between text-2xs text-ink-400" htmlFor="slip-days">
          <span>Simulated slip</span>
          <span className="num text-ink-100">{slip} days</span>
        </label>
        <input
          id="slip-days"
          type="range"
          min={1}
          max={60}
          value={slip}
          onChange={(e) => setSlip(Number(e.target.value))}
          className="mt-2 w-full accent-threat"
          aria-valuetext={slip + ' days'}
        />
        {impact && (
          <div className="mt-3 space-y-3">
            <p className="text-xs leading-relaxed text-ink-200">{impact.narrative}</p>
            {impact.directMilestones.length > 0 && (
              <div>
                <div className="label mb-1.5">Directly affected milestones</div>
                <ul className="space-y-1">
                  {impact.directMilestones.map((m) => (
                    <li key={m.id} className="flex items-center justify-between text-xs text-ink-300">
                      <span>{m.name}</span>
                      <span className="num text-attention">+{m.slip}d</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {impact.benefitsThreatened.length > 0 && (
              <div>
                <div className="label mb-1.5">Benefits threatened</div>
                <ul className="space-y-1">
                  {impact.benefitsThreatened.map((b) => (
                    <li key={b.id} className="flex items-center justify-between text-xs text-ink-300">
                      <span>{b.name}</span>
                      <span className="num text-threat">{money(b.unrealised)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Section>

      {linkedRisks.length > 0 && (
        <Section title="Linked risks">
          {linkedRisks.map((r) => (
            <p key={r.id} className="text-xs text-ink-300">
              &bull; {r.ref} {r.title}
            </p>
          ))}
        </Section>
      )}
    </div>
  );
}

import { useMemo } from 'react';
import { useStore } from '@/state/store';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat, Meter, EmptyState } from '@/ui/primitives';
import { DataTable, type Column, type FilterGroup } from '@/ui/DataTable';
import { SlideOver, Section, Field } from '@/ui/SlideOver';
import { useFocusParam } from '@/ui/useFocusParam';
import { formatCurrency, formatNumber, formatPercent, titleCase } from '@/lib/format';
import { formatDate } from '@/lib/dates';
import { ROUTE_BY_PATH } from '@/nav';
import type { Decision } from '@/domain/types';

const meta = ROUTE_BY_PATH['/decisions'];

export function DecisionScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const [focus, setFocus] = useFocusParam();
  const summary = analytics.health.decisions;
  const decision = program.decisions.find((d) => d.id === focus);

  const columns: Column<Decision>[] = useMemo(
    () => [
      { key: 'ref', header: 'ID', render: (d) => <span className="num text-2xs text-ink-500">{d.ref}</span>, width: '4.5rem' },
      { key: 'title', header: 'Decision', render: (d) => d.title, sortValue: (d) => d.title, searchValue: (d) => d.title + ' ' + d.context },
      { key: 'forum', header: 'Forum', render: (d) => d.forum, sortValue: (d) => d.forum, optional: true },
      { key: 'status', header: 'Status', render: (d) => <Chip tone={summary.byId[d.id]?.isOverdue ? 'threat' : d.status === 'decided' ? 'controlled' : 'attention'}>{titleCase(d.status)}</Chip>, sortValue: (d) => d.status },
      { key: 'options', header: 'Options', render: (d) => d.options.length, sortValue: (d) => d.options.length, align: 'right' },
      {
        key: 'quality',
        header: 'Process quality',
        render: (d) => {
          const q = summary.byId[d.id]?.processQuality ?? 0;
          return (
            <div className="flex items-center gap-2">
              <Meter value={q} max={100} tone={q >= 70 ? 'controlled' : q >= 45 ? 'attention' : 'threat'} className="w-16" label="Process quality" />
              <span className="num text-2xs text-ink-300">{Math.round(q)}</span>
            </div>
          );
        },
        sortValue: (d) => summary.byId[d.id]?.processQuality ?? 0,
      },
      {
        key: 'outcome',
        header: 'Outcome',
        render: (d) => (d.outcomeScore ? d.outcomeScore + ' / 5' : d.status === 'decided' ? 'Pending review' : '--'),
        sortValue: (d) => d.outcomeScore ?? -1,
      },
      { key: 'required', header: 'Required by', render: (d) => formatDate(d.dateRequired), sortValue: (d) => d.dateRequired, optional: true },
    ],
    [summary],
  );

  const filters: FilterGroup<Decision>[] = [
    {
      key: 'status',
      label: 'Status',
      options: ['required', 'scheduled', 'decided', 'reversed', 'superseded'].map((s) => ({ value: s, label: titleCase(s), match: (d) => d.status === s })),
    },
  ];

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Decisions required" value={summary.required} hint={summary.overdue + ' overdue'} tone="threat" />
        <Stat label="Average process quality" value={Math.round(summary.averageProcessQuality)} tone="info" />
        <Stat label="Average days to decide" value={formatNumber(Math.round(summary.averageDaysToDecide))} tone="attention" />
        <Stat label="Good outcome rate" value={formatPercent(summary.goodOutcomeRate, 0)} hint={summary.reviewedCount + ' reviewed'} tone="controlled" />
      </div>

      <Panel dense subtitle="Process quality is scored independently of outcome: a good decision with a bad outcome is not the same failure as a rushed one.">
        <DataTable rows={program.decisions} columns={columns} filters={filters} onRowClick={(d) => setFocus(d.id)} caption="Decision log" searchPlaceholder="Search decisions" initialSort={{ key: 'required', direction: 'asc' }} />
      </Panel>

      <SlideOver open={Boolean(decision)} onClose={() => setFocus(null)} title={decision ? decision.ref + '  ' + decision.title : ''} width="wider">
        {decision && <DecisionDetail decision={decision} />}
      </SlideOver>
    </>
  );
}

function DecisionDetail({ decision }: { decision: Decision }) {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const a = analytics.health.decisions.byId[decision.id];
  const money = (n: number) => formatCurrency(n, program.currency);

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{decision.context}</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Owner">{analytics.ownerById[decision.ownerId] ?? decision.ownerId}</Field>
        <Field label="Decision maker">{analytics.ownerById[decision.decisionMakerId] ?? decision.decisionMakerId}</Field>
        <Field label="Forum">{decision.forum}</Field>
        <Field label="Required by">{formatDate(decision.dateRequired)}</Field>
      </div>

      <Section title={'Options considered (' + decision.options.length + ')'}>
        {decision.options.length === 0 ? (
          <EmptyState title="No option is recorded." />
        ) : (
          <div className="space-y-2">
            {decision.options.map((o) => (
              <div
                key={o.id}
                className={
                  'rounded-md border p-3 ' + (o.id === decision.chosenOptionId ? 'border-strategic/50 bg-strategic/10' : 'border-base-500')
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-ink-100">{o.label}</span>
                  {o.id === decision.chosenOptionId && <Chip tone="strategic">Chosen</Chip>}
                </div>
                <p className="mt-1 text-2xs text-ink-500">
                  {money(o.estimatedCost)} &middot; {o.estimatedScheduleDays} days
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <div className="label mb-1">Pros</div>
                    {o.pros.map((p) => (
                      <p key={p} className="text-2xs text-controlled">+ {p}</p>
                    ))}
                  </div>
                  <div>
                    <div className="label mb-1">Cons</div>
                    {o.cons.map((c) => (
                      <p key={c} className="text-2xs text-threat">- {c}</p>
                    ))}
                  </div>
                </div>
                {o.residualRiskNote && <p className="mt-2 text-2xs text-ink-400">Residual risk: {o.residualRiskNote}</p>}
              </div>
            ))}
          </div>
        )}
      </Section>

      {decision.rationale && (
        <Section title="Rationale">
          <p className="text-xs leading-relaxed text-ink-300">{decision.rationale}</p>
        </Section>
      )}

      <Section title="Expected against actual outcome">
        <Field label="Expected outcome">{decision.expectedOutcome}</Field>
        <div className="mt-3">
          {decision.actualOutcome ? (
            <>
              <Field label="Actual outcome">{decision.actualOutcome}</Field>
              {decision.outcomeScore && <p className="mt-2 text-2xs text-ink-400">Self-assessed {decision.outcomeScore} / 5 at review.</p>}
            </>
          ) : (
            <p className="text-2xs text-ink-500">
              {decision.reviewDate ? 'Review due ' + formatDate(decision.reviewDate) + '. Outcome not yet recorded.' : 'No review date has been set.'}
            </p>
          )}
        </div>
      </Section>

      {a && a.drivers.length > 0 && (
        <Section title="Decision quality flags">
          <ul className="space-y-1.5">
            {a.drivers.map((d) => (
              <li key={d} className="text-xs text-ink-300">
                &bull; {d}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {decision.evidence.length > 0 && (
        <Section title="Evidence">
          {decision.evidence.map((e) => (
            <p key={e.id} className="text-xs text-ink-300">
              &bull; {e.label} ({titleCase(e.confidence)})
            </p>
          ))}
        </Section>
      )}
    </div>
  );
}

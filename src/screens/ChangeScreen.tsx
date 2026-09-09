import { useMemo, useState } from 'react';
import { ArrowUpCircle, Check, Clock, X } from 'lucide-react';
import { useStore } from '@/state/store';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat } from '@/ui/primitives';
import { DataTable, type Column, type FilterGroup } from '@/ui/DataTable';
import { SlideOver, Section, Field } from '@/ui/SlideOver';
import { useFocusParam } from '@/ui/useFocusParam';
import { formatCurrency, titleCase } from '@/lib/format';
import { formatDate } from '@/lib/dates';
import { ROUTE_BY_PATH } from '@/nav';
import type { ChangeDecision, ChangeRequest } from '@/domain/types';

const meta = ROUTE_BY_PATH['/change'];

export function ChangeScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const [focus, setFocus] = useFocusParam();
  const summary = analytics.health.changes;
  const change = program.changes.find((c) => c.id === focus);
  const money = (n: number) => formatCurrency(n, program.currency);

  const columns: Column<ChangeRequest>[] = useMemo(
    () => [
      { key: 'ref', header: 'ID', render: (c) => <span className="num text-2xs text-ink-500">{c.ref}</span>, width: '4.5rem' },
      { key: 'title', header: 'Change', render: (c) => c.title, sortValue: (c) => c.title, searchValue: (c) => c.title + ' ' + c.description + ' ' + c.reason },
      { key: 'requester', header: 'Requester', render: (c) => analytics.ownerById[c.requesterId] ?? c.requesterId, sortValue: (c) => analytics.ownerById[c.requesterId] ?? '' },
      { key: 'cost', header: 'Cost impact', render: (c) => money(c.costImpact), sortValue: (c) => c.costImpact, align: 'right' },
      { key: 'schedule', header: 'Schedule', render: (c) => (c.scheduleImpactDays >= 0 ? '+' : '') + c.scheduleImpactDays + 'd', sortValue: (c) => c.scheduleImpactDays, align: 'right' },
      { key: 'benefit', header: 'Benefit impact', render: (c) => money(c.benefitImpact), sortValue: (c) => c.benefitImpact, align: 'right', optional: true },
      {
        key: 'decision',
        header: 'Decision',
        render: (c) => (
          <Chip tone={c.decision === 'approved' ? 'controlled' : c.decision === 'rejected' ? 'threat' : c.decision === 'escalated' ? 'strategic' : 'attention'}>
            {titleCase(c.decision)}
          </Chip>
        ),
        sortValue: (c) => c.decision,
      },
      { key: 'status', header: 'Status', render: (c) => <Chip>{titleCase(c.status)}</Chip>, sortValue: (c) => c.status, optional: true },
      {
        key: 'steerco',
        header: 'Authority',
        render: (c) => (analytics.health.changes.byId[c.id]?.requiresSteerCo ? <Chip tone="strategic">SteerCo</Chip> : 'Programme'),
        sortValue: (c) => (analytics.health.changes.byId[c.id]?.requiresSteerCo ? 1 : 0),
      },
    ],
    [analytics, money],
  );

  const filters: FilterGroup<ChangeRequest>[] = [
    {
      key: 'decision',
      label: 'Decision',
      options: ['pending', 'approved', 'rejected', 'deferred', 'escalated'].map((d) => ({ value: d, label: titleCase(d), match: (c) => c.decision === d })),
    },
  ];

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Pending decisions" value={summary.pending} hint={summary.escalated + ' escalated, ' + summary.staleCount + ' stale'} tone="attention" />
        <Stat label="Pending cost exposure" value={money(summary.pendingCostExposure)} tone="threat" />
        <Stat label="Approved cost committed" value={money(summary.approvedCostImpact)} hint={(summary.budgetErosionPct * 100).toFixed(1) + '% of budget'} tone="strategic" />
        <Stat label="Requires steering committee" value={summary.steerCoCount} tone="info" />
      </div>

      <Panel dense subtitle="Approve, reject, defer or escalate from the detail panel. Six impact axes are recorded on every change, not just cost.">
        <DataTable
          rows={program.changes}
          columns={columns}
          filters={filters}
          onRowClick={(c) => setFocus(c.id)}
          caption="Change register"
          searchPlaceholder="Search changes"
          initialSort={{ key: 'cost', direction: 'desc' }}
        />
      </Panel>

      <SlideOver open={Boolean(change)} onClose={() => setFocus(null)} title={change ? change.ref + '  ' + change.title : ''} width="wider">
        {change && <ChangeDetail change={change} />}
      </SlideOver>
    </>
  );
}

function ChangeDetail({ change }: { change: ChangeRequest }) {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const decideChange = useStore((s) => s.decideChange);
  const a = analytics.health.changes.byId[change.id];
  const money = (n: number) => formatCurrency(n, program.currency);
  const [rationale, setRationale] = useState(change.decisionRationale ?? '');
  const linkedRisks = program.risks.filter((r) => change.linkedRiskIds.includes(r.id));

  const act = (decision: ChangeDecision) => decideChange(change.id, decision, program.programManager || 'Programme Manager', rationale);

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{change.description}</p>
      <div>
        <div className="label mb-1">Reason</div>
        <p className="text-xs text-ink-300">{change.reason}</p>
      </div>

      <Section title="Impact">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Scope">{change.scopeImpact}</Field>
          <Field label="Resource">{change.resourceImpact}</Field>
          <Field label="Cost">{money(change.costImpact)}</Field>
          <Field label="Schedule">{(change.scheduleImpactDays >= 0 ? '+' : '') + change.scheduleImpactDays + ' days'}</Field>
          <Field label="Risk">{change.riskImpact}</Field>
          <Field label="Benefit">{money(change.benefitImpact)}</Field>
        </div>
      </Section>

      {a && (
        <Section title="Why this needs attention">
          <ul className="space-y-1.5">
            {a.drivers.map((d) => (
              <li key={d} className="text-xs text-ink-300">
                &bull; {d}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(change.affectedWorkstreamIds.length > 0 || change.affectedMilestoneIds.length > 0 || change.affectedDependencyIds.length > 0 || change.affectedBenefitIds.length > 0) && (
        <Section title="Reach">
          <div className="flex flex-wrap gap-1.5">
            {change.affectedMilestoneIds.map((id) => (
              <Chip key={id} tone="attention">{analytics.milestoneById[id] ?? id}</Chip>
            ))}
            {change.affectedBenefitIds.map((id) => (
              <Chip key={id} tone="info">benefit {id}</Chip>
            ))}
            {change.affectedDependencyIds.map((id) => (
              <Chip key={id}>{id}</Chip>
            ))}
          </div>
        </Section>
      )}

      {linkedRisks.length > 0 && (
        <Section title="Linked risks">
          {linkedRisks.map((r) => (
            <p key={r.id} className="text-xs text-ink-300">
              &bull; {r.ref} {r.title}
            </p>
          ))}
        </Section>
      )}

      <Section title="Decision">
        <div className="mb-2 flex items-center gap-2">
          <Chip tone={change.decision === 'approved' ? 'controlled' : change.decision === 'rejected' ? 'threat' : change.decision === 'escalated' ? 'strategic' : 'attention'}>
            Currently {titleCase(change.decision)}
          </Chip>
          {change.decisionDate && <span className="text-2xs text-ink-500">on {formatDate(change.decisionDate)}</span>}
        </div>
        <label htmlFor="change-rationale" className="label mb-1 block">
          Rationale
        </label>
        <textarea
          id="change-rationale"
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          rows={2}
          className="input w-full resize-none"
          placeholder="Record why this decision was made"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => act('approved')} className="btn btn-primary">
            <Check aria-hidden="true" className="h-3.5 w-3.5" /> Approve
          </button>
          <button type="button" onClick={() => act('rejected')} className="btn btn-danger">
            <X aria-hidden="true" className="h-3.5 w-3.5" /> Reject
          </button>
          <button type="button" onClick={() => act('deferred')} className="btn">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" /> Defer
          </button>
          <button type="button" onClick={() => act('escalated')} className="btn">
            <ArrowUpCircle aria-hidden="true" className="h-3.5 w-3.5" /> Escalate
          </button>
        </div>
      </Section>
    </div>
  );
}

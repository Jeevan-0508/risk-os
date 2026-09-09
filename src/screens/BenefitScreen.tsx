import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '@/state/store';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat, Meter, EmptyState } from '@/ui/primitives';
import { DataTable, type Column, type FilterGroup } from '@/ui/DataTable';
import { SlideOver, Section, Field } from '@/ui/SlideOver';
import { useFocusParam } from '@/ui/useFocusParam';
import { chartTheme, tooltipStyle } from '@/ui/chart';
import { formatCurrency, formatPercent, titleCase } from '@/lib/format';
import { formatDate, formatMonthLabel } from '@/lib/dates';
import { ROUTE_BY_PATH } from '@/nav';
import type { Benefit } from '@/domain/types';
import type { BenefitAssessment } from '@/domain/engines/benefitEngine';

const meta = ROUTE_BY_PATH['/benefits'];

const STATUS_TONE: Record<Benefit['status'], 'threat' | 'attention' | 'controlled' | 'info' | 'neutral'> = {
  'not-started': 'neutral',
  'in-progress': 'info',
  'partially-realised': 'attention',
  realised: 'controlled',
  'at-risk': 'threat',
  lost: 'threat',
};

const CONFIDENCE_TONE: Record<BenefitAssessment['confidence'], 'threat' | 'attention' | 'controlled'> = {
  high: 'controlled',
  medium: 'attention',
  low: 'threat',
};

export function BenefitScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const [focus, setFocus] = useFocusParam();
  const summary = analytics.health.benefits;
  const benefit = program.benefits.find((b) => b.id === focus);
  const money = (n: number) => formatCurrency(n, program.currency);

  const curveSeries = analytics.benefitCurve.map((p) => ({
    date: formatMonthLabel(p.date),
    expected: Math.round(p.expected),
    realised: Math.round(p.realised),
  }));

  const columns: Column<Benefit>[] = useMemo(
    () => [
      { key: 'ref', header: 'ID', render: (b) => <span className="num text-2xs text-ink-500">{b.ref}</span>, width: '4.5rem' },
      {
        key: 'name',
        header: 'Benefit',
        render: (b) => b.name,
        sortValue: (b) => b.name,
        searchValue: (b) => b.name + ' ' + b.description + ' ' + b.measure,
      },
      { key: 'type', header: 'Type', render: (b) => <Chip>{titleCase(b.type)}</Chip>, sortValue: (b) => b.type, optional: true },
      { key: 'owner', header: 'Owner', render: (b) => analytics.ownerById[b.ownerId] ?? b.ownerId, sortValue: (b) => analytics.ownerById[b.ownerId] ?? '', optional: true },
      { key: 'expected', header: 'Expected', render: (b) => money(b.expectedValue), sortValue: (b) => b.expectedValue, align: 'right' },
      { key: 'realised', header: 'Realised', render: (b) => money(b.realisedValue), sortValue: (b) => b.realisedValue, align: 'right' },
      {
        key: 'pct',
        header: 'Realisation',
        render: (b) => <Meter value={summary.byId[b.id]?.realisationPct ?? 0} tone={STATUS_TONE[b.status] === 'threat' ? 'threat' : 'controlled'} />,
        sortValue: (b) => summary.byId[b.id]?.realisationPct ?? 0,
      },
      {
        key: 'confidence',
        header: 'Confidence',
        render: (b) => <Chip tone={CONFIDENCE_TONE[summary.byId[b.id]?.confidence ?? 'medium']}>{titleCase(summary.byId[b.id]?.confidence ?? 'medium')}</Chip>,
        sortValue: (b) => summary.byId[b.id]?.confidence ?? '',
      },
      { key: 'target', header: 'Target date', render: (b) => formatDate(b.targetDate), sortValue: (b) => b.targetDate, optional: true },
      { key: 'status', header: 'Status', render: (b) => <Chip tone={STATUS_TONE[b.status]}>{titleCase(b.status)}</Chip>, sortValue: (b) => b.status },
    ],
    [summary, analytics.ownerById],
  );

  const filters: FilterGroup<Benefit>[] = [
    {
      key: 'status',
      label: 'Status',
      options: (['not-started', 'in-progress', 'partially-realised', 'realised', 'at-risk', 'lost'] as Benefit['status'][]).map((s) => ({
        value: s,
        label: titleCase(s),
        match: (b) => b.status === s,
      })),
    },
    {
      key: 'type',
      label: 'Type',
      options: (['financial', 'efficiency', 'risk-reduction', 'compliance', 'customer', 'strategic'] as Benefit['type'][]).map((t) => ({
        value: t,
        label: titleCase(t),
        match: (b) => b.type === t,
      })),
    },
    {
      key: 'confidence',
      label: 'Confidence',
      options: (['high', 'medium', 'low'] as BenefitAssessment['confidence'][]).map((c) => ({
        value: c,
        label: titleCase(c),
        match: (b) => summary.byId[b.id]?.confidence === c,
      })),
    },
  ];

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Expected benefit" value={money(summary.totalExpected)} tone="strategic" />
        <Stat label="Realised" value={money(summary.totalRealised)} hint={formatPercent(summary.realisationPct, 0) + ' of expected'} tone="controlled" />
        <Stat label="Value at risk" value={money(summary.totalValueAtRisk)} hint={summary.atRiskCount + ' benefit(s) at risk'} tone="threat" />
        <Stat label="Confidence-adjusted value" value={money(summary.confidenceAdjustedValue)} hint={summary.lowConfidenceCount + ' low confidence'} tone="attention" />
      </div>

      <Panel title="Realisation curve" subtitle="Cumulative expected ramp against measured realisation, by month." className="mb-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveSeries} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBenefitRealised" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d68f" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00d68f" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis dataKey="date" {...chartTheme.axis} />
              <YAxis {...chartTheme.axis} tickFormatter={(v: number) => money(v)} width={78} />
              <Tooltip {...tooltipStyle} formatter={(v) => money(Number(v))} />
              <Area type="monotone" dataKey="expected" name="Expected" stroke="#3b9cff" strokeWidth={1.5} fill="none" strokeDasharray="4 3" />
              <Area type="monotone" dataKey="realised" name="Realised" stroke="#00d68f" strokeWidth={2} fill="url(#gradBenefitRealised)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel dense subtitle="Realisation measures value banked, not milestone completion; pace variance compares it against time elapsed.">
        {program.benefits.length === 0 ? (
          <EmptyState title="No benefits defined." />
        ) : (
          <DataTable
            rows={program.benefits}
            columns={columns}
            filters={filters}
            onRowClick={(b) => setFocus(b.id)}
            caption="Benefits register"
            searchPlaceholder="Search benefits"
            initialSort={{ key: 'expected', direction: 'desc' }}
          />
        )}
      </Panel>

      <SlideOver open={Boolean(benefit)} onClose={() => setFocus(null)} title={benefit ? benefit.ref + '  ' + benefit.name : ''} width="wider">
        {benefit && <BenefitDetail benefit={benefit} />}
      </SlideOver>
    </>
  );
}

function BenefitDetail({ benefit }: { benefit: Benefit }) {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const a = analytics.health.benefits.byId[benefit.id];
  const money = (n: number) => formatCurrency(n, program.currency);

  const enablingMilestones = program.milestones.filter((m) => benefit.enablingMilestoneIds.includes(m.id));
  const threateningRisks = program.risks.filter((r) => benefit.threateningRiskIds.includes(r.id));
  const linkedChanges = program.changes.filter((c) => benefit.linkedChangeIds.includes(c.id));
  const linkedDecisions = program.decisions.filter((d) => benefit.linkedDecisionIds.includes(d.id));

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{benefit.description}</p>

      {a && (
        <p className="rounded-md border border-base-500 bg-base-700/50 p-3 text-xs leading-relaxed text-ink-200">
          {a.drivers.join('. ')}.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Type">{titleCase(benefit.type)}</Field>
        <Field label="Owner">{analytics.ownerById[benefit.ownerId] ?? benefit.ownerId}</Field>
        <Field label="Measure">{benefit.measure}</Field>
        <Field label="Baseline &rarr; target">
          {benefit.baseline} &rarr; {benefit.target} (current {benefit.current})
        </Field>
        <Field label="Start">{formatDate(benefit.startDate)}</Field>
        <Field label="Target date">{formatDate(benefit.targetDate)}</Field>
        <Field label="Status">
          <Chip tone={STATUS_TONE[benefit.status]}>{titleCase(benefit.status)}</Chip>
        </Field>
        <Field label="Confidence">{a && <Chip tone={CONFIDENCE_TONE[a.confidence]}>{titleCase(a.confidence)}</Chip>}</Field>
      </div>

      {a && (
        <Section title="Value">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expected">{money(a.expectedValue)}</Field>
            <Field label="Realised">{money(a.realisedValue)}</Field>
            <Field label="Unrealised">{money(a.unrealisedValue)}</Field>
            <Field label="Value at risk">{money(a.valueAtRisk)}</Field>
            <Field label="Realisation">{formatPercent(a.realisationPct, 0)}</Field>
            <Field label="Pace variance">
              <span className={a.paceVariance < 0 ? 'text-threat' : 'text-controlled'}>
                {a.paceVariance >= 0 ? '+' : ''}
                {formatPercent(a.paceVariance, 0)}
              </span>{' '}
              vs time elapsed
            </Field>
          </div>
        </Section>
      )}

      {enablingMilestones.length > 0 && (
        <Section title="Enabling milestones">
          {enablingMilestones.map((m) => (
            <p key={m.id} className="text-xs text-ink-300">
              &bull; {m.name} &mdash; <Chip tone={m.status === 'at-risk' || m.status === 'blocked' ? 'threat' : 'neutral'}>{titleCase(m.status)}</Chip>
            </p>
          ))}
        </Section>
      )}

      {threateningRisks.length > 0 && (
        <Section title="Threatening risks">
          {threateningRisks.map((r) => (
            <p key={r.id} className="text-xs text-ink-300">
              &bull; {r.ref} {r.title}
            </p>
          ))}
        </Section>
      )}

      {linkedChanges.length > 0 && (
        <Section title="Linked changes">
          {linkedChanges.map((c) => (
            <p key={c.id} className="text-xs text-ink-300">
              &bull; {c.ref} {c.title}
            </p>
          ))}
        </Section>
      )}

      {linkedDecisions.length > 0 && (
        <Section title="Linked decisions">
          {linkedDecisions.map((d) => (
            <p key={d.id} className="text-xs text-ink-300">
              &bull; {d.ref} {d.title}
            </p>
          ))}
        </Section>
      )}
    </div>
  );
}

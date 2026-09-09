import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '@/state/store';
import { assessControl } from '@/domain/engines/controlEngine';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, RagBadge, Meter, Stat, EmptyState } from '@/ui/primitives';
import { DataTable, type Column, type FilterGroup } from '@/ui/DataTable';
import { SlideOver, Section, Field } from '@/ui/SlideOver';
import { useFocusParam } from '@/ui/useFocusParam';
import { formatCurrency, formatPercent, titleCase } from '@/lib/format';
import { formatDate, formatMonthLabel } from '@/lib/dates';
import { chartTheme, tooltipStyle } from '@/ui/chart';
import { ROUTE_BY_PATH } from '@/nav';
import type { Control, Risk } from '@/domain/types';

const meta = ROUTE_BY_PATH['/risk'];

export function RiskEngineScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const [focus, setFocus] = useFocusParam();
  const [tab, setTab] = useState<'register' | 'controls'>('register');

  const risk = program.risks.find((r) => r.id === focus);
  const money = (n: number) => formatCurrency(n, program.currency);
  const portfolio = analytics.health.risk;

  const burndown = analytics.burndown.map((p) => ({
    date: formatMonthLabel(p.date),
    inherent: Math.round(p.inherentExposure),
    residual: Math.round(p.residualExposure),
  }));

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Inherent exposure" value={money(portfolio.totalInherentExposure)} tone="attention" />
        <Stat label="Residual exposure" value={money(portfolio.totalResidualExposure)} tone="threat" hint={formatPercent(portfolio.totalExposureReduced / Math.max(1, portfolio.totalInherentExposure), 0) + ' removed by controls'} />
        <Stat label="Average control effectiveness" value={formatPercent(portfolio.averageControlEffectiveness, 0)} tone="controlled" />
        <Stat label="Uncontrolled exposure" value={money(portfolio.uncontrolledExposure)} tone="strategic" />
      </div>

      <Panel title="Exposure burndown" subtitle="The engine tracks falling exposure, not a falling count: a shrinking register with rising residual money is not progress." className="mb-4">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={burndown} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="riskResidualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4d5e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ff4d5e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis dataKey="date" {...chartTheme.axis} />
              <YAxis {...chartTheme.axis} width={78} tickFormatter={(v: number) => money(v)} />
              <Tooltip {...tooltipStyle} formatter={(v) => money(Number(v))} />
              <Area type="monotone" dataKey="inherent" name="Inherent" stroke="#ffb020" strokeDasharray="4 3" fill="none" strokeWidth={1.5} />
              <Area type="monotone" dataKey="residual" name="Residual" stroke="#ff4d5e" fill="url(#riskResidualGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="mb-4 flex gap-1 border-b border-base-600">
        {(['register', 'controls'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t ? 'page' : undefined}
            className={'border-b-2 px-4 py-2.5 text-xs font-medium transition-colors ' + (tab === t ? 'border-threat text-ink-100' : 'border-transparent text-ink-400 hover:text-ink-200')}
          >
            {t === 'register' ? 'Risk register' : 'Control effectiveness'}
          </button>
        ))}
      </div>

      {tab === 'register' ? <RegisterTable risks={program.risks} onOpen={setFocus} /> : <ControlsTable controls={program.controls} />}

      <SlideOver
        open={Boolean(risk)}
        onClose={() => setFocus(null)}
        title={risk ? risk.ref + '  ' + risk.title : ''}
        badge={risk && <RagBadge status={analytics.health.risk.byId[risk.id]?.residualSeverity ?? 'amber'} />}
        width="wider"
      >
        {risk && <RiskDeepDive risk={risk} />}
      </SlideOver>
    </>
  );
}

function RegisterTable({ risks, onOpen }: { risks: Risk[]; onOpen: (id: string) => void }) {
  const analytics = useStore((s) => s.analytics);
  const program = useStore((s) => s.program);
  const money = (n: number) => formatCurrency(n, program.currency);

  const columns: Column<Risk>[] = useMemo(
    () => [
      { key: 'ref', header: 'ID', render: (r) => <span className="num text-2xs text-ink-500">{r.ref}</span>, width: '4.5rem' },
      { key: 'title', header: 'Title', render: (r) => r.title, sortValue: (r) => r.title, searchValue: (r) => r.title + ' ' + r.description },
      {
        key: 'inherent',
        header: 'Inherent',
        render: (r) => money(analytics.health.risk.byId[r.id]?.inherentFinancialExposure ?? 0),
        sortValue: (r) => analytics.health.risk.byId[r.id]?.inherentFinancialExposure ?? 0,
        align: 'right',
      },
      {
        key: 'residual',
        header: 'Residual',
        render: (r) => money(analytics.health.risk.byId[r.id]?.residualFinancialExposure ?? 0),
        sortValue: (r) => analytics.health.risk.byId[r.id]?.residualFinancialExposure ?? 0,
        align: 'right',
      },
      {
        key: 'reduction',
        header: 'Reduction',
        render: (r) => formatPercent(analytics.health.risk.byId[r.id]?.reductionPct ?? 0, 0),
        sortValue: (r) => analytics.health.risk.byId[r.id]?.reductionPct ?? 0,
        align: 'right',
      },
      {
        key: 'velocity',
        header: 'Velocity',
        render: (r) => {
          const v = analytics.health.risk.byId[r.id]?.velocity ?? 0;
          return <span className={v > 0.15 ? 'text-threat' : v > 0.03 ? 'text-attention' : v < -0.05 ? 'text-controlled' : 'text-ink-400'}>{v >= 0 ? '+' : ''}{v.toFixed(2)}</span>;
        },
        sortValue: (r) => analytics.health.risk.byId[r.id]?.velocity ?? 0,
      },
      {
        key: 'severity',
        header: 'Residual severity',
        render: (r) => {
          const a = analytics.health.risk.byId[r.id];
          return a ? <RagBadge status={a.residualSeverity} /> : '--';
        },
        sortValue: (r) => analytics.health.risk.byId[r.id]?.residualScore ?? 0,
      },
      { key: 'horizon', header: 'Horizon', render: (r) => titleCase(r.timeHorizon), sortValue: (r) => r.timeHorizon, optional: true },
      { key: 'confidence', header: 'Evidence', render: (r) => titleCase(r.evidenceConfidence), sortValue: (r) => r.evidenceConfidence, optional: true },
    ],
    [analytics, money],
  );

  const filters: FilterGroup<Risk>[] = [
    {
      key: 'severity',
      label: 'Residual',
      options: (['red', 'amber', 'green'] as const).map((s) => ({ value: s, label: titleCase(s), match: (r) => analytics.health.risk.byId[r.id]?.residualSeverity === s })),
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
    {
      key: 'category',
      label: 'Category',
      options: [...new Set(program.risks.map((r) => r.category))].map((c) => ({ value: c, label: titleCase(c), match: (r) => r.category === c })),
    },
  ];

  return (
    <Panel dense>
      <DataTable rows={risks} columns={columns} filters={filters} onRowClick={(r) => onOpen(r.id)} caption="Risk engine register" searchPlaceholder="Search risks" initialSort={{ key: 'residual', direction: 'desc' }} />
    </Panel>
  );
}

function ControlsTable({ controls }: { controls: Control[] }) {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);

  const columns: Column<Control>[] = useMemo(
    () => [
      { key: 'ref', header: 'ID', render: (c) => <span className="num text-2xs text-ink-500">{c.ref}</span>, width: '4.5rem' },
      { key: 'name', header: 'Control', render: (c) => c.name, sortValue: (c) => c.name, searchValue: (c) => c.name + ' ' + c.description },
      { key: 'type', header: 'Type', render: (c) => <Chip>{titleCase(c.type)}</Chip>, sortValue: (c) => c.type },
      { key: 'owner', header: 'Owner', render: (c) => analytics.ownerById[c.ownerId] ?? c.ownerId, sortValue: (c) => analytics.ownerById[c.ownerId] ?? '' },
      { key: 'frequency', header: 'Frequency', render: (c) => titleCase(c.frequency), sortValue: (c) => c.frequency, optional: true },
      {
        key: 'effectiveness',
        header: 'Effectiveness',
        render: (c) => {
          const eff = assessControl(c, program.statusDate, 'measured').effectiveness;
          return (
            <div className="flex items-center gap-2">
              <Meter value={eff} max={1} tone={eff >= 0.7 ? 'controlled' : eff >= 0.4 ? 'attention' : 'threat'} className="w-16" label="Effectiveness" />
              <span className="num text-2xs text-ink-300">{Math.round(eff * 100)}%</span>
            </div>
          );
        },
        sortValue: (c) => assessControl(c, program.statusDate, 'measured').effectiveness,
      },
      { key: 'status', header: 'Status', render: (c) => <Chip tone={c.status === 'failed' ? 'threat' : c.status === 'degraded' ? 'attention' : c.status === 'active' ? 'controlled' : 'neutral'}>{titleCase(c.status)}</Chip>, sortValue: (c) => c.status },
      { key: 'lastTested', header: 'Last tested', render: (c) => (c.lastTested ? formatDate(c.lastTested) : 'Never'), sortValue: (c) => c.lastTested ?? '', optional: true },
      { key: 'nextTest', header: 'Next test', render: (c) => (c.nextTest ? formatDate(c.nextTest) : '--'), sortValue: (c) => c.nextTest ?? '', optional: true },
      { key: 'linked', header: 'Risks covered', render: (c) => c.linkedRiskIds.length, sortValue: (c) => c.linkedRiskIds.length, align: 'right' },
    ],
    [analytics, program.statusDate],
  );

  const filters: FilterGroup<Control>[] = [
    {
      key: 'status',
      label: 'Status',
      options: ['active', 'degraded', 'failed', 'planned', 'retired'].map((s) => ({ value: s, label: titleCase(s), match: (c) => c.status === s })),
    },
    {
      key: 'type',
      label: 'Type',
      options: ['preventive', 'detective', 'corrective', 'directive'].map((t) => ({ value: t, label: titleCase(t), match: (c) => c.type === t })),
    },
  ];

  return (
    <Panel dense subtitle="Effectiveness blends design x operating x status x evidence confidence. See the worked example in docs/risk-model.md.">
      <DataTable rows={controls} columns={columns} filters={filters} caption="Control portfolio" searchPlaceholder="Search controls" initialSort={{ key: 'effectiveness', direction: 'asc' }} />
    </Panel>
  );
}

function RiskDeepDive({ risk }: { risk: Risk }) {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const a = analytics.health.risk.byId[risk.id];
  const money = (n: number) => formatCurrency(n, program.currency);
  const linkedControls = program.controls.filter((c) => risk.controlIds.includes(c.id));

  const history = risk.history.map((h) => ({ date: formatMonthLabel(h.date), exposure: Math.round(h.financialExposure * h.probability) }));

  if (!a) return <EmptyState title="No assessment available." />;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{risk.description}</p>

      <Section title="Inherent to residual">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md border border-attention/30 bg-attention/5 p-3">
            <div className="label">Inherent</div>
            <div className="num mt-1 text-base text-attention">{money(a.inherentFinancialExposure)}</div>
          </div>
          <div className="flex flex-col items-center justify-center text-2xs text-ink-400">
            <span>controls remove</span>
            <span className="num text-sm text-controlled">{formatPercent(a.reductionPct, 0)}</span>
          </div>
          <div className="rounded-md border border-threat/30 bg-threat/5 p-3">
            <div className="label">Residual</div>
            <div className="num mt-1 text-base text-threat">{money(a.residualFinancialExposure)}</div>
          </div>
        </div>
      </Section>

      <Section title="Risk trajectory">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis dataKey="date" {...chartTheme.axis} />
              <YAxis {...chartTheme.axis} width={56} tickFormatter={(v: number) => money(v)} />
              <Tooltip {...tooltipStyle} formatter={(v) => money(Number(v))} />
              <Line type="monotone" dataKey="exposure" stroke="#ff4d5e" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-2xs text-ink-400">
          Velocity {a.velocity >= 0 ? '+' : ''}{a.velocity.toFixed(2)} points per fortnight &middot; classified {titleCase(a.trend)}.
        </p>
      </Section>

      <Section title="Why this score">
        <ul className="space-y-1.5">
          {a.drivers.map((d) => (
            <li key={d} className="text-xs text-ink-300">
              &bull; {d}
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Inherent probability">{formatPercent(a.inherentProbability, 0)}</Field>
        <Field label="Inherent impact">{a.inherentImpact} / 5</Field>
        <Field label="Residual probability">{formatPercent(a.residualProbability, 0)}</Field>
        <Field label="Residual impact">{a.residualImpactBand} / 5</Field>
        <Field label="Strategic exposure">{money(a.strategicExposure)}</Field>
        <Field label="Reputation exposure">{money(a.reputationExposure)}</Field>
      </div>

      <Section title={'Controls (' + linkedControls.length + ')'}>
        {linkedControls.length === 0 ? (
          <EmptyState title="No control assigned. This risk is fully exposed." />
        ) : (
          <ul className="space-y-2">
            {linkedControls.map((c) => {
              const ca = assessControl(c, program.statusDate, risk.evidenceConfidence);
              return (
                <li key={c.id} className="rounded-md border border-base-500 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-ink-100">{c.name}</span>
                    <span className="num text-2xs text-controlled">{Math.round(ca.effectiveness * 100)}%</span>
                  </div>
                  <p className="mt-1 text-2xs text-ink-400">{ca.drivers.join('. ')}</p>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {risk.evidence.length > 0 && (
        <Section title="Evidence">
          <ul className="space-y-1.5">
            {risk.evidence.map((e) => (
              <li key={e.id} className="text-xs text-ink-300">
                <span className="text-ink-100">{e.label}</span> &mdash; {titleCase(e.kind)}, {titleCase(e.confidence)}, {formatDate(e.date)}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { useStore } from '@/state/store';
import { buildKpis, type Kpi } from '@/domain/engines/kpiEngine';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, RagBadge, Meter, Stat, DriverList, Chip } from '@/ui/primitives';
import { SlideOver, Section } from '@/ui/SlideOver';
import { cx } from '@/lib/cx';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';
import { formatDate, formatMonthLabel } from '@/lib/dates';
import { ROUTES } from '@/nav';
import { chartTheme, tooltipStyle } from '@/ui/chart';
import type { DimensionHealth } from '@/domain/engines/healthEngine';

const meta = ROUTES[0];

export function CommandCenter() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const navigate = useNavigate();
  const [openKpi, setOpenKpi] = useState<string | null>(null);
  const [openDimension, setOpenDimension] = useState<string | null>(null);

  const kpis = useMemo(() => buildKpis(program, analytics), [program, analytics]);
  const kpi = kpis.find((k) => k.id === openKpi) ?? null;

  const health = analytics.health;
  const dimensions: DimensionHealth[] = [health.overall, ...Object.values(health.dimensions)];
  const dimension = dimensions.find((d) => d.dimension === openDimension) ?? null;

  const money = (n: number) => formatCurrency(n, program.currency);

  const exposureSeries = analytics.burndown.map((p) => ({
    date: formatMonthLabel(p.date),
    residual: Math.round(p.residualExposure),
    inherent: Math.round(p.inherentExposure),
  }));

  const countSeries = analytics.burndown.map((p) => ({
    date: formatMonthLabel(p.date),
    open: p.open,
    critical: p.critical,
    accepted: p.accepted,
    closed: p.closed,
  }));

  const benefitSeries = analytics.benefitCurve.map((p) => ({
    date: formatMonthLabel(p.date),
    expected: Math.round(p.expected),
    realised: Math.round(p.realised),
  }));

  return (
    <>
      <ScreenHeader
        code={meta.code}
        title={meta.label}
        purpose={meta.purpose}
        actions={
          <Link to="/brief" className="btn btn-primary">
            Executive brief
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <section className="panel mb-4 overflow-hidden bg-scan">
        <div className="grid gap-px bg-base-600 md:grid-cols-2 xl:grid-cols-4">
          <div className="bg-base-800 p-5">
            <div className="label">Programme</div>
            <div className="num mt-1 text-2xl font-bold tracking-tight text-ink-100">{program.codename}</div>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink-400">{program.name}</p>
            <p className="mt-3 text-2xs leading-relaxed text-ink-500">
              {formatDate(program.startDate)} to {formatDate(program.endDate)} &middot; {money(program.budget)} budget &middot;{' '}
              {program.workstreams.length} workstreams &middot; sponsor {program.sponsor}
            </p>
          </div>
          <div className="bg-base-800 p-5">
            <div className="flex items-center justify-between">
              <div className="label">Programme health</div>
              <RagBadge status={health.overall.status} />
            </div>
            <div className="num mt-1 text-2xl font-bold text-ink-100">
              {Math.round(health.overall.score)}
              <span className="text-sm text-ink-500"> / 100</span>
            </div>
            <Meter
              className="mt-2"
              value={health.overall.score}
              max={100}
              tone={health.overall.status === 'red' ? 'threat' : health.overall.status === 'amber' ? 'attention' : 'controlled'}
              label="Overall health score"
            />
            <p className="mt-3 text-2xs leading-relaxed text-ink-400">{health.overall.headline}</p>
          </div>
          <div className="bg-base-800 p-5">
            <div className="label">Residual risk exposure</div>
            <div className="num mt-1 text-2xl font-bold text-threat">{money(health.risk.totalResidualExposure)}</div>
            <p className="mt-1 text-2xs text-ink-400">
              reduced {formatPercent(health.risk.totalExposureReduced / Math.max(1, health.risk.totalInherentExposure), 0)} from{' '}
              {money(health.risk.totalInherentExposure)} inherent
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Chip tone="threat">{formatNumber(health.risk.criticalCount)} critical</Chip>
              <Chip tone="attention">{formatNumber(health.risk.acceleratingCount)} accelerating</Chip>
              <Chip tone="neutral">{formatNumber(health.risk.openCount)} open</Chip>
            </div>
          </div>
          <div className="bg-base-800 p-5">
            <div className="label">Delivery and value</div>
            <div className="num mt-1 text-2xl font-bold text-attention">{formatNumber(health.schedule.atRisk)}</div>
            <p className="mt-1 text-2xs text-ink-400">milestones at risk of {formatNumber(health.schedule.total)}</p>
            <p className="mt-3 text-2xs leading-relaxed text-ink-400">
              {money(health.benefits.totalExpected)} expected benefits, {money(health.benefits.totalRealised)} realised,{' '}
              {money(health.benefits.totalValueAtRisk)} at risk.
            </p>
          </div>
        </div>
      </section>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {kpis.map((k) => (
          <KpiCard key={k.id} kpi={k} onOpen={() => setOpenKpi(k.id)} />
        ))}
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Exposure trend"
          subtitle="Inherent against residual, monthly. The objective is falling exposure, not a falling risk count."
          className="xl:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={exposureSeries} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradResidual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff4d5e" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#ff4d5e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="date" {...chartTheme.axis} />
                <YAxis {...chartTheme.axis} tickFormatter={(v: number) => money(v)} width={78} />
                <Tooltip {...tooltipStyle} formatter={(v) => money(Number(v))} />
                <Area type="monotone" dataKey="inherent" name="Inherent" stroke="#ffb020" strokeWidth={1.5} fill="none" strokeDasharray="4 3" />
                <Area type="monotone" dataKey="residual" name="Residual" stroke="#ff4d5e" strokeWidth={2} fill="url(#gradResidual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Health drivers" subtitle="Six weighted dimensions. Select one to see what moved it." dense>
          <ul className="divide-y divide-base-600">
            {dimensions.map((d) => (
              <li key={d.dimension}>
                <button
                  type="button"
                  onClick={() => setOpenDimension(d.dimension)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-base-700"
                >
                  <span className="w-24 shrink-0 text-xs capitalize text-ink-200">{d.dimension}</span>
                  <span className="min-w-0 flex-1">
                    <Meter
                      value={d.score}
                      max={100}
                      tone={d.status === 'red' ? 'threat' : d.status === 'amber' ? 'attention' : 'controlled'}
                      label={d.dimension + ' score'}
                    />
                  </span>
                  <span className="num w-8 shrink-0 text-right text-xs text-ink-200">{Math.round(d.score)}</span>
                  <RagBadge status={d.status} className="shrink-0" />
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink-500" />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Risk burndown" subtitle="Counts by state per month. A flat open line with rising criticals is a warning, not progress.">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={countSeries} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="date" {...chartTheme.axis} />
                <YAxis {...chartTheme.axis} width={32} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="open" name="Open" stroke="#3b9cff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="critical" name="Critical" stroke="#ff4d5e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="accepted" name="Accepted" stroke="#a970ff" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="closed" name="Closed" stroke="#00d68f" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Benefit realisation" subtitle="Cumulative expected ramp against measured realisation.">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={benefitSeries} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRealised" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d68f" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00d68f" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="date" {...chartTheme.axis} />
                <YAxis {...chartTheme.axis} tickFormatter={(v: number) => money(v)} width={78} />
                <Tooltip {...tooltipStyle} formatter={(v) => money(Number(v))} />
                <Area type="monotone" dataKey="expected" name="Expected" stroke="#3b9cff" strokeWidth={1.5} fill="none" strokeDasharray="4 3" />
                <Area type="monotone" dataKey="realised" name="Realised" stroke="#00d68f" strokeWidth={2} fill="url(#gradRealised)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Attention queue"
        subtitle="Ranked by priority index: exposure, velocity and evidence confidence combined."
        dense
        actions={
          <Link to="/risk" className="btn">
            All risks
          </Link>
        }
      >
        <ul className="divide-y divide-base-600">
          {analytics.health.risk.topRisks.slice(0, 8).map((r) => (
            <li key={r.riskId}>
              <button
                type="button"
                onClick={() => navigate('/risk?focus=' + r.riskId)}
                className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-base-700"
              >
                <span className="num w-14 shrink-0 text-2xs text-ink-500">{r.ref}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink-100">{r.title}</span>
                  <span className="block truncate text-2xs text-ink-400">{r.drivers[0] ?? ''}</span>
                </span>
                <span className="num shrink-0 text-xs text-threat">{money(r.residualFinancialExposure)}</span>
                <RagBadge status={r.residualSeverity} className="shrink-0" />
                <span className={cx('chip shrink-0 border', r.trend === 'accelerating' ? 'border-threat/40 text-threat' : 'border-base-500 text-ink-400')}>
                  {r.trend}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <SlideOver open={Boolean(kpi)} onClose={() => setOpenKpi(null)} title={kpi?.label ?? ''} subtitle={kpi?.value} width="wide">
        {kpi && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-ink-200">{kpi.explanation.headline}</p>
            <Section title="How this number is calculated">
              <p className="text-xs leading-relaxed text-ink-400">{kpi.explanation.method}</p>
            </Section>
            <Section title="Top contributors">
              {kpi.explanation.contributors.length === 0 ? (
                <p className="text-xs text-ink-400">Nothing is contributing to this number right now.</p>
              ) : (
                <ul className="space-y-3">
                  {kpi.explanation.contributors.map((c) => (
                    <li key={c.label} className="border-l-2 border-base-500 pl-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-xs font-medium text-ink-100">{c.label}</span>
                        {c.value && <span className="num shrink-0 text-2xs text-attention">{c.value}</span>}
                      </div>
                      <p className="mt-0.5 text-2xs leading-relaxed text-ink-400">{c.detail}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
            <Section title="Supporting figures">
              <div className="grid grid-cols-2 gap-3">
                {kpi.explanation.metrics.map((m) => (
                  <Stat key={m.label} label={m.label} value={m.value} />
                ))}
              </div>
            </Section>
            <div className="flex flex-wrap gap-2">
              {kpi.explanation.links.map((l) => (
                <Link key={l.to} to={l.to} className="btn" onClick={() => setOpenKpi(null)}>
                  {l.label}
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </SlideOver>

      <SlideOver
        open={Boolean(dimension)}
        onClose={() => setOpenDimension(null)}
        title={dimension ? dimension.dimension.toUpperCase() + ' HEALTH' : ''}
        subtitle={dimension ? Math.round(dimension.score) + ' / 100' : undefined}
        badge={dimension && <RagBadge status={dimension.status} />}
      >
        {dimension && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-ink-200">{dimension.headline}</p>
            <Section title="What moved the score">
              <p className="mb-3 text-2xs text-ink-500">
                Each dimension starts at 100 and loses points to the drivers below. The overall score is the weighted mean of the six dimensions.
              </p>
              <DriverList drivers={dimension.drivers} />
            </Section>
            <Section title="Underlying figures">
              <div className="grid grid-cols-2 gap-3">
                {dimension.metrics.map((m) => (
                  <Stat key={m.label} label={m.label} value={m.value} />
                ))}
              </div>
            </Section>
          </div>
        )}
      </SlideOver>
    </>
  );
}

function KpiCard({ kpi, onOpen }: { kpi: Kpi; onOpen: () => void }) {
  const toneText: Record<string, string> = {
    default: 'text-ink-100',
    threat: 'text-threat',
    attention: 'text-attention',
    controlled: 'text-controlled',
    info: 'text-info',
    strategic: 'text-strategic',
  };
  const meterTone = kpi.tone === 'default' ? 'info' : kpi.tone;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={kpi.label + ': ' + kpi.value + '. Open the explanation.'}
      className="panel group p-4 text-left transition-colors hover:border-base-400 hover:bg-base-700/40"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="label">{kpi.label}</span>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-200" />
      </div>
      <div className={cx('num mt-2 text-xl font-bold', toneText[kpi.tone])}>{kpi.value}</div>
      <p className="mt-1 text-2xs leading-relaxed text-ink-400">{kpi.hint}</p>
      {kpi.share !== null && <Meter className="mt-3" value={kpi.share} max={1} tone={meterTone} label={kpi.label + ' share'} />}
      <p className="mt-2 text-2xs text-ink-500 opacity-0 transition-opacity group-hover:opacity-100">Why this number</p>
    </button>
  );
}

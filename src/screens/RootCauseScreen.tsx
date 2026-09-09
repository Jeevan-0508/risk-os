import { useMemo, useState } from 'react';
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '@/state/store';
import { computePareto, groupFishbone, assessDmaic } from '@/domain/engines/dmaicEngine';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat, EmptyState } from '@/ui/primitives';
import { SlideOver, Section, Field } from '@/ui/SlideOver';
import { useFocusParam } from '@/ui/useFocusParam';
import { formatPercent, titleCase } from '@/lib/format';
import { chartTheme, tooltipStyle } from '@/ui/chart';
import { cx } from '@/lib/cx';
import { ROUTES } from '@/nav';
import type { Cause, FishboneCategory } from '@/domain/types';

const meta = ROUTES.find((r) => r.code === '06')!;

const CATEGORY_LABEL: Record<FishboneCategory, string> = {
  people: 'People',
  process: 'Process',
  technology: 'Technology',
  policy: 'Policy',
  environment: 'Environment',
  measurement: 'Measurement',
  management: 'Management',
};

export function RootCauseScreen() {
  const program = useStore((s) => s.program);
  const [focus, setFocus] = useFocusParam();
  const [tab, setTab] = useState<'fishbone' | 'pareto' | 'dmaic'>('fishbone');

  const cause = program.causes.find((c) => c.id === focus);
  const fishbone = useMemo(() => groupFishbone(program.causes), [program.causes]);
  const pareto = useMemo(() => computePareto(program.causes), [program.causes]);
  const rootCauseCount = program.causes.filter((c) => c.isRootCause).length;

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Causes logged" value={program.causes.length} tone="info" />
        <Stat label="Validated root causes" value={rootCauseCount} tone="threat" />
        <Stat label="Vital few (Pareto)" value={pareto.filter((p) => p.isVitalFew).length} hint="drive 80% of observed frequency" tone="attention" />
        <Stat label="DMAIC projects" value={program.dmaic.length} tone="strategic" />
      </div>

      <div className="mb-4 flex gap-1 border-b border-base-600">
        {(['fishbone', 'pareto', 'dmaic'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t ? 'page' : undefined}
            className={cx('border-b-2 px-4 py-2.5 text-xs font-medium transition-colors', tab === t ? 'border-threat text-ink-100' : 'border-transparent text-ink-400 hover:text-ink-200')}
          >
            {t === 'fishbone' ? 'Fishbone (Ishikawa)' : t === 'pareto' ? 'Pareto' : 'DMAIC'}
          </button>
        ))}
      </div>

      {tab === 'fishbone' && <FishboneView groups={fishbone} onOpen={setFocus} />}
      {tab === 'pareto' && <ParetoView slices={pareto} onOpen={setFocus} />}
      {tab === 'dmaic' && <DmaicView />}

      <SlideOver open={Boolean(cause)} onClose={() => setFocus(null)} title={cause ? cause.ref + '  ' + cause.title : ''} badge={cause?.isRootCause && <Chip tone="threat">Root cause</Chip>}>
        {cause && <CauseDetail cause={cause} />}
      </SlideOver>
    </>
  );
}

function FishboneView({ groups, onOpen }: { groups: ReturnType<typeof groupFishbone>; onOpen: (id: string) => void }) {
  const maxFreq = Math.max(1, ...groups.map((g) => g.totalFrequency));
  return (
    <Panel title="Ishikawa diagram" subtitle="Causes grouped by category. Bar length is total observed frequency; the root-cause count is what has been validated with a Five Whys chain.">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {groups.map((g) => (
          <div key={g.category} className="rounded-md border border-base-500 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-200">{CATEGORY_LABEL[g.category]}</span>
              <Chip tone={g.rootCauseCount > 0 ? 'threat' : 'neutral'}>{g.rootCauseCount} root</Chip>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-base-600">
              <div className="h-full rounded-full bg-info" style={{ width: (g.totalFrequency / maxFreq) * 100 + '%' }} />
            </div>
            {g.causes.length === 0 ? (
              <p className="mt-3 text-2xs text-ink-500">No cause logged in this category.</p>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {g.causes.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => onOpen(c.id)} className="flex w-full items-center justify-between gap-2 rounded px-1.5 py-1 text-left text-xs text-ink-300 hover:bg-base-700 hover:text-ink-100">
                      <span className="truncate">{c.title}</span>
                      <span className="num shrink-0 text-2xs text-ink-500">x{c.frequency}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ParetoView({ slices, onOpen }: { slices: ReturnType<typeof computePareto>; onOpen: (id: string) => void }) {
  const chartData = slices.map((s) => ({ label: s.label.length > 22 ? s.label.slice(0, 22) + '…' : s.label, frequency: s.frequency, cumulative: Math.round(s.cumulativePct * 100), vital: s.isVitalFew }));
  if (slices.length === 0) return <EmptyState title="No cause has a recorded frequency yet." />;
  return (
    <Panel title="Pareto of cause frequency" subtitle="The vital few: causes whose cumulative share reaches 80% of all observed occurrences.">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 4, right: 24, left: 0, bottom: 48 }}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis dataKey="label" {...chartTheme.axis} interval={0} angle={-30} textAnchor="end" height={70} />
            <YAxis yAxisId="left" {...chartTheme.axis} width={32} />
            <YAxis yAxisId="right" orientation="right" {...chartTheme.axis} width={40} domain={[0, 100]} tickFormatter={(v: number) => v + '%'} />
            <Tooltip {...tooltipStyle} />
            <Bar yAxisId="left" dataKey="frequency" name="Frequency" radius={[3, 3, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.vital ? '#ff4d5e' : '#5b6675'} />
              ))}
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Cumulative %" stroke="#a970ff" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 divide-y divide-base-600">
        {slices.map((s) => (
          <li key={s.causeId}>
            <button type="button" onClick={() => onOpen(s.causeId)} className="flex w-full items-center gap-3 px-2 py-2 text-left hover:bg-base-700">
              <span className={cx('h-2 w-2 shrink-0 rotate-45', s.isVitalFew ? 'bg-threat' : 'bg-base-500')} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-xs text-ink-200">{s.label}</span>
              <span className="num text-2xs text-ink-400">x{s.frequency}</span>
              <span className="num w-14 text-right text-2xs text-ink-500">{formatPercent(s.sharePct, 0)}</span>
              <span className="num w-16 text-right text-2xs text-ink-500">{formatPercent(s.cumulativePct, 0)} cum.</span>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function DmaicView() {
  const program = useStore((s) => s.program);
  if (program.dmaic.length === 0) return <EmptyState title="No DMAIC project is open." />;
  return (
    <div className="space-y-4">
      {program.dmaic.map((project) => {
        const a = assessDmaic(project, program.causes, program.fmea);
        return (
          <Panel key={project.id} title={project.ref + '  ' + project.name} subtitle={'Phase: ' + titleCase(project.phase)}>
            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Sigma level" value={a.sigma.sigmaLevel.toFixed(2)} hint={a.sigma.dpmo.toFixed(0) + ' DPMO'} tone="info" />
              <Stat label="Baseline" value={a.baseline + ' ' + project.measure.unit} tone="attention" />
              <Stat label="Projected" value={a.projected.toFixed(1) + ' ' + project.measure.unit} hint={formatPercent(a.expectedImprovementPct, 0) + ' improvement modelled'} tone="controlled" />
              <Stat label="Projected savings" value={a.projectedSavings.toLocaleString('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} tone="strategic" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Section title="Define">
                  <Field label="Problem statement">{project.define.problemStatement}</Field>
                  <div className="mt-2">
                    <Field label="Business impact">{project.define.businessImpact}</Field>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.define.ctq.map((c) => (
                      <Chip key={c}>{c}</Chip>
                    ))}
                  </div>
                </Section>
                <Section title="Measure">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Volume">{project.measure.volume}</Field>
                    <Field label="Defect rate">{formatPercent(project.measure.defectRate, 1)}</Field>
                    <Field label="Cycle time">{project.measure.cycleTimeDays} days</Field>
                    <Field label="Cost of poor quality">{project.measure.costOfPoorQuality.toLocaleString()}</Field>
                  </div>
                </Section>
              </div>
              <div>
                <Section title="Gate readiness">
                  <ul className="space-y-2">
                    {a.gateReadiness.map((g) => (
                      <li key={g.gate} className="flex items-start gap-2">
                        <Chip tone={g.ready ? 'controlled' : 'threat'}>{g.gate}</Chip>
                        <span className="text-2xs leading-relaxed text-ink-400">{g.reason}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
                <Section title="Control">
                  <Field label="Control metric">{project.control.controlMetric}</Field>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Field label="Lower limit">{project.control.lowerControlLimit}</Field>
                    <Field label="Upper limit">{project.control.upperControlLimit}</Field>
                  </div>
                  <div className="mt-2">
                    <Field label="Escalation trigger">{project.control.escalationTrigger}</Field>
                  </div>
                </Section>
              </div>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

function CauseDetail({ cause }: { cause: Cause }) {
  const analytics = useStore((s) => s.analytics);
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-ink-200">{cause.description}</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">{CATEGORY_LABEL[cause.category]}</Field>
        <Field label="Owner">{analytics.ownerById[cause.ownerId] ?? cause.ownerId}</Field>
        <Field label="Frequency">{cause.frequency}</Field>
        <Field label="Root cause">{cause.isRootCause ? 'Validated' : 'Not yet validated'}</Field>
      </div>
      <Section title={'Five Whys (' + cause.whyChain.length + ')'}>
        <ol className="space-y-2 border-l border-base-500 pl-4">
          {cause.whyChain.map((why, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[1.32rem] top-0.5 num flex h-4 w-4 items-center justify-center rounded-full bg-base-600 text-2xs text-ink-300">{i + 1}</span>
              <span className="text-xs text-ink-300">{why}</span>
            </li>
          ))}
        </ol>
        {!cause.isRootCause && cause.whyChain.length < 5 && (
          <p className="mt-3 text-2xs text-ink-500">Chain stops before a systemic cause is reached; not yet accepted as root cause.</p>
        )}
      </Section>
    </div>
  );
}

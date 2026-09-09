import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '@/state/store';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat, EmptyState } from '@/ui/primitives';
import { DataTable, type Column, type FilterGroup } from '@/ui/DataTable';
import { SlideOver, Section, Field } from '@/ui/SlideOver';
import { useFocusParam } from '@/ui/useFocusParam';
import { formatPercent, titleCase } from '@/lib/format';
import { formatDate } from '@/lib/dates';
import { chartTheme, tooltipStyle } from '@/ui/chart';
import { ROUTE_BY_PATH } from '@/nav';
import type { FMEAItem } from '@/domain/types';
import type { RpnBand } from '@/domain/engines/fmeaEngine';

const meta = ROUTE_BY_PATH['/fmea'];

/**
 * AIAG-VDA methodology, not a generic severity table: severity 5 escalates
 * regardless of RPN, and the before/after comparison is the whole point of
 * doing an FMEA rather than a plain risk register.
 */
export function FmeaScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const [focus, setFocus] = useFocusParam();
  const summary = analytics.fmea;
  const item = program.fmea.find((f) => f.id === focus);

  const byProcessChart = summary.byProcess.map((p) => ({ process: p.process, before: Math.round(p.totalRpn), after: Math.round(p.residualRpn) }));

  const columns: Column<FMEAItem>[] = useMemo(
    () => [
      { key: 'ref', header: 'ID', render: (f) => <span className="num text-2xs text-ink-500">{f.ref}</span>, width: '4.5rem' },
      {
        key: 'failureMode',
        header: 'Failure mode',
        render: (f) => (
          <div>
            <div className="truncate text-ink-100">{f.failureMode}</div>
            <div className="truncate text-2xs text-ink-500">
              {f.process} &middot; {f.processStep}
            </div>
          </div>
        ),
        sortValue: (f) => f.failureMode,
        searchValue: (f) => f.failureMode + ' ' + f.process + ' ' + f.processStep + ' ' + f.effect,
      },
      {
        key: 'sod',
        header: 'S x O x D',
        render: (f) => <span className="num text-2xs text-ink-300">{f.severity} x {f.occurrence} x {f.detection}</span>,
        sortValue: (f) => f.severity * f.occurrence * f.detection,
      },
      {
        key: 'rpn',
        header: 'RPN',
        render: (f) => {
          const a = summary.byId[f.id];
          return <Chip tone={a.band === 'critical' ? 'threat' : a.band === 'high' ? 'attention' : a.band === 'moderate' ? 'info' : 'controlled'}>{a.rpn}</Chip>;
        },
        sortValue: (f) => summary.byId[f.id]?.rpn ?? 0,
      },
      {
        key: 'residual',
        header: 'Residual RPN',
        render: (f) => summary.byId[f.id]?.residualRpn ?? 0,
        sortValue: (f) => summary.byId[f.id]?.residualRpn ?? 0,
      },
      {
        key: 'reduction',
        header: 'Reduction',
        render: (f) => formatPercent(summary.byId[f.id]?.rpnReductionPct ?? 0, 0),
        sortValue: (f) => summary.byId[f.id]?.rpnReductionPct ?? 0,
        align: 'right',
      },
      { key: 'status', header: 'Action', render: (f) => <Chip>{titleCase(f.actionStatus)}</Chip>, sortValue: (f) => f.actionStatus },
    ],
    [summary],
  );

  const filters: FilterGroup<FMEAItem>[] = [
    {
      key: 'band',
      label: 'RPN band',
      options: (['critical', 'high', 'moderate', 'low'] as RpnBand[]).map((b) => ({ value: b, label: titleCase(b), match: (f) => summary.byId[f.id]?.band === b })),
    },
    {
      key: 'actionStatus',
      label: 'Action status',
      options: ['open', 'in-progress', 'complete'].map((s) => ({ value: s, label: titleCase(s), match: (f) => f.actionStatus === s })),
    },
    {
      key: 'process',
      label: 'Process',
      options: [...new Set(program.fmea.map((f) => f.process))].map((p) => ({ value: p, label: p, match: (f) => f.process === p })),
    },
  ];

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Failure modes" value={summary.total} hint={summary.criticalCount + ' critical, ' + summary.highCount + ' high'} tone="threat" />
        <Stat label="Total RPN" value={summary.totalRpn} tone="attention" />
        <Stat label="Modelled reduction" value={formatPercent(summary.rpnReductionPct, 0)} hint={'to ' + summary.totalResidualRpn + ' residual'} tone="controlled" />
        <Stat label="Detection-dependent" value={summary.detectionDependentCount} hint="held down by detection alone" tone="strategic" />
      </div>

      <Panel title="RPN before and after, by process" subtitle="AIAG-VDA scoring: severity 5 always escalates the failure mode regardless of the RPN number." className="mb-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byProcessChart} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis dataKey="process" {...chartTheme.axis} interval={0} angle={-20} textAnchor="end" height={56} />
              <YAxis {...chartTheme.axis} width={36} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="before" name="Before" fill="#ffb020" radius={[3, 3, 0, 0]} />
              <Bar dataKey="after" name="After" fill="#00d68f" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel dense subtitle="Ranked worst-first by current RPN, then severity.">
        <DataTable
          rows={program.fmea}
          columns={columns}
          filters={filters}
          onRowClick={(f) => setFocus(f.id)}
          caption="FMEA register"
          searchPlaceholder="Search failure modes"
          initialSort={{ key: 'rpn', direction: 'desc' }}
        />
      </Panel>

      <SlideOver open={Boolean(item)} onClose={() => setFocus(null)} title={item ? item.ref + '  ' + item.failureMode : ''} width="wider">
        {item && <FmeaDetail item={item} />}
      </SlideOver>
    </>
  );
}

function FmeaDetail({ item }: { item: FMEAItem }) {
  const analytics = useStore((s) => s.analytics);
  const program = useStore((s) => s.program);
  const a = analytics.fmea.byId[item.id];
  if (!a) return <EmptyState title="No assessment available." />;

  const linkedRisks = program.risks.filter((r) => item.linkedRiskIds.includes(r.id));
  const linkedCauses = program.causes.filter((c) => item.linkedCauseIds.includes(c.id));
  const linkedControls = program.controls.filter((c) => item.linkedControlIds.includes(c.id));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Process">{item.process}</Field>
        <Field label="Process step">{item.processStep}</Field>
        <Field label="Effect">{item.effect}</Field>
        <Field label="Cause">{item.cause}</Field>
      </div>

      <Section title="Before countermeasure">
        <div className="grid grid-cols-4 gap-2 text-center">
          <ScoreBox label="Severity" value={item.severity} />
          <ScoreBox label="Occurrence" value={item.occurrence} />
          <ScoreBox label="Detection" value={item.detection} />
          <div className="rounded-md border border-threat/30 bg-threat/5 p-2">
            <div className="label">RPN</div>
            <div className="num mt-1 text-lg text-threat">{a.rpn}</div>
          </div>
        </div>
      </Section>

      <Section title="After countermeasure">
        <div className="grid grid-cols-4 gap-2 text-center">
          <ScoreBox label="Severity" value={item.postSeverity} />
          <ScoreBox label="Occurrence" value={item.postOccurrence} />
          <ScoreBox label="Detection" value={item.postDetection} />
          <div className="rounded-md border border-controlled/30 bg-controlled/5 p-2">
            <div className="label">Residual RPN</div>
            <div className="num mt-1 text-lg text-controlled">{a.residualRpn}</div>
          </div>
        </div>
        <p className="mt-2 text-2xs text-ink-400">{formatPercent(a.rpnReductionPct, 0)} reduction, {a.rpnReduction} points removed.</p>
      </Section>

      <Section title="Existing control and recommended action">
        <Field label="Existing control">{item.existingControl}</Field>
        <div className="mt-3">
          <Field label="Recommended action">{item.recommendedAction}</Field>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Owner">{analytics.ownerById[item.ownerId] ?? item.ownerId}</Field>
          <Field label="Due">{formatDate(item.dueDate)}</Field>
        </div>
      </Section>

      <Section title="Why this matters">
        <ul className="space-y-1.5">
          {a.drivers.map((d) => (
            <li key={d} className="text-xs text-ink-300">
              &bull; {d}
            </li>
          ))}
        </ul>
      </Section>

      {(linkedRisks.length > 0 || linkedCauses.length > 0 || linkedControls.length > 0) && (
        <Section title="Linked">
          {linkedRisks.map((r) => (
            <p key={r.id} className="text-xs text-ink-300">
              Risk &bull; {r.ref} {r.title}
            </p>
          ))}
          {linkedCauses.map((c) => (
            <p key={c.id} className="text-xs text-ink-300">
              Cause &bull; {c.title}
            </p>
          ))}
          {linkedControls.map((c) => (
            <p key={c.id} className="text-xs text-ink-300">
              Control &bull; {c.name}
            </p>
          ))}
        </Section>
      )}
    </div>
  );
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-base-500 p-2">
      <div className="label">{label}</div>
      <div className="num mt-1 text-lg text-ink-100">{value}</div>
    </div>
  );
}

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Copy } from 'lucide-react';
import { useStore } from '@/state/store';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat, RagBadge } from '@/ui/primitives';
import { formatCurrency, formatPercent, titleCase } from '@/lib/format';
import { formatDate } from '@/lib/dates';
import { ROUTE_BY_PATH } from '@/nav';

const meta = ROUTE_BY_PATH['/brief'];

function buildBriefText(program: import('@/domain/types').Program, analytics: import('@/state/analytics').Analytics): string {
  const money = (n: number) => formatCurrency(n, program.currency);
  const h = analytics.health;
  const lines: string[] = [];
  lines.push(program.codename + ' \u2014 ' + program.name);
  lines.push('Status date: ' + formatDate(program.statusDate) + '  |  Health: ' + h.overall.status.toUpperCase() + ' (' + Math.round(h.overall.score) + '/100)');
  lines.push(h.overall.headline);
  lines.push('');
  lines.push('Residual risk exposure: ' + money(h.risk.totalResidualExposure) + '  |  Expected benefits: ' + money(h.benefits.totalExpected) + '  |  Realised: ' + money(h.benefits.totalRealised));
  lines.push('Milestones at risk: ' + h.schedule.atRisk + ' of ' + h.schedule.total + '  |  Critical dependencies open: ' + h.dependencies.criticalOpen);
  lines.push('');
  lines.push('TOP RISKS');
  for (const r of h.risk.topRisks.slice(0, 5)) lines.push(' - ' + r.ref + ' ' + r.title + ' \u2014 ' + money(r.residualFinancialExposure) + ' residual, ' + titleCase(r.trend));
  lines.push('');
  lines.push('MILESTONES AT RISK');
  for (const m of h.schedule.assessments.filter((a) => a.isAtRisk).slice(0, 6)) lines.push(' - ' + m.name + ' \u2014 ' + m.drivers.join('; '));
  lines.push('');
  lines.push('DECISIONS REQUIRED');
  for (const d of program.decisions.filter((d) => d.status === 'required' || d.status === 'scheduled')) lines.push(' - ' + d.ref + ' ' + d.title + ' (due ' + formatDate(d.dateRequired) + ')');
  return lines.join('\n');
}

export function BriefScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const notify = useStore((s) => s.notify);
  const money = (n: number) => formatCurrency(n, program.currency);
  const h = analytics.health;
  const ownerName = (id: string) => analytics.ownerById[id] ?? id;

  const topRisks = h.risk.topRisks.slice(0, 5);

  const majorIssues = useMemo(
    () =>
      [...program.issues]
        .filter((i) => i.status === 'open' || i.status === 'in-progress' || i.status === 'escalated')
        .sort((a, b) => b.actualCostImpact - a.actualCostImpact)
        .slice(0, 5),
    [program.issues],
  );

  const milestonesAtRisk = useMemo(
    () =>
      h.schedule.assessments
        .filter((a) => a.isAtRisk)
        .sort((a, b) => (a.daysToForecast ?? 9999) - (b.daysToForecast ?? 9999))
        .slice(0, 6),
    [h.schedule.assessments],
  );

  const criticalDeps = useMemo(
    () =>
      h.dependencies.assessments
        .filter((a) => a.criticality === 'critical' && a.status !== 'delivered' && a.status !== 'cancelled')
        .sort((a, b) => b.expectedDelayDays - a.expectedDelayDays)
        .slice(0, 5),
    [h.dependencies.assessments],
  );

  const decisionsRequired = useMemo(
    () =>
      [...program.decisions]
        .filter((d) => d.status === 'required' || d.status === 'scheduled')
        .sort((a, b) => (a.dateRequired < b.dateRequired ? -1 : 1))
        .slice(0, 5),
    [program.decisions],
  );

  const benefitsAtRisk = useMemo(
    () =>
      h.benefits.assessments
        .filter((a) => a.status === 'at-risk' || a.status === 'lost')
        .sort((a, b) => b.valueAtRisk - a.valueAtRisk)
        .slice(0, 5),
    [h.benefits.assessments],
  );

  const majorChanges = useMemo(
    () =>
      h.changes.assessments
        .filter((a) => a.decision === 'pending' || a.decision === 'escalated')
        .sort((a, b) => Math.abs(b.costImpact) - Math.abs(a.costImpact))
        .slice(0, 5),
    [h.changes.assessments],
  );

  const escalations = useMemo(() => {
    const items: { label: string; detail: string; to: string }[] = [];
    for (const r of program.risks.filter((r) => r.status === 'escalated')) items.push({ label: r.ref + ' ' + r.title, detail: 'Risk escalated', to: '/risk?focus=' + r.id });
    for (const i of program.issues.filter((i) => i.status === 'escalated')) items.push({ label: i.ref + ' ' + i.title, detail: 'Issue escalated', to: '/raid?focus=' + i.id });
    for (const a of h.changes.assessments.filter((a) => a.decision === 'escalated')) items.push({ label: a.ref + ' ' + a.title, detail: 'Change escalated to steering committee', to: '/change?focus=' + a.changeId });
    return items;
  }, [program.risks, program.issues, h.changes.assessments]);

  const handleCopy = () => {
    const text = buildBriefText(program, analytics);
    navigator.clipboard
      .writeText(text)
      .then(() => notify({ kind: 'success', message: 'Brief copied to clipboard as plain text.' }))
      .catch(() => notify({ kind: 'error', message: 'Could not access the clipboard.' }));
  };

  return (
    <>
      <ScreenHeader
        code={meta.code}
        title={meta.label}
        purpose={meta.purpose}
        actions={
          <>
            <button type="button" className="btn" onClick={handleCopy}>
              <Copy className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
              Copy as text
            </button>
            <button type="button" className="btn-primary" onClick={() => window.print()}>
              <Printer className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
              Print / Export PDF
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-[880px] space-y-4 print:max-w-none">
        <Panel className="print:border-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-2xs uppercase tracking-widest text-ink-500">Executive Brief</div>
              <p className="mt-1 text-xl font-semibold text-ink-50">
                {program.codename} <span className="text-ink-400">&mdash; {program.name}</span>
              </p>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-ink-300">{h.overall.headline}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-2xs text-ink-500">
                <span>Sponsor: {program.sponsor}</span>
                <span>Programme manager: {program.programManager}</span>
                <span>Status date: {formatDate(program.statusDate)}</span>
              </div>
            </div>
            <div className="text-right">
              <RagBadge status={h.overall.status} label={'HEALTH ' + Math.round(h.overall.score)} />
            </div>
          </div>

          <div className="mt-4 grid gap-3 border-t border-base-600 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Residual risk exposure" value={money(h.risk.totalResidualExposure)} hint={h.risk.criticalCount + ' critical risk(s)'} tone="threat" />
            <Stat label="Expected benefits" value={money(h.benefits.totalExpected)} hint={formatPercent(h.benefits.realisationPct, 0) + ' realised'} tone="strategic" />
            <Stat label="Milestones at risk" value={h.schedule.atRisk + ' / ' + h.schedule.total} hint={h.schedule.gatesAtRisk + ' stage gate(s)'} tone="attention" />
            <Stat label="Change exposure" value={money(h.changes.pendingCostExposure)} hint={h.changes.escalated + ' escalated of ' + h.changes.total} tone="info" />
          </div>
        </Panel>

        <Panel title="Programme health" subtitle="Every dimension, worst first, with the driver that explains it.">
          <div className="grid gap-3 sm:grid-cols-3">
            {h.worstDimensions.map((d) => (
              <div key={d.dimension} className="rounded-md border border-base-500 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-semibold uppercase tracking-wide text-ink-300">{titleCase(d.dimension)}</span>
                  <RagBadge status={d.status} label={String(Math.round(d.score))} />
                </div>
                <p className="mt-1.5 text-2xs leading-relaxed text-ink-400">{d.headline}</p>
              </div>
            ))}
          </div>
        </Panel>

        <BriefTable
          title="Top risks"
          subtitle="Ranked by exposure, velocity and evidence confidence combined."
          rows={topRisks}
          empty="No open risks."
          columns={[
            { header: 'Risk', render: (r) => r.ref + '  ' + r.title, to: (r) => '/risk?focus=' + r.riskId },
            { header: 'Residual', render: (r) => money(r.residualFinancialExposure), align: 'right' as const },
            { header: 'Trend', render: (r) => <Chip tone={r.trend === 'accelerating' || r.trend === 'deteriorating' ? 'threat' : 'controlled'}>{titleCase(r.trend)}</Chip> },
          ]}
        />

        <BriefTable
          title="Major issues"
          subtitle="Open and escalated issues, ranked by realised cost impact."
          rows={majorIssues}
          empty="No open issues."
          columns={[
            { header: 'Issue', render: (i) => i.ref + '  ' + i.title, to: (i) => '/raid?focus=' + i.id },
            { header: 'Owner', render: (i) => ownerName(i.ownerId) },
            { header: 'Cost impact', render: (i) => money(i.actualCostImpact), align: 'right' as const },
            { header: 'Status', render: (i) => <Chip tone={i.status === 'escalated' ? 'threat' : 'attention'}>{titleCase(i.status)}</Chip> },
          ]}
        />

        <BriefTable
          title="Milestones at risk"
          subtitle="Nearest forecast date first."
          rows={milestonesAtRisk}
          empty="No milestone currently at risk."
          columns={[
            { header: 'Milestone', render: (m) => m.name, to: (m) => '/program?focus=' + m.milestoneId },
            { header: 'Forecast', render: (m) => formatDate(m.forecastDate) },
            { header: 'Variance', render: (m) => (m.varianceDays > 0 ? '+' : '') + m.varianceDays + 'd', align: 'right' as const },
            { header: 'Why', render: (m) => <span className="text-2xs text-ink-400">{m.drivers[0] ?? ''}</span> },
          ]}
        />

        <BriefTable
          title="Critical dependencies"
          subtitle="Open critical-path dependencies with the highest probability-weighted slip."
          rows={criticalDeps}
          empty="No critical dependency is currently exposed."
          columns={[
            { header: 'Dependency', render: (d) => d.name, to: (d) => '/dependencies?focus=' + d.dependencyId },
            { header: 'Expected slip', render: (d) => Math.round(d.expectedDelayDays) + 'd', align: 'right' as const },
            { header: 'Benefit at risk', render: (d) => money(d.benefitValueAtRisk), align: 'right' as const },
          ]}
        />

        <BriefTable
          title="Decisions required"
          subtitle="Awaiting a decision, earliest due date first."
          rows={decisionsRequired}
          empty="No decision is currently outstanding."
          columns={[
            { header: 'Decision', render: (d) => d.ref + '  ' + d.title, to: (d) => '/decisions?focus=' + d.id },
            { header: 'Forum', render: (d) => d.forum },
            { header: 'Due', render: (d) => formatDate(d.dateRequired), align: 'right' as const },
          ]}
        />

        <BriefTable
          title="Benefits at risk"
          subtitle="Unrealised value with the highest probability-weighted loss."
          rows={benefitsAtRisk}
          empty="No benefit is currently flagged at risk."
          columns={[
            { header: 'Benefit', render: (b) => b.name, to: (b) => '/benefits?focus=' + b.benefitId },
            { header: 'Value at risk', render: (b) => money(b.valueAtRisk), align: 'right' as const },
            { header: 'Confidence', render: (b) => <Chip tone={b.confidence === 'low' ? 'threat' : 'attention'}>{titleCase(b.confidence)}</Chip> },
          ]}
        />

        <BriefTable
          title="Major changes"
          subtitle="Pending and escalated change requests, largest cost impact first."
          rows={majorChanges}
          empty="No change is currently pending."
          columns={[
            { header: 'Change', render: (c) => c.ref + '  ' + c.title, to: (c) => '/change?focus=' + c.changeId },
            { header: 'Cost impact', render: (c) => money(c.costImpact), align: 'right' as const },
            { header: 'Decision', render: (c) => <Chip tone={c.decision === 'escalated' ? 'threat' : 'attention'}>{titleCase(c.decision)}</Chip> },
          ]}
        />

        <Panel title="Escalations requiring executive attention" subtitle="Every risk, issue and change currently flagged escalated, in one place.">
          {escalations.length === 0 ? (
            <p className="text-xs text-ink-400">Nothing is currently escalated.</p>
          ) : (
            <ul className="space-y-1.5">
              {escalations.map((e) => (
                <li key={e.to}>
                  <Link to={e.to} className="flex items-center justify-between gap-2 rounded px-1.5 py-1 text-xs text-ink-200 hover:bg-base-700/60">
                    <span>{e.label}</span>
                    <Chip tone="threat">{e.detail}</Chip>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

interface BriefColumn<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  align?: 'left' | 'right';
  to?: (row: T) => string;
}

function BriefTable<T>({
  title,
  subtitle,
  rows,
  columns,
  empty,
}: {
  title: string;
  subtitle: string;
  rows: T[];
  columns: BriefColumn<T>[];
  empty: string;
}) {
  return (
    <Panel title={title} subtitle={subtitle} dense>
      {rows.length === 0 ? (
        <p className="px-4 py-3 text-xs text-ink-400">{empty}</p>
      ) : (
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-base-600 text-2xs uppercase tracking-wide text-ink-500">
              {columns.map((c) => (
                <th key={c.header} className={'px-4 py-2 font-medium' + (c.align === 'right' ? ' text-right' : '')}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-base-700/60 last:border-0">
                {columns.map((c, ci) => (
                  <td key={c.header} className={'px-4 py-2 text-ink-200' + (c.align === 'right' ? ' text-right num' : '')}>
                    {ci === 0 && c.to ? (
                      <Link to={c.to(row)} className="font-medium text-ink-100 hover:text-strategic hover:underline">
                        {c.render(row)}
                      </Link>
                    ) : (
                      c.render(row)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/state/store';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, RagBadge, Meter, Stat, DriverList, Chip } from '@/ui/primitives';
import { cx } from '@/lib/cx';
import { formatCurrency, formatNumber } from '@/lib/format';
import { ROUTE_BY_PATH } from '@/nav';

const meta = ROUTE_BY_PATH['/portfolio'];

/**
 * The portfolio-level landing screen. Every number here is read straight off
 * the store's already-computed portfolio derivatives (portfolioHealth,
 * analyticsByProgramId, crossLinkImpacts, concentration) — this screen never
 * runs an engine itself, matching every other screen's contract.
 */
export function PortfolioCommandCenter() {
  const portfolio = useStore((s) => s.portfolio);
  const activeProgramId = useStore((s) => s.activeProgramId);
  const switchProgram = useStore((s) => s.switchProgram);
  const portfolioHealth = useStore((s) => s.portfolioHealth);
  const analyticsByProgramId = useStore((s) => s.analyticsByProgramId);
  const crossLinkImpacts = useStore((s) => s.crossLinkImpacts);
  const vendorConcentration = useStore((s) => s.vendorConcentration);
  const ownerConcentration = useStore((s) => s.ownerConcentration);
  const sharedRiskGroups = useStore((s) => s.sharedRiskGroups);
  const navigate = useNavigate();

  const rows = useMemo(
    () =>
      portfolio.programs.map((program) => {
        const analytics = analyticsByProgramId[program.id];
        const impacts = crossLinkImpacts[program.id] ?? [];
        return { program, analytics, impacts };
      }),
    [portfolio.programs, analyticsByProgramId, crossLinkImpacts],
  );

  const totals = rows.reduce(
    (acc, r) => {
      const currency = r.program.currency || 'EUR';
      acc.exposure += r.analytics?.health.risk.totalResidualExposure ?? 0;
      acc.benefitsAtRisk += r.analytics?.health.benefits.totalValueAtRisk ?? 0;
      acc.risks += r.program.risks.filter((rk) => rk.status !== 'closed').length;
      acc.currency = currency;
      return acc;
    },
    { exposure: 0, benefitsAtRisk: 0, risks: 0, currency: 'EUR' },
  );

  const criticalDependencies = rows
    .flatMap((r) => r.impacts.map((impact) => ({ ...impact, toCodename: r.program.codename, toProgramId: r.program.id })))
    .filter((i) => i.penaltyPoints > 0.5)
    .sort((a, b) => b.penaltyPoints - a.penaltyPoints);

  const overloadedOwners = ownerConcentration.filter((o) => o.overloaded);
  const crossingVendors = vendorConcentration.filter((v) => v.crossesPrograms);

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Panel title="Portfolio health" className="lg:col-span-1">
          <div className="flex items-center justify-between">
            <Stat label="Weighted score" value={formatNumber(portfolioHealth.score, 0) + ' / 100'} />
            <RagBadge status={portfolioHealth.status} />
          </div>
          <p className="mt-3 text-2xs leading-relaxed text-ink-400">{portfolioHealth.headline}</p>
        </Panel>

        <Panel title="Programmes" className="lg:col-span-1">
          <Stat label="Active programmes" value={String(portfolio.programs.length)} hint={rows.map((r) => r.program.codename).join(' \u00b7 ')} />
        </Panel>

        <Panel title="Aggregate residual exposure" className="lg:col-span-1">
          <Stat label="Across all programmes" value={formatCurrency(totals.exposure, totals.currency)} tone="threat" hint={totals.risks + ' open risk(s)'} />
        </Panel>

        <Panel title="Benefits at risk" className="lg:col-span-1">
          <Stat label="Across all programmes" value={formatCurrency(totals.benefitsAtRisk, totals.currency)} tone="attention" />
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Programmes" subtitle="Click through to a programme's own Command Center" className="lg:col-span-2" dense>
          <div className="divide-y divide-base-600">
            {rows.map(({ program, analytics, impacts }) => {
              const health = analytics?.health;
              const isActive = program.id === activeProgramId;
              return (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => {
                    switchProgram(program.id);
                    navigate('/');
                  }}
                  className={cx(
                    'flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-base-700/60',
                    isActive && 'bg-base-700/40',
                  )}
                >
                  <div className="w-24 shrink-0">
                    <div className="num text-sm font-bold text-ink-100">{program.codename}</div>
                    <div className="text-2xs text-ink-500">{program.strategicPriority ?? 'medium'} priority</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs text-ink-300">{program.name}</div>
                    <Meter value={health?.overall.score ?? 0} max={100} tone={health?.overall.status === 'red' ? 'threat' : health?.overall.status === 'amber' ? 'attention' : 'controlled'} className="mt-1.5" label={program.codename + ' health'} />
                  </div>
                  <div className="w-28 shrink-0 text-right">
                    <div className="num text-sm text-threat">{formatCurrency(health?.risk.totalResidualExposure ?? 0, program.currency)}</div>
                    {impacts.length > 0 && (
                      <div className="text-2xs text-attention">{impacts.length} cross-link impact{impacts.length > 1 ? 's' : ''}</div>
                    )}
                  </div>
                  <RagBadge status={health?.overall.status ?? 'green'} label={formatNumber(health?.overall.score ?? 0, 0)} />
                  <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-500" />
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="Portfolio health drivers" subtitle="Weight = strategic priority x budget share, never a naive average" dense className="lg:col-span-1">
          <div className="p-4">
            <DriverList drivers={portfolioHealth.drivers.map((d) => ({ label: d.label, detail: d.detail, contribution: d.contribution }))} />
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Critical cross-programme dependencies" subtitle="A slip upstream, priced in days and euros, on the programme it lands on" className="lg:col-span-1">
          {criticalDependencies.length === 0 ? (
            <p className="text-2xs text-ink-500">No material cross-programme slip is currently transferring between programmes.</p>
          ) : (
            <ul className="space-y-3">
              {criticalDependencies.map((impact) => (
                <li key={impact.linkId + impact.toProgramId} className="text-2xs">
                  <div className="flex items-center gap-2">
                    <Chip tone="attention">{impact.fromProgramName}</Chip>
                    <ChevronRight aria-hidden="true" className="h-3 w-3 text-ink-500" />
                    <Chip tone="threat">{impact.toCodename}</Chip>
                    <span className="num ml-auto text-ink-300">-{formatNumber(impact.penaltyPoints, 1)} pts</span>
                  </div>
                  <p className="mt-1 leading-relaxed text-ink-400">{impact.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Vendor concentration" subtitle="Same supplier, more than one programme exposed" className="lg:col-span-1">
          {crossingVendors.length === 0 ? (
            <p className="text-2xs text-ink-500">No vendor currently has open risk in more than one programme.</p>
          ) : (
            <ul className="space-y-3">
              {crossingVendors.map((v) => (
                <li key={v.vendor} className="text-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-200">{v.vendor}</span>
                    <span className="num text-threat">{formatCurrency(v.totalInherentExposure, totals.currency)}</span>
                  </div>
                  <p className="mt-0.5 text-ink-500">{v.riskCount} open risk(s) across {v.programCodenames.join(', ')}</p>
                </li>
              ))}
            </ul>
          )}
          {sharedRiskGroups.length > 0 && (
            <div className="mt-4 border-t border-base-600 pt-3">
              <div className="label mb-2">Same underlying risk, more than one programme</div>
              <ul className="space-y-2">
                {sharedRiskGroups.map((g) => (
                  <li key={g.sharedRiskGroupId} className="text-2xs text-ink-400">
                    <span className="text-ink-200">{g.title}</span> {'—'} {g.programCodenames.join(' + ')}, {formatCurrency(g.totalExposure, totals.currency)} combined
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>

        <Panel title="Owner concentration" subtitle="Workload exposure across programmes, not a performance judgement" className="lg:col-span-1">
          {overloadedOwners.length === 0 ? (
            <p className="text-2xs text-ink-500">No owner currently carries an overloaded workload across more than one programme.</p>
          ) : (
            <ul className="space-y-3">
              {overloadedOwners.map((o) => (
                <li key={o.ownerName} className="text-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-200">{o.ownerName}</span>
                    <span className="num text-attention">{o.openRiskCount + o.openActionCount} open item(s)</span>
                  </div>
                  <p className="mt-0.5 text-ink-500">Across {o.programCodenames.join(', ')}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

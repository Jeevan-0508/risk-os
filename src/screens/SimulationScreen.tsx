import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Dices } from 'lucide-react';
import { useStore } from '@/state/store';
import { DEFAULT_SIMULATION_CONFIG, deriveTasks, explainPercentile, runSimulation } from '@/domain/engines/simulationEngine';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat } from '@/ui/primitives';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';
import { chartTheme, tooltipStyle } from '@/ui/chart';
import { ROUTES } from '@/nav';

const meta = ROUTES.find((r) => r.code === '11')!;
const LEVELS = [0.1, 0.5, 0.8, 0.9, 0.95];

/**
 * A sampler over the estimate ranges that were entered, not a prediction. The
 * assumption list is shown next to every number, per the product rule that
 * this screen must never be allowed to look like a forecast.
 */
export function SimulationScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const [iterations, setIterations] = useState(DEFAULT_SIMULATION_CONFIG.iterations);
  const [seed, setSeed] = useState(DEFAULT_SIMULATION_CONFIG.seed);
  const [includeRiskEvents, setIncludeRiskEvents] = useState(true);
  const [runToken, setRunToken] = useState(0);

  const tasks = useMemo(() => deriveTasks(program), [program]);
  const residualProbabilityById = useMemo(
    () => Object.fromEntries(analytics.health.risk.assessments.map((a) => [a.riskId, a.residualProbability])),
    [analytics],
  );

  const result = useMemo(
    () =>
      runSimulation(tasks, program.risks, residualProbabilityById, {
        iterations,
        seed,
        includeRiskEvents,
        confidenceLevels: LEVELS,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, program.risks, residualProbabilityById, iterations, seed, includeRiskEvents, runToken],
  );

  const money = (n: number) => formatCurrency(n, program.currency);
  const scheduleHist = result.schedule.histogram.map((b) => ({ label: Math.round((b.from + b.to) / 2) + 'd', count: b.count }));
  const costHist = result.cost.histogram.map((b) => ({ label: money(Math.round((b.from + b.to) / 2)), count: b.count }));

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <Panel title="Simulation configuration" className="mb-4" dense>
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="iterations" className="label mb-1 block">
              Iterations
            </label>
            <input
              id="iterations"
              type="number"
              min={100}
              max={50000}
              step={100}
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="input w-full"
            />
          </div>
          <div>
            <label htmlFor="seed" className="label mb-1 block">
              Random seed
            </label>
            <input id="seed" type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} className="input w-full" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-xs text-ink-300">
              <input type="checkbox" checked={includeRiskEvents} onChange={(e) => setIncludeRiskEvents(e.target.checked)} className="h-3.5 w-3.5 accent-threat" />
              Include discrete risk events
            </label>
          </div>
          <div className="flex items-end">
            <button type="button" onClick={() => setRunToken((t) => t + 1)} className="btn btn-primary w-full">
              <Dices aria-hidden="true" className="h-3.5 w-3.5" /> Re-run
            </button>
          </div>
        </div>
        {result.warnings.length > 0 && (
          <div className="border-t border-base-600 px-4 py-2">
            {result.warnings.map((w) => (
              <p key={w} className="text-2xs text-attention">
                {w}
              </p>
            ))}
          </div>
        )}
      </Panel>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="P50 schedule" value={formatNumber(Math.round(result.schedule.percentiles['0.5'] ?? 0)) + ' days'} tone="info" />
        <Stat label="P80 schedule" value={formatNumber(Math.round(result.schedule.percentiles['0.8'] ?? 0)) + ' days'} hint={'+' + Math.round(result.schedule.contingencyAtP80) + 'd over deterministic'} tone="attention" />
        <Stat label="P50 cost" value={money(result.cost.percentiles['0.5'] ?? 0)} tone="info" />
        <Stat label="P80 cost" value={money(result.cost.percentiles['0.8'] ?? 0)} hint={money(result.cost.contingencyAtP80) + ' over deterministic'} tone="threat" />
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Schedule distribution" subtitle={explainPercentile(0.8, result.schedule.percentiles['0.8'] ?? 0, 'days', result.schedule.deterministic)}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scheduleHist} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="label" {...chartTheme.axis} interval={2} />
                <YAxis {...chartTheme.axis} width={28} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" fill="#3b9cff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Cost distribution" subtitle={explainPercentile(0.8, result.cost.percentiles['0.8'] ?? 0, program.currency, result.cost.deterministic)}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costHist} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="label" {...chartTheme.axis} interval={2} angle={-25} textAnchor="end" height={50} />
                <YAxis {...chartTheme.axis} width={28} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" fill="#ffb020" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Percentiles" dense>
          <table className="w-full text-xs">
            <thead>
              <tr className="th">
                <th className="th text-left">Confidence</th>
                <th className="th text-right">Schedule</th>
                <th className="th text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {LEVELS.map((l) => (
                <tr key={l}>
                  <td className="td">P{Math.round(l * 100)}</td>
                  <td className="td num text-right">{formatNumber(Math.round(result.schedule.percentiles[String(l)] ?? 0))} days</td>
                  <td className="td num text-right">{money(result.cost.percentiles[String(l)] ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Schedule drivers" subtitle="Share of total simulated days contributed by each derived task." dense>
          <ul className="divide-y divide-base-600">
            {result.scheduleDrivers.slice(0, 8).map((d) => (
              <li key={d.taskId} className="flex items-center gap-3 px-4 py-2">
                <span className="min-w-0 flex-1 truncate text-xs text-ink-200">{d.name}</span>
                <span className="num w-12 text-right text-2xs text-ink-400">{formatPercent(d.contributionPct, 0)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {result.riskFireRates.length > 0 && (
        <Panel title="Risk event firing rates" subtitle="Sanity check: observed firing rate against the residual probability the risk carries." className="mb-4" dense>
          <ul className="divide-y divide-base-600">
            {result.riskFireRates.slice(0, 10).map((r) => (
              <li key={r.riskId} className="flex items-center gap-3 px-4 py-2">
                <span className="num w-14 shrink-0 text-2xs text-ink-500">{r.ref}</span>
                <span className="min-w-0 flex-1 truncate text-xs text-ink-200">{r.title}</span>
                <span className="num text-2xs text-ink-400">observed {formatPercent(r.fireRate, 0)}</span>
                <span className="num text-2xs text-ink-500">expected {formatPercent(r.expectedRate, 0)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title="Assumptions" subtitle="Stated in full so this cannot be mistaken for a forecast.">
        <ul className="space-y-3">
          {result.assumptions.map((a) => (
            <li key={a.label}>
              <Chip tone="strategic">{a.label}</Chip>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{a.detail}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

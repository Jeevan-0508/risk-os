import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/state/store';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, RagBadge } from '@/ui/primitives';
import { DataTable, type Column, type FilterGroup } from '@/ui/DataTable';
import { formatCurrency, titleCase } from '@/lib/format';
import { formatDate } from '@/lib/dates';
import { ROUTE_BY_PATH } from '@/nav';
import type { Program, Risk } from '@/domain/types';
import type { Analytics } from '@/state/analytics';

const meta = ROUTE_BY_PATH['/global-risks'];

interface RiskRow {
  /** Composite key: risk.id alone collides across programmes (each generator starts its own rsk-NN sequence). */
  id: string;
  risk: Risk;
  program: Program;
  analytics: Analytics;
}

/**
 * Every risk in every programme, one table, with a Program column. Rows read
 * from each programme's own analytics (already cross-link-adjusted where
 * relevant), so this screen, like every other, never recomputes engine
 * output itself.
 */
export function GlobalRiskRegister() {
  const portfolio = useStore((s) => s.portfolio);
  const analyticsByProgramId = useStore((s) => s.analyticsByProgramId);
  const switchProgram = useStore((s) => s.switchProgram);
  const navigate = useNavigate();

  const rows: RiskRow[] = useMemo(
    () =>
      portfolio.programs.flatMap((program) => {
        const analytics = analyticsByProgramId[program.id];
        if (!analytics) return [];
        return program.risks.map((risk) => ({ id: program.id + ':' + risk.id, risk, program, analytics }));
      }),
    [portfolio.programs, analyticsByProgramId],
  );

  const nameOf = (row: RiskRow, id: string) => row.analytics.ownerById[id] ?? 'Unassigned';

  const columns: Column<RiskRow>[] = useMemo(
    () => [
      {
        key: 'program',
        header: 'Programme',
        render: (row) => <Chip tone="info">{row.program.codename}</Chip>,
        sortValue: (row) => row.program.codename,
        width: '6rem',
      },
      { key: 'ref', header: 'ID', render: (row) => <span className="num text-2xs text-ink-500">{row.risk.ref}</span>, sortValue: (row) => row.risk.ref, width: '4.5rem' },
      {
        key: 'title',
        header: 'Title',
        render: (row) => (
          <div>
            <div className="truncate text-ink-100">{row.risk.title}</div>
            <div className="truncate text-2xs text-ink-500">
              {titleCase(row.risk.category)}
              {row.risk.vendor ? ' \u00b7 ' + row.risk.vendor : ''}
              {row.risk.sharedRiskGroupId ? ' \u00b7 shared risk' : ''}
            </div>
          </div>
        ),
        sortValue: (row) => row.risk.title,
        searchValue: (row) => row.risk.title + ' ' + row.risk.description + ' ' + row.risk.ref + ' ' + (row.risk.vendor ?? ''),
      },
      { key: 'owner', header: 'Owner', render: (row) => nameOf(row, row.risk.ownerId), sortValue: (row) => nameOf(row, row.risk.ownerId), searchValue: (row) => nameOf(row, row.risk.ownerId) },
      { key: 'status', header: 'Status', render: (row) => <Chip>{titleCase(row.risk.status)}</Chip>, sortValue: (row) => row.risk.status },
      {
        key: 'severity',
        header: 'Residual',
        render: (row) => {
          const a = row.analytics.health.risk.byId[row.risk.id];
          return a ? <RagBadge status={a.residualSeverity} /> : '--';
        },
        sortValue: (row) => row.analytics.health.risk.byId[row.risk.id]?.residualScore ?? 0,
      },
      {
        key: 'exposure',
        header: 'Residual exposure',
        render: (row) => formatCurrency(row.analytics.health.risk.byId[row.risk.id]?.residualFinancialExposure ?? 0, row.program.currency),
        sortValue: (row) => row.analytics.health.risk.byId[row.risk.id]?.residualFinancialExposure ?? 0,
        align: 'right',
      },
      {
        key: 'trend',
        header: 'Trend',
        render: (row) => {
          const t = row.analytics.health.risk.byId[row.risk.id]?.trend ?? 'new';
          return <span className={t === 'accelerating' ? 'text-threat' : t === 'deteriorating' ? 'text-attention' : t === 'improving' ? 'text-controlled' : 'text-ink-400'}>{titleCase(t)}</span>;
        },
        sortValue: (row) => row.analytics.health.risk.byId[row.risk.id]?.velocity ?? 0,
      },
      { key: 'due', header: 'Review', render: (row) => formatDate(row.risk.reviewDate), sortValue: (row) => row.risk.reviewDate, optional: true },
    ],
    [],
  );

  const filters: FilterGroup<RiskRow>[] = [
    {
      key: 'program',
      label: 'Programme',
      options: portfolio.programs.map((p) => ({ value: p.id, label: p.codename, match: (row) => row.program.id === p.id })),
    },
    {
      key: 'status',
      label: 'Status',
      options: ['open', 'monitoring', 'escalated', 'accepted', 'materialised', 'closed'].map((s) => ({
        value: s,
        label: titleCase(s),
        match: (row) => row.risk.status === s,
      })),
    },
    {
      key: 'severity',
      label: 'Residual',
      options: (['red', 'amber', 'green'] as const).map((s) => ({
        value: s,
        label: titleCase(s),
        match: (row) => row.analytics.health.risk.byId[row.risk.id]?.residualSeverity === s,
      })),
    },
    {
      key: 'shared',
      label: 'Cross-programme',
      options: [
        { value: 'vendor', label: 'Has vendor tag', match: (row) => Boolean(row.risk.vendor) },
        { value: 'shared-group', label: 'Shared risk group', match: (row) => Boolean(row.risk.sharedRiskGroupId) },
      ],
    },
  ];

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />
      <Panel dense>
        <DataTable
          rows={rows}
          columns={columns}
          filters={filters}
          onRowClick={(row) => {
            switchProgram(row.program.id);
            navigate('/raid?focus=' + row.risk.id);
          }}
          caption={rows.length + ' risk(s) across ' + portfolio.programs.length + ' programme(s)'}
          searchPlaceholder="Search risks across every programme"
          initialSort={{ key: 'exposure', direction: 'desc' }}
        />
      </Panel>
    </>
  );
}

import { useMemo, useState } from 'react';
import { ROUTE_BY_PATH } from '@/nav';
import { useStore } from '@/state/store';
import { Chip, EmptyState, Panel } from '@/ui/primitives';
import { ScreenHeader } from '@/ui/ScreenHeader';
import type { RiskIntakeRecord } from '@/domain/types';

const meta = ROUTE_BY_PATH['/risk-intake'];

function label(value: string): string {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusTone(record: RiskIntakeRecord): 'neutral' | 'info' | 'attention' | 'controlled' | 'threat' {
  if (record.authority === 'synthetic') return 'attention';
  if (record.lifecycle === 'accepted') return 'controlled';
  if (record.lifecycle === 'rejected') return 'threat';
  return 'info';
}

export function RiskIntakeScreen() {
  const program = useStore((state) => state.program);
  const ingestRiskIntake = useStore((state) => state.ingestRiskIntake);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const records = useMemo(
    () => [...(program.riskIntakes ?? [])].sort((a, b) => b.capturedAt.localeCompare(a.capturedAt)),
    [program.riskIntakes],
  );

  const importFile = async (file: File) => {
    setBusy(true);
    setFeedback(null);
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('The intake file is larger than the 2 MB safety limit.');
      const result = ingestRiskIntake(JSON.parse(await file.text()));
      setFeedback(result.ok ? 'Risk intake ' + result.status + '.' : 'Rejected: ' + result.error);
    } catch (error) {
      setFeedback('Rejected: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />
      <Panel
        title="Controlled MESH intake"
        subtitle="Canonical handoffs are stored separately from scored Risk[] records until an operator reviews them."
        actions={
          <label className="btn btn-primary cursor-pointer">
            {busy ? 'Reading…' : 'Import JSON'}
            <input
              className="sr-only"
              type="file"
              accept="application/json,.json"
              disabled={busy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importFile(file);
                event.currentTarget.value = '';
              }}
            />
          </label>
        }
      >
        <div className="mb-4 border border-attention/40 bg-attention/10 p-3 text-xs leading-relaxed text-ink-300">
          Synthetic simulation candidates are hypotheses and context only. They never become real-world evidence, scored risks, or accepted records through this intake path. Unknown likelihood, impact, owner, control effectiveness and confidence stay visible as Unknown.
        </div>
        {feedback && <div className="mb-4 text-xs text-ink-300" role="status">{feedback}</div>}
        {records.length === 0 ? (
          <EmptyState title="No risk intake records" hint="Import a risk-intake.v1 handoff produced by the controlled MESH boundary." />
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <article key={record.intakeId} className="border border-base-500 bg-base-800/50 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-100">{record.statement}</div>
                    <div className="mt-1 text-2xs text-ink-500">{record.canonicalRiskId} · {record.sourceRepository} · {record.sourceRevision ? record.sourceRevision.slice(0, 12) : 'revision unknown'}</div>
                  </div>
                  <div className="flex gap-2"><Chip tone={statusTone(record)}>{label(record.lifecycle)}</Chip><Chip>{label(record.authority)}</Chip></div>
                </div>
                <div className="mt-3 grid gap-2 text-2xs text-ink-400 sm:grid-cols-3">
                  <div><span className="text-ink-500">Source:</span> {record.sourceSystem} / {label(record.dataClass)}</div>
                  <div><span className="text-ink-500">Evidence:</span> {record.evidenceIds.length} supporting, {record.contradictingEvidenceIds.length} contradicting</div>
                  <div><span className="text-ink-500">Assessment:</span> likelihood {record.likelihood ?? 'Unknown'} · impact {record.impact ?? 'Unknown'} · confidence {record.confidence ?? 'Unknown'}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}

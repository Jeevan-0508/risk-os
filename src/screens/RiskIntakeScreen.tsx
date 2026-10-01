import { useMemo, useState } from 'react';
import { ROUTE_BY_PATH } from '@/nav';
import { useStore } from '@/state/store';
import { Chip, EmptyState, Panel } from '@/ui/primitives';
import { ScreenHeader } from '@/ui/ScreenHeader';
import type { RiskIntakePromotion, RiskIntakeRecord } from '@/domain/types';

const meta = ROUTE_BY_PATH['/risk-intake'];

function label(value: string): string {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function shortName(record: RiskIntakeRecord): string {
  const identity = record.sourceIdentity;
  const mo = /^MO-\d+$/i.exec(identity);
  if (mo) {
    const afterColon = record.statement.split(': ', 2)[1] ?? record.statement;
    const title = afterColon.split(' (', 1)[0].trim();
    return `${mo[0].toUpperCase()} · ${title}`.slice(0, 120);
  }
  if (identity.startsWith('fraud-watch:')) {
    const signature = identity.replace(/^fraud-watch:/, '').replaceAll('+', ' / ').replaceAll('_', ' ');
    return `Candidate · ${signature}`.slice(0, 120);
  }
  return record.canonicalRiskId;
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
  const reviewRiskIntake = useStore((state) => state.reviewRiskIntake);
  const promoteRiskIntake = useStore((state) => state.promoteRiskIntake);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [operatorId, setOperatorId] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [assessmentJson, setAssessmentJson] = useState('');
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

  const review = (intakeId: string, decision: 'operator_review' | 'rejected') => {
    const result = reviewRiskIntake(intakeId, decision, operatorId, reviewNote);
    setFeedback(result.ok ? 'Review recorded.' : 'Rejected: ' + result.error);
  };

  const promote = (intakeId: string) => {
    try {
      const assessment = JSON.parse(assessmentJson) as RiskIntakePromotion;
      const result = promoteRiskIntake(intakeId, assessment);
      setFeedback(result.ok ? 'Promoted to scored risk ' + result.riskId + '.' : 'Rejected: ' + result.error);
    } catch (error) {
      setFeedback('Rejected: assessment JSON is invalid. ' + (error instanceof Error ? error.message : String(error)));
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
                    <div className="text-sm font-semibold text-ink-100">{shortName(record)}</div>
                    <div className="mt-1 max-w-5xl text-xs leading-relaxed text-ink-300">{record.statement}</div>
                    <div className="mt-1 text-2xs text-ink-500">{record.canonicalRiskId} · {record.sourceRepository} · {record.sourceRevision ? record.sourceRevision.slice(0, 12) : 'revision unknown'}</div>
                  </div>
                  <div className="flex gap-2"><Chip tone={statusTone(record)}>{label(record.lifecycle)}</Chip><Chip>{label(record.authority)}</Chip></div>
                </div>
                <div className="mt-3 grid gap-2 text-2xs text-ink-400 sm:grid-cols-3">
                  <div><span className="text-ink-500">Source:</span> {record.sourceSystem} / {label(record.dataClass)}</div>
                  <div><span className="text-ink-500">Evidence:</span> {record.evidenceIds.length} supporting, {record.contradictingEvidenceIds.length} contradicting</div>
                  <div><span className="text-ink-500">Assessment:</span> likelihood {record.likelihood ?? 'Unknown'} · impact {record.impact ?? 'Unknown'} · confidence {record.confidence ?? 'Unknown'}</div>
                </div>
                {record.syntheticContext && (
                  <details className="mt-3 border-t border-base-600 pt-3">
                    <summary className="cursor-pointer text-xs text-attention">Synthetic context · {record.syntheticContext.signalTypes.length} signal types</summary>
                    <div className="mt-3 space-y-3 text-2xs text-ink-300">
                      <p className="border border-attention/30 bg-attention/5 p-2 leading-relaxed">{record.syntheticContext.disclaimer}</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <div><span className="text-ink-500">Simulator status:</span> {record.syntheticContext.status ?? 'Unknown'}</div>
                        <div><span className="text-ink-500">Classification:</span> {record.syntheticContext.classification ?? 'Unknown'}</div>
                        <div><span className="text-ink-500">Correlation index:</span> {record.syntheticContext.correlationIndex ?? 'Unknown'}{record.syntheticContext.correlationIndexSemantics ? ` (${record.syntheticContext.correlationIndexSemantics})` : ''}</div>
                        <div><span className="text-ink-500">Confidence band:</span> {record.syntheticContext.confidenceBand ?? 'Unknown'}</div>
                        <div><span className="text-ink-500">Recurrence count:</span> {record.syntheticContext.recurrenceCount ?? 'Unknown'}</div>
                        <div><span className="text-ink-500">Site spread:</span> {record.syntheticContext.siteSpread ?? 'Unknown'}</div>
                      </div>
                      <div><span className="text-ink-500">Entities:</span> {Object.entries(record.syntheticContext.entityIds).filter(([, value]) => value).map(([key, value]) => `${label(key)} ${value}`).join(' · ') || 'Unknown'}</div>
                      <div><span className="text-ink-500">Signals:</span> {record.syntheticContext.signalTypes.map(label).join(' · ') || 'Unknown'}</div>
                      {record.syntheticContext.signals.length > 0 && (
                        <div className="overflow-x-auto border border-base-600">
                          <table className="w-full text-left text-2xs"><thead className="text-ink-500"><tr><th className="p-2">Signal</th><th className="p-2">Contribution</th><th className="p-2">Reliability</th><th className="p-2">Observed at</th><th className="p-2">Site</th></tr></thead><tbody>{record.syntheticContext.signals.map((signal, index) => <tr key={`${signal.signalType}-${signal.at ?? index}`} className="border-t border-base-600"><td className="p-2">{label(signal.signalType)}</td><td className="p-2">{signal.contribution ?? 'Unknown'}</td><td className="p-2">{signal.reliability ?? 'Unknown'}</td><td className="p-2">{signal.at ?? 'Unknown'}</td><td className="p-2">{signal.facilityName ?? signal.facilityId ?? 'Open road / unknown'}</td></tr>)}</tbody></table>
                        </div>
                      )}
                      {record.syntheticContext.relatedPatterns.length > 0 && <div><div className="mb-1 text-ink-500">Related taxonomy patterns</div><ul className="list-disc space-y-1 pl-4">{record.syntheticContext.relatedPatterns.map((pattern) => <li key={pattern.id}>{pattern.name} · {pattern.votes} shared keywords ({pattern.keywords.join(', ')})</li>)}</ul></div>}
                      {record.syntheticContext.resemblanceNotes.length > 0 && <div><div className="mb-1 text-ink-500">Interpretation notes</div><ul className="list-disc space-y-1 pl-4">{record.syntheticContext.resemblanceNotes.map((note, index) => <li key={`${index}-${note.slice(0, 20)}`}>{note}</li>)}</ul></div>}
                      {record.syntheticContext.legitimateExplanations.length > 0 && <div><div className="mb-1 text-ink-500">Documented legitimate explanations</div><ul className="list-disc space-y-1 pl-4">{record.syntheticContext.legitimateExplanations.map((item) => <li key={item.title}><b>{item.title}</b> — {item.actually} <span className="text-info">Rule out: {item.ruleOut}</span></li>)}</ul></div>}
                      {record.syntheticContext.countermeasures.length > 0 && <div><div className="mb-1 text-ink-500">Taxonomy countermeasures (context only)</div><ul className="list-disc space-y-1 pl-4">{record.syntheticContext.countermeasures.map((item, index) => <li key={`${item.bucket}-${index}`}><span className="text-ink-500">{label(item.bucket)}:</span> {item.text}</li>)}</ul></div>}
                    </div>
                  </details>
                )}
                {record.lifecycle !== 'accepted' && (
                  <details className="mt-3 border-t border-base-600 pt-3" open={reviewing === record.intakeId} onToggle={(event) => setReviewing(event.currentTarget.open ? record.intakeId : null)}>
                    <summary className="cursor-pointer text-xs text-info">Operator review</summary>
                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                      <div className="space-y-2">
                        <input className="input" placeholder="Operator id (self-declared)" value={operatorId} onChange={(event) => setOperatorId(event.target.value)} />
                        <textarea className="input min-h-20" placeholder="Review note and decision rationale" value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} />
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="btn" onClick={() => review(record.intakeId, 'operator_review')}>Mark under review</button>
                          <button type="button" className="btn btn-danger" onClick={() => review(record.intakeId, 'rejected')}>Reject</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <textarea className="input min-h-48 font-mono text-2xs" placeholder={'Explicit promotion assessment JSON. No values are inferred. Required fields include operatorId, note, dates, category, ownerId, workstreamId, status, strategy, likelihood, impact and evidenceConfidence.'} value={assessmentJson} onChange={(event) => setAssessmentJson(event.target.value)} />
                        <button type="button" className="btn btn-primary" onClick={() => promote(record.intakeId)}>Promote to scored Risk[]</button>
                        <p className="text-2xs leading-relaxed text-ink-500">Promotion requires non-synthetic source data, source-bound evidence, no unresolved contradictions, and every scored field supplied by the operator. Identity and source truth remain unverified.</p>
                      </div>
                    </div>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}

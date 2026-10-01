import { describe, expect, it } from 'vitest';
import { parseRiskIntake, toRiskIntakeRecord } from './riskIntake';

const base = (): any => ({
  schema_version: 'risk-intake.v1',
  kind: 'risk-intake',
  intake_id: 'intake-001',
  canonical_risk_id: 'risk:carrier-capacity',
  statement: 'Carrier capacity may be constrained during peak season.',
  source: {
    system: 'Risk-Mesh',
    repository: 'Risk-Mesh',
    revision: '0123456789abcdef0123456789abcdef01234567',
    uri: 'https://github.com/Jeevan-0508/Risk-Mesh/commit/0123456789abcdef0123456789abcdef01234567',
    identity: 'mesh:validation:2026-10-01',
    captured_at: '2026-10-01T12:00:00Z',
    data_class: 'external_source_content',
  },
  claim: {
    evidence_ids: ['ev-1'],
    contradicting_evidence_ids: [],
    hypothesis_context_sha256: null,
    mode_of_operation_id: 'FFT-001',
    likelihood: null,
    impact: null,
    financial_impact: null,
    owner_id: null,
    control_effectiveness: null,
    confidence: null,
  },
  lifecycle: { state: 'unverified_external', authority: 'external_unverified' },
  idempotency_key: 'risk:carrier-capacity@mesh:validation:2026-10-01',
});

describe('risk-intake.v1', () => {
  it('preserves unknown assessment fields as null and adapts to a separate record', () => {
    const parsed = parseRiskIntake(base());
    const record = toRiskIntakeRecord(parsed);
    expect(record.likelihood).toBeNull();
    expect(record.impact).toBeNull();
    expect(record.ownerId).toBeNull();
    expect(record.confidence).toBeNull();
    expect(record.history).toHaveLength(1);
  });

  it('allows synthetic context only as a hypothesis', () => {
    const input = base();
    input.source.data_class = 'synthetic_simulation';
    input.lifecycle = { state: 'hypothesis', authority: 'synthetic' };
    input.claim.evidence_ids = [];
    expect(parseRiskIntake(input).lifecycle.state).toBe('hypothesis');
    input.lifecycle = { state: 'accepted', authority: 'operator_validated' };
    expect(() => parseRiskIntake(input)).toThrow(/Synthetic simulation/);
  });

  it('does not allow model output to claim operator validation', () => {
    const input = base();
    input.source.data_class = 'model_output';
    input.lifecycle = { state: 'operator_review', authority: 'operator_validated' };
    expect(() => parseRiskIntake(input)).toThrow(/Model output/);
  });

  it('rejects unknown fields, malformed provenance and duplicate evidence', () => {
    const input = base() as Record<string, unknown>;
    input.extra = true;
    expect(() => parseRiskIntake(input)).toThrow(/unknown field/);
    const malformed = base();
    malformed.source.revision = 'not-a-sha';
    expect(() => parseRiskIntake(malformed)).toThrow(/revision/);
    const duplicate = base();
    duplicate.claim.contradicting_evidence_ids = ['ev-1'];
    expect(() => parseRiskIntake(duplicate)).toThrow(/both supporting/);
  });

  it('appends history only when the source or lifecycle changes', () => {
    const first = toRiskIntakeRecord(parseRiskIntake(base()));
    const same = toRiskIntakeRecord(parseRiskIntake(base()), first);
    expect(same.history).toHaveLength(1);
    const changed = base();
    changed.source.revision = 'fedcba9876543210fedcba9876543210fedcba98';
    changed.source.captured_at = '2026-10-02T12:00:00Z';
    const updated = toRiskIntakeRecord(parseRiskIntake(changed), same);
    expect(updated.history).toHaveLength(2);
  });
});

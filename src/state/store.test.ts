import { describe, expect, it } from 'vitest';
import { demoPortfolio } from '@/data/portfolio';
import { makeProgram } from '@/test/factories';
import { resolveInitialSeed, useStore } from './store';

describe('resolveInitialSeed', () => {
  it('returns the shipped demo portfolio when nothing is persisted', () => {
    const seed = resolveInitialSeed(null, null);
    expect(seed.portfolio).toBe(demoPortfolio);
    expect(seed.activeProgramId).toBe('prog-orion');
    expect(seed.source).toBe('demo');
  });

  it('prefers a portfolio-shaped save over a legacy single-programme save', () => {
    const seed = resolveInitialSeed(
      { version: 1, savedAt: '2026-01-01T00:00:00.000Z', source: 'edited', activeProgramId: 'prog-orion', portfolio: demoPortfolio },
      { version: 1, savedAt: '2026-01-01T00:00:00.000Z', source: 'demo', program: makeProgram({ id: 'prog-orion' }) },
    );
    // validatePortfolio repairs a clone (backfilling createdAt/updatedAt), so it is a
    // new object rather than the same reference; what matters is that the legacy save
    // never displaced the portfolio-shaped one.
    expect(seed.portfolio.id).toBe(demoPortfolio.id);
    expect(seed.portfolio.programs.map((p) => p.id)).toEqual(demoPortfolio.programs.map((p) => p.id));
    expect(seed.source).toBe('edited');
  });

  it('migrates a legacy single-programme save into a portfolio, keeping the demo companion programmes visible', () => {
    const legacyOrion = makeProgram({ id: 'prog-orion', name: 'My Edited Orion' });
    const seed = resolveInitialSeed(null, {
      version: 1,
      savedAt: '2026-01-01T00:00:00.000Z',
      source: 'edited',
      program: legacyOrion,
    });

    expect(seed.activeProgramId).toBe('prog-orion');
    expect(seed.source).toBe('edited');

    const ids = seed.portfolio.programs.map((p) => p.id);
    // The user's own saved programme replaces the demo's ORION, but ATLAS/NOVA/HELIOS stay so the other worked examples are never lost behind a one-programme portfolio.
    expect(ids).toContain('prog-orion');
    for (const companion of demoPortfolio.programs) {
      if (companion.id === 'prog-orion') continue;
      expect(ids).toContain(companion.id);
    }
    expect(seed.portfolio.programs.length).toBe(demoPortfolio.programs.length);

    const migratedOrion = seed.portfolio.programs.find((p) => p.id === 'prog-orion');
    expect(migratedOrion?.name).toBe('My Edited Orion');
  });

  it('never crashes when a legacy programme uses an id the demo does not have', () => {
    const legacyCustom = makeProgram({ id: 'prog-custom-legacy', name: 'Standalone Programme' });
    const seed = resolveInitialSeed(null, {
      version: 1,
      savedAt: '2026-01-01T00:00:00.000Z',
      source: 'imported',
      program: legacyCustom,
    });

    expect(seed.activeProgramId).toBe('prog-custom-legacy');
    const ids = seed.portfolio.programs.map((p) => p.id);
    expect(ids).toContain('prog-custom-legacy');
    expect(ids.length).toBe(demoPortfolio.programs.length + 1);
  });

  it('falls back to the demo portfolio when the legacy save fails validation', () => {
    const seed = resolveInitialSeed(null, {
      version: 1,
      savedAt: '2026-01-01T00:00:00.000Z',
      source: 'edited',
      program: { id: 'prog-broken' } as never,
    });
    expect(seed.portfolio).toBe(demoPortfolio);
    expect(seed.source).toBe('demo');
  });

  it('bundles the committed Fraud Watch hypothesis inbox into the active programme', () => {
    const records = useStore.getState().program.riskIntakes ?? [];
    expect(records.length).toBeGreaterThanOrEqual(10);
    expect(records.every((record) => record.lifecycle === 'hypothesis' && record.authority === 'synthetic')).toBe(true);
    expect(records.every((record) => record.evidenceIds.length === 0 && record.confidence === null)).toBe(true);
    expect(records.some((record) => record.intakeId === 'fraud-watch:mo:MO-0001')).toBe(true);
  });

  it('ingests a MESH handoff without adding an unreviewed record to scored risks', () => {
    const store = useStore.getState();
    store.resetToDemo();
    const beforeRiskCount = useStore.getState().program.risks.length;
    const input = {
      schema_version: 'risk-intake.v1',
      kind: 'risk-intake',
      intake_id: 'store-intake-001',
      canonical_risk_id: 'risk:store-boundary',
      statement: 'A source-bound handoff needs operator review.',
      source: {
        system: 'Risk-Mesh',
        repository: 'Risk-Mesh',
        revision: '0123456789abcdef0123456789abcdef01234567',
        uri: null,
        identity: 'mesh:test',
        captured_at: '2026-10-01T12:00:00Z',
        data_class: 'external_source_content',
      },
      claim: {
        evidence_ids: ['ev-store-1'],
        contradicting_evidence_ids: [],
        hypothesis_context_sha256: null,
        mode_of_operation_id: null,
        likelihood: null,
        impact: null,
        financial_impact: null,
        owner_id: null,
        control_effectiveness: null,
        confidence: null,
      },
      lifecycle: { state: 'unverified_external', authority: 'external_unverified' },
      idempotency_key: 'store-intake-001',
    };
    const created = useStore.getState().ingestRiskIntake(input);
    expect(created.ok).toBe(true);
    expect(useStore.getState().program.risks).toHaveLength(beforeRiskCount);
    expect(useStore.getState().program.riskIntakes).toHaveLength(1);
    const updated = useStore.getState().ingestRiskIntake({ ...input, statement: 'The same handoff was refreshed.' });
    expect(updated.ok).toBe(true);
    expect(useStore.getState().program.riskIntakes).toHaveLength(1);
    const promoted = useStore.getState().promoteRiskIntake('store-intake-001', {
      operatorId: 'operator-1',
      note: 'Reviewed the source-bound handoff and recorded the explicit assessment.',
      dateIdentified: '2026-10-01',
      reviewDate: '2026-11-01',
      category: 'operational',
      ownerId: 'own-1',
      workstreamId: 'ws-1',
      status: 'open',
      strategy: 'mitigate',
      inherentProbability: 0.4,
      inherentImpact: 3,
      inherentFinancialImpact: 100000,
      inherentScheduleImpactDays: 5,
      strategicImpact: 2,
      reputationImpact: 2,
      timeHorizon: 'near',
      evidenceConfidence: 'indicative',
    });
    expect(promoted.ok).toBe(true);
    expect(useStore.getState().program.risks).toHaveLength(beforeRiskCount + 1);
    expect(useStore.getState().program.riskIntakes?.[0].promotedRiskId).toBeDefined();
    store.resetToDemo();
  });
});

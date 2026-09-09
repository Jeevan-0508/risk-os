import { describe, expect, it } from 'vitest';
import { demoPortfolio } from '@/data/portfolio';
import { makeProgram } from '@/test/factories';
import { resolveInitialSeed } from './store';

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
});

import { describe, expect, it } from 'vitest';
import { validateProgram } from './validate';
import { computeProgramHealth } from './engines/healthEngine';
import { makeProgram } from '@/test/factories';

describe('validateProgram backward compatibility', () => {
  it('defaults treatments and acceptances to empty arrays on a pre-upgrade file that never had them', () => {
    const legacy = makeProgram();
    const raw = legacy as unknown as Record<string, unknown>;
    delete raw.treatments;
    delete raw.acceptances;
    delete raw.riskAppetite;

    const result = validateProgram(raw);
    expect(result.ok).toBe(true);
    expect(result.program?.treatments).toEqual([]);
    expect(result.program?.acceptances).toEqual([]);
    expect(result.warnings.some((w) => w.includes('treatments'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('acceptances'))).toBe(true);
  });

  it('never discards an unknown field it does not recognise', () => {
    const raw = { ...makeProgram(), someFutureField: { keep: 'me' } } as Record<string, unknown>;
    const result = validateProgram(raw);
    expect((result.program as unknown as Record<string, unknown>)?.someFutureField).toEqual({ keep: 'me' });
  });

  it('a repaired legacy programme with no riskAppetite still computes health without throwing, using the conservative default', () => {
    const legacy = makeProgram();
    const raw = legacy as unknown as Record<string, unknown>;
    delete raw.riskAppetite;
    delete raw.treatments;
    delete raw.acceptances;

    const result = validateProgram(raw);
    expect(result.program).toBeDefined();
    const health = computeProgramHealth(result.program!);
    expect(Number.isFinite(health.overall.score)).toBe(true);
    expect(health.tolerance.appetite.id).toBe('appetite-default');
  });

  it('drops malformed imported risk intake records instead of exposing them to the intake screen', () => {
    const raw = { ...makeProgram(), riskIntakes: [{ intakeId: 'broken' }] } as Record<string, unknown>;
    const result = validateProgram(raw);
    expect(result.ok).toBe(true);
    expect(result.program?.riskIntakes).toEqual([]);
    expect(result.warnings.some((w) => w.includes('riskIntakes'))).toBe(true);
  });
});

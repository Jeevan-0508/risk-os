import { describe, expect, it } from 'vitest';
import { assessControl, combineControls, summariseControlPortfolio } from './controlEngine';
import { makeControl, makeRisk } from '@/test/factories';

const STATUS = '2026-09-09';

describe('assessControl', () => {
  it('multiplies design by operating effectiveness', () => {
    const c = makeControl({ designEffectiveness: 0.8, operatingEffectiveness: 0.5 });
    expect(assessControl(c, STATUS, 'verified').effectiveness).toBeCloseTo(0.4, 6);
  });

  it('discounts effectiveness when the evidence is weak', () => {
    const c = makeControl({ designEffectiveness: 0.8, operatingEffectiveness: 1 });
    const verified = assessControl(c, STATUS, 'verified').effectiveness;
    const anecdotal = assessControl(c, STATUS, 'anecdotal').effectiveness;
    expect(anecdotal).toBeLessThan(verified);
    expect(anecdotal).toBeCloseTo(0.8 * 0.55, 6);
  });

  it('gives a failed control zero effectiveness regardless of design', () => {
    const c = makeControl({ status: 'failed', designEffectiveness: 1, operatingEffectiveness: 1 });
    expect(assessControl(c, STATUS, 'verified').effectiveness).toBe(0);
  });

  it('gives a planned control zero effectiveness because it is not operating yet', () => {
    const c = makeControl({ status: 'planned' });
    expect(assessControl(c, STATUS, 'verified').effectiveness).toBe(0);
  });

  it('erodes assurance when the test is overdue and reports the overdue days', () => {
    const fresh = makeControl({ nextTest: '2026-12-01' });
    const stale = makeControl({ nextTest: '2026-03-09' });
    const a = assessControl(fresh, STATUS, 'verified');
    const b = assessControl(stale, STATUS, 'verified');
    expect(a.testOverdueDays).toBeNull();
    expect(b.testOverdueDays).toBe(184);
    expect(b.effectiveness).toBeLessThan(a.effectiveness);
  });

  it('classifies preventive and directive controls as acting on likelihood', () => {
    expect(assessControl(makeControl({ type: 'preventive' }), STATUS, 'verified').reducesProbability).toBe(true);
    expect(assessControl(makeControl({ type: 'directive' }), STATUS, 'verified').reducesProbability).toBe(true);
    expect(assessControl(makeControl({ type: 'detective' }), STATUS, 'verified').reducesProbability).toBe(false);
    expect(assessControl(makeControl({ type: 'corrective' }), STATUS, 'verified').reducesProbability).toBe(false);
  });
});

describe('combineControls', () => {
  it('combines barriers multiplicatively rather than additively', () => {
    const controls = [
      makeControl({ id: 'a', designEffectiveness: 0.5, operatingEffectiveness: 1 }),
      makeControl({ id: 'b', designEffectiveness: 0.5, operatingEffectiveness: 1 }),
    ];
    // 1 - (1-0.5)(1-0.5) = 0.75, not 1.0
    expect(combineControls(controls, STATUS, 'verified').probabilityReduction).toBeCloseTo(0.75, 6);
  });

  it('never exceeds the 0.95 ceiling however many controls are stacked', () => {
    const controls = Array.from({ length: 12 }, (_, i) =>
      makeControl({ id: 'c' + i, designEffectiveness: 0.9, operatingEffectiveness: 0.9 }),
    );
    expect(combineControls(controls, STATUS, 'verified').probabilityReduction).toBeLessThanOrEqual(0.95);
  });

  it('separates likelihood reduction from consequence reduction', () => {
    const result = combineControls(
      [
        makeControl({ id: 'p', type: 'preventive', designEffectiveness: 0.6, operatingEffectiveness: 1 }),
        makeControl({ id: 'd', type: 'detective', designEffectiveness: 0.4, operatingEffectiveness: 1 }),
      ],
      STATUS,
      'verified',
    );
    expect(result.probabilityReduction).toBeCloseTo(0.6, 6);
    expect(result.impactReduction).toBeCloseTo(0.4, 6);
    expect(result.overallEffectiveness).toBeCloseTo(1 - 0.4 * 0.6, 6);
  });

  it('returns zero reduction when no controls are linked', () => {
    const result = combineControls([], STATUS, 'verified');
    expect(result.probabilityReduction).toBe(0);
    expect(result.impactReduction).toBe(0);
    expect(result.assessments).toHaveLength(0);
  });
});

describe('summariseControlPortfolio', () => {
  it('identifies uncontrolled risks and single points of failure', () => {
    const controls = [makeControl({ id: 'ctl-a', linkedRiskIds: ['r1'] })];
    const risks = [
      makeRisk({ id: 'r1', controlIds: ['ctl-a'] }),
      makeRisk({ id: 'r2', controlIds: [] }),
      makeRisk({ id: 'r3', controlIds: [], status: 'closed' }),
    ];
    const s = summariseControlPortfolio(controls, risks, STATUS);
    expect(s.uncontrolledRiskIds).toEqual(['r2']);
    expect(s.singlePointsOfFailure).toEqual(['ctl-a']);
    expect(s.total).toBe(1);
    expect(s.active).toBe(1);
  });
});

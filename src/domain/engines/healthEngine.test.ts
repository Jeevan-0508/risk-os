import { describe, expect, it } from 'vitest';
import { DIMENSION_WEIGHTS, computeProgramHealth, ragFromScore } from './healthEngine';
import { makeBenefit, makeDependency, makeMilestone, makeProgram, makeRisk } from '@/test/factories';

describe('DIMENSION_WEIGHTS', () => {
  it('sums to exactly 1 so the weighted score stays on a 0..100 scale', () => {
    const total = Object.values(DIMENSION_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1, 10);
  });

  it('weights risk and schedule highest, as documented', () => {
    expect(DIMENSION_WEIGHTS.risk).toBeGreaterThanOrEqual(DIMENSION_WEIGHTS.schedule);
    expect(DIMENSION_WEIGHTS.schedule).toBeGreaterThan(DIMENSION_WEIGHTS.scope);
  });
});

describe('ragFromScore', () => {
  it('bands on the documented thresholds', () => {
    expect(ragFromScore(100)).toBe('green');
    expect(ragFromScore(75)).toBe('green');
    expect(ragFromScore(74)).toBe('amber');
    expect(ragFromScore(55)).toBe('amber');
    expect(ragFromScore(54)).toBe('red');
    expect(ragFromScore(0)).toBe('red');
  });
});

describe('computeProgramHealth', () => {
  it('scores a clean programme green on every dimension', () => {
    const health = computeProgramHealth(
      makeProgram({
        statusDate: '2026-03-01',
        forecastSpend: 10_000_000,
        spendToDate: 1_500_000,
      }),
    );
    expect(health.overall.status).toBe('green');
    expect(health.overall.score).toBeGreaterThan(90);
  });

  it('never reports an unexplained status: every dimension carries drivers and metrics', () => {
    const health = computeProgramHealth(makeProgram());
    for (const dim of Object.values(health.dimensions)) {
      expect(dim.drivers.length).toBeGreaterThan(0);
      expect(dim.metrics.length).toBeGreaterThan(0);
      expect(dim.headline.length).toBeGreaterThan(0);
      for (const driver of dim.drivers) expect(driver.detail.length).toBeGreaterThan(0);
    }
    expect(health.overall.drivers.length).toBe(Object.keys(DIMENSION_WEIGHTS).length);
  });

  it('drives the score down when residual exposure eats the budget', () => {
    const clean = computeProgramHealth(makeProgram({ statusDate: '2026-03-01' }));
    const exposed = computeProgramHealth(
      makeProgram({
        statusDate: '2026-03-01',
        risks: [makeRisk({ id: 'r1', inherentProbability: 0.9, inherentImpact: 5, inherentFinancialImpact: 4_000_000 })],
      }),
    );
    expect(exposed.dimensions.risk.score).toBeLessThan(clean.dimensions.risk.score);
    expect(exposed.dimensions.risk.headline).toContain('residual exposure');
  });

  it('caps the overall status at amber while any single dimension is red', () => {
    const health = computeProgramHealth(
      makeProgram({
        statusDate: '2026-03-01',
        budget: 1_000_000,
        risks: [
          makeRisk({ id: 'r1', inherentProbability: 1, inherentImpact: 5, inherentFinancialImpact: 5_000_000 }),
        ],
      }),
    );
    expect(health.dimensions.risk.status).toBe('red');
    expect(health.overall.status).not.toBe('green');
  });

  it('turns the overall status red once two dimensions are red', () => {
    const health = computeProgramHealth(
      makeProgram({
        statusDate: '2026-03-01',
        budget: 1_000_000,
        forecastSpend: 3_000_000,
        spendToDate: 2_000_000,
        risks: [makeRisk({ id: 'r1', inherentProbability: 1, inherentImpact: 5, inherentFinancialImpact: 5_000_000 })],
      }),
    );
    const reds = Object.values(health.dimensions).filter((d) => d.status === 'red').length;
    expect(reds).toBeGreaterThanOrEqual(2);
    expect(health.overall.status).toBe('red');
  });

  it('orders the overall drivers worst contribution first', () => {
    const health = computeProgramHealth(
      makeProgram({
        statusDate: '2026-03-01',
        risks: [makeRisk({ id: 'r1', inherentProbability: 0.9, inherentImpact: 5, inherentFinancialImpact: 4_000_000 })],
      }),
    );
    const contributions = health.overall.drivers.map((d) => d.contribution);
    expect([...contributions].sort((a, b) => a - b)).toEqual(contributions);
    expect(contributions[0]).toBeLessThanOrEqual(0);
  });

  it('penalises schedule when milestones slip', () => {
    const clean = computeProgramHealth(makeProgram({ statusDate: '2026-03-01', milestones: [makeMilestone({ id: 'm1' })] }));
    const slipped = computeProgramHealth(
      makeProgram({
        statusDate: '2026-03-01',
        milestones: [makeMilestone({ id: 'm1', baselineDate: '2026-04-01', forecastDate: '2026-06-01', status: 'at-risk', isGate: true })],
      }),
    );
    expect(slipped.dimensions.schedule.score).toBeLessThan(clean.dimensions.schedule.score);
  });

  it('penalises the dependency dimension for late links on the critical chain', () => {
    const clean = computeProgramHealth(makeProgram({ statusDate: '2026-03-01' }));
    const strained = computeProgramHealth(
      makeProgram({
        statusDate: '2026-03-01',
        dependencies: [
          makeDependency({ id: 'd1', status: 'late', potentialDelayDays: 40, delayProbability: 0.9 }),
          makeDependency({ id: 'd2', status: 'at-risk', predecessorIds: ['d1'], potentialDelayDays: 30, delayProbability: 0.8 }),
        ],
      }),
    );
    expect(strained.dimensions.dependency.score).toBeLessThan(clean.dimensions.dependency.score);
    expect(strained.dimensions.dependency.headline).toContain('critical chain');
  });

  it('penalises benefits that lag the elapsed programme', () => {
    const lagging = computeProgramHealth(
      makeProgram({
        statusDate: '2026-10-01',
        benefits: [makeBenefit({ id: 'b1', expectedValue: 5_000_000, realisedValue: 100_000 })],
      }),
    );
    expect(lagging.dimensions.benefit.score).toBeLessThan(80);
  });

  it('keeps every dimension score inside 0..100', () => {
    const health = computeProgramHealth(
      makeProgram({
        statusDate: '2026-12-31',
        budget: 1,
        forecastSpend: 50_000_000,
        spendToDate: 40_000_000,
        risks: [makeRisk({ id: 'r1', inherentProbability: 1, inherentImpact: 5, inherentFinancialImpact: 90_000_000 })],
      }),
    );
    for (const dim of [...Object.values(health.dimensions), health.overall]) {
      expect(dim.score).toBeGreaterThanOrEqual(0);
      expect(dim.score).toBeLessThanOrEqual(100);
    }
  });

  it('sorts worstDimensions ascending by score', () => {
    const health = computeProgramHealth(makeProgram({ statusDate: '2026-03-01' }));
    const scores = health.worstDimensions.map((d) => d.score);
    expect([...scores].sort((a, b) => a - b)).toEqual(scores);
  });

  it('computes a health for a completely empty programme without throwing', () => {
    const health = computeProgramHealth(makeProgram());
    expect(Number.isFinite(health.overall.score)).toBe(true);
  });
});

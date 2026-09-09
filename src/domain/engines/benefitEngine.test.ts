import { describe, expect, it } from 'vitest';
import { assessBenefit, computeRealisationCurve, summariseBenefits } from './benefitEngine';
import { makeBenefit, makeControl, makeMilestone, makeProgram, makeRisk } from '@/test/factories';

const STATUS = '2026-07-01';

describe('assessBenefit', () => {
  it('measures realisation against the elapsed delivery window', () => {
    const benefit = makeBenefit({ expectedValue: 1_000_000, realisedValue: 250_000, startDate: '2026-01-01', targetDate: '2026-12-31' });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit] }));
    expect(a.realisationPct).toBeCloseTo(0.25, 6);
    expect(a.timeElapsedPct).toBeGreaterThan(0.45);
    expect(a.timeElapsedPct).toBeLessThan(0.55);
    expect(a.paceVariance).toBeLessThan(0);
    expect(a.drivers[0]).toContain('25% realised');
  });

  it('reports a positive pace variance when ahead of the curve', () => {
    const benefit = makeBenefit({ expectedValue: 1_000_000, realisedValue: 900_000, startDate: '2026-01-01', targetDate: '2026-12-31' });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit] }));
    expect(a.paceVariance).toBeGreaterThan(0);
    expect(a.confidence).toBe('high');
  });

  it('combines threatening risks as independent events rather than adding them', () => {
    const control = makeControl({ id: 'c1', designEffectiveness: 0, operatingEffectiveness: 0 });
    const r1 = makeRisk({ id: 'r1', inherentProbability: 0.5, inherentFinancialImpact: 400_000, controlIds: [] });
    const r2 = makeRisk({ id: 'r2', inherentProbability: 0.5, inherentFinancialImpact: 400_000, controlIds: [] });
    const benefit = makeBenefit({ expectedValue: 1_000_000, realisedValue: 0, threateningRiskIds: ['r1', 'r2'] });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit], risks: [r1, r2], controls: [control] }));
    // 1 - 0.5*0.5 = 0.75, not 1.0
    expect(a.valueAtRisk).toBeCloseTo(750_000, 0);
  });

  it('never puts more at risk than the unrealised amount', () => {
    const r1 = makeRisk({ id: 'r1', inherentProbability: 1, inherentFinancialImpact: 9_000_000 });
    const benefit = makeBenefit({ expectedValue: 1_000_000, realisedValue: 800_000, threateningRiskIds: ['r1'] });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit], risks: [r1] }));
    expect(a.unrealisedValue).toBe(200_000);
    expect(a.valueAtRisk).toBeLessThanOrEqual(200_000);
  });

  it('ignores a threatening risk id that does not resolve', () => {
    const benefit = makeBenefit({ threateningRiskIds: ['ghost'] });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit] }));
    expect(a.threatExposure).toBe(0);
    expect(a.valueAtRisk).toBe(0);
  });

  it('drops confidence when an enabling milestone is late', () => {
    const ms = makeMilestone({ id: 'm1', baselineDate: '2026-06-01', forecastDate: '2026-07-15' });
    const benefit = makeBenefit({ expectedValue: 1_000_000, realisedValue: 500_000, enablingMilestoneIds: ['m1'] });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit], milestones: [ms] }));
    expect(a.enablingMilestonesAtRisk).toEqual(['m1']);
    expect(a.confidence).not.toBe('high');
  });

  it('flags a benefit whose target date has passed unrealised', () => {
    const benefit = makeBenefit({ expectedValue: 1_000_000, realisedValue: 100_000, startDate: '2025-01-01', targetDate: '2026-03-01' });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit] }));
    expect(a.isOverdue).toBe(true);
    expect(a.confidence).toBe('low');
  });

  it('does not call a fully realised benefit overdue', () => {
    const benefit = makeBenefit({ expectedValue: 1_000_000, realisedValue: 1_000_000, targetDate: '2026-03-01', status: 'realised' });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit] }));
    expect(a.isOverdue).toBe(false);
  });

  it('treats a zero-length window as fully elapsed instead of dividing by zero', () => {
    const benefit = makeBenefit({ startDate: '2026-06-01', targetDate: '2026-06-01' });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit] }));
    expect(a.timeElapsedPct).toBe(1);
    expect(Number.isFinite(a.paceVariance)).toBe(true);
  });

  it('coerces malformed values rather than emitting NaN', () => {
    const benefit = makeBenefit({ expectedValue: Number.NaN, realisedValue: -50 });
    const a = assessBenefit(benefit, makeProgram({ statusDate: STATUS, benefits: [benefit] }));
    expect(a.expectedValue).toBe(0);
    expect(a.realisedValue).toBe(0);
    expect(a.realisationPct).toBe(0);
  });
});

describe('summariseBenefits', () => {
  const program = makeProgram({
    statusDate: STATUS,
    benefits: [
      makeBenefit({ id: 'b1', expectedValue: 2_000_000, realisedValue: 500_000, status: 'in-progress' }),
      makeBenefit({ id: 'b2', expectedValue: 1_000_000, realisedValue: 1_000_000, status: 'realised' }),
      makeBenefit({ id: 'b3', expectedValue: 500_000, realisedValue: 0, status: 'at-risk' }),
    ],
  });

  it('totals expected, realised and unrealised value', () => {
    const s = summariseBenefits(program);
    expect(s.totalExpected).toBe(3_500_000);
    expect(s.totalRealised).toBe(1_500_000);
    expect(s.totalUnrealised).toBe(2_000_000);
    expect(s.realisationPct).toBeCloseTo(1_500_000 / 3_500_000, 6);
  });

  it('counts benefits by status', () => {
    const s = summariseBenefits(program);
    expect(s.realisedCount).toBe(1);
    expect(s.atRiskCount).toBe(1);
    expect(s.lostCount).toBe(0);
  });

  it('deducts value at risk to give a confidence-adjusted total', () => {
    const s = summariseBenefits(program);
    expect(s.confidenceAdjustedValue).toBeLessThanOrEqual(s.totalExpected);
  });

  it('handles a program with no benefits', () => {
    const s = summariseBenefits(makeProgram());
    expect(s.totalExpected).toBe(0);
    expect(s.realisationPct).toBe(0);
  });
});

describe('computeRealisationCurve', () => {
  const program = makeProgram({
    benefits: [
      makeBenefit({
        id: 'b1',
        expectedValue: 1_200_000,
        startDate: '2026-01-01',
        targetDate: '2026-12-31',
        history: [
          { date: '2026-03-01', realisedValue: 100_000 },
          { date: '2026-06-01', realisedValue: 400_000 },
        ],
      }),
    ],
  });

  it('ramps expected value linearly across the window', () => {
    const curve = computeRealisationCurve(program, ['2026-01-01', '2026-07-01', '2026-12-31']);
    expect(curve[0].expected).toBeCloseTo(0, 6);
    expect(curve[2].expected).toBeCloseTo(1_200_000, 0);
    expect(curve[1].expected).toBeGreaterThan(curve[0].expected);
  });

  it('carries the latest realised sample forward, never a future one', () => {
    const curve = computeRealisationCurve(program, ['2026-02-01', '2026-04-01', '2026-08-01']);
    expect(curve[0].realised).toBe(0);
    expect(curve[1].realised).toBe(100_000);
    expect(curve[2].realised).toBe(400_000);
  });

  it('returns an empty curve for an empty month list', () => {
    expect(computeRealisationCurve(program, [])).toEqual([]);
  });
});

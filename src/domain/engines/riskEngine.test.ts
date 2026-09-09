import { describe, expect, it } from 'vitest';
import {
  assessPortfolio,
  assessRisk,
  classifyTrend,
  computeBurndown,
  computeVelocity,
  matrixScore,
  probabilityBand,
  severityFromScore,
} from './riskEngine';
import { makeControl, makeRisk } from '@/test/factories';

const STATUS = '2026-09-09';

describe('probability banding', () => {
  it('maps probabilities onto the 5 point scale at the documented boundaries', () => {
    expect(probabilityBand(0.05)).toBe(1);
    expect(probabilityBand(0.1)).toBe(1);
    expect(probabilityBand(0.11)).toBe(2);
    expect(probabilityBand(0.3)).toBe(2);
    expect(probabilityBand(0.5)).toBe(3);
    expect(probabilityBand(0.75)).toBe(4);
    expect(probabilityBand(0.9)).toBe(5);
  });

  it('clamps out of range input rather than producing a nonsense band', () => {
    expect(probabilityBand(-1)).toBe(1);
    expect(probabilityBand(4)).toBe(5);
  });

  it('scores the matrix as band times impact and bands the severity', () => {
    expect(matrixScore(0.9, 5)).toBe(25);
    expect(matrixScore(0.05, 1)).toBe(1);
    expect(severityFromScore(25)).toBe('red');
    expect(severityFromScore(15)).toBe('red');
    expect(severityFromScore(14)).toBe('amber');
    expect(severityFromScore(8)).toBe('amber');
    expect(severityFromScore(7)).toBe('green');
  });
});

describe('computeVelocity', () => {
  it('returns zero when there is not enough history to measure a trend', () => {
    expect(computeVelocity([], STATUS)).toBe(0);
    expect(computeVelocity([{ date: '2026-09-01', probability: 0.5, impactScore: 3, financialExposure: 100 }], STATUS)).toBe(0);
  });

  it('normalises exposure growth to a fortnightly rate', () => {
    // 20% growth over 28 days is 10% per fortnight.
    const history = [
      { date: '2026-08-12', probability: 0.5, impactScore: 3 as const, financialExposure: 100_000 },
      { date: '2026-09-09', probability: 0.5, impactScore: 3 as const, financialExposure: 120_000 },
    ];
    expect(computeVelocity(history, STATUS)).toBeCloseTo(0.1, 5);
  });

  it('returns a negative velocity when exposure is falling', () => {
    const history = [
      { date: '2026-08-26', probability: 0.5, impactScore: 3 as const, financialExposure: 200_000 },
      { date: '2026-09-09', probability: 0.4, impactScore: 3 as const, financialExposure: 150_000 },
    ];
    expect(computeVelocity(history, STATUS)).toBeLessThan(0);
  });
});

describe('classifyTrend', () => {
  const history = [
    { date: '2026-01-01', probability: 0.4, impactScore: 3 as const, financialExposure: 100 },
    { date: '2026-05-01', probability: 0.4, impactScore: 3 as const, financialExposure: 100 },
    { date: '2026-09-01', probability: 0.4, impactScore: 3 as const, financialExposure: 100 },
  ];

  it('applies the documented velocity thresholds', () => {
    expect(classifyTrend(history, 0.4, STATUS)).toBe('accelerating');
    expect(classifyTrend(history, 0.15, STATUS)).toBe('accelerating');
    expect(classifyTrend(history, 0.08, STATUS)).toBe('deteriorating');
    expect(classifyTrend(history, 0.0, STATUS)).toBe('stagnant');
    expect(classifyTrend(history, -0.2, STATUS)).toBe('improving');
  });

  it('treats a risk with a single sample as newly raised', () => {
    expect(classifyTrend([history[0]], 0, STATUS)).toBe('new');
  });
});

describe('assessRisk', () => {
  it('reproduces the worked example: 1.0M inherent at 80% control effectiveness leaves 200K', () => {
    const risk = makeRisk({
      inherentProbability: 1,
      inherentFinancialImpact: 1_000_000,
      controlIds: ['ctl-x'],
      evidenceConfidence: 'verified',
    });
    const control = makeControl({
      id: 'ctl-x',
      type: 'detective',
      designEffectiveness: 0.8,
      operatingEffectiveness: 1,
    });
    const a = assessRisk(risk, [control], STATUS);
    expect(a.inherentFinancialExposure).toBe(1_000_000);
    expect(a.residualFinancialExposure).toBeCloseTo(200_000, 6);
    expect(a.exposureReduced).toBeCloseTo(800_000, 6);
    expect(a.reductionPct).toBeCloseTo(0.8, 6);
  });

  it('leaves residual equal to inherent when there are no controls', () => {
    const a = assessRisk(makeRisk({ inherentProbability: 0.4, inherentFinancialImpact: 500_000 }), [], STATUS);
    expect(a.inherentFinancialExposure).toBeCloseTo(200_000, 6);
    expect(a.residualFinancialExposure).toBeCloseTo(200_000, 6);
    expect(a.drivers.some((d) => d.includes('No controls'))).toBe(true);
  });

  it('reduces likelihood with a preventive control and consequence with a detective one', () => {
    const risk = makeRisk({ inherentProbability: 0.8, inherentFinancialImpact: 1_000_000, controlIds: ['c'] });
    const preventive = assessRisk(risk, [makeControl({ id: 'c', type: 'preventive', designEffectiveness: 0.5 })], STATUS);
    const detective = assessRisk(risk, [makeControl({ id: 'c', type: 'detective', designEffectiveness: 0.5 })], STATUS);
    expect(preventive.residualProbability).toBeCloseTo(0.4, 6);
    expect(detective.residualProbability).toBeCloseTo(0.8, 6);
    expect(detective.residualFinancialExposure).toBeCloseTo(preventive.residualFinancialExposure, 6);
  });

  it('flags a red residual severity risk as critical', () => {
    const a = assessRisk(makeRisk({ inherentProbability: 0.9, inherentImpact: 5 }), [], STATUS);
    expect(a.residualSeverity).toBe('red');
    expect(a.isCritical).toBe(true);
  });

  it('never marks a closed risk as critical', () => {
    const a = assessRisk(makeRisk({ status: 'closed', inherentProbability: 0.9, inherentImpact: 5 }), [], STATUS);
    expect(a.isCritical).toBe(false);
  });

  it('produces a priority index inside 0 to 100 and explains itself', () => {
    const a = assessRisk(makeRisk({ inherentProbability: 0.7, inherentImpact: 4, timeHorizon: 'immediate' }), [], STATUS);
    expect(a.priorityIndex).toBeGreaterThan(0);
    expect(a.priorityIndex).toBeLessThanOrEqual(100);
    expect(a.drivers.length).toBeGreaterThan(1);
  });

  it('tolerates malformed numeric input without producing NaN', () => {
    const a = assessRisk(
      makeRisk({ inherentProbability: Number.NaN, inherentFinancialImpact: Number.NaN, inherentScheduleImpactDays: -5 }),
      [],
      STATUS,
    );
    expect(Number.isFinite(a.residualFinancialExposure)).toBe(true);
    expect(Number.isFinite(a.priorityIndex)).toBe(true);
  });
});

describe('assessPortfolio', () => {
  const risks = [
    makeRisk({ id: 'r1', inherentProbability: 0.8, inherentImpact: 5, inherentFinancialImpact: 1_000_000 }),
    makeRisk({ id: 'r2', inherentProbability: 0.2, inherentImpact: 2, inherentFinancialImpact: 200_000 }),
    makeRisk({ id: 'r3', status: 'closed', inherentProbability: 0.9, inherentImpact: 5, inherentFinancialImpact: 900_000 }),
    makeRisk({ id: 'r4', status: 'accepted', inherentProbability: 0.5, inherentImpact: 3, inherentFinancialImpact: 300_000 }),
  ];

  it('excludes closed risks from the exposure totals', () => {
    const s = assessPortfolio(risks, [], '2026-09-09');
    expect(s.closedCount).toBe(1);
    expect(s.totalResidualExposure).toBeCloseTo(0.8 * 1_000_000 + 0.2 * 200_000 + 0.5 * 300_000, 6);
  });

  it('attributes exposure with no linked control to uncontrolled exposure', () => {
    const s = assessPortfolio(risks, [], '2026-09-09');
    expect(s.uncontrolledExposure).toBeCloseTo(s.totalResidualExposure, 6);
  });

  it('ranks the top risks by priority index', () => {
    const s = assessPortfolio(risks, [], '2026-09-09');
    expect(s.topRisks[0].riskId).toBe('r1');
    for (let i = 1; i < s.topRisks.length; i += 1) {
      expect(s.topRisks[i - 1].priorityIndex).toBeGreaterThanOrEqual(s.topRisks[i].priorityIndex);
    }
  });
});

describe('computeBurndown', () => {
  it('reconstructs the register from the recorded history at each month end', () => {
    const risk = makeRisk({
      dateIdentified: '2026-01-01',
      history: [
        { date: '2026-01-15', probability: 0.5, impactScore: 4, financialExposure: 400_000 },
        { date: '2026-03-15', probability: 0.6, impactScore: 4, financialExposure: 600_000 },
      ],
    });
    const points = computeBurndown([risk], [], ['2026-01-01', '2026-02-01', '2026-04-01']);
    expect(points[0].open).toBe(0); // identified but no sample yet at 1 Jan
    expect(points[1].open).toBe(1);
    expect(points[1].residualExposure).toBeCloseTo(200_000, 6);
    expect(points[2].residualExposure).toBeCloseTo(360_000, 6);
  });

  it('returns a point per requested month even with an empty register', () => {
    expect(computeBurndown([], [], ['2026-01-01', '2026-02-01'])).toHaveLength(2);
  });
});

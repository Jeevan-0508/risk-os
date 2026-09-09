import { describe, expect, it } from 'vitest';
import { assessRisk } from './riskEngine';
import { assessResponseEffectiveness, summariseTreatments, MIN_MEASUREMENT_DAYS } from './treatmentEngine';
import { makeRisk, makeTreatment, makeProgram } from '@/test/factories';

const STATUS = '2026-09-09';

describe('assessResponseEffectiveness', () => {
  it('is NOT_MEASURABLE before enough post-start evidence exists', () => {
    const risk = makeRisk({
      inherentFinancialImpact: 1_000_000,
      history: [{ date: '2026-08-01', probability: 0.5, impactScore: 3, financialExposure: 500_000 }],
    });
    const treatment = makeTreatment({ startDate: '2026-08-05', expectedExposureReductionPct: 0.4 });
    const assessment = assessRisk(risk, [], STATUS);
    const result = assessResponseEffectiveness(risk, treatment, assessment, [], STATUS);
    expect(result.status).toBe('not-measurable');
    expect(result.observedResidual).toBeNull();
  });

  it('is NOT_MEASURABLE when there is post-start evidence but not enough elapsed time', () => {
    const risk = makeRisk({
      history: [
        { date: '2026-08-01', probability: 0.5, impactScore: 3, financialExposure: 500_000 },
        { date: '2026-09-08', probability: 0.4, impactScore: 3, financialExposure: 400_000 },
      ],
    });
    const treatment = makeTreatment({ startDate: '2026-09-05', expectedExposureReductionPct: 0.4 });
    const assessment = assessRisk(risk, [], STATUS);
    const result = assessResponseEffectiveness(risk, treatment, assessment, [], STATUS);
    expect(daysSince(treatment.startDate)).toBeLessThan(MIN_MEASUREMENT_DAYS);
    expect(result.status).toBe('not-measurable');
  });

  it('is EFFECTIVE when observed reduction meets at least 85% of what was expected', () => {
    // Baseline at treatment start (reconstructed from the history sample): 0.5 x 500,000 = 250,000 residual.
    // Current stated position: 0.5 x 300,000 = 150,000 residual, exactly the 40% reduction the plan expected.
    const risk = makeRisk({
      inherentProbability: 0.5,
      inherentImpact: 3,
      inherentFinancialImpact: 300_000,
      history: [
        { date: '2026-01-01', probability: 0.5, impactScore: 3, financialExposure: 500_000 },
        { date: '2026-02-01', probability: 0.5, impactScore: 3, financialExposure: 400_000 },
      ],
    });
    const treatment = makeTreatment({ startDate: '2026-01-01', expectedExposureReductionPct: 0.4 });
    const assessment = assessRisk(risk, [], STATUS);
    const result = assessResponseEffectiveness(risk, treatment, assessment, [], STATUS);
    expect(result.status).toBe('effective');
    expect(result.observedReductionPct).not.toBeNull();
  });

  it('is FAILED when exposure has grown since treatment start rather than fallen', () => {
    const risk = makeRisk({
      inherentProbability: 0.6,
      inherentImpact: 4,
      inherentFinancialImpact: 940_000,
      history: [
        { date: '2026-05-10', probability: 0.6, impactScore: 4, financialExposure: 500_000 },
        { date: '2026-09-06', probability: 0.85, impactScore: 4, financialExposure: 940_000 },
      ],
    });
    const treatment = makeTreatment({ startDate: '2026-05-19', expectedExposureReductionPct: 0.45 });
    const assessment = assessRisk(risk, [], STATUS);
    const result = assessResponseEffectiveness(risk, treatment, assessment, [], STATUS);
    expect(result.status).toBe('failed');
    expect(result.observedReductionAmount).toBeLessThan(0);
    // Never claims the treatment caused the deterioration, only reports what was observed.
    expect(result.headline.toLowerCase()).not.toContain('caused');
  });

  it('is UNDERPERFORMING when observed reduction is positive but well short of expected', () => {
    // Baseline residual 250,000; expected residual 150,000 (40% reduction); observed residual 230,000,
    // an 8% reduction, a fifth of what the plan expected.
    const risk = makeRisk({
      inherentProbability: 0.5,
      inherentImpact: 3,
      inherentFinancialImpact: 460_000,
      history: [
        { date: '2026-01-01', probability: 0.5, impactScore: 3, financialExposure: 500_000 },
        { date: '2026-02-01', probability: 0.5, impactScore: 3, financialExposure: 480_000 },
      ],
    });
    const treatment = makeTreatment({ startDate: '2026-01-01', expectedExposureReductionPct: 0.4 });
    const assessment = assessRisk(risk, [], STATUS);
    const result = assessResponseEffectiveness(risk, treatment, assessment, [], STATUS);
    expect(result.status).toBe('underperforming');
  });
});

describe('summariseTreatments', () => {
  it('links each effectiveness result back to its own risk and treatment', () => {
    const risk = makeRisk({
      id: 'r1',
      history: [
        { date: '2026-01-01', probability: 0.5, impactScore: 3, financialExposure: 500_000 },
        { date: '2026-02-01', probability: 0.5, impactScore: 3, financialExposure: 500_000 },
      ],
    });
    const treatment = makeTreatment({ id: 't1', riskId: 'r1', startDate: '2026-01-01', expectedExposureReductionPct: 0.3 });
    const program = makeProgram({ risks: [risk], treatments: [treatment], statusDate: STATUS });
    const assessmentById = { r1: assessRisk(risk, [], STATUS) };
    const summary = summariseTreatments(program, assessmentById);
    expect(summary.byId['t1'].riskId).toBe('r1');
    expect(summary.byRiskId['r1']).toHaveLength(1);
  });

  it('ignores a treatment whose risk no longer exists rather than throwing', () => {
    const treatment = makeTreatment({ riskId: 'ghost' });
    const program = makeProgram({ risks: [], treatments: [treatment], statusDate: STATUS });
    const summary = summariseTreatments(program, {});
    expect(summary.assessments).toHaveLength(0);
  });
});

function daysSince(date: string): number {
  return Math.round((new Date(STATUS).getTime() - new Date(date).getTime()) / 86_400_000);
}

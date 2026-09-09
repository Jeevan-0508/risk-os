import { describe, expect, it } from 'vitest';
import type { Program, RiskTrend } from '@/domain/types';
import { buildDecisionQueue, type DecisionQueueContext } from './decisionQueueEngine';
import { assessPortfolio } from './riskEngine';
import { summariseBenefits } from './benefitEngine';
import { summariseDependencies } from './dependencyEngine';
import { summariseSchedule } from './scheduleEngine';
import { summariseTolerance, DEFAULT_RISK_APPETITE } from './toleranceEngine';
import { summariseTreatments } from './treatmentEngine';
import { summariseAcceptances } from './acceptanceEngine';
import { summariseAging } from './agingEngine';
import { makeAcceptance, makeBenefit, makeControl, makeDependency, makeMilestone, makeProgram, makeRisk, makeTreatment } from '@/test/factories';

const STATUS = '2026-09-09';

/** Builds a real context the same way healthEngine.ts does, so the test exercises the real composition, not a hand-typed stand-in. */
function contextFor(program: Program): DecisionQueueContext {
  const risk = assessPortfolio(program.risks, program.controls, program.statusDate);
  const benefits = summariseBenefits(program);
  const benefitAtRiskByRiskId: Record<string, number> = {};
  for (const r of program.risks) {
    benefitAtRiskByRiskId[r.id] = r.affectedBenefitIds.reduce((s, bid) => s + (benefits.byId[bid]?.valueAtRisk ?? 0), 0);
  }
  const tolerance = summariseTolerance(program.risks, risk.byId, program.riskAppetite ?? DEFAULT_RISK_APPETITE, benefitAtRiskByRiskId);
  const treatments = summariseTreatments(program, risk.byId);
  const acceptances = summariseAcceptances(program);
  const trendByRiskId: Record<string, RiskTrend> = {};
  const toleranceBreachedByRiskId: Record<string, boolean> = {};
  for (const a of risk.assessments) {
    trendByRiskId[a.riskId] = a.trend;
    toleranceBreachedByRiskId[a.riskId] = tolerance.byId[a.riskId]?.status === 'breach';
  }
  const aging = summariseAging(program, trendByRiskId, toleranceBreachedByRiskId);
  return {
    tolerance,
    treatments,
    acceptances,
    aging,
    dependencies: summariseDependencies(program),
    benefits,
    schedule: summariseSchedule(program),
    assessmentById: risk.byId,
  };
}

describe('buildDecisionQueue', () => {
  it('excludes a risk with no triggered reasons', () => {
    const risk = makeRisk({ id: 'r1', inherentProbability: 0.1, inherentImpact: 1, inherentFinancialImpact: 5_000, lastAssessmentDate: STATUS, reviewDate: '2026-12-01' });
    const program = makeProgram({ risks: [risk], statusDate: STATUS });
    expect(buildDecisionQueue(program, contextFor(program))).toHaveLength(0);
  });

  it('surfaces a tolerance breach with the deterministic escalation action', () => {
    const risk = makeRisk({ id: 'r1', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 900_000, lastAssessmentDate: STATUS, reviewDate: '2026-12-01' });
    const program = makeProgram({ risks: [risk], statusDate: STATUS });
    const item = buildDecisionQueue(program, contextFor(program))[0];
    expect(item.riskId).toBe('r1');
    expect(item.reasons).toContain('tolerance-breach');
    expect(item.primaryReason).toBe('tolerance-breach');
    expect(item.recommendedAction).toBe('Escalate remediation plan');
    expect(item.severity).toBe('critical');
  });

  it('surfaces an expired acceptance and recommends renew-or-revoke', () => {
    const risk = makeRisk({
      id: 'r1',
      inherentProbability: 0.1,
      inherentImpact: 1,
      inherentFinancialImpact: 5_000,
      status: 'accepted',
      lastAssessmentDate: STATUS,
      reviewDate: '2026-12-01',
    });
    const acceptance = makeAcceptance({ riskId: 'r1', status: 'accepted', expiryDate: '2026-08-01' });
    const program = makeProgram({ risks: [risk], acceptances: [acceptance], statusDate: STATUS });
    const item = buildDecisionQueue(program, contextFor(program))[0];
    expect(item.primaryReason).toBe('acceptance-expired');
    expect(item.recommendedAction).toBe('Renew or revoke acceptance');
  });

  it('recommends replacing a failed treatment, distinct from a merely underperforming one', () => {
    const risk = makeRisk({
      id: 'r1',
      inherentProbability: 0.6,
      inherentImpact: 4,
      inherentFinancialImpact: 940_000,
      lastAssessmentDate: STATUS,
      reviewDate: '2026-12-01',
      history: [
        { date: '2026-05-10', probability: 0.6, impactScore: 4, financialExposure: 500_000 },
        { date: '2026-09-06', probability: 0.85, impactScore: 4, financialExposure: 940_000 },
      ],
    });
    const treatment = makeTreatment({ riskId: 'r1', startDate: '2026-05-19', expectedExposureReductionPct: 0.45 });
    const program = makeProgram({ risks: [risk], treatments: [treatment], statusDate: STATUS });
    const item = buildDecisionQueue(program, contextFor(program))[0];
    expect(item.reasons).toContain('treatment-underperforming');
    expect(item.recommendedAction).toBe('Replace or strengthen treatment');
  });

  it('surfaces a control failure linked to the risk', () => {
    const control = makeControl({ id: 'ctl-1', status: 'failed' });
    const risk = makeRisk({ id: 'r1', inherentProbability: 0.1, inherentImpact: 1, inherentFinancialImpact: 5_000, controlIds: ['ctl-1'], lastAssessmentDate: STATUS, reviewDate: '2026-12-01' });
    const program = makeProgram({ risks: [risk], controls: [control], statusDate: STATUS });
    const item = buildDecisionQueue(program, contextFor(program))[0];
    expect(item.reasons).toContain('control-failure');
    expect(item.recommendedAction).toBe('Remediate or replace failed control');
  });

  it('surfaces a critical dependency that is late', () => {
    const dependency = makeDependency({ id: 'dep-1', criticality: 'critical', status: 'late', dueDate: '2026-08-01' });
    const risk = makeRisk({ id: 'r1', inherentProbability: 0.1, inherentImpact: 1, inherentFinancialImpact: 5_000, dependencyIds: ['dep-1'], lastAssessmentDate: STATUS, reviewDate: '2026-12-01' });
    const program = makeProgram({ risks: [risk], dependencies: [dependency], statusDate: STATUS });
    const item = buildDecisionQueue(program, contextFor(program))[0];
    expect(item.reasons).toContain('critical-dependency');
    expect(item.recommendedAction).toBe('Escalate dependency to programme board');
  });

  it('surfaces a threatened milestone and carries its id on the item', () => {
    const milestone = makeMilestone({ id: 'ms-1', baselineDate: '2026-06-01', forecastDate: '2026-07-01' });
    const risk = makeRisk({ id: 'r1', inherentProbability: 0.1, inherentImpact: 1, inherentFinancialImpact: 5_000, affectedMilestoneIds: ['ms-1'], lastAssessmentDate: STATUS, reviewDate: '2026-12-01' });
    const program = makeProgram({ risks: [risk], milestones: [milestone], statusDate: STATUS });
    const item = buildDecisionQueue(program, contextFor(program))[0];
    expect(item.reasons).toContain('milestone-threat');
    expect(item.affectedMilestoneIds).toContain('ms-1');
  });

  it('surfaces a benefit at risk and carries its id on the item', () => {
    const benefit = makeBenefit({ id: 'ben-1', status: 'at-risk', expectedValue: 200_000, realisedValue: 0 });
    const risk = makeRisk({ id: 'r1', inherentProbability: 0.6, inherentImpact: 4, inherentFinancialImpact: 300_000, affectedBenefitIds: ['ben-1'], lastAssessmentDate: STATUS, reviewDate: '2026-12-01' });
    const program = makeProgram({ risks: [risk], benefits: [benefit], statusDate: STATUS });
    const item = buildDecisionQueue(program, contextFor(program))[0];
    expect(item.reasons).toContain('benefit-at-risk');
    expect(item.affectedBenefitIds).toContain('ben-1');
  });

  it('surfaces reassessment-overdue and critical-aging together for a stale risk', () => {
    const risk = makeRisk({
      id: 'r1',
      inherentProbability: 0.1,
      inherentImpact: 1,
      inherentFinancialImpact: 5_000,
      lastAssessmentDate: '2026-01-01',
      reassessmentFrequency: 'monthly',
      reviewDate: '2026-02-01',
    });
    const program = makeProgram({ risks: [risk], statusDate: STATUS });
    const item = buildDecisionQueue(program, contextFor(program))[0];
    expect(item.reasons).toContain('reassessment-overdue');
    expect(item.reasons).toContain('critical-aging');
    expect(item.recommendedAction).toBe('Reassess risk now');
  });

  it('consolidates several live reasons on one risk into a single item with tolerance-breach as primary', () => {
    const risk = makeRisk({
      id: 'r1',
      inherentProbability: 0.95,
      inherentImpact: 5,
      inherentFinancialImpact: 900_000,
      lastAssessmentDate: '2026-01-01',
      reassessmentFrequency: 'monthly',
      reviewDate: '2026-02-01',
    });
    const program = makeProgram({ risks: [risk], statusDate: STATUS });
    const items = buildDecisionQueue(program, contextFor(program));
    expect(items).toHaveLength(1);
    expect(items[0].reasons.length).toBeGreaterThan(1);
    expect(items[0].primaryReason).toBe('tolerance-breach');
  });

  it('is deterministic: the same programme produces the same queue on a second call', () => {
    const risk = makeRisk({ id: 'r1', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 900_000, lastAssessmentDate: STATUS, reviewDate: '2026-12-01' });
    const program = makeProgram({ risks: [risk], statusDate: STATUS });
    const ctx = contextFor(program);
    expect(buildDecisionQueue(program, ctx)).toEqual(buildDecisionQueue(program, ctx));
  });

  it('sorts items worst-first by severity then by exposure', () => {
    const high = makeRisk({ id: 'r1', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 260_000, lastAssessmentDate: STATUS, reviewDate: '2026-12-01' });
    const critical = makeRisk({ id: 'r2', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 900_000, lastAssessmentDate: STATUS, reviewDate: '2026-12-01' });
    const program = makeProgram({ risks: [high, critical], statusDate: STATUS });
    const items = buildDecisionQueue(program, contextFor(program));
    expect(items[0].riskId).toBe('r2');
  });
});

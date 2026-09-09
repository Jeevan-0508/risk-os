import { describe, expect, it } from 'vitest';
import { assessRisk } from './riskEngine';
import { assessTolerance, summariseTolerance, DEFAULT_RISK_APPETITE } from './toleranceEngine';
import { makeRisk } from '@/test/factories';
import type { RiskAppetite } from '@/domain/types';

const STATUS = '2026-09-09';

const APPETITE: RiskAppetite = {
  id: 'appetite-t1',
  statement: 'Test appetite.',
  thresholds: [
    { dimension: 'financial', unit: 'currency', nearLimit: 100_000, breachLimit: 200_000 },
    { dimension: 'schedule', unit: 'days', nearLimit: 5, breachLimit: 10 },
    { dimension: 'benefit', unit: 'currency', nearLimit: 100_000, breachLimit: 200_000 },
    { dimension: 'severity', unit: 'score', nearLimit: 8, breachLimit: 15 },
  ],
};

describe('assessTolerance', () => {
  it('reports WITHIN when every dimension sits under its near limit', () => {
    const risk = makeRisk({ inherentProbability: 0.2, inherentImpact: 2, inherentFinancialImpact: 100_000, inherentScheduleImpactDays: 5 });
    const assessment = assessRisk(risk, [], STATUS);
    const result = assessTolerance(risk, assessment, APPETITE, 0);
    expect(result.status).toBe('within');
    expect(result.breachedDimensions).toHaveLength(0);
    expect(result.escalationRequired).toBe(false);
  });

  it('reports NEAR when a dimension sits between its near and breach limit', () => {
    const risk = makeRisk({ inherentProbability: 0.9, inherentImpact: 3, inherentFinancialImpact: 160_000, inherentScheduleImpactDays: 1 });
    const assessment = assessRisk(risk, [], STATUS);
    const result = assessTolerance(risk, assessment, APPETITE, 0);
    expect(result.status).toBe('near');
    expect(result.breachedDimensions).toHaveLength(0);
  });

  it('reports BREACH once a dimension clears its breach limit, and never from probability x impact alone', () => {
    const risk = makeRisk({ inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 500_000, inherentScheduleImpactDays: 1 });
    const assessment = assessRisk(risk, [], STATUS);
    const result = assessTolerance(risk, assessment, APPETITE, 0);
    expect(result.status).toBe('breach');
    expect(result.breachedDimensions).toContain('financial');
    // A high matrix score alone (severity) does not drive this: it is the explicit financial threshold that fires.
    expect(result.dimensionResults.find((d) => d.dimension === 'financial')?.overBy).toBeGreaterThan(0);
  });

  it('the worst dimension decides the overall status even when others are comfortable', () => {
    const risk = makeRisk({ inherentProbability: 0.1, inherentImpact: 1, inherentFinancialImpact: 10_000, inherentScheduleImpactDays: 1 });
    const assessment = assessRisk(risk, [], STATUS);
    const result = assessTolerance(risk, assessment, APPETITE, 250_000);
    expect(result.status).toBe('breach');
    expect(result.breachedDimensions).toEqual(['benefit']);
  });

  it('escalationRequired is true for a severe breach and false for a single minor breach', () => {
    const severe = makeRisk({ inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 900_000, inherentScheduleImpactDays: 1 });
    const minor = makeRisk({ inherentProbability: 0.7, inherentImpact: 3, inherentFinancialImpact: 330_000, inherentScheduleImpactDays: 1 });
    const severeResult = assessTolerance(severe, assessRisk(severe, [], STATUS), APPETITE, 0);
    const minorResult = assessTolerance(minor, assessRisk(minor, [], STATUS), APPETITE, 0);
    expect(severeResult.breachSeverity).toBe('severe');
    expect(severeResult.escalationRequired).toBe(true);
    expect(minorResult.breachSeverity).toBe('minor');
    expect(minorResult.escalationRequired).toBe(false);
  });

  it('every status is explainable: the headline names the dimension responsible', () => {
    const risk = makeRisk({ inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 500_000, inherentScheduleImpactDays: 1 });
    const result = assessTolerance(risk, assessRisk(risk, [], STATUS), APPETITE, 0);
    expect(result.headline).toContain('financial');
  });
});

describe('summariseTolerance', () => {
  it('excludes closed risks and counts breach/near/within correctly', () => {
    const open = makeRisk({ id: 'r1', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 500_000 });
    const closed = makeRisk({ id: 'r2', status: 'closed', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 500_000 });
    const risks = [open, closed];
    const assessmentById = { r1: assessRisk(open, [], STATUS), r2: assessRisk(closed, [], STATUS) };
    const summary = summariseTolerance(risks, assessmentById, APPETITE, {});
    expect(Object.keys(summary.byId)).toEqual(['r1']);
    expect(summary.breachCount).toBe(1);
  });

  it('sorts breached risks worst-first', () => {
    const mild = makeRisk({ id: 'r1', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 210_000 });
    const severe = makeRisk({ id: 'r2', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 900_000 });
    const risks = [mild, severe];
    const assessmentById = { r1: assessRisk(mild, [], STATUS), r2: assessRisk(severe, [], STATUS) };
    const summary = summariseTolerance(risks, assessmentById, APPETITE, {});
    expect(summary.breachedRisks[0].riskId).toBe('r2');
  });

  it('DEFAULT_RISK_APPETITE is applied so a programme with no explicit appetite still gets checked', () => {
    expect(DEFAULT_RISK_APPETITE.thresholds).toHaveLength(4);
  });
});

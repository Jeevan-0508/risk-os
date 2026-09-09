import { describe, expect, it } from 'vitest';
import { assessAging, summariseAging, REASSESSMENT_INTERVAL_DAYS } from './agingEngine';
import { makeRisk, makeProgram, makeTreatment, makeAction } from '@/test/factories';

const STATUS = '2026-09-09';

describe('assessAging', () => {
  it('classifies FRESH when last assessed well inside the cadence', () => {
    const risk = makeRisk({ lastAssessmentDate: '2026-09-01', reassessmentFrequency: 'monthly', reviewDate: '2026-10-01' });
    const result = assessAging(risk, STATUS, { trend: 'stagnant', toleranceBreached: false, treatments: [], actions: [] });
    expect(result.agingClass).toBe('fresh');
    expect(result.reassessmentOverdue).toBe(false);
  });

  it('classifies AGING once past one cadence interval', () => {
    const risk = makeRisk({ lastAssessmentDate: '2026-07-20', reassessmentFrequency: 'monthly', reviewDate: '2026-10-01' });
    const result = assessAging(risk, STATUS, { trend: 'stagnant', toleranceBreached: false, treatments: [], actions: [] });
    expect(result.agingClass).toBe('aging');
  });

  it('classifies CRITICAL_AGING once past three cadence intervals', () => {
    const risk = makeRisk({ lastAssessmentDate: '2026-01-01', reassessmentFrequency: 'monthly', reviewDate: '2026-10-01' });
    const result = assessAging(risk, STATUS, { trend: 'stagnant', toleranceBreached: false, treatments: [], actions: [] });
    expect(result.agingClass).toBe('critical-aging');
  });

  it('is REASSESSMENT_OVERDUE once the calendar due date has passed for a calendar-driven frequency', () => {
    const risk = makeRisk({ lastAssessmentDate: '2026-08-01', reassessmentFrequency: 'monthly', reviewDate: '2026-09-01' });
    const result = assessAging(risk, STATUS, { trend: 'stagnant', toleranceBreached: false, treatments: [], actions: [] });
    expect(result.reassessmentOverdue).toBe(true);
    expect(result.reassessmentDue).toBe(true);
  });

  it('is REASSESSMENT_DUE (not yet overdue) inside the due-soon window ahead of the calendar date', () => {
    const risk = makeRisk({ lastAssessmentDate: '2026-08-15', reassessmentFrequency: 'monthly', reviewDate: '2026-09-14' });
    const result = assessAging(risk, STATUS, { trend: 'stagnant', toleranceBreached: false, treatments: [], actions: [] });
    expect(result.reassessmentDue).toBe(true);
    expect(result.reassessmentOverdue).toBe(false);
  });

  it('an event-based risk is not due purely by the calendar, only when conditions change', () => {
    const risk = makeRisk({ lastAssessmentDate: '2026-06-01', reassessmentFrequency: 'event-based', reviewDate: '2027-06-01' });
    const stable = assessAging(risk, STATUS, { trend: 'stagnant', toleranceBreached: false, treatments: [], actions: [] });
    const changed = assessAging(risk, STATUS, { trend: 'accelerating', toleranceBreached: false, treatments: [], actions: [] });
    expect(stable.reassessmentDue).toBe(false);
    expect(changed.reassessmentDue).toBe(true);
    expect(changed.conditionChangeTriggered).toBe(true);
  });

  it('a tolerance breach on an already-overdue risk forces CRITICAL_AGING regardless of the raw ratio', () => {
    const risk = makeRisk({ lastAssessmentDate: '2026-08-20', reassessmentFrequency: 'monthly', reviewDate: '2026-09-01' });
    const result = assessAging(risk, STATUS, { trend: 'stagnant', toleranceBreached: true, treatments: [], actions: [] });
    expect(result.agingClass).toBe('critical-aging');
  });

  it('reports the age of the oldest still-active treatment on the risk', () => {
    const risk = makeRisk({ id: 'r1', lastAssessmentDate: STATUS, reviewDate: '2026-10-01' });
    const active = makeTreatment({ riskId: 'r1', startDate: '2026-08-01', status: 'in-progress' });
    const cancelled = makeTreatment({ id: 'trt-2', riskId: 'r1', startDate: '2026-01-01', status: 'cancelled' });
    const result = assessAging(risk, STATUS, { trend: 'stagnant', toleranceBreached: false, treatments: [active, cancelled], actions: [] });
    expect(result.treatmentAgeDays).toBe(39);
  });

  it('reports the most recent linked action date as lastActionDate', () => {
    const risk = makeRisk({ id: 'r1', actionIds: ['a1', 'a2'], lastAssessmentDate: STATUS, reviewDate: '2026-10-01' });
    const older = makeAction({ id: 'a1', dueDate: '2026-06-01', completedDate: '2026-06-10' });
    const newer = makeAction({ id: 'a2', dueDate: '2026-08-01', completedDate: '2026-08-05' });
    const result = assessAging(risk, STATUS, { trend: 'stagnant', toleranceBreached: false, treatments: [], actions: [older, newer] });
    expect(result.lastActionDate).toBe('2026-08-05');
  });

  it('every calendar frequency has a defined nominal interval', () => {
    expect(REASSESSMENT_INTERVAL_DAYS.weekly).toBe(7);
    expect(REASSESSMENT_INTERVAL_DAYS.monthly).toBe(30);
    expect(REASSESSMENT_INTERVAL_DAYS.quarterly).toBe(90);
  });
});

describe('summariseAging', () => {
  it('excludes closed risks and counts overdue/due risks across the programme', () => {
    const open = makeRisk({ id: 'r1', lastAssessmentDate: '2026-01-01', reassessmentFrequency: 'monthly', reviewDate: '2026-02-01' });
    const closed = makeRisk({ id: 'r2', status: 'closed', lastAssessmentDate: '2026-01-01', reviewDate: '2026-02-01' });
    const program = makeProgram({ risks: [open, closed], statusDate: STATUS });
    const summary = summariseAging(program, {}, {});
    expect(Object.keys(summary.byId)).toEqual(['r1']);
    expect(summary.reassessmentOverdueCount).toBe(1);
    expect(summary.criticalAgingCount).toBe(1);
  });
});

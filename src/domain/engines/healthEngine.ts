import type { HealthDimension, Program, RagStatus, RiskTrend } from '@/domain/types';
import { clamp, ratio } from '@/lib/format';
import { daysBetween } from '@/lib/dates';
import { assessPortfolio, type PortfolioRiskSummary } from './riskEngine';
import { summariseSchedule, summariseActions, type ScheduleSummary, type ActionSummary } from './scheduleEngine';
import { summariseDependencies, type DependencySummary } from './dependencyEngine';
import { summariseChanges, summariseDecisions, type ChangeSummary, type DecisionSummary } from './changeEngine';
import { summariseBenefits, type BenefitSummary } from './benefitEngine';
import { summariseControlPortfolio, type ControlPortfolioSummary } from './controlEngine';
import { summariseTolerance, DEFAULT_RISK_APPETITE, type ToleranceSummary } from './toleranceEngine';
import { summariseTreatments, type TreatmentSummary } from './treatmentEngine';
import { summariseAcceptances, type AcceptanceSummary } from './acceptanceEngine';
import { summariseAging, type AgingSummary } from './agingEngine';
import { buildDecisionQueue, type DecisionQueueItem } from './decisionQueueEngine';

export interface HealthDriver {
  label: string;
  /** Signed contribution to the score, in score points. */
  contribution: number;
  detail: string;
}

export interface DimensionHealth {
  dimension: HealthDimension;
  /** 0..100 where 100 is perfect. */
  score: number;
  status: RagStatus;
  headline: string;
  drivers: HealthDriver[];
  metrics: { label: string; value: string }[];
}

/**
 * Dimension weights for the overall score. Risk and schedule dominate because
 * they are the two things a program manager can still act on.
 */
export const DIMENSION_WEIGHTS: Record<Exclude<HealthDimension, 'overall'>, number> = {
  risk: 0.24,
  schedule: 0.22,
  dependency: 0.16,
  cost: 0.15,
  benefit: 0.14,
  scope: 0.09,
};

export function ragFromScore(score: number): RagStatus {
  if (score >= 75) return 'green';
  if (score >= 55) return 'amber';
  return 'red';
}

/**
 * Every penalty below is expressed as "observed / fully bad", where fully bad is
 * the level at which that driver alone would consume its entire point budget.
 * Those anchors are stated in docs/health-model.md so a reader can disagree with
 * a specific number rather than with the whole score.
 */
/** Penalty helper: converts a 0..1 badness ratio into score points removed. */
function penalty(badness: number, maxPoints: number): number {
  return -clamp(badness, 0, 1) * maxPoints;
}

function build(dimension: HealthDimension, headline: string, drivers: HealthDriver[], metrics: { label: string; value: string }[]): DimensionHealth {
  const score = clamp(100 + drivers.reduce((s, d) => s + d.contribution, 0), 0, 100);
  return { dimension, score, status: ragFromScore(score), headline, drivers, metrics };
}

export interface ProgramHealth {
  overall: DimensionHealth;
  dimensions: Record<Exclude<HealthDimension, 'overall'>, DimensionHealth>;
  risk: PortfolioRiskSummary;
  schedule: ScheduleSummary;
  dependencies: DependencySummary;
  changes: ChangeSummary;
  decisions: DecisionSummary;
  benefits: BenefitSummary;
  actions: ActionSummary;
  controls: ControlPortfolioSummary;
  tolerance: ToleranceSummary;
  treatments: TreatmentSummary;
  acceptances: AcceptanceSummary;
  aging: AgingSummary;
  /** Deterministic, explainable escalation list: see decisionQueueEngine.ts. */
  decisionQueue: DecisionQueueItem[];
  /** Ordered worst-first, used by the executive brief. */
  worstDimensions: DimensionHealth[];
}

export function computeProgramHealth(program: Program): ProgramHealth {
  const risk = assessPortfolio(program.risks, program.controls, program.statusDate);
  const schedule = summariseSchedule(program);
  const dependencies = summariseDependencies(program);
  const changes = summariseChanges(program);
  const decisions = summariseDecisions(program);
  const benefits = summariseBenefits(program);
  const actions = summariseActions(program.actions, program.statusDate);
  const controls = summariseControlPortfolio(program.controls, program.risks, program.statusDate);

  // ---- risk intelligence: tolerance, treatment effectiveness, acceptance expiry, aging, decision queue.
  // Tolerance and aging are computed first because the decision queue and the aging classification both
  // need to know which risks are already in breach; everything here reads risk.byId, it never recomputes it.
  const appetite = program.riskAppetite ?? DEFAULT_RISK_APPETITE;
  const benefitAtRiskByRiskId: Record<string, number> = {};
  for (const r of program.risks) {
    benefitAtRiskByRiskId[r.id] = r.affectedBenefitIds.reduce((sum, bid) => sum + (benefits.byId[bid]?.valueAtRisk ?? 0), 0);
  }
  const tolerance = summariseTolerance(program.risks, risk.byId, appetite, benefitAtRiskByRiskId);
  // Enrichment by reference: assessPortfolio's assessments, byId and topRisks all point at the same
  // objects, so setting .tolerance once here makes it visible everywhere RiskAssessment is read.
  for (const [riskId, assessment] of Object.entries(risk.byId)) {
    assessment.tolerance = tolerance.byId[riskId];
  }

  const treatments = summariseTreatments(program, risk.byId);
  const acceptances = summariseAcceptances(program);

  const trendByRiskId: Record<string, RiskTrend> = {};
  const toleranceBreachedByRiskId: Record<string, boolean> = {};
  for (const a of risk.assessments) {
    trendByRiskId[a.riskId] = a.trend;
    toleranceBreachedByRiskId[a.riskId] = a.tolerance?.status === 'breach';
  }
  const aging = summariseAging(program, trendByRiskId, toleranceBreachedByRiskId);

  const decisionQueue = buildDecisionQueue(program, {
    tolerance,
    treatments,
    acceptances,
    aging,
    dependencies,
    benefits,
    schedule,
    assessmentById: risk.byId,
  });

  // ---- risk
  const exposureVsBudget = ratio(risk.totalResidualExposure, program.budget);
  const riskDrivers: HealthDriver[] = [
    {
      label: 'Residual exposure vs budget',
      contribution: penalty(exposureVsBudget, 40),
      detail:
        'Residual exposure of ' +
        Math.round(risk.totalResidualExposure).toLocaleString('en-GB') +
        ' is ' +
        Math.round(exposureVsBudget * 100) +
        '% of the ' +
        Math.round(program.budget).toLocaleString('en-GB') +
        ' budget',
    },
    {
      label: 'Critical risks',
      contribution: penalty(ratio(risk.criticalCount, 12), 22),
      detail: risk.criticalCount + ' risk(s) sit in the critical band after controls',
    },
    {
      label: 'Accelerating risks',
      contribution: penalty(ratio(risk.acceleratingCount, 6), 16),
      detail: risk.acceleratingCount + ' risk(s) are growing rather than being contained',
    },
    {
      label: 'Control effectiveness',
      contribution: penalty(1 - risk.averageControlEffectiveness, 14),
      detail: 'Average control effectiveness is ' + Math.round(risk.averageControlEffectiveness * 100) + '%',
    },
    {
      label: 'Uncontrolled exposure',
      contribution: penalty(ratio(risk.uncontrolledExposure, Math.max(1, risk.totalResidualExposure)), 10),
      detail:
        Math.round(risk.uncontrolledExposure).toLocaleString('en-GB') +
        ' of residual exposure sits on risks with no linked control',
    },
    {
      label: 'Tolerance breaches',
      contribution: penalty(ratio(tolerance.breachCount, 6), 20),
      detail:
        tolerance.breachCount +
        ' risk(s) breach the programme\'s explicit tolerance boundary' +
        (tolerance.escalationRequiredCount > 0 ? ', ' + tolerance.escalationRequiredCount + ' requiring escalation' : ''),
    },
  ];

  // ---- schedule
  const scheduleDrivers: HealthDriver[] = [
    {
      label: 'Milestones at risk',
      contribution: penalty(ratio(schedule.atRisk, Math.max(1, schedule.total) * 0.6), 34),
      detail: schedule.atRisk + ' of ' + schedule.total + ' milestones are at risk',
    },
    {
      label: 'Overdue milestones',
      contribution: penalty(ratio(schedule.overdue, Math.max(1, schedule.total) * 0.25), 24),
      detail: schedule.overdue + ' milestone(s) are past their forecast date',
    },
    {
      label: 'Worst slip',
      contribution: penalty(ratio(schedule.worstVarianceDays, 60), 18),
      detail: 'Largest single slip against baseline is ' + schedule.worstVarianceDays + ' days',
    },
    {
      label: 'Gates at risk',
      contribution: penalty(ratio(schedule.gatesAtRisk, 6), 14),
      detail: schedule.gatesAtRisk + ' stage gate(s) are at risk',
    },
    {
      label: 'Overdue actions',
      contribution: penalty(ratio(actions.overdue, Math.max(1, actions.total) * 0.25), 10),
      detail: actions.overdue + ' of ' + actions.total + ' actions are overdue',
    },
  ];

  // ---- cost
  const elapsed = daysBetween(program.startDate, program.statusDate) ?? 0;
  const duration = Math.max(1, daysBetween(program.startDate, program.endDate) ?? 1);
  const timeElapsed = clamp(ratio(elapsed, duration), 0, 1);
  const budgetConsumed = ratio(program.spendToDate, program.budget);
  const burnVariance = budgetConsumed - timeElapsed;
  const forecastVariance = ratio(program.forecastSpend - program.budget, program.budget);
  const costDrivers: HealthDriver[] = [
    {
      label: 'Forecast against budget',
      contribution: penalty(ratio(Math.max(0, forecastVariance), 0.15), 40),
      detail:
        'Forecast spend of ' +
        Math.round(program.forecastSpend).toLocaleString('en-GB') +
        ' is ' +
        (forecastVariance >= 0 ? '+' : '') +
        Math.round(forecastVariance * 100) +
        '% against budget',
    },
    {
      label: 'Burn rate vs elapsed time',
      contribution: penalty(ratio(Math.max(0, burnVariance), 0.15), 24),
      detail:
        Math.round(budgetConsumed * 100) + '% of budget consumed at ' + Math.round(timeElapsed * 100) + '% of elapsed schedule',
    },
    {
      label: 'Approved change cost',
      contribution: penalty(ratio(changes.budgetErosionPct, 0.08), 20),
      detail:
        'Approved changes have added ' +
        Math.round(changes.approvedCostImpact).toLocaleString('en-GB') +
        ' (' +
        Math.round(changes.budgetErosionPct * 100) +
        '% of budget)',
    },
    {
      label: 'Financial risk exposure',
      contribution: penalty(ratio(risk.totalResidualExposure, program.budget * 0.35), 16),
      detail: 'Unmitigated financial exposure could add ' + Math.round(risk.totalResidualExposure).toLocaleString('en-GB'),
    },
  ];

  // ---- scope
  const scopeChanges = program.changes.filter((c) => c.scopeImpact.length > 0);
  const invalidAssumptions = program.assumptions.filter((a) => a.status === 'invalidated').length;
  const unvalidatedAssumptions = program.assumptions.filter((a) => a.status === 'unvalidated').length;
  const scopeDrivers: HealthDriver[] = [
    {
      label: 'Change volume',
      contribution: penalty(ratio(scopeChanges.length, Math.max(6, program.workstreams.length * 3)), 30),
      detail: scopeChanges.length + ' change request(s) carry a scope impact',
    },
    {
      label: 'Undecided changes',
      contribution: penalty(ratio(changes.pending + changes.escalated, 8), 26),
      detail: changes.pending + ' pending and ' + changes.escalated + ' escalated change(s) leave scope unsettled',
    },
    {
      label: 'Invalidated assumptions',
      contribution: penalty(ratio(invalidAssumptions, 5), 24),
      detail: invalidAssumptions + ' assumption(s) have been proved false',
    },
    {
      label: 'Unvalidated assumptions',
      contribution: penalty(ratio(unvalidatedAssumptions, Math.max(1, program.assumptions.length)), 16),
      detail: unvalidatedAssumptions + ' of ' + program.assumptions.length + ' assumptions remain unvalidated',
    },
  ];

  // ---- dependency
  const openDeps = program.dependencies.filter((d) => d.status !== 'delivered' && d.status !== 'cancelled').length;
  const dependencyDrivers: HealthDriver[] = [
    {
      label: 'Late dependencies',
      contribution: penalty(ratio(dependencies.late, Math.max(1, openDeps) * 0.2), 34),
      detail: dependencies.late + ' dependency(ies) are already late',
    },
    {
      label: 'At-risk dependencies',
      contribution: penalty(ratio(dependencies.atRisk, Math.max(1, openDeps) * 0.5), 26),
      detail: dependencies.atRisk + ' of ' + openDeps + ' open dependencies are flagged at risk',
    },
    {
      label: 'Critical chain slip',
      contribution: penalty(ratio(dependencies.criticalChain.totalExpectedDelayDays, 90), 22),
      detail:
        'The critical dependency chain carries ' +
        dependencies.criticalChain.totalExpectedDelayDays +
        ' days of probability-weighted slip across ' +
        dependencies.criticalChain.dependencyIds.length +
        ' links',
    },
    {
      label: 'External exposure',
      contribution: penalty(ratio(dependencies.externalShare, 0.95), 18),
      detail: Math.round(dependencies.externalShare * 100) + '% of dependencies sit outside direct program control',
    },
  ];

  // ---- benefit
  const benefitDrivers: HealthDriver[] = [
    {
      label: 'Value at risk',
      contribution: penalty(ratio(benefits.totalValueAtRisk, Math.max(1, benefits.totalExpected) * 0.6), 34),
      detail:
        Math.round(benefits.totalValueAtRisk).toLocaleString('en-GB') +
        ' of ' +
        Math.round(benefits.totalExpected).toLocaleString('en-GB') +
        ' expected benefit is exposed',
    },
    {
      label: 'Realisation pace',
      contribution: penalty(ratio(clamp(timeElapsed - benefits.realisationPct, 0, 1), 0.6), 28),
      detail:
        Math.round(benefits.realisationPct * 100) +
        '% of benefit realised at ' +
        Math.round(timeElapsed * 100) +
        '% of elapsed programme',
    },
    {
      label: 'Low-confidence benefits',
      contribution: penalty(ratio(benefits.lowConfidenceCount, Math.max(1, program.benefits.length) * 0.6), 22),
      detail: benefits.lowConfidenceCount + ' benefit(s) are assessed low confidence',
    },
    {
      label: 'Lost benefits',
      contribution: penalty(ratio(benefits.lostCount, 2), 16),
      detail: benefits.lostCount + ' benefit(s) have been written off',
    },
  ];

  const dimensions = {
    risk: build('risk', headlineForRisk(risk), riskDrivers, [
      { label: 'Residual exposure', value: Math.round(risk.totalResidualExposure).toLocaleString('en-GB') },
      { label: 'Critical', value: String(risk.criticalCount) },
      { label: 'Accelerating', value: String(risk.acceleratingCount) },
      { label: 'Avg control eff.', value: Math.round(risk.averageControlEffectiveness * 100) + '%' },
      { label: 'Tolerance breaches', value: String(tolerance.breachCount) },
      { label: 'Decisions queued', value: String(decisionQueue.length) },
    ]),
    schedule: build(
      'schedule',
      schedule.atRisk + ' of ' + schedule.total + ' milestones at risk, worst slip ' + schedule.worstVarianceDays + ' days',
      scheduleDrivers,
      [
        { label: 'Complete', value: schedule.complete + '/' + schedule.total },
        { label: 'At risk', value: String(schedule.atRisk) },
        { label: 'Overdue', value: String(schedule.overdue) },
        { label: 'SPI proxy', value: schedule.schedulePerformanceIndex.toFixed(2) },
      ],
    ),
    cost: build(
      'cost',
      'Forecast ' + (forecastVariance >= 0 ? '+' : '') + Math.round(forecastVariance * 100) + '% against budget',
      costDrivers,
      [
        { label: 'Budget', value: Math.round(program.budget).toLocaleString('en-GB') },
        { label: 'Spend to date', value: Math.round(program.spendToDate).toLocaleString('en-GB') },
        { label: 'Forecast', value: Math.round(program.forecastSpend).toLocaleString('en-GB') },
        { label: 'Change cost', value: Math.round(changes.approvedCostImpact).toLocaleString('en-GB') },
      ],
    ),
    scope: build(
      'scope',
      changes.pending + changes.escalated + ' change(s) undecided, ' + invalidAssumptions + ' assumption(s) invalidated',
      scopeDrivers,
      [
        { label: 'Changes', value: String(changes.total) },
        { label: 'Pending', value: String(changes.pending) },
        { label: 'Assumptions', value: String(program.assumptions.length) },
        { label: 'Invalidated', value: String(invalidAssumptions) },
      ],
    ),
    dependency: build(
      'dependency',
      dependencies.late + ' late and ' + dependencies.atRisk + ' at-risk dependencies, ' + dependencies.criticalChain.totalExpectedDelayDays + ' days on the critical chain',
      dependencyDrivers,
      [
        { label: 'Total', value: String(dependencies.total) },
        { label: 'At risk', value: String(dependencies.atRisk) },
        { label: 'Late', value: String(dependencies.late) },
        { label: 'Chain slip', value: dependencies.criticalChain.totalExpectedDelayDays + 'd' },
      ],
    ),
    benefit: build(
      'benefit',
      Math.round(benefits.realisationPct * 100) + '% realised with ' + Math.round(benefits.totalValueAtRisk).toLocaleString('en-GB') + ' at risk',
      benefitDrivers,
      [
        { label: 'Expected', value: Math.round(benefits.totalExpected).toLocaleString('en-GB') },
        { label: 'Realised', value: Math.round(benefits.totalRealised).toLocaleString('en-GB') },
        { label: 'At risk', value: Math.round(benefits.totalValueAtRisk).toLocaleString('en-GB') },
        { label: 'Low confidence', value: String(benefits.lowConfidenceCount) },
      ],
    ),
  } as Record<Exclude<HealthDimension, 'overall'>, DimensionHealth>;

  const overallScore = clamp(
    (Object.keys(DIMENSION_WEIGHTS) as (keyof typeof DIMENSION_WEIGHTS)[]).reduce(
      (sum, key) => sum + dimensions[key].score * DIMENSION_WEIGHTS[key],
      0,
    ),
    0,
    100,
  );

  const worstDimensions = Object.values(dimensions).sort((a, b) => a.score - b.score);

  // A single red dimension caps the overall status at amber even if the weighted
  // average looks healthy: a program cannot be green while one axis is red.
  let overallStatus = ragFromScore(overallScore);
  const redCount = worstDimensions.filter((d) => d.status === 'red').length;
  if (overallStatus === 'green' && redCount > 0) overallStatus = 'amber';
  if (redCount >= 2) overallStatus = 'red';

  const overallDrivers: HealthDriver[] = (Object.keys(DIMENSION_WEIGHTS) as (keyof typeof DIMENSION_WEIGHTS)[])
    .map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      contribution: (dimensions[key].score - 100) * DIMENSION_WEIGHTS[key],
      detail: dimensions[key].headline + ' (score ' + Math.round(dimensions[key].score) + ', weight ' + Math.round(DIMENSION_WEIGHTS[key] * 100) + '%)',
    }))
    .sort((a, b) => a.contribution - b.contribution);

  const overall: DimensionHealth = {
    dimension: 'overall',
    score: overallScore,
    status: overallStatus,
    headline:
      'Weighted health ' +
      Math.round(overallScore) +
      '/100. ' +
      (redCount > 0 ? redCount + ' dimension(s) are red, led by ' + worstDimensions[0].dimension + '.' : 'No dimension is red.'),
    drivers: overallDrivers,
    metrics: [
      { label: 'Score', value: Math.round(overallScore) + '/100' },
      { label: 'Red dimensions', value: String(redCount) },
      { label: 'Worst', value: worstDimensions[0].dimension },
      { label: 'Status date', value: program.statusDate },
    ],
  };

  return { overall, dimensions, risk, schedule, dependencies, changes, decisions, benefits, actions, controls, tolerance, treatments, acceptances, aging, decisionQueue, worstDimensions };
}

function headlineForRisk(risk: PortfolioRiskSummary): string {
  return (
    Math.round(risk.totalResidualExposure).toLocaleString('en-GB') +
    ' residual exposure across ' +
    risk.openCount +
    ' open risks, ' +
    risk.criticalCount +
    ' critical, ' +
    risk.acceleratingCount +
    ' accelerating'
  );
}

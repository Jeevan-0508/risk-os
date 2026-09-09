import type { Program } from '@/domain/types';
import type { Analytics } from '@/state/analytics';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';
import { formatShortDate } from '@/lib/dates';

export type KpiTone = 'default' | 'threat' | 'attention' | 'controlled' | 'info' | 'strategic';

export interface KpiLink {
  label: string;
  to: string;
}

/**
 * The explanation carried by every headline number. A KPI without one is not
 * allowed on the command center: the product rule is that no number appears
 * without the reason it is what it is.
 */
export interface KpiExplanation {
  /** Plain language statement of what the number means right now. */
  headline: string;
  /** How the number is derived, so a reader can disagree with the method. */
  method: string;
  /** Ranked contributors, worst first. */
  contributors: { label: string; detail: string; value?: string }[];
  /** Supporting figures. */
  metrics: { label: string; value: string }[];
  links: KpiLink[];
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  hint: string;
  tone: KpiTone;
  /** 0..1 share used for the card meter, or null for count-only cards. */
  share: number | null;
  explanation: KpiExplanation;
}

const cur = (program: Program) => (n: number) => formatCurrency(n, program.currency);

/**
 * Builds the ten command-center KPIs from the derived analytics. Kept out of the
 * component so the wording and the arithmetic can be unit tested.
 */
export function buildKpis(program: Program, analytics: Analytics): Kpi[] {
  const f = cur(program);
  const { health } = analytics;
  const risk = health.risk;
  const schedule = health.schedule;
  const deps = health.dependencies;
  const changes = health.changes;
  const benefits = health.benefits;
  const actions = health.actions;
  const controls = analytics.controlPortfolio;

  const riskById = Object.fromEntries(program.risks.map((r) => [r.id, r]));
  const nameOf = (id: string) => analytics.ownerById[id] ?? 'unassigned';
  const msName = (id: string) => analytics.milestoneById[id] ?? id;

  const openIssues = program.issues.filter((i) => i.status !== 'closed' && i.status !== 'resolved');
  const escalated = openIssues.filter((i) => i.status === 'escalated');
  const issueCost = openIssues.reduce((s, i) => s + i.actualCostImpact, 0);
  const issueDays = openIssues.reduce((s, i) => s + i.actualScheduleImpactDays, 0);

  const accelerating = risk.assessments.filter((a) => a.trend === 'accelerating');
  const criticals = risk.assessments.filter((a) => a.status !== 'closed' && a.residualSeverity === 'red');
  const atRiskMilestones = schedule.assessments.filter((a) => a.isAtRisk);
  const criticalDeps = deps.assessments.filter((a) => a.status !== 'delivered' && a.status !== 'cancelled' && a.criticality === 'critical');
  const pendingChanges = changes.assessments.filter((a) => a.decision === 'pending' || a.decision === 'escalated' || a.decision === 'deferred');

  return [
    {
      id: 'exposure',
      label: 'Residual risk exposure',
      value: f(risk.totalResidualExposure),
      hint: formatPercent(risk.totalResidualExposure / Math.max(1, program.budget), 0) + ' of the ' + f(program.budget) + ' budget',
      tone: 'threat',
      share: Math.min(1, risk.totalResidualExposure / Math.max(1, program.budget)),
      explanation: {
        headline:
          'Open risks carry ' +
          f(risk.totalResidualExposure) +
          ' of probability-weighted loss after controls, down from ' +
          f(risk.totalInherentExposure) +
          ' inherent. Controls remove ' +
          formatPercent(risk.totalExposureReduced / Math.max(1, risk.totalInherentExposure), 0) +
          '.',
        method:
          'For each open risk: residual probability x residual financial impact, where residual probability = inherent probability x (1 - probability-side control effectiveness). Summed across the register. Closed risks are excluded.',
        contributors: risk.topRisks.slice(0, 6).map((a) => ({
          label: a.ref + ' ' + a.title,
          value: f(a.residualFinancialExposure),
          detail:
            formatPercent(a.residualProbability, 0) +
            ' likely, impact ' +
            f(riskById[a.riskId]?.inherentFinancialImpact ?? 0) +
            ', controls ' +
            formatPercent(a.controlEffectiveness, 0) +
            ' effective, trend ' +
            a.trend,
        })),
        metrics: [
          { label: 'Inherent exposure', value: f(risk.totalInherentExposure) },
          { label: 'Removed by controls', value: f(risk.totalExposureReduced) },
          { label: 'Uncontrolled exposure', value: f(risk.uncontrolledExposure) },
          { label: 'Average control effectiveness', value: formatPercent(risk.averageControlEffectiveness, 0) },
          { label: 'Open risks', value: formatNumber(risk.openCount) },
        ],
        links: [
          { label: 'Open the risk engine', to: '/risk' },
          { label: 'Open RAID++', to: '/raid' },
        ],
      },
    },
    {
      id: 'critical',
      label: 'Critical risks',
      value: formatNumber(criticals.length),
      hint: 'of ' + formatNumber(risk.openCount) + ' open, carrying ' + f(criticals.reduce((s, a) => s + a.residualFinancialExposure, 0)),
      tone: 'threat',
      share: criticals.length / Math.max(1, risk.openCount),
      explanation: {
        headline:
          formatNumber(criticals.length) +
          ' open risks still score red after their controls are credited, threatening ' +
          f(criticals.reduce((s, a) => s + a.residualFinancialExposure, 0)) +
          ' and ' +
          formatNumber(new Set(criticals.flatMap((a) => riskById[a.riskId]?.affectedMilestoneIds ?? [])).size) +
          ' milestones.',
        method:
          'Residual severity is banded from residual probability x residual impact on the 5x5 matrix. Red means a residual score of 15 or above, or an impact of 5 at any probability above remote.',
        contributors: criticals.slice(0, 6).map((a) => ({
          label: a.ref + ' ' + a.title,
          value: f(a.residualFinancialExposure),
          detail:
            'Owner ' +
            nameOf(riskById[a.riskId]?.ownerId ?? '') +
            '. ' +
            ((riskById[a.riskId]?.affectedMilestoneIds ?? []).length > 0
              ? 'Threatens ' + (riskById[a.riskId]?.affectedMilestoneIds ?? []).map(msName).join(', ') + '. '
              : 'No milestone linked. ') +
            (a.controlEffect.assessments.length === 0 ? 'No control in place.' : formatNumber(a.controlEffect.assessments.length) + ' controls, combined ' + formatPercent(a.controlEffectiveness, 0) + '.'),
        })),
        metrics: [
          { label: 'Critical risks', value: formatNumber(criticals.length) },
          { label: 'Uncontrolled open risks', value: formatNumber(controls.uncontrolledRiskIds.length) },
          { label: 'Accepted risks', value: formatNumber(risk.acceptedCount) },
          { label: 'Closed risks', value: formatNumber(risk.closedCount) },
        ],
        links: [{ label: 'Open the risk engine', to: '/risk' }],
      },
    },
    {
      id: 'accelerating',
      label: 'Risks accelerating',
      value: formatNumber(accelerating.length),
      hint: accelerating.length === 0 ? 'no risk is deteriorating on trend' : 'residual score rising fastest over 28 days',
      tone: 'attention',
      share: accelerating.length / Math.max(1, risk.openCount),
      explanation: {
        headline:
          accelerating.length === 0
            ? 'No open risk shows a rising residual score over the last 28 days.'
            : formatNumber(accelerating.length) + ' risks are getting worse faster than the programme is closing them.',
        method:
          'Velocity is the change in residual score across the last 28 days of exposure history, normalised per fortnight. Accelerating means velocity above 1.5 points per fortnight with a rising last sample.',
        contributors: accelerating.slice(0, 6).map((a) => ({
          label: a.ref + ' ' + a.title,
          value: '+' + a.velocity.toFixed(1) + ' pts / fortnight',
          detail:
            'Residual score ' +
            a.residualScore.toFixed(1) +
            ', exposure ' +
            f(a.residualFinancialExposure) +
            '. ' +
            (a.drivers[0] ?? ''),
        })),
        metrics: [
          { label: 'Deteriorating', value: formatNumber(risk.assessments.filter((a) => a.trend === 'deteriorating').length) },
          { label: 'Stagnant', value: formatNumber(risk.assessments.filter((a) => a.trend === 'stagnant').length) },
          { label: 'Improving', value: formatNumber(risk.assessments.filter((a) => a.trend === 'improving').length) },
        ],
        links: [{ label: 'Open the risk engine', to: '/risk' }],
      },
    },
    {
      id: 'issues',
      label: 'Open issues',
      value: formatNumber(openIssues.length),
      hint: f(issueCost) + ' realised cost, ' + formatNumber(issueDays) + ' days lost',
      tone: 'attention',
      share: openIssues.length / Math.max(1, program.issues.length),
      explanation: {
        headline:
          formatNumber(openIssues.length) +
          ' issues are live. Unlike risks these have already happened: they have cost ' +
          f(issueCost) +
          ' and ' +
          formatNumber(issueDays) +
          ' days of schedule so far.',
        method: 'Issues with status open, in progress or escalated. Cost and schedule are actuals recorded on the issue, not probability weighted.',
        contributors: [...openIssues]
          .sort((a, b) => b.actualCostImpact - a.actualCostImpact)
          .slice(0, 6)
          .map((i) => ({
            label: i.ref + ' ' + i.title,
            value: f(i.actualCostImpact),
            detail:
              'Owner ' +
              nameOf(i.ownerId) +
              ', ' +
              i.priority +
              ' priority, target ' +
              formatShortDate(i.targetResolution) +
              '. ' +
              (i.originRiskId ? 'Materialised from ' + i.originRiskId.toUpperCase() + '.' : 'No parent risk recorded.'),
          })),
        metrics: [
          { label: 'Escalated', value: formatNumber(escalated.length) },
          { label: 'Resolved', value: formatNumber(program.issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length) },
          { label: 'Realised cost', value: f(issueCost) },
          { label: 'Realised delay', value: formatNumber(issueDays) + ' days' },
        ],
        links: [{ label: 'Open RAID++', to: '/raid' }],
      },
    },
    {
      id: 'actions',
      label: 'Overdue actions',
      value: formatNumber(actions.overdue),
      hint: 'of ' + formatNumber(actions.open) + ' open mitigations',
      tone: 'attention',
      share: actions.overdue / Math.max(1, actions.open),
      explanation: {
        headline:
          formatNumber(actions.overdue) +
          ' mitigation actions are past their due date. Together they were meant to remove roughly ' +
          formatPercent(Math.min(1, actions.atRiskReduction / Math.max(1, actions.overdue)), 0) +
          ' of residual exposure on the risks they serve.',
        method: 'An action is overdue when its due date is before the status date and it is neither complete nor cancelled. The reduction figure is the mean expected risk reduction of the overdue set.',
        contributors: actions.overdueActions.slice(0, 6).map((a) => ({
          label: a.ref + ' ' + a.title,
          value: 'due ' + formatShortDate(a.dueDate),
          detail:
            'Owner ' +
            nameOf(a.ownerId) +
            ', ' +
            formatPercent(a.percentComplete / 100, 0) +
            ' complete, promises ' +
            formatPercent(a.expectedRiskReduction, 0) +
            ' reduction on ' +
            (a.linkedRiskIds.map((r) => r.toUpperCase()).join(', ') || 'no linked risk'),
        })),
        metrics: [
          { label: 'Open actions', value: formatNumber(actions.open) },
          { label: 'Completion rate', value: formatPercent(actions.completionRate, 0) },
          { label: 'Total actions', value: formatNumber(actions.total) },
        ],
        links: [{ label: 'Open RAID++', to: '/raid' }],
      },
    },
    {
      id: 'milestones',
      label: 'Milestones at risk',
      value: formatNumber(schedule.atRisk),
      hint: formatNumber(schedule.overdue) + ' overdue, worst slip ' + formatNumber(schedule.worstVarianceDays) + ' days',
      tone: 'threat',
      share: schedule.atRisk / Math.max(1, schedule.total),
      explanation: {
        headline:
          formatNumber(schedule.atRisk) +
          ' of ' +
          formatNumber(schedule.total) +
          ' milestones are forecast late enough to matter, gating ' +
          f(schedule.benefitValueGated) +
          ' of benefit.',
        method:
          'A milestone is at risk when its forecast date is 10 or more days after baseline, or it is already overdue. Forecast dates come from the plan; dependency pressure is shown separately so the two are not double counted.',
        contributors: [...atRiskMilestones]
          .sort((a, b) => b.varianceDays - a.varianceDays)
          .slice(0, 6)
          .map((m) => ({
            label: m.name,
            value: '+' + formatNumber(m.varianceDays) + ' days',
            detail:
              'Baseline ' +
              formatShortDate(m.baselineDate) +
              ' to forecast ' +
              formatShortDate(m.forecastDate) +
              '. ' +
              (m.drivers[0] ?? 'No driver recorded.'),
          })),
        metrics: [
          { label: 'Complete', value: formatNumber(schedule.complete) + ' of ' + formatNumber(schedule.total) },
          { label: 'Overdue', value: formatNumber(schedule.overdue) },
          { label: 'Gates at risk', value: formatNumber(schedule.gatesAtRisk) },
          { label: 'Schedule performance index', value: schedule.schedulePerformanceIndex.toFixed(2) },
          { label: 'Benefit value gated', value: f(schedule.benefitValueGated) },
        ],
        links: [{ label: 'Open the programme plan', to: '/program' }],
      },
    },
    {
      id: 'dependencies',
      label: 'Critical dependencies',
      value: formatNumber(criticalDeps.length),
      hint: formatNumber(deps.late) + ' late, ' + formatNumber(deps.atRisk) + ' at risk of ' + formatNumber(deps.total),
      tone: 'threat',
      share: criticalDeps.length / Math.max(1, deps.total),
      explanation: {
        headline:
          formatNumber(criticalDeps.length) +
          ' open dependencies are rated critical. Across the register the probability-weighted slip is ' +
          formatNumber(deps.totalExpectedDelayDays) +
          ' days and ' +
          f(deps.benefitValueAtRisk) +
          ' of benefit sits behind them.',
        method:
          'Criticality is recorded on the dependency. Expected delay is delay probability x potential delay days. Benefit at risk follows the dependency to its milestones, then to the benefits those milestones enable.',
        contributors: [...criticalDeps]
          .sort((a, b) => b.criticalityIndex - a.criticalityIndex)
          .slice(0, 6)
          .map((d) => ({ label: d.ref + ' ' + d.name, value: formatNumber(Math.round(d.expectedDelayDays)) + ' days expected', detail: d.narrative })),
        metrics: [
          { label: 'On the critical chain', value: formatNumber(deps.criticalChain.dependencyIds.length) + ' links' },
          { label: 'Critical chain slip', value: formatNumber(Math.round(deps.criticalChain.totalExpectedDelayDays)) + ' days' },
          { label: 'External share', value: formatPercent(deps.externalShare, 0) },
          { label: 'Delivered', value: formatNumber(deps.delivered) + ' of ' + formatNumber(deps.total) },
        ],
        links: [{ label: 'Open dependency intelligence', to: '/dependencies' }],
      },
    },
    {
      id: 'change',
      label: 'Change exposure',
      value: f(changes.pendingCostExposure),
      hint: formatNumber(changes.pending) + ' pending, ' + formatNumber(changes.escalated) + ' escalated of ' + formatNumber(changes.total),
      tone: 'strategic',
      share: Math.min(1, changes.pendingCostExposure / Math.max(1, program.budget * 0.1)),
      explanation: {
        headline:
          f(changes.pendingCostExposure) +
          ' of cost and ' +
          formatNumber(changes.pendingScheduleExposureDays) +
          ' days of schedule are waiting on a change decision. Approved changes have already committed ' +
          f(changes.approvedCostImpact) +
          ', eroding ' +
          formatPercent(changes.budgetErosionPct, 1) +
          ' of budget.',
        method: 'Pending exposure sums cost and schedule impact across changes whose decision is pending, deferred or escalated. Approved impact is counted separately because it is already committed.',
        contributors: pendingChanges
          .sort((a, b) => b.impactIndex - a.impactIndex)
          .slice(0, 6)
          .map((c) => ({
            label: c.ref + ' ' + c.title,
            value: f(c.costImpact),
            detail:
              formatNumber(c.scheduleImpactDays) +
              ' days, benefit ' +
              f(c.benefitImpact) +
              ', ' +
              (c.requiresSteerCo ? 'needs steering committee. ' : 'inside programme authority. ') +
              (c.isStale ? 'Waiting ' + formatNumber(c.daysAwaitingDecision ?? 0) + ' days.' : ''),
          })),
        metrics: [
          { label: 'Approved', value: formatNumber(changes.approved) },
          { label: 'Rejected', value: formatNumber(changes.rejected) },
          { label: 'Needs steering committee', value: formatNumber(changes.steerCoCount) },
          { label: 'Stale decisions', value: formatNumber(changes.staleCount) },
          { label: 'Approved schedule impact', value: formatNumber(changes.approvedScheduleImpactDays) + ' days' },
        ],
        links: [{ label: 'Open change control', to: '/change' }],
      },
    },
    {
      id: 'expected-benefits',
      label: 'Expected benefits',
      value: f(benefits.totalExpected),
      hint: f(benefits.totalValueAtRisk) + ' at risk, ' + f(benefits.confidenceAdjustedValue) + ' confidence adjusted',
      tone: 'info',
      share: null,
      explanation: {
        headline:
          'The business case promises ' +
          f(benefits.totalExpected) +
          '. After deducting probability-weighted threat the defensible number today is ' +
          f(benefits.confidenceAdjustedValue) +
          '.',
        method:
          'Value at risk per benefit is the residual probability of the risks linked to it, applied to the unrealised balance and capped at that balance. Enabling milestones that are late reduce confidence but are not double counted as loss.',
        contributors: [...benefits.assessments]
          .sort((a, b) => b.valueAtRisk - a.valueAtRisk)
          .slice(0, 6)
          .map((b) => ({
            label: b.ref + ' ' + b.name,
            value: f(b.valueAtRisk) + ' at risk',
            detail: b.drivers[0] ?? 'Expected ' + f(b.expectedValue) + ', realised ' + f(b.realisedValue) + '.',
          })),
        metrics: [
          { label: 'Realised', value: f(benefits.totalRealised) },
          { label: 'Unrealised', value: f(benefits.totalUnrealised) },
          { label: 'Low confidence benefits', value: formatNumber(benefits.lowConfidenceCount) },
          { label: 'Benefits at risk', value: formatNumber(benefits.atRiskCount) },
        ],
        links: [{ label: 'Open benefits realisation', to: '/benefits' }],
      },
    },
    {
      id: 'realised-benefits',
      label: 'Realised benefits',
      value: f(benefits.totalRealised),
      hint: formatPercent(benefits.realisationPct, 0) + ' of the expected total',
      tone: 'controlled',
      share: benefits.realisationPct,
      explanation: {
        headline:
          f(benefits.totalRealised) +
          ' of benefit has been banked, ' +
          formatPercent(benefits.realisationPct, 0) +
          ' of the case, with ' +
          formatNumber(benefits.realisedCount) +
          ' benefits fully realised.',
        method: 'Realised value is the latest measurement recorded against each benefit. Pace variance compares realisation share against elapsed share of the benefit window, so a benefit can be behind without being at risk.',
        contributors: [...benefits.assessments]
          .sort((a, b) => a.paceVariance - b.paceVariance)
          .slice(0, 6)
          .map((b) => ({
            label: b.ref + ' ' + b.name,
            value: formatPercent(b.realisationPct, 0) + ' realised',
            detail:
              formatPercent(b.timeElapsedPct, 0) +
              ' of its window has elapsed, so it is ' +
              (b.paceVariance >= 0 ? 'ahead of' : 'behind') +
              ' pace by ' +
              formatPercent(Math.abs(b.paceVariance), 0) +
              '. Confidence ' +
              b.confidence +
              '.',
          })),
        metrics: [
          { label: 'Fully realised', value: formatNumber(benefits.realisedCount) },
          { label: 'Lost', value: formatNumber(benefits.lostCount) },
          { label: 'Realisation', value: formatPercent(benefits.realisationPct, 1) },
        ],
        links: [{ label: 'Open benefits realisation', to: '/benefits' }],
      },
    },
  ];
}

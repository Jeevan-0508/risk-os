import type { Program } from '@/domain/types';
import { computeProgramHealth, type ProgramHealth } from '@/domain/engines/healthEngine';
import { computeBurndown, type BurndownPoint } from '@/domain/engines/riskEngine';
import { summariseControlPortfolio, type ControlPortfolioSummary } from '@/domain/engines/controlEngine';
import { summariseFmea, type FmeaSummary } from '@/domain/engines/fmeaEngine';
import { buildTwinGraph, type TwinGraph } from '@/domain/engines/graphEngine';
import { computeRealisationCurve, type BenefitCurvePoint } from '@/domain/engines/benefitEngine';
import { monthsBetween } from '@/lib/dates';

/**
 * One derived view of the programme. Every screen reads from this object rather
 * than recomputing, so a number shown in two places cannot disagree with itself.
 */
export interface Analytics {
  program: Program;
  health: ProgramHealth;
  burndown: BurndownPoint[];
  controlPortfolio: ControlPortfolioSummary;
  fmea: FmeaSummary;
  graph: TwinGraph;
  benefitCurve: BenefitCurvePoint[];
  months: string[];
  ownerById: Record<string, string>;
  workstreamById: Record<string, string>;
  milestoneById: Record<string, string>;
}

export function computeAnalytics(program: Program): Analytics {
  const health = computeProgramHealth(program);
  const months = monthsBetween(program.startDate, program.statusDate);

  const severity = {
    risk: Object.fromEntries(
      health.risk.assessments.map((a) => [
        a.riskId,
        a.residualSeverity === 'red' ? ('red' as const) : a.residualSeverity === 'amber' ? ('amber' as const) : ('green' as const),
      ]),
    ),
    milestone: Object.fromEntries(
      health.schedule.assessments.map((a) => [
        a.milestoneId,
        a.isComplete ? ('green' as const) : a.isOverdue ? ('red' as const) : a.isAtRisk ? ('amber' as const) : ('neutral' as const),
      ]),
    ),
    program: health.overall.status === 'green' ? ('green' as const) : health.overall.status === 'amber' ? ('amber' as const) : ('red' as const),
  };

  return {
    program,
    health,
    burndown: computeBurndown(program.risks, program.controls, months),
    controlPortfolio: summariseControlPortfolio(program.controls, program.risks, program.statusDate),
    fmea: summariseFmea(program.fmea),
    graph: buildTwinGraph(program, severity),
    benefitCurve: computeRealisationCurve(program, months),
    months,
    ownerById: Object.fromEntries(program.owners.map((o) => [o.id, o.name])),
    workstreamById: Object.fromEntries(program.workstreams.map((w) => [w.id, w.name])),
    milestoneById: Object.fromEntries(program.milestones.map((m) => [m.id, m.name])),
  };
}

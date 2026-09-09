import type { Likert5, Portfolio, Program } from '@/domain/types';
import { computeProgramHealth, type ProgramHealth } from './healthEngine';
import {
  applyCrossLinkPenalties,
  computeCrossLinkImpacts,
  computePortfolioHealth,
  type PortfolioHealth,
  type ProgramPortfolioEntry,
} from './portfolioEngine';

export interface ScenarioRiskOverride {
  riskId: string;
  inherentProbability?: number;
  inherentImpact?: Likert5;
  inherentFinancialImpact?: number;
  inherentScheduleImpactDays?: number;
}

export interface ScenarioControlOverride {
  controlId: string;
  designEffectiveness?: number;
  operatingEffectiveness?: number;
}

export interface ScenarioMilestoneOverride {
  milestoneId: string;
  /** Added to the current forecast date, in days. Positive slips it later. */
  slipDays: number;
}

export interface ScenarioInput {
  riskOverrides?: ScenarioRiskOverride[];
  controlOverrides?: ScenarioControlOverride[];
  milestoneOverrides?: ScenarioMilestoneOverride[];
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Pure. Deep-clones the programme (safe: the domain model is plain,
 * JSON-serialisable data with no functions or cycles) and patches only the
 * fields named in the scenario, so the caller's real object is never touched
 * and nothing but the named fields moves.
 */
export function applyScenario(program: Program, input: ScenarioInput): Program {
  const clone: Program = JSON.parse(JSON.stringify(program));

  for (const override of input.riskOverrides ?? []) {
    const risk = clone.risks.find((r) => r.id === override.riskId);
    if (!risk) continue;
    if (override.inherentProbability !== undefined) risk.inherentProbability = override.inherentProbability;
    if (override.inherentImpact !== undefined) risk.inherentImpact = override.inherentImpact;
    if (override.inherentFinancialImpact !== undefined) risk.inherentFinancialImpact = override.inherentFinancialImpact;
    if (override.inherentScheduleImpactDays !== undefined) risk.inherentScheduleImpactDays = override.inherentScheduleImpactDays;
  }

  for (const override of input.controlOverrides ?? []) {
    const control = clone.controls.find((c) => c.id === override.controlId);
    if (!control) continue;
    if (override.designEffectiveness !== undefined) control.designEffectiveness = override.designEffectiveness;
    if (override.operatingEffectiveness !== undefined) control.operatingEffectiveness = override.operatingEffectiveness;
  }

  for (const override of input.milestoneOverrides ?? []) {
    const milestone = clone.milestones.find((m) => m.id === override.milestoneId);
    if (!milestone) continue;
    milestone.forecastDate = addDays(milestone.forecastDate, override.slipDays);
  }

  return clone;
}

function computeEntries(portfolio: Portfolio): ProgramPortfolioEntry[] {
  const impactsByProgramId = computeCrossLinkImpacts(portfolio);
  return portfolio.programs.map((program) => {
    const health = computeProgramHealth(program);
    const impacts = impactsByProgramId[program.id] ?? [];
    return { program, health: applyCrossLinkPenalties(health, impacts), crossLinkImpacts: impacts };
  });
}

export interface ScenarioSnapshot {
  programHealth: ProgramHealth;
  portfolioHealth: PortfolioHealth;
  totalResidualExposure: number;
  benefitsAtRisk: number;
  entries: ProgramPortfolioEntry[];
}

function snapshot(portfolio: Portfolio, activeProgramId: string): ScenarioSnapshot {
  const entries = computeEntries(portfolio);
  const portfolioHealth = computePortfolioHealth(entries);
  const active = entries.find((e) => e.program.id === activeProgramId)!;
  return {
    programHealth: active.health,
    portfolioHealth,
    totalResidualExposure: active.health.risk.totalResidualExposure,
    benefitsAtRisk: active.health.benefits.totalValueAtRisk,
    entries,
  };
}

export interface ScenarioResult {
  baseline: ScenarioSnapshot;
  scenario: ScenarioSnapshot;
  deltas: {
    programHealthScore: number;
    portfolioHealthScore: number;
    residualExposure: number;
    benefitsAtRisk: number;
  };
  /** Other programmes whose cross-link-adjusted health changed because a real link exists to the scenario programme. Empty when the change stayed contained. */
  affectedOtherPrograms: { programId: string; codename: string; healthScoreDelta: number }[];
}

/**
 * Runs a what-if scenario against the real, current portfolio without ever
 * mutating it: both the baseline and the scenario are computed by re-running
 * the same unchanged engines (computeProgramHealth, computePortfolioHealth,
 * applyCrossLinkPenalties) against two Portfolio objects that only differ by
 * the one patched clone, so "no duplicate logic" and "no mutation of real
 * data" both hold by construction rather than by convention.
 */
export function runScenario(portfolio: Portfolio, activeProgramId: string, input: ScenarioInput): ScenarioResult {
  const activeProgram = portfolio.programs.find((p) => p.id === activeProgramId);
  if (!activeProgram) throw new Error('Unknown programme id for scenario: ' + activeProgramId);

  const scenarioProgram = applyScenario(activeProgram, input);
  const scenarioPortfolio: Portfolio = {
    ...portfolio,
    programs: portfolio.programs.map((p) => (p.id === activeProgramId ? scenarioProgram : p)),
  };

  const baseline = snapshot(portfolio, activeProgramId);
  const scenario = snapshot(scenarioPortfolio, activeProgramId);

  const affectedOtherPrograms = baseline.entries
    .filter((e) => e.program.id !== activeProgramId)
    .map((e) => {
      const before = e.health.overall.score;
      const after = scenario.entries.find((s) => s.program.id === e.program.id)!.health.overall.score;
      return { programId: e.program.id, codename: e.program.codename, healthScoreDelta: after - before };
    })
    .filter((d) => Math.abs(d.healthScoreDelta) > 0.01);

  return {
    baseline,
    scenario,
    deltas: {
      programHealthScore: scenario.programHealth.overall.score - baseline.programHealth.overall.score,
      portfolioHealthScore: scenario.portfolioHealth.score - baseline.portfolioHealth.score,
      residualExposure: scenario.totalResidualExposure - baseline.totalResidualExposure,
      benefitsAtRisk: scenario.benefitsAtRisk - baseline.benefitsAtRisk,
    },
    affectedOtherPrograms,
  };
}

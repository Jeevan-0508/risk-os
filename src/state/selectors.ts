import type { Portfolio, Program } from '@/domain/types';
import { computeAnalytics, type Analytics } from './analytics';
import {
  applyCrossLinkPenalties,
  computeCrossLinkImpacts,
  computePortfolioHealth,
  type CrossLinkImpact,
  type PortfolioHealth,
  type ProgramPortfolioEntry,
} from '@/domain/engines/portfolioEngine';
import {
  computeCrossProgramRiskGroups,
  computeOwnerConcentration,
  computeVendorConcentration,
  type CrossProgramRiskGroup,
  type OwnerConcentrationEntry,
  type VendorConcentrationEntry,
} from '@/domain/engines/concentrationEngine';

/**
 * Everything derived from a Portfolio, in one place, so a screen never
 * recomputes engine output itself. Cross-link penalties are folded into each
 * programme's own analytics.health here (not inside computeAnalytics, which
 * stays a pure single-programme function) so every existing screen that reads
 * `analytics.health` sees the cross-programme-adjusted number without any
 * screen-side change.
 */
export interface PortfolioDerived {
  analyticsByProgramId: Record<string, Analytics>;
  crossLinkImpacts: Record<string, CrossLinkImpact[]>;
  portfolioHealth: PortfolioHealth;
  vendorConcentration: VendorConcentrationEntry[];
  ownerConcentration: OwnerConcentrationEntry[];
  sharedRiskGroups: CrossProgramRiskGroup[];
}

export function computePortfolioDerived(portfolio: Portfolio): PortfolioDerived {
  const crossLinkImpacts = computeCrossLinkImpacts(portfolio);
  const analyticsByProgramId: Record<string, Analytics> = {};
  const entries: ProgramPortfolioEntry[] = portfolio.programs.map((program) => {
    const raw = computeAnalytics(program);
    const impacts = crossLinkImpacts[program.id] ?? [];
    const health = applyCrossLinkPenalties(raw.health, impacts);
    analyticsByProgramId[program.id] = { ...raw, health };
    return { program, health, crossLinkImpacts: impacts };
  });

  return {
    analyticsByProgramId,
    crossLinkImpacts,
    portfolioHealth: computePortfolioHealth(entries),
    vendorConcentration: computeVendorConcentration(portfolio),
    ownerConcentration: computeOwnerConcentration(portfolio),
    sharedRiskGroups: computeCrossProgramRiskGroups(portfolio),
  };
}

export function findActiveProgram(portfolio: Portfolio, activeProgramId: string): Program {
  return portfolio.programs.find((p) => p.id === activeProgramId) ?? portfolio.programs[0];
}

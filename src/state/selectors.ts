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
import type { DecisionQueueItem } from '@/domain/engines/decisionQueueEngine';

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
  /**
   * Every programme's own decisionQueue (unchanged, from analyticsByProgramId[id].health)
   * plus the two portfolio-only reasons that no single programme can see for itself:
   * cross-program-propagation (from crossLinkImpacts) and material-concentration (from
   * vendorConcentration and sharedRiskGroups). See buildPortfolioOnlyDecisions below.
   */
  portfolioDecisionQueue: DecisionQueueItem[];
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

  const vendorConcentration = computeVendorConcentration(portfolio);
  const sharedRiskGroups = computeCrossProgramRiskGroups(portfolio);
  const programDecisions = Object.values(analyticsByProgramId).flatMap((a) => a.health.decisionQueue);
  const portfolioOnlyDecisions = buildPortfolioOnlyDecisions(crossLinkImpacts, vendorConcentration, sharedRiskGroups);

  return {
    analyticsByProgramId,
    crossLinkImpacts,
    portfolioHealth: computePortfolioHealth(entries),
    vendorConcentration,
    ownerConcentration: computeOwnerConcentration(portfolio),
    sharedRiskGroups,
    portfolioDecisionQueue: [...programDecisions, ...portfolioOnlyDecisions].sort((a, b) => rank(b.severity) - rank(a.severity) || b.exposure - a.exposure),
  };
}

function rank(s: DecisionQueueItem['severity']): number {
  return s === 'critical' ? 3 : s === 'high' ? 2 : s === 'medium' ? 1 : 0;
}

/**
 * The two portfolio-only reasons from the decision queue specification:
 * cross-program-propagation (a cross-link whose penalty on the receiving
 * programme is not trivial) and material-concentration (a vendor or a
 * literally-shared risk with a material footprint across programmes).
 * Deterministic and table-driven like everything in decisionQueueEngine.ts;
 * these two just need portfolio-wide inputs no single programme has.
 */
function buildPortfolioOnlyDecisions(
  crossLinkImpacts: Record<string, CrossLinkImpact[]>,
  vendorConcentration: VendorConcentrationEntry[],
  sharedRiskGroups: CrossProgramRiskGroup[],
): DecisionQueueItem[] {
  const items: DecisionQueueItem[] = [];

  for (const [programId, impacts] of Object.entries(crossLinkImpacts)) {
    for (const impact of impacts) {
      if (impact.penaltyPoints <= 0) continue;
      const severity = impact.penaltyPoints >= 15 ? 'critical' : impact.penaltyPoints >= 8 ? 'high' : 'medium';
      items.push({
        id: `portfolio:cross-program-propagation:${impact.linkId}`,
        programId,
        riskId: null,
        riskRef: null,
        riskTitle: impact.label,
        reasons: ['cross-program-propagation'],
        primaryReason: 'cross-program-propagation',
        problem: impact.detail,
        exposure: 0,
        severity,
        urgency: severity === 'critical' ? 'immediate' : 'this-month',
        ownerId: null,
        recommendedAction: 'Coordinate cross-programme response',
        deadline: null,
        evidence: [impact.detail],
        affectedMilestoneIds: [],
        affectedBenefitIds: [],
      });
    }
  }

  for (const v of vendorConcentration) {
    if (!v.crossesPrograms) continue;
    const severity = v.totalInherentExposure >= 500_000 ? 'critical' : 'high';
    items.push({
      id: `portfolio:material-concentration:vendor:${v.vendor}`,
      programId: v.programIds[0] ?? 'portfolio',
      riskId: null,
      riskRef: null,
      riskTitle: v.vendor,
      reasons: ['material-concentration'],
      primaryReason: 'material-concentration',
      problem: `${v.vendor} concentrates ${v.riskCount} open risk(s) worth ${Math.round(v.totalInherentExposure).toLocaleString('en-GB')} across ${v.programCodenames.join(', ')}`,
      exposure: v.totalInherentExposure,
      severity,
      urgency: 'this-month',
      ownerId: null,
      recommendedAction: 'Review concentrated exposure with risk owner',
      deadline: null,
      evidence: [`${v.riskCount} open risk(s) on ${v.programCodenames.join(', ')} share vendor ${v.vendor}`],
      affectedMilestoneIds: [],
      affectedBenefitIds: [],
    });
  }

  for (const g of sharedRiskGroups) {
    const severity = g.totalExposure >= 500_000 ? 'critical' : 'high';
    items.push({
      id: `portfolio:material-concentration:shared-risk:${g.sharedRiskGroupId}`,
      programId: g.programIds[0] ?? 'portfolio',
      riskId: null,
      riskRef: null,
      riskTitle: g.title,
      reasons: ['material-concentration'],
      primaryReason: 'material-concentration',
      problem: `${g.title} is the same underlying risk on ${g.programCodenames.join(', ')}, ${Math.round(g.totalExposure).toLocaleString('en-GB')} combined residual exposure`,
      exposure: g.totalExposure,
      severity,
      urgency: 'this-month',
      ownerId: null,
      recommendedAction: 'Review concentrated exposure with risk owner',
      deadline: null,
      evidence: [`Shared across ${g.riskIds.length} linked risk record(s): ${g.riskIds.join(', ')}`],
      affectedMilestoneIds: [],
      affectedBenefitIds: [],
    });
  }

  return items;
}

export function findActiveProgram(portfolio: Portfolio, activeProgramId: string): Program {
  return portfolio.programs.find((p) => p.id === activeProgramId) ?? portfolio.programs[0];
}

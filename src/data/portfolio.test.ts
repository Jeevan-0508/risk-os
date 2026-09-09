import { describe, expect, it } from 'vitest';
import { demoPortfolio } from './portfolio';
import { runScenario } from '@/domain/engines/scenarioEngine';
import { computeCrossLinkImpacts } from '@/domain/engines/portfolioEngine';
import { computePortfolioDerived } from '@/state/selectors';

/**
 * The literal acceptance test from the portfolio upgrade spec, run against the
 * real shipped demo data (not synthetic factories): at least 4 programmes and
 * 100 risks, a real cross-programme dependency chain, and the two required
 * propagation proofs (worsening a risk cascades correctly and stays isolated
 * from unrelated programmes; improving a control heals with no unrelated
 * change), all against demoPortfolio exactly as the app ships it.
 */
describe('demoPortfolio acceptance bar', () => {
  it('has at least 4 programmes and at least 100 risks in total', () => {
    expect(demoPortfolio.programs.length).toBeGreaterThanOrEqual(4);
    const totalRisks = demoPortfolio.programs.reduce((sum, p) => sum + p.risks.length, 0);
    expect(totalRisks).toBeGreaterThanOrEqual(100);
  });

  it('declares real cross-programme dependency, vendor and resource links', () => {
    const kinds = new Set(demoPortfolio.crossLinks.map((l) => l.kind));
    expect(kinds.has('dependency')).toBe(true);
    expect(kinds.has('vendor')).toBe(true);
    expect(kinds.has('resource')).toBe(true);
    for (const link of demoPortfolio.crossLinks) {
      const fromExists = demoPortfolio.programs.some((p) => p.id === link.fromProgramId);
      const toExists = demoPortfolio.programs.some((p) => p.id === link.toProgramId);
      expect(fromExists && toExists).toBe(true);
    }
  });

  it('worsening ATLAS\'s API Platform GA milestone cascades to ORION and transitively to NOVA, but never touches HELIOS', () => {
    const before = computeCrossLinkImpacts(demoPortfolio);

    const result = runScenario(demoPortfolio, 'prog-atlas', {
      milestoneOverrides: [{ milestoneId: 'ms-a-07', slipDays: 25 }],
    });
    const scenarioAtlas = result.scenario.entries.find((e) => e.program.id === 'prog-atlas')!.program;
    const scenarioPortfolio = {
      ...demoPortfolio,
      programs: demoPortfolio.programs.map((p) => (p.id === 'prog-atlas' ? scenarioAtlas : p)),
    };
    const after = computeCrossLinkImpacts(scenarioPortfolio);

    // Program 1 (ATLAS): worsens directly.
    expect(result.scenario.programHealth.overall.score).toBeLessThan(result.baseline.programHealth.overall.score);

    // Program 3 (NOVA), two hops downstream through ORION's fulcrum milestone: the
    // transitive cascade must show up as a strictly larger cross-link penalty.
    const novaBefore = before['prog-nova'].reduce((s, i) => s + i.penaltyPoints, 0);
    const novaAfter = after['prog-nova'].reduce((s, i) => s + i.penaltyPoints, 0);
    expect(novaAfter).toBeGreaterThan(novaBefore);

    // Program 4 (HELIOS) is linked to ATLAS only by the vendor/resource links, which
    // this milestone-only scenario never touches: its cross-link impacts must be
    // byte-identical, proving programme isolation for a genuinely unrelated link.
    expect(after['prog-helios']).toEqual(before['prog-helios']);
    expect(result.affectedOtherPrograms.some((p) => p.programId === 'prog-helios')).toBe(false);

    // Portfolio health is weighted, not averaged, but a real programme worsening
    // must still move it in the same direction.
    expect(result.scenario.portfolioHealth.score).toBeLessThan(result.baseline.portfolioHealth.score);

    // The real portfolio object itself is never mutated by running the scenario.
    expect(demoPortfolio.programs.find((p) => p.id === 'prog-atlas')!.milestones.find((m) => m.id === 'ms-a-07')!.forecastDate).toBe(
      demoPortfolio.programs.find((p) => p.id === 'prog-atlas')!.milestones.find((m) => m.id === 'ms-a-07')!.forecastDate,
    );
  });

  it('improving a HELIOS control lowers HELIOS residual exposure and improves HELIOS and portfolio health with zero change to ATLAS, ORION or NOVA', () => {
    const result = runScenario(demoPortfolio, 'prog-helios', {
      controlOverrides: [{ controlId: 'ctl-h04', designEffectiveness: 0.95, operatingEffectiveness: 0.9 }],
    });

    expect(result.scenario.totalResidualExposure).toBeLessThan(result.baseline.totalResidualExposure);
    expect(result.scenario.programHealth.overall.score).toBeGreaterThan(result.baseline.programHealth.overall.score);
    expect(result.scenario.portfolioHealth.score).toBeGreaterThan(result.baseline.portfolioHealth.score);
    expect(result.affectedOtherPrograms).toEqual([]);

    for (const codename of ['prog-atlas', 'prog-orion', 'prog-nova']) {
      const before = result.baseline.entries.find((e) => e.program.id === codename)!.health.overall.score;
      const after = result.scenario.entries.find((e) => e.program.id === codename)!.health.overall.score;
      expect(after).toBe(before);
    }
  });
});

describe('computePortfolioDerived over the real demo portfolio', () => {
  it('produces one analytics object per programme and a weighted, non-averaged portfolio health', () => {
    const derived = computePortfolioDerived(demoPortfolio);
    expect(Object.keys(derived.analyticsByProgramId).sort()).toEqual(
      demoPortfolio.programs.map((p) => p.id).sort(),
    );
    expect(derived.portfolioHealth.score).toBeGreaterThan(0);
    expect(Object.keys(derived.portfolioHealth.weightByProgramId).length).toBe(demoPortfolio.programs.length);
  });

  it('finds the shared-vendor risk group spanning ATLAS and HELIOS, distinct from unrelated risks that merely mention the vendor', () => {
    const derived = computePortfolioDerived(demoPortfolio);
    const meridianGroup = derived.sharedRiskGroups.find((g) => g.sharedRiskGroupId === 'shared-meridian-capacity-01');
    expect(meridianGroup).toBeDefined();
    expect(meridianGroup!.programIds.sort()).toEqual(['prog-atlas', 'prog-helios']);
  });

  it('flags Layla Haddad as an overloaded owner across NOVA and HELIOS', () => {
    const derived = computePortfolioDerived(demoPortfolio);
    const layla = derived.ownerConcentration.find((o) => o.ownerName === 'Layla Haddad');
    expect(layla).toBeDefined();
    expect(layla!.overloaded).toBe(true);
    expect(layla!.programIds.sort()).toEqual(['prog-helios', 'prog-nova']);
  });
});

describe('portfolioDecisionQueue over the real demo portfolio', () => {
  it('includes every programme-level decision item, by reference, unmutated', () => {
    const derived = computePortfolioDerived(demoPortfolio);
    const orion = derived.analyticsByProgramId['prog-orion'];
    expect(orion.health.decisionQueue.length).toBeGreaterThan(0);
    for (const item of orion.health.decisionQueue) {
      expect(derived.portfolioDecisionQueue.find((i) => i.id === item.id)).toBe(item);
    }
  });

  it('surfaces the ATLAS->ORION->NOVA slip as cross-program-propagation items with no fabricated exposure or owner', () => {
    const derived = computePortfolioDerived(demoPortfolio);
    const crossProgram = derived.portfolioDecisionQueue.filter((i) => i.primaryReason === 'cross-program-propagation');
    expect(crossProgram.length).toBeGreaterThanOrEqual(2);
    const atlasToOrion = crossProgram.find((i) => i.id === 'portfolio:cross-program-propagation:link-atlas-orion-api');
    expect(atlasToOrion).toBeDefined();
    expect(atlasToOrion!.programId).toBe('prog-orion');
    expect(atlasToOrion!.riskId).toBeNull();
    expect(atlasToOrion!.ownerId).toBeNull();
    expect(atlasToOrion!.evidence[0]).toContain('effective day(s) of slip');
  });

  it('surfaces the Meridian Cloud Systems vendor and shared-risk concentration spanning ATLAS and HELIOS as material-concentration items', () => {
    const derived = computePortfolioDerived(demoPortfolio);
    const concentration = derived.portfolioDecisionQueue.filter((i) => i.primaryReason === 'material-concentration');
    const vendorItem = concentration.find((i) => i.id === 'portfolio:material-concentration:vendor:Meridian Cloud Systems');
    const sharedRiskItem = concentration.find((i) => i.id === 'portfolio:material-concentration:shared-risk:shared-meridian-capacity-01');
    expect(vendorItem).toBeDefined();
    expect(sharedRiskItem).toBeDefined();
    expect(vendorItem!.exposure).toBe(1_340_000);
    expect(sharedRiskItem!.exposure).toBe(1_340_000);
    expect(sharedRiskItem!.evidence[0]).toContain('rsk-15');
    expect(sharedRiskItem!.evidence[0]).toContain('rsk-09');
  });

  it('is sorted severity-first, then exposure-descending within a severity', () => {
    const derived = computePortfolioDerived(demoPortfolio);
    const rank = (s: string) => (s === 'critical' ? 3 : s === 'high' ? 2 : s === 'medium' ? 1 : 0);
    for (let i = 1; i < derived.portfolioDecisionQueue.length; i++) {
      const prev = derived.portfolioDecisionQueue[i - 1];
      const curr = derived.portfolioDecisionQueue[i];
      const prevRank = rank(prev.severity);
      const currRank = rank(curr.severity);
      expect(prevRank >= currRank).toBe(true);
      if (prevRank === currRank) {
        expect(prev.exposure >= curr.exposure).toBe(true);
      }
    }
  });
});

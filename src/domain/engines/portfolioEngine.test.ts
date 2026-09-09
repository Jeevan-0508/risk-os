import { describe, expect, it } from 'vitest';
import { computeProgramHealth } from './healthEngine';
import { applyCrossLinkPenalties, computeCrossLinkImpacts, computePortfolioHealth, type ProgramPortfolioEntry } from './portfolioEngine';
import { makeCrossLink, makeMilestone, makePortfolio, makeProgram, makeRisk } from '@/test/factories';

function entriesFor(portfolio: ReturnType<typeof makePortfolio>): ProgramPortfolioEntry[] {
  const impacts = computeCrossLinkImpacts(portfolio);
  return portfolio.programs.map((program) => {
    const health = computeProgramHealth(program);
    return { program, health: applyCrossLinkPenalties(health, impacts[program.id] ?? []), crossLinkImpacts: impacts[program.id] ?? [] };
  });
}

describe('computeCrossLinkImpacts / program isolation', () => {
  it('produces no impact at all for a programme with no cross-link', () => {
    const upstream = makeProgram({ id: 'prog-a', codename: 'A', milestones: [makeMilestone({ id: 'ms-a', baselineDate: '2026-01-01', forecastDate: '2026-02-15' })] });
    const linked = makeProgram({ id: 'prog-b', codename: 'B', milestones: [makeMilestone({ id: 'ms-b', baselineDate: '2026-02-01', forecastDate: '2026-02-01' })] });
    const unrelated = makeProgram({ id: 'prog-c', codename: 'C' });
    const portfolio = makePortfolio({
      programs: [upstream, linked, unrelated],
      crossLinks: [makeCrossLink({ fromProgramId: 'prog-a', fromMilestoneId: 'ms-a', toProgramId: 'prog-b', toMilestoneId: 'ms-b', passThroughPct: 0.8 })],
    });

    const impacts = computeCrossLinkImpacts(portfolio);
    expect(impacts['prog-c']).toEqual([]);
    expect(impacts['prog-b'].length).toBe(1);
    expect(impacts['prog-b'][0].penaltyPoints).toBeGreaterThan(0);
  });

  it('cascades transitively through a two-hop chain (A -> B -> C) but never touches an unlinked D', () => {
    const a = makeProgram({ id: 'prog-a', codename: 'ATLAS', milestones: [makeMilestone({ id: 'ms-a', baselineDate: '2026-01-01', forecastDate: '2026-03-02' })] }); // 60 days late
    const b = makeProgram({
      id: 'prog-b',
      codename: 'ORION',
      // Same milestone is both the receiving end of A's cascade and the triggering
      // end of the cascade onward to C, exactly the "Integration" fulcrum pattern
      // the product spec describes (ATLAS API Platform -> ORION Integration -> NOVA Launch).
      milestones: [makeMilestone({ id: 'ms-b', baselineDate: '2026-02-01', forecastDate: '2026-02-01' })],
    });
    const c = makeProgram({ id: 'prog-c', codename: 'NOVA', milestones: [makeMilestone({ id: 'ms-c', baselineDate: '2026-03-01', forecastDate: '2026-03-01' })] });
    const d = makeProgram({ id: 'prog-d', codename: 'HELIOS' });

    const portfolio = makePortfolio({
      programs: [a, b, c, d],
      crossLinks: [
        makeCrossLink({ id: 'link-ab', fromProgramId: 'prog-a', fromMilestoneId: 'ms-a', toProgramId: 'prog-b', toMilestoneId: 'ms-b', passThroughPct: 1 }),
        makeCrossLink({ id: 'link-bc', fromProgramId: 'prog-b', fromMilestoneId: 'ms-b', toProgramId: 'prog-c', toMilestoneId: 'ms-c', passThroughPct: 1 }),
      ],
    });

    const impacts = computeCrossLinkImpacts(portfolio);
    expect(impacts['prog-b'][0].penaltyPoints).toBeGreaterThan(0);
    expect(impacts['prog-c'][0].penaltyPoints).toBeGreaterThan(0);
    expect(impacts['prog-c'][0].detail).toContain('inherited');
    expect(impacts['prog-d']).toEqual([]);
  });
});

describe('applyCrossLinkPenalties', () => {
  it('is a no-op, value-equal to the unadjusted health, when there are no impacts', () => {
    const program = makeProgram();
    const health = computeProgramHealth(program);
    const adjusted = applyCrossLinkPenalties(health, []);
    expect(adjusted).toBe(health);
  });

  it('lowers only the dependency dimension and the overall score, never other dimensions', () => {
    const program = makeProgram();
    const health = computeProgramHealth(program);
    const adjusted = applyCrossLinkPenalties(health, [{ linkId: 'l1', fromProgramId: 'x', fromProgramName: 'X', label: 'test', penaltyPoints: 20, detail: 'test detail' }]);
    expect(adjusted.dimensions.dependency.score).toBeLessThan(health.dimensions.dependency.score);
    expect(adjusted.dimensions.risk.score).toBe(health.dimensions.risk.score);
    expect(adjusted.dimensions.schedule.score).toBe(health.dimensions.schedule.score);
    expect(adjusted.overall.score).toBeLessThan(health.overall.score);
  });
});

describe('computePortfolioHealth', () => {
  it('is not a naive average: a critical-priority red programme caps a healthy portfolio at amber', () => {
    const healthyBig = makeProgram({ id: 'p1', codename: 'BIG', budget: 20_000_000, strategicPriority: 'medium' });
    const criticalRed = makeProgram({
      id: 'p2',
      codename: 'SMALL-CRITICAL',
      budget: 500_000,
      strategicPriority: 'critical',
      risks: [makeRisk({ id: 'r1', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 5_000_000 })],
    });
    const portfolio = makePortfolio({ programs: [healthyBig, criticalRed] });
    const entries = entriesFor(portfolio);
    const criticalHealth = entries.find((e) => e.program.id === 'p2')!.health;
    expect(criticalHealth.overall.status).toBe('red');

    const portfolioHealth = computePortfolioHealth(entries);
    expect(portfolioHealth.status).not.toBe('green');
  });

  it('weights a critical small programme above a low-priority large one', () => {
    const critical = makeProgram({ id: 'p1', codename: 'CRIT', budget: 1_000_000, strategicPriority: 'critical' });
    const low = makeProgram({ id: 'p2', codename: 'LOW', budget: 20_000_000, strategicPriority: 'low' });
    const portfolio = makePortfolio({ programs: [critical, low] });
    const entries = entriesFor(portfolio);
    const health = computePortfolioHealth(entries);
    expect(health.weightByProgramId['p1']).toBeGreaterThan(health.weightByProgramId['p2']);
  });

  it('ignores archived/closed programmes in the weighted score', () => {
    const active = makeProgram({ id: 'p1', codename: 'ACTIVE', programStatus: 'active' });
    const closed = makeProgram({
      id: 'p2',
      codename: 'CLOSED',
      programStatus: 'closed',
      risks: [makeRisk({ id: 'r1', inherentProbability: 1, inherentImpact: 5, inherentFinancialImpact: 50_000_000 })],
    });
    const portfolio = makePortfolio({ programs: [active, closed] });
    const entries = entriesFor(portfolio);
    const health = computePortfolioHealth(entries);
    expect(health.weightByProgramId['p2']).toBeUndefined();
  });
});

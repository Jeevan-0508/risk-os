import { describe, expect, it } from 'vitest';
import { applyScenario, runScenario } from './scenarioEngine';
import { makeCrossLink, makeMilestone, makePortfolio, makeProgram, makeRisk } from '@/test/factories';

describe('applyScenario', () => {
  it('never mutates the original programme', () => {
    const program = makeProgram({ risks: [makeRisk({ id: 'r1', inherentFinancialImpact: 1_000_000 })] });
    const frozen = JSON.stringify(program);
    applyScenario(program, { riskOverrides: [{ riskId: 'r1', inherentFinancialImpact: 9_000_000 }] });
    expect(JSON.stringify(program)).toBe(frozen);
  });

  it('patches only the named fields on a clone', () => {
    const program = makeProgram({ risks: [makeRisk({ id: 'r1', inherentProbability: 0.3, inherentFinancialImpact: 1_000_000, title: 'Keep me' })] });
    const scenario = applyScenario(program, { riskOverrides: [{ riskId: 'r1', inherentProbability: 0.9 }] });
    expect(scenario.risks[0].inherentProbability).toBe(0.9);
    expect(scenario.risks[0].inherentFinancialImpact).toBe(1_000_000);
    expect(scenario.risks[0].title).toBe('Keep me');
    expect(scenario).not.toBe(program);
  });
});

describe('runScenario', () => {
  it('leaves the real portfolio object graph untouched', () => {
    const program = makeProgram({ id: 'p1', risks: [makeRisk({ id: 'r1', inherentProbability: 0.3, inherentFinancialImpact: 1_000_000 })] });
    const portfolio = makePortfolio({ programs: [program] });
    const frozen = JSON.stringify(portfolio);
    runScenario(portfolio, 'p1', { riskOverrides: [{ riskId: 'r1', inherentProbability: 0.99, inherentFinancialImpact: 20_000_000 }] });
    expect(JSON.stringify(portfolio)).toBe(frozen);
  });

  it('worsening a risk increases residual exposure and lowers programme and portfolio health', () => {
    const program = makeProgram({
      id: 'p1',
      codename: 'A',
      risks: [makeRisk({ id: 'r1', inherentProbability: 0.2, inherentImpact: 2, inherentFinancialImpact: 200_000 })],
    });
    const portfolio = makePortfolio({ programs: [program] });
    const result = runScenario(portfolio, 'p1', { riskOverrides: [{ riskId: 'r1', inherentProbability: 0.95, inherentImpact: 5, inherentFinancialImpact: 8_000_000 }] });

    expect(result.deltas.residualExposure).toBeGreaterThan(0);
    expect(result.deltas.programHealthScore).toBeLessThan(0);
    expect(result.deltas.portfolioHealthScore).toBeLessThan(0);
  });

  it('improving a control lowers residual exposure and improves health with no unrelated-programme change', () => {
    const program = makeProgram({
      id: 'p1',
      codename: 'A',
      risks: [makeRisk({ id: 'r1', inherentProbability: 0.8, inherentImpact: 4, inherentFinancialImpact: 5_000_000, controlIds: ['c1'] })],
      controls: [
        {
          id: 'c1',
          ref: 'CTL-1',
          name: 'Test control',
          description: 'test',
          type: 'preventive',
          ownerId: 'own-1',
          frequency: 'monthly',
          designEffectiveness: 0.4,
          operatingEffectiveness: 0.4,
          evidenceRef: 'test',
          automated: false,
          linkedRiskIds: ['r1'],
          status: 'active',
        },
      ],
    });
    const untouched = makeProgram({ id: 'p2', codename: 'B' });
    const portfolio = makePortfolio({ programs: [program, untouched] });

    const result = runScenario(portfolio, 'p1', { controlOverrides: [{ controlId: 'c1', designEffectiveness: 0.9, operatingEffectiveness: 0.9 }] });

    expect(result.deltas.residualExposure).toBeLessThan(0);
    expect(result.deltas.programHealthScore).toBeGreaterThan(0);
    expect(result.affectedOtherPrograms).toEqual([]);
  });

  it('only reports another programme as affected when a real cross-link exists', () => {
    const a = makeProgram({ id: 'p1', codename: 'A', milestones: [makeMilestone({ id: 'ms-a', baselineDate: '2026-01-01', forecastDate: '2026-01-01' })] });
    const b = makeProgram({ id: 'p2', codename: 'B', milestones: [makeMilestone({ id: 'ms-b', baselineDate: '2026-02-01', forecastDate: '2026-02-01' })] });
    const c = makeProgram({ id: 'p3', codename: 'C' });
    const portfolio = makePortfolio({
      programs: [a, b, c],
      crossLinks: [makeCrossLink({ fromProgramId: 'p1', fromMilestoneId: 'ms-a', toProgramId: 'p2', toMilestoneId: 'ms-b', passThroughPct: 1 })],
    });

    const result = runScenario(portfolio, 'p1', { milestoneOverrides: [{ milestoneId: 'ms-a', slipDays: 60 }] });

    const affectedIds = result.affectedOtherPrograms.map((d) => d.programId);
    expect(affectedIds).toContain('p2');
    expect(affectedIds).not.toContain('p3');
    expect(result.affectedOtherPrograms.find((d) => d.programId === 'p2')!.healthScoreDelta).toBeLessThan(0);
  });
});

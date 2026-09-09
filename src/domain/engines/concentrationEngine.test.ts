import { describe, expect, it } from 'vitest';
import { computeCrossProgramRiskGroups, computeOwnerConcentration, computeVendorConcentration } from './concentrationEngine';
import { makeAction, makePortfolio, makeProgram, makeRisk } from '@/test/factories';

describe('computeVendorConcentration', () => {
  it('groups independent risks that merely share a vendor, without treating them as the same risk', () => {
    const a = makeProgram({
      id: 'p1',
      codename: 'A',
      risks: [makeRisk({ id: 'r1', vendor: 'Meridian Cloud Systems', inherentFinancialImpact: 500_000 })],
    });
    const b = makeProgram({
      id: 'p2',
      codename: 'B',
      risks: [makeRisk({ id: 'r2', vendor: 'Meridian Cloud Systems', inherentFinancialImpact: 300_000 })],
    });
    const portfolio = makePortfolio({ programs: [a, b] });
    const result = computeVendorConcentration(portfolio);
    expect(result).toHaveLength(1);
    expect(result[0].crossesPrograms).toBe(true);
    expect(result[0].riskCount).toBe(2);
    expect(result[0].totalInherentExposure).toBe(800_000);
  });

  it('excludes closed risks', () => {
    const a = makeProgram({ id: 'p1', risks: [makeRisk({ id: 'r1', vendor: 'X', status: 'closed' })] });
    const portfolio = makePortfolio({ programs: [a] });
    expect(computeVendorConcentration(portfolio)).toHaveLength(0);
  });
});

describe('computeOwnerConcentration', () => {
  it('flags an owner as overloaded only once workload crosses the threshold across programmes', () => {
    const owner = { id: 'own-1', name: 'Priya Raman', role: 'Lead' };
    const light = makeProgram({ id: 'p1', owners: [owner], risks: [makeRisk({ id: 'r1', ownerId: 'own-1' })] });
    const heavy = makeProgram({
      id: 'p2',
      owners: [owner],
      risks: [makeRisk({ id: 'r2', ownerId: 'own-1' }), makeRisk({ id: 'r3', ownerId: 'own-1' })],
      actions: [makeAction({ id: 'a1', ownerId: 'own-1' }), makeAction({ id: 'a2', ownerId: 'own-1' })],
    });
    const portfolio = makePortfolio({ programs: [light, heavy] });
    const result = computeOwnerConcentration(portfolio);
    const entry = result.find((e) => e.ownerName === 'Priya Raman')!;
    expect(entry.programIds).toHaveLength(2);
    expect(entry.overloaded).toBe(true);
  });

  it('does not flag a single-programme owner as overloaded regardless of volume', () => {
    const owner = { id: 'own-1', name: 'Solo Owner', role: 'Lead' };
    const program = makeProgram({
      id: 'p1',
      owners: [owner],
      risks: [makeRisk({ id: 'r1', ownerId: 'own-1' }), makeRisk({ id: 'r2', ownerId: 'own-1' }), makeRisk({ id: 'r3', ownerId: 'own-1' })],
      actions: [makeAction({ id: 'a1', ownerId: 'own-1' }), makeAction({ id: 'a2', ownerId: 'own-1' })],
    });
    const portfolio = makePortfolio({ programs: [program] });
    const entry = computeOwnerConcentration(portfolio).find((e) => e.ownerName === 'Solo Owner')!;
    expect(entry.overloaded).toBe(false);
  });
});

describe('computeCrossProgramRiskGroups', () => {
  it('reports a genuinely shared risk group, distinct from mere vendor overlap', () => {
    const a = makeProgram({
      id: 'p1',
      codename: 'A',
      risks: [makeRisk({ id: 'r1', vendor: 'Meridian Cloud Systems', sharedRiskGroupId: 'shared-meridian', inherentFinancialImpact: 400_000 })],
    });
    const b = makeProgram({
      id: 'p2',
      codename: 'B',
      risks: [
        makeRisk({ id: 'r2', vendor: 'Meridian Cloud Systems', sharedRiskGroupId: 'shared-meridian', inherentFinancialImpact: 600_000 }),
        makeRisk({ id: 'r3', vendor: 'Meridian Cloud Systems' }),
      ],
    });
    const portfolio = makePortfolio({ programs: [a, b] });
    const groups = computeCrossProgramRiskGroups(portfolio);
    expect(groups).toHaveLength(1);
    expect(groups[0].riskIds.sort()).toEqual(['r1', 'r2']);
    expect(groups[0].totalExposure).toBe(1_000_000);

    const vendorConcentration = computeVendorConcentration(portfolio);
    expect(vendorConcentration[0].riskCount).toBe(3);
  });

  it('does not report a shared group id used only within a single programme', () => {
    const a = makeProgram({
      id: 'p1',
      risks: [makeRisk({ id: 'r1', sharedRiskGroupId: 'local-only' }), makeRisk({ id: 'r2', sharedRiskGroupId: 'local-only' })],
    });
    const portfolio = makePortfolio({ programs: [a] });
    expect(computeCrossProgramRiskGroups(portfolio)).toHaveLength(0);
  });
});

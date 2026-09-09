import type { Portfolio } from '@/domain/types';

/**
 * Every function here reads across all programmes in the portfolio, which is
 * why it is not part of healthEngine/riskEngine: those stay single-programme
 * and unaware of the portfolio, so program isolation for health/exposure math
 * is structural. Concentration is deliberately the one place that looks sideways.
 */

export interface VendorConcentrationEntry {
  vendor: string;
  programIds: string[];
  programCodenames: string[];
  riskCount: number;
  totalInherentExposure: number;
  /** True once the same vendor's risks touch more than one programme. */
  crossesPrograms: boolean;
}

/** Groups open risks by declared vendor across every programme. Two risks sharing a vendor are reported as concentration, never merged into one risk. */
export function computeVendorConcentration(portfolio: Portfolio): VendorConcentrationEntry[] {
  const byVendor = new Map<string, VendorConcentrationEntry>();
  for (const program of portfolio.programs) {
    for (const risk of program.risks) {
      if (!risk.vendor || risk.status === 'closed') continue;
      const entry = byVendor.get(risk.vendor) ?? {
        vendor: risk.vendor,
        programIds: [],
        programCodenames: [],
        riskCount: 0,
        totalInherentExposure: 0,
        crossesPrograms: false,
      };
      if (!entry.programIds.includes(program.id)) {
        entry.programIds.push(program.id);
        entry.programCodenames.push(program.codename);
      }
      entry.riskCount += 1;
      entry.totalInherentExposure += risk.inherentFinancialImpact;
      entry.crossesPrograms = entry.programIds.length > 1;
      byVendor.set(risk.vendor, entry);
    }
  }
  return [...byVendor.values()].sort((a, b) => b.totalInherentExposure - a.totalInherentExposure);
}

export interface OwnerConcentrationEntry {
  ownerName: string;
  programIds: string[];
  programCodenames: string[];
  openRiskCount: number;
  openActionCount: number;
  totalOwnedExposure: number;
  /** Workload signal only. Being on several programmes is not a performance judgement. */
  overloaded: boolean;
}

/**
 * Owner.id is only unique inside one programme's own owners[] array, so this
 * matches by name across programmes. That is a deliberate, stated modelling
 * choice: name collisions between two different real people would under-count
 * distinct owners, which is an acceptable trade at this data scale and is
 * cheaper and more transparent than inventing a portfolio-wide person registry
 * the rest of the product does not otherwise need.
 */
export function computeOwnerConcentration(portfolio: Portfolio): OwnerConcentrationEntry[] {
  const byName = new Map<string, OwnerConcentrationEntry>();
  for (const program of portfolio.programs) {
    const ownerNameById = new Map(program.owners.map((o) => [o.id, o.name]));
    const openRisksByOwner = new Map<string, number>();
    const openExposureByOwner = new Map<string, number>();
    for (const risk of program.risks) {
      if (risk.status === 'closed') continue;
      const name = ownerNameById.get(risk.ownerId);
      if (!name) continue;
      openRisksByOwner.set(name, (openRisksByOwner.get(name) ?? 0) + 1);
      openExposureByOwner.set(name, (openExposureByOwner.get(name) ?? 0) + risk.inherentFinancialImpact);
    }
    const openActionsByOwner = new Map<string, number>();
    for (const action of program.actions) {
      if (action.status === 'complete' || action.status === 'cancelled') continue;
      const name = ownerNameById.get(action.ownerId);
      if (!name) continue;
      openActionsByOwner.set(name, (openActionsByOwner.get(name) ?? 0) + 1);
    }

    const names = new Set([...openRisksByOwner.keys(), ...openActionsByOwner.keys()]);
    for (const name of names) {
      const entry = byName.get(name) ?? {
        ownerName: name,
        programIds: [],
        programCodenames: [],
        openRiskCount: 0,
        openActionCount: 0,
        totalOwnedExposure: 0,
        overloaded: false,
      };
      if (!entry.programIds.includes(program.id)) {
        entry.programIds.push(program.id);
        entry.programCodenames.push(program.codename);
      }
      entry.openRiskCount += openRisksByOwner.get(name) ?? 0;
      entry.openActionCount += openActionsByOwner.get(name) ?? 0;
      entry.totalOwnedExposure += openExposureByOwner.get(name) ?? 0;
      byName.set(name, entry);
    }
  }

  for (const entry of byName.values()) {
    const totalItems = entry.openRiskCount + entry.openActionCount;
    entry.overloaded = entry.programIds.length >= 2 && totalItems >= 5;
  }

  return [...byName.values()].sort((a, b) => b.totalOwnedExposure - a.totalOwnedExposure);
}

export interface CrossProgramRiskGroup {
  sharedRiskGroupId: string;
  title: string;
  programIds: string[];
  programCodenames: string[];
  riskIds: string[];
  /** Sum of each member's own residual exposure. Each risk is counted exactly once, in the one group it belongs to, so this is never blindly double-counted against any other total. */
  totalExposure: number;
}

/**
 * Groups risks that are declared the *same underlying risk* manifesting in
 * more than one programme (sharedRiskGroupId), as distinct from
 * computeVendorConcentration's much looser "shares a supplier" grouping.
 * Only groups whose members span two or more distinct programmes are returned:
 * a shared id used twice inside one programme is not a cross-programme risk.
 */
export function computeCrossProgramRiskGroups(portfolio: Portfolio): CrossProgramRiskGroup[] {
  const byGroup = new Map<string, CrossProgramRiskGroup>();
  for (const program of portfolio.programs) {
    for (const risk of program.risks) {
      if (!risk.sharedRiskGroupId) continue;
      const entry = byGroup.get(risk.sharedRiskGroupId) ?? {
        sharedRiskGroupId: risk.sharedRiskGroupId,
        title: risk.title,
        programIds: [],
        programCodenames: [],
        riskIds: [],
        totalExposure: 0,
      };
      if (!entry.programIds.includes(program.id)) {
        entry.programIds.push(program.id);
        entry.programCodenames.push(program.codename);
      }
      entry.riskIds.push(risk.id);
      entry.totalExposure += risk.inherentFinancialImpact;
      byGroup.set(risk.sharedRiskGroupId, entry);
    }
  }
  return [...byGroup.values()].filter((g) => g.programIds.length > 1).sort((a, b) => b.totalExposure - a.totalExposure);
}

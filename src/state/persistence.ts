import type { PersistedState, Program } from '@/domain/types';

export const STORAGE_KEY = 'riskos.state.v1';
export const SCHEMA_VERSION = 1;

/**
 * localStorage is used rather than IndexedDB: the whole programme is a single
 * JSON document of a few hundred kilobytes, so a key-value store is the right
 * size of tool and keeps loading synchronous with no hydration flicker.
 */

export function loadPersisted(): PersistedState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || typeof parsed !== 'object' || !parsed.program) return null;
    if (parsed.version !== SCHEMA_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePersisted(program: Program, source: PersistedState['source']): boolean {
  try {
    const payload: PersistedState = {
      version: SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      source,
      program,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearPersisted(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // A blocked storage API is not a reason to break the session.
  }
}

export function exportFilename(program: Program): string {
  const slug = (program.codename || program.name || 'program').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return 'riskos-' + slug + '-' + program.statusDate + '.json';
}

export function serialiseProgram(program: Program): string {
  return JSON.stringify({ version: SCHEMA_VERSION, exportedAt: new Date().toISOString(), program }, null, 2);
}

export function downloadJson(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------- portfolio

import type { Portfolio, PersistedPortfolioState } from '@/domain/types';

export const PORTFOLIO_STORAGE_KEY = 'riskos.portfolio.v1';
export const PORTFOLIO_SCHEMA_VERSION = 1;

/**
 * Portfolio persistence lives alongside the legacy single-programme key
 * rather than replacing it: an old single-programme save is migrated into a
 * one-programme portfolio the first time it is read (see store.ts), and the
 * legacy key/functions above stay exactly as they were for that migration
 * path and for anything that still round-trips a single Program export.
 */
export function loadPersistedPortfolio(): PersistedPortfolioState | null {
  try {
    const raw = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedPortfolioState;
    if (!parsed || typeof parsed !== 'object' || !parsed.portfolio) return null;
    if (parsed.version !== PORTFOLIO_SCHEMA_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedPortfolio(
  portfolio: Portfolio,
  activeProgramId: string,
  source: PersistedPortfolioState['source'],
): boolean {
  try {
    const payload: PersistedPortfolioState = {
      version: PORTFOLIO_SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      source,
      activeProgramId,
      portfolio,
    };
    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearPersistedPortfolio(): void {
  try {
    window.localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
  } catch {
    // A blocked storage API is not a reason to break the session.
  }
}

export function exportPortfolioFilename(portfolio: Portfolio): string {
  const slug = (portfolio.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return 'riskos-portfolio-' + slug + '-' + new Date().toISOString().slice(0, 10) + '.json';
}

export function serialisePortfolio(portfolio: Portfolio): string {
  return JSON.stringify({ version: PORTFOLIO_SCHEMA_VERSION, exportedAt: new Date().toISOString(), portfolio }, null, 2);
}

import { create } from 'zustand';
import type { ChangeDecision, Portfolio, Program } from '@/domain/types';
import { demoPortfolio } from '@/data/portfolio';
import { validatePortfolio, validateProgram } from '@/domain/validate';
import {
  clearPersisted,
  clearPersistedPortfolio,
  loadPersisted,
  loadPersistedPortfolio,
  savePersistedPortfolio,
} from './persistence';
import { computeAnalytics, type Analytics } from './analytics';
import { computePortfolioDerived, findActiveProgram, type PortfolioDerived } from './selectors';

export type ProgramSource = 'demo' | 'imported' | 'created' | 'edited';

export interface Notice {
  id: number;
  kind: 'info' | 'success' | 'warning' | 'error';
  message: string;
  detail?: string[];
}

interface StoreState extends PortfolioDerived {
  portfolio: Portfolio;
  activeProgramId: string;
  /** The active programme and its (cross-link-adjusted) analytics, kept in
   * lockstep with portfolio/activeProgramId on every mutation. Every one of
   * the 13 single-programme screens reads only these two fields, unchanged
   * since before the portfolio upgrade, which is what lets them stay
   * completely untouched by it. */
  program: Program;
  analytics: Analytics;
  source: ProgramSource;
  savedAt: string | null;
  persistenceAvailable: boolean;
  notices: Notice[];

  switchProgram: (programId: string) => void;
  loadDemo: () => void;
  importJson: (text: string) => boolean;
  createBlank: (seed: { name: string; codename: string; startDate: string; endDate: string; budget: number }) => void;
  replaceProgram: (program: Program, source: ProgramSource) => void;
  resetToDemo: () => void;
  /** Records a change-control decision in place. The only in-app mutation the product needs, so it stays a single generic action rather than one per screen. */
  decideChange: (changeId: string, decision: ChangeDecision, decisionMakerId: string, rationale: string) => void;
  notify: (notice: Omit<Notice, 'id'>) => void;
  dismissNotice: (id: number) => void;
}

let noticeSeq = 0;

interface Seed {
  portfolio: Portfolio;
  activeProgramId: string;
  source: ProgramSource;
  savedAt: string | null;
}

/**
 * Reads the portfolio-shaped save first; failing that, migrates a legacy
 * single-programme save (from before this upgrade) into a one-programme
 * portfolio so nobody's local data is silently dropped; failing that, the
 * shipped demo portfolio.
 */
function initial(): Seed {
  const persistedPortfolio = loadPersistedPortfolio();
  if (persistedPortfolio) {
    const result = validatePortfolio(persistedPortfolio.portfolio);
    if (result.ok && result.portfolio && result.portfolio.programs.length > 0) {
      const activeProgramId = result.portfolio.programs.some((p) => p.id === persistedPortfolio.activeProgramId)
        ? persistedPortfolio.activeProgramId
        : result.portfolio.programs[0].id;
      return { portfolio: result.portfolio, activeProgramId, source: persistedPortfolio.source, savedAt: persistedPortfolio.savedAt };
    }
  }

  const legacy = loadPersisted();
  if (legacy) {
    const result = validateProgram(legacy.program);
    if (result.ok && result.program) {
      const portfolio: Portfolio = {
        id: 'portfolio-migrated',
        name: (result.program.name || 'Migrated') + ' Portfolio',
        description: 'Migrated automatically from a single-programme save made before the portfolio upgrade.',
        programs: [result.program],
        crossLinks: [],
      };
      return { portfolio, activeProgramId: result.program.id, source: legacy.source, savedAt: legacy.savedAt };
    }
  }

  return { portfolio: demoPortfolio, activeProgramId: 'prog-orion', source: 'demo', savedAt: null };
}

const seed = initial();

function deriveState(portfolio: Portfolio, activeProgramId: string) {
  const derived = computePortfolioDerived(portfolio);
  const program = findActiveProgram(portfolio, activeProgramId);
  const analytics = derived.analyticsByProgramId[program.id] ?? computeAnalytics(program);
  return { ...derived, program, analytics };
}

export const useStore = create<StoreState>((set, get) => ({
  portfolio: seed.portfolio,
  activeProgramId: seed.activeProgramId,
  ...deriveState(seed.portfolio, seed.activeProgramId),
  source: seed.source,
  savedAt: seed.savedAt,
  persistenceAvailable: typeof window !== 'undefined' && Boolean(window.localStorage),
  notices: [],

  notify: (notice) => set((s) => ({ notices: [...s.notices, { ...notice, id: (noticeSeq += 1) }] })),
  dismissNotice: (id) => set((s) => ({ notices: s.notices.filter((n) => n.id !== id) })),

  switchProgram: (programId) => {
    const { portfolio } = get();
    if (!portfolio.programs.some((p) => p.id === programId)) return;
    set({ activeProgramId: programId, ...deriveState(portfolio, programId) });
  },

  replaceProgram: (program, source) => {
    const { portfolio, activeProgramId } = get();
    const idx = portfolio.programs.findIndex((p) => p.id === activeProgramId);
    const programs = idx === -1 ? [...portfolio.programs, program] : portfolio.programs.map((p, i) => (i === idx ? program : p));
    const nextPortfolio: Portfolio = { ...portfolio, programs };
    const nextActiveId = program.id;
    const saved = savePersistedPortfolio(nextPortfolio, nextActiveId, source);
    set({
      portfolio: nextPortfolio,
      activeProgramId: nextActiveId,
      ...deriveState(nextPortfolio, nextActiveId),
      source,
      savedAt: saved ? new Date().toISOString() : null,
      persistenceAvailable: saved,
    });
  },

  decideChange: (changeId, decision, decisionMakerId, rationale) => {
    const program = get().program;
    const idx = program.changes.findIndex((c) => c.id === changeId);
    if (idx === -1) return;
    const changes = [...program.changes];
    const decided = decision !== 'pending';
    changes[idx] = {
      ...changes[idx],
      decision,
      decisionMakerId,
      decisionRationale: rationale,
      decisionDate: decided ? program.statusDate : undefined,
      status: decided ? 'decided' : 'in-review',
    };
    get().replaceProgram({ ...program, changes }, 'edited');
    get().notify({ kind: 'success', message: changes[idx].ref + ' marked ' + decision + '.' });
  },

  loadDemo: () => {
    const saved = savePersistedPortfolio(demoPortfolio, 'prog-orion', 'demo');
    set({
      portfolio: demoPortfolio,
      activeProgramId: 'prog-orion',
      ...deriveState(demoPortfolio, 'prog-orion'),
      source: 'demo',
      savedAt: saved ? new Date().toISOString() : null,
      persistenceAvailable: saved,
    });
    get().notify({ kind: 'success', message: 'Demo portfolio loaded: ORION, ATLAS, NOVA and HELIOS.' });
  },

  resetToDemo: () => {
    clearPersistedPortfolio();
    clearPersisted();
    const saved = savePersistedPortfolio(demoPortfolio, 'prog-orion', 'demo');
    set({
      portfolio: demoPortfolio,
      activeProgramId: 'prog-orion',
      ...deriveState(demoPortfolio, 'prog-orion'),
      source: 'demo',
      savedAt: saved ? new Date().toISOString() : null,
      persistenceAvailable: saved,
    });
    get().notify({ kind: 'success', message: 'Local data cleared and the demo portfolio restored.' });
  },

  importJson: (text) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      get().notify({
        kind: 'error',
        message: 'That file is not valid JSON.',
        detail: [error instanceof Error ? error.message : String(error)],
      });
      return false;
    }
    const result = validateProgram(parsed);
    if (!result.ok || !result.program) {
      get().notify({ kind: 'error', message: 'The file could not be read as a programme.', detail: result.errors });
      return false;
    }
    get().replaceProgram(result.program, 'imported');
    get().notify({
      kind: result.warnings.length > 0 ? 'warning' : 'success',
      message:
        'Imported ' +
        (result.program.codename || result.program.name) +
        ' into the active programme slot' +
        (result.warnings.length > 0 ? ' with ' + result.warnings.length + ' repair(s).' : '.'),
      detail: result.warnings,
    });
    return true;
  },

  createBlank: (input) => {
    const { portfolio } = get();
    const program: Program = {
      id: 'prog-' + Date.now().toString(36),
      name: input.name || 'New programme',
      codename: input.codename || 'NEW',
      description: '',
      sponsor: '',
      programManager: '',
      startDate: input.startDate,
      endDate: input.endDate,
      statusDate: new Date().toISOString().slice(0, 10),
      budget: input.budget,
      spendToDate: 0,
      forecastSpend: input.budget,
      currency: 'EUR',
      businessUnit: 'Unassigned',
      strategicPriority: 'medium',
      programStatus: 'active',
      strategicObjectives: [],
      owners: [],
      workstreams: [],
      milestones: [],
      deliverables: [],
      risks: [],
      causes: [],
      controls: [],
      actions: [],
      issues: [],
      assumptions: [],
      dependencies: [],
      changes: [],
      decisions: [],
      benefits: [],
      fmea: [],
      dmaic: [],
      metrics: [],
    };
    const nextPortfolio: Portfolio = { ...portfolio, programs: [...portfolio.programs, program] };
    const saved = savePersistedPortfolio(nextPortfolio, program.id, 'created');
    set({
      portfolio: nextPortfolio,
      activeProgramId: program.id,
      ...deriveState(nextPortfolio, program.id),
      source: 'created',
      savedAt: saved ? new Date().toISOString() : null,
      persistenceAvailable: saved,
    });
    get().notify({
      kind: 'info',
      message: 'Empty programme "' + program.codename + '" added to the portfolio and switched to. Import a JSON file or edit the export to populate it.',
    });
  },
}));

export const useProgram = () => useStore((s) => s.program);
export const useAnalytics = () => useStore((s) => s.analytics);
export const usePortfolio = () => useStore((s) => s.portfolio);

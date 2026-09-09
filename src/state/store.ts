import { create } from 'zustand';
import type { Program } from '@/domain/types';
import { orionProgram } from '@/data/orion';
import { validateProgram } from '@/domain/validate';
import { clearPersisted, loadPersisted, savePersisted } from './persistence';
import { computeAnalytics, type Analytics } from './analytics';

export type ProgramSource = 'demo' | 'imported' | 'created' | 'edited';

export interface Notice {
  id: number;
  kind: 'info' | 'success' | 'warning' | 'error';
  message: string;
  detail?: string[];
}

interface StoreState {
  program: Program;
  analytics: Analytics;
  source: ProgramSource;
  savedAt: string | null;
  persistenceAvailable: boolean;
  notices: Notice[];

  loadDemo: () => void;
  importJson: (text: string) => boolean;
  createBlank: (seed: { name: string; codename: string; startDate: string; endDate: string; budget: number }) => void;
  replaceProgram: (program: Program, source: ProgramSource) => void;
  resetToDemo: () => void;
  /** Records a change-control decision in place. The only in-app mutation the product needs, so it stays a single generic action rather than one per screen. */
  decideChange: (changeId: string, decision: import('@/domain/types').ChangeDecision, decisionMakerId: string, rationale: string) => void;
  notify: (notice: Omit<Notice, 'id'>) => void;
  dismissNotice: (id: number) => void;
}

let noticeSeq = 0;

function initial(): { program: Program; source: ProgramSource; savedAt: string | null } {
  const persisted = loadPersisted();
  if (persisted) {
    const result = validateProgram(persisted.program);
    if (result.ok && result.program) {
      return { program: result.program, source: persisted.source, savedAt: persisted.savedAt };
    }
  }
  return { program: orionProgram, source: 'demo', savedAt: null };
}

const seed = initial();

export const useStore = create<StoreState>((set, get) => ({
  program: seed.program,
  analytics: computeAnalytics(seed.program),
  source: seed.source,
  savedAt: seed.savedAt,
  persistenceAvailable: typeof window !== 'undefined' && Boolean(window.localStorage),
  notices: [],

  notify: (notice) => set((s) => ({ notices: [...s.notices, { ...notice, id: (noticeSeq += 1) }] })),
  dismissNotice: (id) => set((s) => ({ notices: s.notices.filter((n) => n.id !== id) })),

  replaceProgram: (program, source) => {
    const saved = savePersisted(program, source);
    set({
      program,
      analytics: computeAnalytics(program),
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
    get().replaceProgram(orionProgram, 'demo');
    get().notify({ kind: 'success', message: 'ORION demo programme loaded.' });
  },

  resetToDemo: () => {
    clearPersisted();
    get().replaceProgram(orionProgram, 'demo');
    get().notify({ kind: 'success', message: 'Local data cleared and the ORION demo restored.' });
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
        (result.warnings.length > 0 ? ' with ' + result.warnings.length + ' repair(s).' : '.'),
      detail: result.warnings,
    });
    return true;
  },

  createBlank: (input) => {
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
    get().replaceProgram(program, 'created');
    get().notify({
      kind: 'info',
      message: 'Empty programme created. Import a JSON file or edit the export to populate it.',
    });
  },
}));

export const useProgram = () => useStore((s) => s.program);
export const useAnalytics = () => useStore((s) => s.analytics);

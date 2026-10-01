import { create } from 'zustand';
import type { ChangeDecision, Portfolio, Program, RiskIntakePromotion, RiskIntakeRecord } from '@/domain/types';
import { createRiskFromIntake, parseRiskIntake, toRiskIntakeRecord, validateRiskIntakePromotion } from '@/domain/riskIntake';
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

// The scheduled Fraud Watch workflow commits validated risk-intake.v1 files to
// this inbox. Bundle them at build time so the Risk Intake screen shows the
// automatic handoff without requiring a second manual file picker action.
const bundledRiskIntakeFiles = import.meta.glob('../../risk-intake-inbox/*.risk-intake.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

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
  ingestRiskIntake: (input: unknown) =>
    | { ok: true; status: 'created' | 'updated'; record: RiskIntakeRecord }
    | { ok: false; error: string };
  reviewRiskIntake: (intakeId: string, decision: 'operator_review' | 'rejected', operatorId: string, note: string) =>
    | { ok: true; record: RiskIntakeRecord }
    | { ok: false; error: string };
  promoteRiskIntake: (intakeId: string, assessment: RiskIntakePromotion) =>
    | { ok: true; record: RiskIntakeRecord; riskId: string }
    | { ok: false; error: string };
  resetToDemo: () => void;
  /** Records a change-control decision in place. The only in-app mutation the product needs, so it stays a single generic action rather than one per screen. */
  decideChange: (changeId: string, decision: ChangeDecision, decisionMakerId: string, rationale: string) => void;
  notify: (notice: Omit<Notice, 'id'>) => void;
  dismissNotice: (id: number) => void;
}

let noticeSeq = 0;

export interface Seed {
  portfolio: Portfolio;
  activeProgramId: string;
  source: ProgramSource;
  savedAt: string | null;
}

/**
 * Pure decision logic behind `initial()`, factored out so it is unit
 * testable without faking `window.localStorage` at module-load time.
 *
 * Reads the portfolio-shaped save first; failing that, migrates a legacy
 * single-programme save (from before this upgrade) into a portfolio built
 * from that programme plus the shipped demo's other programmes, so nobody's
 * local data is silently dropped AND the other worked examples (ATLAS, NOVA,
 * HELIOS) stay visible rather than disappearing behind a one-programme
 * portfolio; failing that, the shipped demo portfolio.
 */
export function resolveInitialSeed(
  persistedPortfolio: ReturnType<typeof loadPersistedPortfolio>,
  legacy: ReturnType<typeof loadPersisted>,
): Seed {
  if (persistedPortfolio) {
    const result = validatePortfolio(persistedPortfolio.portfolio);
    if (result.ok && result.portfolio && result.portfolio.programs.length > 0) {
      const activeProgramId = result.portfolio.programs.some((p) => p.id === persistedPortfolio.activeProgramId)
        ? persistedPortfolio.activeProgramId
        : result.portfolio.programs[0].id;
      return { portfolio: result.portfolio, activeProgramId, source: persistedPortfolio.source, savedAt: persistedPortfolio.savedAt };
    }
  }

  if (legacy) {
    const result = validateProgram(legacy.program);
    if (result.ok && result.program) {
      const migrated = result.program;
      const companionPrograms = demoPortfolio.programs.filter((p) => p.id !== migrated.id);
      const portfolio: Portfolio = {
        id: 'portfolio-migrated',
        name: (migrated.name || 'Migrated') + ' Portfolio',
        description: 'Migrated automatically from a single-programme save made before the portfolio upgrade, alongside the shipped demo programmes.',
        programs: [migrated, ...companionPrograms],
        crossLinks: demoPortfolio.crossLinks,
      };
      return { portfolio, activeProgramId: migrated.id, source: legacy.source, savedAt: legacy.savedAt };
    }
  }

  return { portfolio: demoPortfolio, activeProgramId: 'prog-orion', source: 'demo', savedAt: null };
}

function initial(): Seed {
  const seed = resolveInitialSeed(loadPersistedPortfolio(), loadPersisted());
  const targetId = seed.activeProgramId;
  const target = seed.portfolio.programs.find((program) => program.id === targetId);
  if (!target) return seed;
  const existing = target.riskIntakes ?? [];
  const byKey = new Map(existing.map((record) => [record.idempotencyKey, record]));
  for (const raw of Object.values(bundledRiskIntakeFiles)) {
    try {
      const parsed = parseRiskIntake(raw);
      const previous = byKey.get(parsed.idempotency_key) ?? existing.find((record) => record.canonicalRiskId === parsed.canonical_risk_id);
      byKey.set(parsed.idempotency_key, toRiskIntakeRecord(parsed, previous));
    } catch {
      // A malformed inbox file remains visible to CI/import diagnostics; the
      // application refuses it rather than manufacturing a partial record.
    }
  }
  if (Object.keys(bundledRiskIntakeFiles).length === 0) return seed;
  const riskIntakes = [...byKey.values()];
  const portfolio = {
    ...seed.portfolio,
    programs: seed.portfolio.programs.map((program) => (program.id === targetId ? { ...program, riskIntakes } : program)),
  };
  return { ...seed, portfolio };
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

  ingestRiskIntake: (input) => {
    const { portfolio, program, activeProgramId } = get();
    try {
      const parsed = parseRiskIntake(input);
      const existing = (program.riskIntakes ?? []).find(
        (record) => record.idempotencyKey === parsed.idempotency_key || record.canonicalRiskId === parsed.canonical_risk_id,
      );
      const record = toRiskIntakeRecord(parsed, existing);
      const riskIntakes = existing
        ? (program.riskIntakes ?? []).map((item) => (item === existing ? record : item))
        : [...(program.riskIntakes ?? []), record];
      const nextProgram: Program = { ...program, riskIntakes };
      const nextPortfolio: Portfolio = {
        ...portfolio,
        programs: portfolio.programs.map((item) => (item.id === program.id ? nextProgram : item)),
      };
      const saved = savePersistedPortfolio(nextPortfolio, activeProgramId, 'edited');
      set({
        portfolio: nextPortfolio,
        activeProgramId,
        ...deriveState(nextPortfolio, activeProgramId),
        source: 'edited',
        savedAt: saved ? new Date().toISOString() : null,
        persistenceAvailable: saved,
      });
      const status = existing ? 'updated' : 'created';
      get().notify({
        kind: 'success',
        message: 'Risk intake ' + status + ': ' + record.canonicalRiskId + '.',
        detail: ['The record remains separate from scored Risk[] data until operator review supplies missing fields.'],
      });
      return { ok: true, status, record };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      get().notify({ kind: 'error', message: 'Risk intake rejected.', detail: [message] });
      return { ok: false, error: message };
    }
  },

  reviewRiskIntake: (intakeId, decision, operatorId, note) => {
    const { program } = get();
    try {
      if (!operatorId.trim() || !note.trim()) throw new Error('Operator id and review note are required.');
      const current = (program.riskIntakes ?? []).find((record) => record.intakeId === intakeId);
      if (!current) throw new Error('Risk intake was not found.');
      if (current.lifecycle === 'accepted') throw new Error('An accepted intake cannot be moved back to review.');
      const reviewedAt = new Date().toISOString();
      const record: RiskIntakeRecord = {
        ...current,
        lifecycle: decision,
        operatorReview: { operatorId: operatorId.trim(), reviewedAt, note: note.trim() },
        history: [...current.history, { at: reviewedAt, lifecycle: decision, sourceRevision: current.sourceRevision, note: note.trim() }],
      };
      const nextProgram: Program = { ...program, riskIntakes: (program.riskIntakes ?? []).map((item) => (item.intakeId === intakeId ? record : item)) };
      get().replaceProgram(nextProgram, 'edited');
      get().notify({ kind: 'success', message: 'Risk intake marked ' + decision.replace('_', ' ') + '.' });
      return { ok: true, record };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      get().notify({ kind: 'error', message: 'Risk intake review rejected.', detail: [message] });
      return { ok: false, error: message };
    }
  },

  promoteRiskIntake: (intakeId, assessment) => {
    const { program } = get();
    try {
      const current = (program.riskIntakes ?? []).find((record) => record.intakeId === intakeId);
      if (!current) throw new Error('Risk intake was not found.');
      validateRiskIntakePromotion(current, assessment);
      const risk = createRiskFromIntake(current, assessment, program.risks.map((item) => item.id));
      const reviewedAt = new Date().toISOString();
      const record: RiskIntakeRecord = {
        ...current,
        lifecycle: 'accepted',
        authority: 'operator_validated',
        operatorReview: { operatorId: assessment.operatorId.trim(), reviewedAt, note: assessment.note.trim() },
        promotedRiskId: risk.id,
        history: [...current.history, { at: reviewedAt, lifecycle: 'accepted', sourceRevision: current.sourceRevision, note: assessment.note.trim() }],
      };
      const nextProgram: Program = {
        ...program,
        risks: [...program.risks, risk],
        riskIntakes: (program.riskIntakes ?? []).map((item) => (item.intakeId === intakeId ? record : item)),
      };
      get().replaceProgram(nextProgram, 'edited');
      get().notify({ kind: 'success', message: 'Risk intake promoted to scored Risk[] record ' + risk.ref + '.', detail: ['The record retains its intake and source evidence identifiers.'] });
      return { ok: true, record, riskId: risk.id };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      get().notify({ kind: 'error', message: 'Risk intake promotion rejected.', detail: [message] });
      return { ok: false, error: message };
    }
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
      treatments: [],
      acceptances: [],
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

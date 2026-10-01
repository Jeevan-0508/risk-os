import type { Program } from './types';

/**
 * Import validation. An imported file is untrusted: it may be truncated, from an
 * older version, or hand-edited. The rule is that a structurally usable file is
 * accepted with warnings, and only a file we cannot navigate is rejected.
 */

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  program?: Program;
}

const COLLECTIONS = [
  'owners',
  'workstreams',
  'milestones',
  'deliverables',
  'risks',
  'riskIntakes',
  'causes',
  'controls',
  'actions',
  'issues',
  'assumptions',
  'dependencies',
  'changes',
  'decisions',
  'benefits',
  'fmea',
  'dmaic',
  'metrics',
  'strategicObjectives',
  'treatments',
  'acceptances',
] as const;

const REQUIRED_STRINGS = ['id', 'name', 'startDate', 'endDate', 'statusDate'] as const;
const REQUIRED_NUMBERS = ['budget', 'spendToDate', 'forecastSpend'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): boolean {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

/**
 * Coerces an unknown value into a Program. Missing collections are filled with
 * empty arrays so every screen still renders, and each repair is reported.
 */
export function validateProgram(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { ok: false, errors: ['The file does not contain a JSON object.'], warnings };
  }

  const raw = isRecord(input.program) ? (input.program as Record<string, unknown>) : input;

  for (const key of REQUIRED_STRINGS) {
    if (typeof raw[key] !== 'string' || (raw[key] as string).length === 0) {
      errors.push('Missing or invalid "' + key + '".');
    }
  }
  for (const key of ['startDate', 'endDate', 'statusDate'] as const) {
    if (typeof raw[key] === 'string' && !isIsoDate(raw[key])) {
      errors.push('"' + key + '" is not a YYYY-MM-DD date.');
    }
  }
  if (errors.length > 0) return { ok: false, errors, warnings };

  const draft = { ...raw } as Record<string, unknown>;

  for (const key of REQUIRED_NUMBERS) {
    const value = draft[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      warnings.push('"' + key + '" was not a finite number and was set to 0.');
      draft[key] = 0;
    }
  }
  for (const key of ['codename', 'description', 'sponsor', 'programManager', 'currency'] as const) {
    if (typeof draft[key] !== 'string') {
      warnings.push('"' + key + '" was missing and was left blank.');
      draft[key] = key === 'currency' ? 'EUR' : '';
    }
  }

  // Portfolio metadata is new and optional on the wire, but every screen that reads
  // it (Portfolio Command Center, concentration engine, health weighting) wants a
  // real value, so a pre-portfolio import is repaired the same way old collections are.
  if (typeof draft.businessUnit !== 'string') draft.businessUnit = 'Unassigned';
  if (!['critical', 'high', 'medium', 'low'].includes(draft.strategicPriority as string)) draft.strategicPriority = 'medium';
  if (!['active', 'on-hold', 'closed', 'archived'].includes(draft.programStatus as string)) draft.programStatus = 'active';
  if (typeof draft.createdAt !== 'string' || !isIsoDate(draft.createdAt)) draft.createdAt = (draft.startDate as string) ?? '2020-01-01';
  if (typeof draft.updatedAt !== 'string' || !isIsoDate(draft.updatedAt)) draft.updatedAt = (draft.statusDate as string) ?? draft.createdAt;

  for (const key of COLLECTIONS) {
    if (!Array.isArray(draft[key])) {
      warnings.push('Collection "' + key + '" was missing or not an array and was treated as empty.');
      draft[key] = [];
    } else {
      const before = (draft[key] as unknown[]).length;
      // strategicObjectives is a plain string[], not a collection of records; every
      // other entry here is an array of objects with an id, so this is the one exception.
      const isValidEntry = key === 'strategicObjectives' ? (item: unknown) => typeof item === 'string' : isRecord;
      const cleaned = (draft[key] as unknown[]).filter(isValidEntry);
      if (cleaned.length !== before) {
        warnings.push(before - cleaned.length + ' entry(ies) in "' + key + '" were not valid and were dropped.');
      }
      draft[key] = cleaned;
    }
  }

  const program = draft as unknown as Program;
  warnings.push(...auditReferences(program));

  if (program.startDate > program.endDate) {
    warnings.push('Programme start date is after its end date; schedule variance will read oddly.');
  }
  if (program.statusDate < program.startDate || program.statusDate > program.endDate) {
    warnings.push('Status date sits outside the programme window.');
  }

  return { ok: true, errors, warnings, program };
}

/** Reports dangling id references without removing anything. */
export function auditReferences(program: Program): string[] {
  const notes: string[] = [];
  const pool = (items: { id: string }[]) => new Set(items.map((i) => i.id));

  const owners = pool(program.owners ?? []);
  const milestones = pool(program.milestones ?? []);
  const risks = pool(program.risks ?? []);
  const benefits = pool(program.benefits ?? []);
  const controls = pool(program.controls ?? []);
  const dependencies = pool(program.dependencies ?? []);

  const check = (label: string, ids: string[], allowed: Set<string>) => {
    const missing = [...new Set(ids.filter((id) => id && !allowed.has(id)))];
    if (missing.length > 0) {
      notes.push(label + ' references ' + missing.length + ' id(s) that do not exist: ' + missing.slice(0, 5).join(', ') + '.');
    }
  };

  check('Risk owner', (program.risks ?? []).map((r) => r.ownerId), owners);
  check('Risk milestone link', (program.risks ?? []).flatMap((r) => r.affectedMilestoneIds ?? []), milestones);
  check('Risk benefit link', (program.risks ?? []).flatMap((r) => r.affectedBenefitIds ?? []), benefits);
  check('Risk control link', (program.risks ?? []).flatMap((r) => r.controlIds ?? []), controls);
  check('Dependency milestone link', (program.dependencies ?? []).flatMap((d) => d.affectedMilestoneIds ?? []), milestones);
  check('Dependency predecessor', (program.dependencies ?? []).flatMap((d) => d.predecessorIds ?? []), dependencies);
  check('Benefit milestone link', (program.benefits ?? []).flatMap((b) => b.enablingMilestoneIds ?? []), milestones);
  check('Benefit risk link', (program.benefits ?? []).flatMap((b) => b.threateningRiskIds ?? []), risks);

  return notes;
}

// ---------------------------------------------------------------- portfolio

export interface PortfolioValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  portfolio?: import('./types').Portfolio;
}

/**
 * Validates a whole portfolio export. Each programme is run through
 * validateProgram individually so a single malformed programme is reported
 * by name rather than failing the entire import, then cross-link references
 * (which point across programmes, so auditReferences cannot see them) are
 * checked here.
 */
export function validatePortfolio(input: unknown): PortfolioValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) return { ok: false, errors: ['The file does not contain a JSON object.'], warnings };
  const raw = isRecord(input.portfolio) ? (input.portfolio as Record<string, unknown>) : input;

  if (typeof raw.id !== 'string' || typeof raw.name !== 'string') {
    errors.push('Portfolio is missing an "id" or "name".');
  }
  if (!Array.isArray(raw.programs) || raw.programs.length === 0) {
    errors.push('Portfolio has no "programs" array, or it is empty.');
  }
  if (errors.length > 0) return { ok: false, errors, warnings };

  const programs: Program[] = [];
  for (const [i, entry] of (raw.programs as unknown[]).entries()) {
    const result = validateProgram(entry);
    if (!result.ok || !result.program) {
      errors.push('Programme at position ' + i + ' could not be read: ' + result.errors.join(' '));
      continue;
    }
    warnings.push(...result.warnings.map((w) => '[' + (result.program!.codename || i) + '] ' + w));
    programs.push(result.program);
  }
  if (errors.length > 0) return { ok: false, errors, warnings };

  const programIds = new Set(programs.map((p) => p.id));
  const idCounts = new Map<string, number>();
  for (const p of programs) idCounts.set(p.id, (idCounts.get(p.id) ?? 0) + 1);
  const dupes = [...idCounts.entries()].filter(([, n]) => n > 1).map(([id]) => id);
  if (dupes.length > 0) errors.push('Duplicate programme id(s): ' + dupes.join(', ') + '.');

  const crossLinksRaw = Array.isArray(raw.crossLinks) ? (raw.crossLinks as Record<string, unknown>[]) : [];
  const crossLinks = crossLinksRaw.filter((link) => isRecord(link));
  if (crossLinks.length !== crossLinksRaw.length) {
    warnings.push(crossLinksRaw.length - crossLinks.length + ' cross-programme link(s) were not objects and were dropped.');
  }
  for (const link of crossLinks) {
    const from = link.fromProgramId as string;
    const to = link.toProgramId as string;
    if (!programIds.has(from)) warnings.push('Cross-programme link "' + (link.label ?? link.id) + '" references unknown fromProgramId "' + from + '".');
    if (!programIds.has(to)) warnings.push('Cross-programme link "' + (link.label ?? link.id) + '" references unknown toProgramId "' + to + '".');
  }

  if (errors.length > 0) return { ok: false, errors, warnings };

  const portfolio: import('./types').Portfolio = {
    id: raw.id as string,
    name: raw.name as string,
    description: typeof raw.description === 'string' ? raw.description : '',
    programs,
    crossLinks: crossLinks as unknown as import('./types').CrossProgramLink[],
  };

  return { ok: true, errors, warnings, portfolio };
}

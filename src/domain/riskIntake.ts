import type { Likert5, Risk, RiskCategory, RiskIntakeAuthority, RiskIntakeLifecycle, RiskIntakePromotion, RiskIntakeRecord, RiskResponseStrategy, RiskStatus, TimeHorizon } from './types';

export interface RiskIntakeInput {
  schema_version: 'risk-intake.v1';
  kind: 'risk-intake';
  intake_id: string;
  canonical_risk_id: string;
  statement: string;
  source: {
    system: string;
    repository: string;
    revision: string | null;
    uri: string | null;
    identity: string;
    captured_at: string;
    data_class: RiskIntakeRecord['dataClass'];
  };
  claim: {
    evidence_ids: string[];
    contradicting_evidence_ids: string[];
    hypothesis_context_sha256: string | null;
    mode_of_operation_id: string | null;
    likelihood: number | null;
    impact: Likert5 | null;
    financial_impact: number | null;
    owner_id: string | null;
    control_effectiveness: number | null;
    confidence: number | null;
  };
  lifecycle: { state: RiskIntakeLifecycle; authority: RiskIntakeAuthority };
  idempotency_key: string;
}

const DATA_CLASSES = ['synthetic_simulation', 'model_output', 'external_source_content', 'operator_observation'] as const;
const LIFECYCLES = ['hypothesis', 'unverified_external', 'operator_review', 'accepted', 'rejected'] as const;
const AUTHORITIES = ['synthetic', 'model_output', 'external_unverified', 'operator_validated'] as const;
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
const SHA40 = /^[a-f0-9]{40}$/;
const SHA64 = /^[a-f0-9]{64}$/;
const RISK_CATEGORIES: RiskCategory[] = ['delivery', 'technology', 'vendor', 'regulatory', 'financial', 'operational', 'people', 'security', 'data', 'reputational'];
const RISK_STATUSES: RiskStatus[] = ['open', 'monitoring', 'escalated', 'closed', 'accepted', 'materialised'];
const RISK_STRATEGIES: RiskResponseStrategy[] = ['mitigate', 'transfer', 'avoid', 'accept'];
const TIME_HORIZONS: TimeHorizon[] = ['immediate', 'near', 'mid', 'far'];
const EVIDENCE_CONFIDENCE = ['anecdotal', 'indicative', 'measured', 'verified'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[], label: string): void {
  const expected = new Set(keys);
  const unknown = Object.keys(value).filter((key) => !expected.has(key));
  if (unknown.length > 0) throw new Error(label + ' contains unknown field(s): ' + unknown.join(', ') + '.');
  const missing = keys.filter((key) => !(key in value));
  if (missing.length > 0) throw new Error(label + ' is missing field(s): ' + missing.join(', ') + '.');
}

function text(value: unknown, label: string, max = 512): string {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > max) throw new Error(label + ' must be a non-empty bounded string.');
  return value;
}

function nullableText(value: unknown, label: string, max = 512): string | null {
  if (value === null) return null;
  return text(value, label, max);
}

function boundedNumber(value: unknown, label: string, min: number, max: number): number | null {
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error(label + ' must be null or a number from ' + min + ' to ' + max + '.');
  return value;
}

function stringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.length > 500 || value.some((item) => typeof item !== 'string' || item.length === 0 || item.length > 256)) {
    throw new Error(label + ' must be a bounded array of non-empty strings.');
  }
  const unique = new Set(value);
  if (unique.size !== value.length) throw new Error(label + ' must not contain duplicate ids.');
  return [...value];
}

export function parseRiskIntake(input: unknown): RiskIntakeInput {
  if (!isRecord(input)) throw new Error('Risk intake must be a JSON object.');
  exactKeys(input, ['schema_version', 'kind', 'intake_id', 'canonical_risk_id', 'statement', 'source', 'claim', 'lifecycle', 'idempotency_key'], 'risk-intake');
  if (input.schema_version !== 'risk-intake.v1' || input.kind !== 'risk-intake') throw new Error('Risk intake schema_version and kind are invalid.');

  const source = input.source;
  const claim = input.claim;
  const lifecycle = input.lifecycle;
  if (!isRecord(source) || !isRecord(claim) || !isRecord(lifecycle)) throw new Error('source, claim and lifecycle must be objects.');
  exactKeys(source, ['system', 'repository', 'revision', 'uri', 'identity', 'captured_at', 'data_class'], 'source');
  exactKeys(claim, ['evidence_ids', 'contradicting_evidence_ids', 'hypothesis_context_sha256', 'mode_of_operation_id', 'likelihood', 'impact', 'financial_impact', 'owner_id', 'control_effectiveness', 'confidence'], 'claim');
  exactKeys(lifecycle, ['state', 'authority'], 'lifecycle');

  const revision = source.revision === null ? null : text(source.revision, 'source.revision', 40);
  if (revision !== null && !SHA40.test(revision)) throw new Error('source.revision must be a lowercase 40-character SHA-1 or null.');
  const uri = source.uri === null ? null : text(source.uri, 'source.uri', 2048);
  if (uri !== null && !/^https?:\/\//.test(uri)) throw new Error('source.uri must be an HTTP(S) URL or null.');
  if (typeof source.captured_at !== 'string' || !ISO_DATE_TIME.test(source.captured_at) || Number.isNaN(Date.parse(source.captured_at))) throw new Error('source.captured_at must be an ISO UTC timestamp.');
  if (!DATA_CLASSES.includes(source.data_class as typeof DATA_CLASSES[number])) throw new Error('source.data_class is invalid.');
  if (!LIFECYCLES.includes(lifecycle.state as RiskIntakeLifecycle)) throw new Error('lifecycle.state is invalid.');
  if (!AUTHORITIES.includes(lifecycle.authority as RiskIntakeAuthority)) throw new Error('lifecycle.authority is invalid.');

  const dataClass = source.data_class as RiskIntakeRecord['dataClass'];
  const state = lifecycle.state as RiskIntakeLifecycle;
  const authority = lifecycle.authority as RiskIntakeAuthority;
  if (dataClass === 'synthetic_simulation' && (state !== 'hypothesis' || authority !== 'synthetic')) throw new Error('Synthetic simulation input is hypothesis context only and must use synthetic authority.');
  if (dataClass === 'model_output' && authority !== 'model_output') throw new Error('Model output cannot claim operator or external authority.');
  if (state === 'accepted' && authority !== 'operator_validated') throw new Error('Only operator-validated input may be accepted.');
  if (authority === 'operator_validated' && dataClass !== 'operator_observation') throw new Error('Operator validation requires operator-observation data.');

  const hypothesisContextHash = claim.hypothesis_context_sha256 === null ? null : text(claim.hypothesis_context_sha256, 'claim.hypothesis_context_sha256', 64);
  if (hypothesisContextHash !== null && !SHA64.test(hypothesisContextHash)) throw new Error('claim.hypothesis_context_sha256 must be a lowercase 64-character SHA-256 or null.');
  const evidenceIds = stringArray(claim.evidence_ids, 'claim.evidence_ids');
  const contradictingEvidenceIds = stringArray(claim.contradicting_evidence_ids, 'claim.contradicting_evidence_ids');
  if (new Set([...evidenceIds, ...contradictingEvidenceIds]).size !== evidenceIds.length + contradictingEvidenceIds.length) throw new Error('Evidence ids cannot be both supporting and contradicting.');
  if ((dataClass === 'synthetic_simulation' || dataClass === 'model_output') && (evidenceIds.length > 0 || contradictingEvidenceIds.length > 0)) throw new Error('Synthetic and model-produced context cannot be labelled as real-world evidence.');
  const rawImpact = claim.impact;
  const impact = rawImpact === null ? null : rawImpact;
  if (impact !== null && (typeof impact !== 'number' || !Number.isInteger(impact) || impact < 1 || impact > 5)) throw new Error('claim.impact must be null or an integer from 1 to 5.');

  return {
    schema_version: 'risk-intake.v1',
    kind: 'risk-intake',
    intake_id: text(input.intake_id, 'intake_id', 128),
    canonical_risk_id: text(input.canonical_risk_id, 'canonical_risk_id', 256),
    statement: text(input.statement, 'statement', 4000),
    source: {
      system: text(source.system, 'source.system'),
      repository: text(source.repository, 'source.repository', 1024),
      revision,
      uri,
      identity: text(source.identity, 'source.identity', 512),
      captured_at: source.captured_at as string,
      data_class: dataClass,
    },
    claim: {
      evidence_ids: evidenceIds,
      contradicting_evidence_ids: contradictingEvidenceIds,
      hypothesis_context_sha256: hypothesisContextHash,
      mode_of_operation_id: nullableText(claim.mode_of_operation_id, 'claim.mode_of_operation_id', 256),
      likelihood: boundedNumber(claim.likelihood, 'claim.likelihood', 0, 1),
      impact: impact as Likert5 | null,
      financial_impact: boundedNumber(claim.financial_impact, 'claim.financial_impact', 0, Number.MAX_SAFE_INTEGER),
      owner_id: nullableText(claim.owner_id, 'claim.owner_id', 256),
      control_effectiveness: boundedNumber(claim.control_effectiveness, 'claim.control_effectiveness', 0, 1),
      confidence: boundedNumber(claim.confidence, 'claim.confidence', 0, 1),
    },
    lifecycle: { state, authority },
    idempotency_key: text(input.idempotency_key, 'idempotency_key', 256),
  };
}

export function toRiskIntakeRecord(input: RiskIntakeInput, previous?: RiskIntakeRecord): RiskIntakeRecord {
  const next: RiskIntakeRecord = {
    intakeId: input.intake_id,
    canonicalRiskId: input.canonical_risk_id,
    schemaVersion: 'risk-intake.v1',
    statement: input.statement,
    sourceSystem: input.source.system,
    sourceRepository: input.source.repository,
    sourceRevision: input.source.revision,
    sourceUri: input.source.uri,
    sourceIdentity: input.source.identity,
    capturedAt: input.source.captured_at,
    dataClass: input.source.data_class,
    authority: input.lifecycle.authority,
    lifecycle: input.lifecycle.state,
    evidenceIds: input.claim.evidence_ids,
    contradictingEvidenceIds: input.claim.contradicting_evidence_ids,
    hypothesisContextHash: input.claim.hypothesis_context_sha256,
    modeOfOperationId: input.claim.mode_of_operation_id,
    likelihood: input.claim.likelihood,
    impact: input.claim.impact,
    financialImpact: input.claim.financial_impact,
    ownerId: input.claim.owner_id,
    controlEffectiveness: input.claim.control_effectiveness,
    confidence: input.claim.confidence,
    idempotencyKey: input.idempotency_key,
    history: previous?.history ? [...previous.history] : [],
  };
  if (!previous || previous.lifecycle !== next.lifecycle || previous.sourceRevision !== next.sourceRevision || previous.statement !== next.statement) {
    next.history.push({ at: next.capturedAt, lifecycle: next.lifecycle, sourceRevision: next.sourceRevision, note: previous ? 'Intake updated from a newer or changed source.' : 'Intake created from a validated handoff.' });
  }
  return next;
}

function dateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function operatorText(value: unknown, label: string, max: number): string {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > max) throw new Error(label + ' is required.');
  return value.trim();
}

function operatorNumber(value: unknown, label: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error(label + ' must be a finite number from ' + min + ' to ' + max + '.');
  return value;
}

function operatorLikert(value: unknown, label: string): Likert5 {
  if (!Number.isInteger(value) || (value as number) < 1 || (value as number) > 5) throw new Error(label + ' must be an integer from 1 to 5.');
  return value as Likert5;
}

/** Validates the explicit human assessment required before a handoff can become a scored Risk. */
export function validateRiskIntakePromotion(record: RiskIntakeRecord, assessment: RiskIntakePromotion): void {
  if (record.dataClass === 'synthetic_simulation' || record.dataClass === 'model_output' || record.authority === 'synthetic' || record.authority === 'model_output') {
    throw new Error('Synthetic and model-produced context cannot be promoted into scored Risk[] data.');
  }
  if (record.evidenceIds.length === 0) throw new Error('Promotion requires at least one source-bound evidence id.');
  if (record.contradictingEvidenceIds.length > 0) throw new Error('Promotion is blocked while contradicting evidence is unresolved.');
  operatorText(assessment.operatorId, 'operatorId', 256);
  operatorText(assessment.note, 'note', 4000);
  if (!dateOnly(assessment.dateIdentified) || !dateOnly(assessment.reviewDate)) throw new Error('Risk dates must be valid YYYY-MM-DD dates.');
  if (!RISK_CATEGORIES.includes(assessment.category)) throw new Error('Risk category is invalid.');
  if (!RISK_STATUSES.includes(assessment.status)) throw new Error('Risk status is invalid.');
  if (!RISK_STRATEGIES.includes(assessment.strategy)) throw new Error('Risk response strategy is invalid.');
  if (!TIME_HORIZONS.includes(assessment.timeHorizon)) throw new Error('Risk time horizon is invalid.');
  if (!EVIDENCE_CONFIDENCE.includes(assessment.evidenceConfidence)) throw new Error('Evidence confidence is invalid.');
  operatorText(assessment.ownerId, 'ownerId', 256);
  operatorText(assessment.workstreamId, 'workstreamId', 256);
  operatorNumber(assessment.inherentProbability, 'inherentProbability', 0, 1);
  operatorLikert(assessment.inherentImpact, 'inherentImpact');
  operatorNumber(assessment.inherentFinancialImpact, 'inherentFinancialImpact', 0, Number.MAX_SAFE_INTEGER);
  operatorNumber(assessment.inherentScheduleImpactDays, 'inherentScheduleImpactDays', 0, Number.MAX_SAFE_INTEGER);
  operatorLikert(assessment.strategicImpact, 'strategicImpact');
  operatorLikert(assessment.reputationImpact, 'reputationImpact');
}

export function createRiskFromIntake(record: RiskIntakeRecord, assessment: RiskIntakePromotion, existingRiskIds: string[]): Risk {
  validateRiskIntakePromotion(record, assessment);
  const suffix = record.intakeId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64) || 'record';
  const id = 'rsk-intake-' + suffix;
  if (existingRiskIds.includes(id)) throw new Error('This intake already has a scored Risk[] record.');
  const ref = 'INT-' + suffix.toUpperCase().slice(0, 20);
  return {
    id,
    ref,
    title: record.statement.slice(0, 160),
    description: record.statement,
    category: assessment.category,
    ownerId: assessment.ownerId,
    workstreamId: assessment.workstreamId,
    status: assessment.status,
    dateIdentified: assessment.dateIdentified,
    reviewDate: assessment.reviewDate,
    strategy: assessment.strategy,
    inherentProbability: assessment.inherentProbability,
    inherentImpact: assessment.inherentImpact,
    inherentFinancialImpact: assessment.inherentFinancialImpact,
    inherentScheduleImpactDays: assessment.inherentScheduleImpactDays,
    strategicImpact: assessment.strategicImpact,
    reputationImpact: assessment.reputationImpact,
    timeHorizon: assessment.timeHorizon,
    evidenceConfidence: assessment.evidenceConfidence,
    controlIds: [],
    causeIds: [],
    actionIds: [],
    affectedMilestoneIds: [],
    affectedBenefitIds: [],
    dependencyIds: [],
    issueIds: [],
    history: [{ date: assessment.dateIdentified, probability: assessment.inherentProbability, impactScore: assessment.inherentImpact, financialExposure: assessment.inherentFinancialImpact, note: 'Operator assessment from Risk OS intake ' + record.intakeId + '.' }],
    evidence: [],
    comments: [{ id: 'cmt-' + id, authorId: assessment.operatorId, date: assessment.dateIdentified, body: assessment.note + ' Source intake: ' + record.intakeId + '; evidence ids: ' + record.evidenceIds.join(', ') + '.' }],
    tags: ['source:mesh-intake', 'canonical:' + record.canonicalRiskId],
    lastAssessmentDate: assessment.dateIdentified,
    sourceIntakeId: record.intakeId,
    sourceEvidenceIds: [...record.evidenceIds],
  };
}

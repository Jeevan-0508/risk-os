#!/usr/bin/env node
/**
 * Convert Fraud Watch candidate-mo.v1 exports into Risk OS risk-intake.v1
 * hypothesis files. This bridge is intentionally one-way and loss-aware:
 * synthetic candidates carry no evidence ids, no probability, no confidence,
 * and no lifecycle beyond hypothesis/synthetic.
 *
 * Usage:
 *   node scripts/import-fraud-watch-candidates.mjs <input-file-or-dir> [output-dir]
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2];
const outputDir = path.resolve(process.argv[3] ?? 'risk-intake-inbox');

if (!inputPath) {
  console.error('Usage: import-fraud-watch-candidates.mjs <input-file-or-dir> [output-dir]');
  process.exit(2);
}

function fail(message) {
  throw new Error(message);
}

function readInputs(location) {
  const absolute = path.resolve(location);
  const stat = fs.statSync(absolute);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(absolute).filter((name) => name.toLowerCase().endsWith('.json') && name !== 'manifest.json');
    const manifestPath = path.join(absolute, 'manifest.json');
    if (!fs.existsSync(manifestPath)) return files.map((name) => path.join(absolute, name));
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (manifest.schema_version !== 'candidate-export-manifest.v1' || !Array.isArray(manifest.candidates)) {
        return files.map((name) => path.join(absolute, name));
      }
      const current = new Set(manifest.candidates
        .filter((item) => item && item.refused !== true && typeof item.file === 'string')
        .map((item) => item.file));
      return files.filter((name) => current.has(name)).map((name) => path.join(absolute, name));
    } catch {
      return files.map((name) => path.join(absolute, name));
    }
  }
  return [absolute];
}

function stableJson(value) {
  if (Array.isArray(value)) return '[' + value.map(stableJson).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stableJson(value[key])).join(',') + '}';
  return JSON.stringify(value);
}

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120) || 'candidate';
}

function idempotencyKey(id) {
  return id.startsWith('fraud-watch:') ? id : 'fraud-watch:' + id;
}

function baseSource(payload, candidateId, exportedAt) {
  const repository = typeof payload.source.repository === 'string' ? payload.source.repository : 'Jeevan-0508/fraud-watch';
  return {
    system: 'Fraud Watch',
    repository,
    revision: typeof payload.source.revision === 'string' && /^[a-f0-9]{40}$/.test(payload.source.revision) ? payload.source.revision : null,
    uri: typeof payload.source.repository_url === 'string' ? payload.source.repository_url : 'https://github.com/Jeevan-0508/fraud-watch',
    identity: candidateId,
    captured_at: exportedAt,
    data_class: 'synthetic_simulation',
  };
}

function intake({ id, statement, source, patternId, payload }) {
  return {
    schema_version: 'risk-intake.v1',
    kind: 'risk-intake',
    intake_id: id,
    canonical_risk_id: id,
    statement,
    source,
    claim: {
      evidence_ids: [],
      contradicting_evidence_ids: [],
      hypothesis_context_sha256: crypto.createHash('sha256').update(stableJson(payload)).digest('hex'),
      mode_of_operation_id: patternId,
      likelihood: null,
      impact: null,
      financial_impact: null,
      owner_id: null,
      control_effectiveness: null,
      confidence: null,
    },
    lifecycle: { state: 'hypothesis', authority: 'synthetic' },
    idempotency_key: idempotencyKey(id),
  };
}

function assertSyntheticSource(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) fail('Fraud Watch export must be an object');
  if (payload.data_class !== 'synthetic_simulation') fail('Fraud Watch export is not synthetic_simulation');
  if (!payload.source || payload.source.authenticity !== 'unverified_export') fail('Fraud Watch export authenticity is not unverified_export');
}

function convert(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) fail('candidate export must be an object');
  assertSyntheticSource(payload);
  if (payload.schema_version === 'mo-observation.v1' && payload.kind === 'mo_observation') return convertMOObservation(payload);
  if (payload.schema_version !== 'candidate-mo.v1' || payload.kind !== 'candidate_mo') fail('unsupported candidate export schema');
  const candidate = payload.candidate;
  if (!candidate || typeof candidate.id !== 'string' || candidate.id.length === 0) fail('candidate id is missing');
  if (!Array.isArray(candidate.supporting_cases)) fail('candidate supporting cases are missing');
  const signalTypes = [...new Set(candidate.supporting_cases.flatMap((item) => Array.isArray(item?.signal_types) ? item.signal_types : []))].sort();
  const patternId = candidate.supporting_cases.map((item) => item?.related_pattern_id).find((value) => typeof value === 'string') ?? null;
  const exportedAt = typeof payload.exported_at === 'string' ? payload.exported_at : new Date(0).toISOString();
  return intake({
    id: candidate.id,
    statement: 'Synthetic Fraud Watch candidate hypothesis ' + candidate.id + (signalTypes.length ? ' (' + signalTypes.join(', ') + ')' : '') + '.',
    source: baseSource(payload, candidate.id, exportedAt),
    patternId,
    payload,
  });
}

function convertMOObservation(payload) {
  const observation = payload.observation;
  if (!observation || typeof observation !== 'object' || Array.isArray(observation)) fail('MO observation is missing');
  if (typeof observation.id !== 'string' || !/^MO-[0-9]+$/.test(observation.id)) fail('MO observation id is missing or malformed');
  if (!['KNOWN_MO', 'MO_VARIANT', 'POTENTIAL_NEW_MO', 'EMERGING_BEHAVIOR'].includes(observation.classification)) fail('MO observation classification is unknown');
  if (!Array.isArray(observation.signal_types) || observation.signal_types.length === 0 || observation.signal_types.some((value) => typeof value !== 'string' || value.length === 0)) fail('MO observation signal types are missing');
  if (observation.correlation_index_semantics !== 'synthetic_signal_index_not_probability') fail('MO correlation index semantics are not synthetic');
  const exportedAt = typeof payload.exported_at === 'string' ? payload.exported_at : new Date(0).toISOString();
  const title = typeof observation.title === 'string' && observation.title.length > 0 ? observation.title : 'Potential MO ' + observation.id;
  const signals = [...new Set(observation.signal_types)].sort();
  const statement = 'Synthetic Fraud Watch potential MO ' + observation.id + ': ' + title + (signals.length ? ' (' + signals.join(', ') + ').' : '.');
  return intake({
    id: 'fraud-watch:mo:' + observation.id,
    statement,
    source: baseSource(payload, observation.id, exportedAt),
    patternId: typeof observation.related_pattern_id === 'string' ? observation.related_pattern_id : null,
    payload,
  });
}

fs.mkdirSync(outputDir, { recursive: true });
let converted = 0;
for (const file of readInputs(inputPath)) {
  try {
    const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
    const intake = convert(payload);
    const destination = path.join(outputDir, safeName(intake.intake_id) + '.risk-intake.json');
    fs.writeFileSync(destination, JSON.stringify(intake, null, 2) + '\n', 'utf8');
    console.log('Wrote synthetic hypothesis intake: ' + destination);
    converted++;
  } catch (error) {
    console.error('Rejected ' + file + ': ' + (error instanceof Error ? error.message : String(error)));
  }
}
if (converted === 0) process.exitCode = 1;

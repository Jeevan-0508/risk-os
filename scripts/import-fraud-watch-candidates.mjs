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
  if (stat.isDirectory()) return fs.readdirSync(absolute).filter((name) => name.toLowerCase().endsWith('.json')).map((name) => path.join(absolute, name));
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

function convert(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) fail('candidate export must be an object');
  if (payload.schema_version !== 'candidate-mo.v1' || payload.kind !== 'candidate_mo') fail('unsupported candidate export schema');
  if (payload.data_class !== 'synthetic_simulation') fail('candidate export is not synthetic_simulation');
  if (!payload.source || payload.source.authenticity !== 'unverified_export') fail('candidate export authenticity is not unverified_export');
  const candidate = payload.candidate;
  if (!candidate || typeof candidate.id !== 'string' || candidate.id.length === 0) fail('candidate id is missing');
  if (!Array.isArray(candidate.supporting_cases)) fail('candidate supporting cases are missing');
  const signalTypes = [...new Set(candidate.supporting_cases.flatMap((item) => Array.isArray(item?.signal_types) ? item.signal_types : []))].sort();
  const patternId = candidate.supporting_cases.map((item) => item?.related_pattern_id).find((value) => typeof value === 'string') ?? null;
  const digest = crypto.createHash('sha256').update(stableJson(payload)).digest('hex');
  const exportedAt = typeof payload.exported_at === 'string' ? payload.exported_at : new Date(0).toISOString();
  const repository = typeof payload.source.repository === 'string' ? payload.source.repository : 'Jeevan-0508/fraud-watch';
  return {
    schema_version: 'risk-intake.v1',
    kind: 'risk-intake',
    intake_id: candidate.id,
    canonical_risk_id: candidate.id,
    statement: 'Synthetic Fraud Watch candidate hypothesis ' + candidate.id + (signalTypes.length ? ' (' + signalTypes.join(', ') + ')' : '') + '.',
    source: {
      system: 'Fraud Watch',
      repository,
      revision: typeof payload.source.revision === 'string' && /^[a-f0-9]{40}$/.test(payload.source.revision) ? payload.source.revision : null,
      uri: typeof payload.source.repository_url === 'string' ? payload.source.repository_url : 'https://github.com/Jeevan-0508/fraud-watch',
      identity: candidate.id,
      captured_at: exportedAt,
      data_class: 'synthetic_simulation',
    },
    claim: {
      evidence_ids: [],
      contradicting_evidence_ids: [],
      hypothesis_context_sha256: digest,
      mode_of_operation_id: patternId,
      likelihood: null,
      impact: null,
      financial_impact: null,
      owner_id: null,
      control_effectiveness: null,
      confidence: null,
    },
    lifecycle: { state: 'hypothesis', authority: 'synthetic' },
    idempotency_key: 'fraud-watch:' + candidate.id,
  };
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

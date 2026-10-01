import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'risk-os-fw-'));
const input = path.join(temp, 'candidate.json');
const output = path.join(temp, 'out');
const payload = {
  schema_version: 'candidate-mo.v1', kind: 'candidate_mo', data_class: 'synthetic_simulation', exported_at: '2026-10-01T12:00:00.000Z',
  source: { repository: 'Jeevan-0508/fraud-watch', repository_url: 'https://github.com/Jeevan-0508/fraud-watch', revision: null, authenticity: 'unverified_export' },
  candidate: { id: 'fraud-watch:SEAL_MISMATCH+SEAL_REPLACED', supporting_cases: [{ signal_types: ['SEAL_MISMATCH'], related_pattern_id: 'FFT-007' }] },
};
fs.writeFileSync(input, JSON.stringify(payload));
const run = spawnSync(process.execPath, [path.join(import.meta.dirname, 'import-fraud-watch-candidates.mjs'), input, output], { encoding: 'utf8' });
assert.equal(run.status, 0, run.stderr);
const files = fs.readdirSync(output);
assert.equal(files.length, 1);
const intake = JSON.parse(fs.readFileSync(path.join(output, files[0]), 'utf8'));
assert.equal(intake.source.data_class, 'synthetic_simulation');
assert.deepEqual(intake.lifecycle, { state: 'hypothesis', authority: 'synthetic' });
assert.deepEqual(intake.claim.evidence_ids, []);
assert.equal(intake.claim.likelihood, null);
assert.equal(intake.claim.confidence, null);
assert.match(intake.claim.hypothesis_context_sha256, /^[a-f0-9]{64}$/);

const directoryInput = path.join(temp, 'exports');
const directoryOutput = path.join(temp, 'directory-out');
fs.mkdirSync(directoryInput);
fs.writeFileSync(path.join(directoryInput, 'current.json'), JSON.stringify(payload));
fs.writeFileSync(path.join(directoryInput, 'stale.json'), '{"schema_version":"not-a-candidate"}');
fs.writeFileSync(path.join(directoryInput, 'manifest.json'), JSON.stringify({
  schema_version: 'candidate-export-manifest.v1',
  candidates: [{ file: 'current.json', id: payload.candidate.id }],
}));
const directoryRun = spawnSync(process.execPath, [path.join(import.meta.dirname, 'import-fraud-watch-candidates.mjs'), directoryInput, directoryOutput], { encoding: 'utf8' });
assert.equal(directoryRun.status, 0, directoryRun.stderr);
assert.deepEqual(fs.readdirSync(directoryOutput), ['fraud-watch-seal-mismatch-seal-replaced.risk-intake.json']);

const moInput = path.join(temp, 'mo-observation.json');
const moOutput = path.join(temp, 'mo-out');
fs.writeFileSync(moInput, JSON.stringify({
  schema_version: 'mo-observation.v1', kind: 'mo_observation', data_class: 'synthetic_simulation', exported_at: '2026-10-01T12:00:00.000Z',
  source: { repository: 'Jeevan-0508/fraud-watch', repository_url: 'https://github.com/Jeevan-0508/fraud-watch', revision: null, authenticity: 'unverified_export' },
  observation: {
    id: 'MO-0018', classification: 'MO_VARIANT', title: 'Possible Phantom Carrier',
    correlation_index_semantics: 'synthetic_signal_index_not_probability', signal_types: ['CARRIER_UNRESPONSIVE', 'HANDOVER_GAP'], related_pattern_id: 'FFT-001',
  },
}));
const moRun = spawnSync(process.execPath, [path.join(import.meta.dirname, 'import-fraud-watch-candidates.mjs'), moInput, moOutput], { encoding: 'utf8' });
assert.equal(moRun.status, 0, moRun.stderr);
const moIntake = JSON.parse(fs.readFileSync(path.join(moOutput, 'fraud-watch-mo-mo-0018.risk-intake.json'), 'utf8'));
assert.equal(moIntake.intake_id, 'fraud-watch:mo:MO-0018');
assert.match(moIntake.statement, /Possible Phantom Carrier/);
assert.deepEqual(moIntake.claim.evidence_ids, []);
assert.equal(moIntake.lifecycle.authority, 'synthetic');
console.log('Fraud Watch synthetic intake bridge passed.');

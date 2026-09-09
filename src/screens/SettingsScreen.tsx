import { useRef, useState } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { useStore } from '@/state/store';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { Panel, Chip, Stat } from '@/ui/primitives';
import { downloadJson, exportFilename, serialiseProgram } from '@/state/persistence';
import { formatCurrency } from '@/lib/format';
import { formatDate, formatDateTime } from '@/lib/dates';
import { ROUTE_BY_PATH } from '@/nav';

const meta = ROUTE_BY_PATH['/settings'];

const SOURCE_LABEL: Record<string, string> = {
  demo: 'ORION demo programme',
  imported: 'Imported from a JSON file',
  created: 'Created blank, in this browser',
  edited: 'Locally edited since load',
};

export function SettingsScreen() {
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const source = useStore((s) => s.source);
  const savedAt = useStore((s) => s.savedAt);
  const persistenceAvailable = useStore((s) => s.persistenceAvailable);
  const importJson = useStore((s) => s.importJson);
  const resetToDemo = useStore((s) => s.resetToDemo);
  const createBlank = useStore((s) => s.createBlank);
  const notify = useStore((s) => s.notify);
  const fileRef = useRef<HTMLInputElement>(null);

  const [confirmReset, setConfirmReset] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    codename: '',
    startDate: program.statusDate,
    endDate: program.statusDate,
    budget: 1_000_000,
  });

  const onExport = () => {
    downloadJson(exportFilename(program), serialiseProgram(program));
    notify({ kind: 'success', message: 'Exported ' + exportFilename(program) + '.' });
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => notify({ kind: 'error', message: 'Could not read that file.' });
    reader.onload = () => importJson(String(reader.result ?? ''));
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const onCreate = () => {
    if (!form.name.trim() || !form.codename.trim()) {
      notify({ kind: 'error', message: 'A name and codename are required.' });
      return;
    }
    createBlank(form);
    setShowCreate(false);
  };

  return (
    <>
      <ScreenHeader code={meta.code} title={meta.label} purpose={meta.purpose} />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Data source" value={<Chip tone="strategic">{source}</Chip>} hint={SOURCE_LABEL[source] ?? ''} />
        <Stat label="Local persistence" value={persistenceAvailable ? 'Available' : 'Unavailable'} tone={persistenceAvailable ? 'controlled' : 'threat'} hint="Browser localStorage, this device only" />
        <Stat label="Last saved" value={savedAt ? formatDateTime(savedAt) : 'Not yet saved'} />
        <Stat label="Programme size" value={program.risks.length + program.dependencies.length + program.milestones.length + ' objects'} hint="Risks, dependencies and milestones alone" />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Export" subtitle="Download the entire loaded programme as one JSON file. Nothing is sent anywhere; the file never leaves this device.">
          <p className="mb-3 text-xs leading-relaxed text-ink-300">
            The export contains every workstream, milestone, risk, control, dependency, change, decision and benefit, with all
            relationships intact by ID. It is the same shape RISK//OS reads back in on import, so it round-trips exactly.
          </p>
          <button type="button" className="btn-primary" onClick={onExport}>
            <Download className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
            Export {exportFilename(program)}
          </button>
        </Panel>

        <Panel title="Import" subtitle="Replace the loaded programme with one exported from RISK//OS, or hand-authored to the same shape.">
          <p className="mb-3 text-xs leading-relaxed text-ink-300">
            Malformed or incomplete files are rejected with a specific reason rather than corrupting the current programme;
            nothing is replaced until the file validates cleanly.
          </p>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
            Choose a JSON file&hellip;
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Programme JSON file"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </Panel>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Create a new programme" subtitle="Start from an empty programme with only the fields you set here; everything else is built up from scratch inside RISK//OS.">
          {!showCreate ? (
            <button type="button" className="btn" onClick={() => setShowCreate(true)}>
              Create blank programme&hellip;
            </button>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="label mb-1 block">Programme name</span>
                  <input className="input w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="block">
                  <span className="label mb-1 block">Codename</span>
                  <input className="input w-full" value={form.codename} onChange={(e) => setForm({ ...form, codename: e.target.value.toUpperCase() })} />
                </label>
                <label className="block">
                  <span className="label mb-1 block">Start date</span>
                  <input type="date" className="input w-full" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </label>
                <label className="block">
                  <span className="label mb-1 block">End date</span>
                  <input type="date" className="input w-full" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </label>
                <label className="col-span-2 block">
                  <span className="label mb-1 block">Budget ({program.currency})</span>
                  <input
                    type="number"
                    min={0}
                    className="input w-full"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: Number(e.target.value) || 0 })}
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-primary" onClick={onCreate}>
                  Create and switch to it
                </button>
                <button type="button" className="btn" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Reset to the ORION demo" subtitle="Discards anything created, imported or edited locally and reloads the demo programme.">
          <p className="mb-3 text-xs leading-relaxed text-ink-300">
            ORION is the European Logistics Transformation programme used throughout the product: {formatCurrency(8_400_000, program.currency)} budget,
            7 workstreams, 32 milestones, 41 risks, 67 dependencies, {formatCurrency(14_200_000, program.currency)} of expected benefit.
          </p>
          {!confirmReset ? (
            <button type="button" className="btn-danger" onClick={() => setConfirmReset(true)}>
              <RotateCcw className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
              Reset to demo data&hellip;
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-attention">This discards local changes permanently. Continue?</span>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  resetToDemo();
                  setConfirmReset(false);
                }}
              >
                Yes, reset
              </button>
              <button type="button" className="btn" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </div>
          )}
        </Panel>
      </div>

      <Panel title="About this programme" subtitle="What is currently loaded.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <div className="label">Programme</div>
            <div className="mt-1 text-sm text-ink-100">{program.name}</div>
          </div>
          <div>
            <div className="label">Sponsor</div>
            <div className="mt-1 text-sm text-ink-100">{program.sponsor}</div>
          </div>
          <div>
            <div className="label">Programme manager</div>
            <div className="mt-1 text-sm text-ink-100">{program.programManager}</div>
          </div>
          <div>
            <div className="label">Window</div>
            <div className="mt-1 text-sm text-ink-100">
              {formatDate(program.startDate)} &ndash; {formatDate(program.endDate)}
            </div>
          </div>
        </div>
        <p className="mt-4 text-2xs text-ink-500">
          Health {Math.round(analytics.health.overall.score)}/100 &middot; residual exposure {formatCurrency(analytics.health.risk.totalResidualExposure, program.currency)}
        </p>
      </Panel>
    </>
  );
}

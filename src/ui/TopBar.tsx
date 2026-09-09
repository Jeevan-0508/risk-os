import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, RotateCcw, Search, Upload } from 'lucide-react';
import { ROUTE_BY_PATH } from '@/nav';
import { useStore } from '@/state/store';
import { RagBadge } from '@/ui/primitives';
import { downloadJson, exportFilename, serialiseProgram } from '@/state/persistence';
import { formatCurrency } from '@/lib/format';
import { formatDate } from '@/lib/dates';

const SOURCE_LABEL: Record<string, string> = {
  demo: 'Demo data',
  imported: 'Imported',
  created: 'Created here',
  edited: 'Locally edited',
};

export function TopBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const location = useLocation();
  const program = useStore((s) => s.program);
  const analytics = useStore((s) => s.analytics);
  const source = useStore((s) => s.source);
  const importJson = useStore((s) => s.importJson);
  const resetToDemo = useStore((s) => s.resetToDemo);
  const notify = useStore((s) => s.notify);
  const fileRef = useRef<HTMLInputElement>(null);

  const route = ROUTE_BY_PATH[location.pathname];
  const exposure = analytics.health.risk.totalResidualExposure;

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

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-base-600 bg-base-800/80 px-4 backdrop-blur">
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="num text-sm font-bold tracking-widest text-ink-100">{program.codename}</span>
          <span className="truncate text-xs uppercase tracking-wider text-ink-400">{program.name}</span>
        </div>
        <p className="truncate text-2xs text-ink-500">{route ? route.code + ' / ' + route.label + ' \u2014 ' + route.purpose : location.pathname}</p>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-4">
        <div className="hidden text-right lg:block">
          <div className="label">Residual exposure</div>
          <div className="num text-sm text-threat">{formatCurrency(exposure, program.currency)}</div>
        </div>
        <div className="hidden text-right md:block">
          <div className="label">Status date</div>
          <div className="num text-sm text-ink-200">{formatDate(program.statusDate)}</div>
        </div>
        <RagBadge status={analytics.health.overall.status} label={'Health ' + Math.round(analytics.health.overall.score)} />

        <div className="flex items-center gap-1 border-l border-base-600 pl-3">
          <button type="button" onClick={onOpenPalette} className="btn" aria-label="Open command palette" title="Command palette (Ctrl K)">
            <Search aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={onExport} className="btn" title="Export programme JSON">
            <Download aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Export</span>
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="btn" title="Import programme JSON">
            <Upload aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Import</span>
          </button>
          <button type="button" onClick={resetToDemo} className="btn" title="Reset to the ORION demo programme">
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Programme JSON file"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
        <span className="chip hidden shrink-0 border border-base-500 text-ink-400 2xl:inline-flex">{SOURCE_LABEL[source] ?? source}</span>
      </div>
    </header>
  );
}

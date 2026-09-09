import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, Search } from 'lucide-react';
import { ROUTES } from '@/nav';
import { useStore } from '@/state/store';
import { cx } from '@/lib/cx';

interface PaletteItem {
  id: string;
  label: string;
  hint: string;
  group: string;
  /** Where to go. Focus ids are read by the target screen to open its detail panel. */
  to: string;
  run?: () => void;
}

/**
 * One entry point to everything: the thirteen screens, every register item by id
 * or title, and the three data commands. Selecting a register item navigates to
 * its screen with ?focus=<id>, which the screen uses to open its detail panel.
 */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const program = useStore((s) => s.program);
  const resetToDemo = useStore((s) => s.resetToDemo);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo<PaletteItem[]>(() => {
    const out: PaletteItem[] = ROUTES.map((r) => ({
      id: 'route:' + r.path,
      label: r.code + '  ' + r.label,
      hint: r.purpose,
      group: 'Navigate',
      to: r.path,
    }));

    const add = (rows: { id: string; title: string }[], group: string, path: string, hint: (r: { id: string; title: string }) => string) => {
      for (const row of rows) {
        out.push({ id: group + ':' + row.id, label: row.id.toUpperCase() + '  ' + row.title, hint: hint(row), group, to: path + '?focus=' + row.id });
      }
    };

    add(program.risks.map((r) => ({ id: r.id, title: r.title })), 'Risk', '/risk', () => 'Open in the risk engine');
    add(program.issues.map((r) => ({ id: r.id, title: r.title })), 'Issue', '/raid', () => 'Open in RAID++');
    add(program.assumptions.map((r) => ({ id: r.id, title: r.statement })), 'Assumption', '/raid', () => 'Open in RAID++');
    add(program.dependencies.map((r) => ({ id: r.id, title: r.name })), 'Dependency', '/dependencies', () => 'Open in dependency intelligence');
    add(program.milestones.map((r) => ({ id: r.id, title: r.name })), 'Milestone', '/program', () => 'Open in the programme plan');
    add(program.changes.map((r) => ({ id: r.id, title: r.title })), 'Change', '/change', () => 'Open in change control');
    add(program.decisions.map((r) => ({ id: r.id, title: r.title })), 'Decision', '/decisions', () => 'Open in the decision log');
    add(program.benefits.map((r) => ({ id: r.id, title: r.name })), 'Benefit', '/benefits', () => 'Open in benefits realisation');
    add(program.controls.map((r) => ({ id: r.id, title: r.name })), 'Control', '/risk', () => 'Open in the control portfolio');
    add(program.causes.map((r) => ({ id: r.id, title: r.description })), 'Cause', '/root-cause', () => 'Open in root cause analysis');

    out.push({ id: 'cmd:export', label: 'Export programme as JSON', hint: 'Download the whole programme', group: 'Data', to: '/settings?action=export' });
    out.push({ id: 'cmd:import', label: 'Import programme from JSON', hint: 'Replace the loaded programme', group: 'Data', to: '/settings?action=import' });
    out.push({ id: 'cmd:reset', label: 'Reset to the ORION demo programme', hint: 'Discards local changes', group: 'Data', to: '/', run: resetToDemo });

    return out;
  }, [program, resetToDemo]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.filter((i) => i.group === 'Navigate' || i.group === 'Data');
    const tokens = q.split(/\s+/);
    return items
      .filter((i) => {
        const hay = (i.label + ' ' + i.hint + ' ' + i.group).toLowerCase();
        return tokens.every((t) => hay.includes(t));
      })
      .slice(0, 60);
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    const node = listRef.current?.querySelector('[data-active="true"]');
    if (node) node.scrollIntoView({ block: 'nearest' });
  }, [cursor, results]);

  if (!open) return null;

  const choose = (item: PaletteItem | undefined) => {
    if (!item) return;
    if (item.run) item.run();
    navigate(item.to);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[10vh]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-2xl overflow-hidden rounded-lg border border-base-500 bg-base-800 shadow-2xl animate-slide-in"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-base-600 px-4">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, results.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                choose(results[cursor]);
              }
            }}
            placeholder="Search screens, risks, dependencies, decisions, benefits, controls"
            aria-label="Search everything"
            className="h-12 w-full bg-transparent text-sm text-ink-100 outline-none placeholder:text-ink-500"
          />
          <kbd className="num shrink-0 rounded border border-base-500 px-1.5 py-0.5 text-2xs text-ink-400">Esc</kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-400">No match for &ldquo;{query}&rdquo;.</p>
        ) : (
          <ul ref={listRef} className="max-h-[52vh] overflow-y-auto py-1">
            {results.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  data-active={index === cursor}
                  onMouseEnter={() => setCursor(index)}
                  onClick={() => choose(item)}
                  className={cx(
                    'flex w-full items-center gap-3 px-4 py-2 text-left',
                    index === cursor ? 'bg-base-600' : 'hover:bg-base-700',
                  )}
                >
                  <span className="num w-24 shrink-0 text-2xs uppercase tracking-wider text-ink-500">{item.group}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink-100">{item.label}</span>
                    <span className="block truncate text-2xs text-ink-400">{item.hint}</span>
                  </span>
                  {index === cursor && <CornerDownLeft aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink-400" />}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between border-t border-base-600 px-4 py-2 text-2xs text-ink-500">
          <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
          <span>Arrow keys to move, Enter to open</span>
        </div>
      </div>
    </div>
  );
}

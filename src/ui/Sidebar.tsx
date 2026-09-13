import { NavLink } from 'react-router-dom';
import jkLogo from '@/assets/jk-logo.png';
import { Command } from 'lucide-react';
import { ROUTES } from '@/nav';
import { ICONS } from '@/ui/icons';
import { cx } from '@/lib/cx';

/**
 * Fixed left rail. Routes keep their numbers so the product can be talked about
 * by number in a review ("open 07") the way a console is.
 */
export function Sidebar({ onOpenPalette }: { onOpenPalette: () => void }) {
  let lastGroup = '';
  return (
    <nav aria-label="Primary" className="flex h-full w-[13.5rem] shrink-0 flex-col border-r border-base-600 bg-base-800">
      <div className="flex h-14 items-center gap-2 border-b border-base-600 px-4">
        <span className="num text-sm font-bold tracking-tight text-ink-100">
          RISK<span className="text-threat">//</span>OS
        </span>
        <a href="https://github.com/Jeevan-0508" target="_blank" rel="noopener" title="Jeevan Siddhabhaktula" className="ml-auto shrink-0"><img src={jkLogo} alt="JK" className="h-[26px] w-[26px] rounded-full object-cover opacity-90" /></a>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {ROUTES.map((r) => {
          const Icon = ICONS[r.icon];
          const showGroup = r.group !== lastGroup;
          lastGroup = r.group;
          return (
            <div key={r.path}>
              {showGroup && <div className="label px-4 pb-1 pt-3">{r.group}</div>}
              <NavLink
                to={r.path}
                end={r.path === '/'}
                title={r.purpose}
                className={({ isActive }) =>
                  cx(
                    'group flex items-center gap-2.5 border-l-2 px-4 py-2 text-sm transition-colors',
                    isActive
                      ? 'border-threat bg-base-700 text-ink-100'
                      : 'border-transparent text-ink-300 hover:border-base-500 hover:bg-base-700/50 hover:text-ink-100',
                  )
                }
              >
                <span className="num w-5 shrink-0 text-2xs text-ink-500">{r.code}</span>
                {Icon && <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />}
                <span className="truncate">{r.label}</span>
              </NavLink>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={onOpenPalette} className="flex items-center gap-2 border-t border-base-600 px-4 py-3 text-2xs text-ink-400 hover:text-ink-100">
        <Command aria-hidden="true" className="h-3.5 w-3.5" />
        Command palette
        <kbd className="num ml-auto rounded border border-base-500 bg-base-700 px-1.5 py-0.5 text-2xs text-ink-300">Ctrl K</kbd>
      </button>
    </nav>
  );
}

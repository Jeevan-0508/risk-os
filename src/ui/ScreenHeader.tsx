import type { ReactNode } from 'react';

/** Every screen opens with what it is for, so no view is unexplained. */
export function ScreenHeader({ code, title, purpose, actions }: { code: string; title: string; purpose: string; actions?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-4">
      <div className="min-w-0">
        <div className="flex items-baseline gap-2.5">
          <span className="num text-2xs text-threat">{code}</span>
          <h1 className="text-lg font-semibold tracking-tight text-ink-100">{title}</h1>
        </div>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ink-400">{purpose}</p>
      </div>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

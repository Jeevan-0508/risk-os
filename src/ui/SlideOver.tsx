import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

/**
 * Detail panel. Everything opens here rather than navigating away, so the user
 * never loses the list they were working through.
 */
export function SlideOver({
  open,
  onClose,
  title,
  subtitle,
  badge,
  children,
  width = 'wide',
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  width?: 'wide' | 'wider';
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreFocusTo.current = document.activeElement;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const timer = window.setTimeout(() => panelRef.current?.focus(), 20);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
      if (restoreFocusTo.current instanceof HTMLElement) restoreFocusTo.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Detail'}>
      <button className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm" aria-label="Close panel" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={
          'relative flex h-full w-full flex-col border-l border-base-500 bg-base-800 shadow-2xl animate-slide-in ' +
          (width === 'wider' ? 'max-w-3xl' : 'max-w-xl')
        }
      >
        <header className="flex items-start gap-3 border-b border-base-600 bg-base-700/60 px-5 py-4">
          <div className="min-w-0 flex-1">
            {badge && <div className="mb-1.5">{badge}</div>}
            <h2 className="text-sm font-semibold leading-snug text-ink-100">{title}</h2>
            {subtitle && <p className="mt-1 text-2xs text-ink-400">{subtitle}</p>}
          </div>
          <button className="btn px-2 py-1" onClick={onClose} aria-label="Close panel">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="mt-1 text-xs leading-relaxed text-ink-200">{children}</div>
    </div>
  );
}

export function Section({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="mt-5 first:mt-0">
      <div className="mb-2 flex items-center justify-between border-b border-base-600 pb-1.5">
        <h3 className="text-2xs font-semibold uppercase tracking-widest text-ink-300">{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  );
}

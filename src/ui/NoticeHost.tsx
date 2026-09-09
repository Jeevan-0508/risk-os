import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useStore } from '@/state/store';
import { cx } from '@/lib/cx';

const TONE = {
  info: { cls: 'border-info/40 bg-info/10 text-info', Icon: Info },
  success: { cls: 'border-controlled/40 bg-controlled/10 text-controlled', Icon: CheckCircle2 },
  warning: { cls: 'border-attention/40 bg-attention/10 text-attention', Icon: AlertTriangle },
  error: { cls: 'border-threat/40 bg-threat/10 text-threat', Icon: XCircle },
};

/** Notices stay until dismissed: an import warning must not vanish before it is read. */
export function NoticeHost() {
  const notices = useStore((s) => s.notices);
  const dismiss = useStore((s) => s.dismissNotice);
  if (notices.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex w-[22rem] flex-col gap-2" role="status" aria-live="polite">
      {notices.map((n) => {
        const tone = TONE[n.kind];
        return (
          <div key={n.id} className={cx('pointer-events-auto flex items-start gap-2.5 rounded-md border p-3 shadow-lg backdrop-blur animate-slide-in', tone.cls)}>
            <tone.Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="min-w-0 flex-1 text-xs leading-relaxed text-ink-100">{n.message}</p>
            <button type="button" onClick={() => dismiss(n.id)} aria-label="Dismiss notice" className="shrink-0 text-ink-400 hover:text-ink-100">
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

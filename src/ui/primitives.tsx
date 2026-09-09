import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import type { RagStatus } from '@/domain/types';

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
  dense,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  dense?: boolean;
}) {
  return (
    <section className={cx('panel', className)}>
      {(title || actions) && (
        <header className="panel-head">
          <div className="min-w-0">
            {title && <h2 className="truncate text-xs font-semibold uppercase tracking-widest text-ink-200">{title}</h2>}
            {subtitle && <p className="mt-0.5 truncate text-2xs text-ink-400">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={dense ? '' : 'p-4'}>{children}</div>
    </section>
  );
}

const RAG_CLASS: Record<RagStatus, string> = {
  green: 'bg-controlled/15 text-controlled border-controlled/40',
  amber: 'bg-attention/15 text-attention border-attention/40',
  red: 'bg-threat/15 text-threat border-threat/40',
};

const RAG_LABEL: Record<RagStatus, string> = { green: 'Controlled', amber: 'Attention', red: 'Threat' };

/** Never colour alone: the band always carries its word and a shape. */
export function RagBadge({ status, label, className }: { status: RagStatus; label?: string; className?: string }) {
  return (
    <span className={cx('chip border', RAG_CLASS[status], className)}>
      <span aria-hidden="true" className="mr-1.5 inline-block h-1.5 w-1.5 rotate-45 bg-current" />
      {label ?? RAG_LABEL[status]}
    </span>
  );
}

export function Chip({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'info' | 'strategic' | 'controlled' | 'attention' | 'threat'; className?: string }) {
  const tones: Record<string, string> = {
    neutral: 'border-base-500 bg-base-700 text-ink-300',
    info: 'border-info/40 bg-info/10 text-info',
    strategic: 'border-strategic/40 bg-strategic/10 text-strategic',
    controlled: 'border-controlled/40 bg-controlled/10 text-controlled',
    attention: 'border-attention/40 bg-attention/10 text-attention',
    threat: 'border-threat/40 bg-threat/10 text-threat',
  };
  return <span className={cx('chip border', tones[tone], className)}>{children}</span>;
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('label', className)}>{children}</div>;
}

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: 'default' | 'threat' | 'attention' | 'controlled' | 'info' | 'strategic';
}) {
  const toneClass =
    tone === 'threat'
      ? 'text-threat'
      : tone === 'attention'
        ? 'text-attention'
        : tone === 'controlled'
          ? 'text-controlled'
          : tone === 'info'
            ? 'text-info'
            : tone === 'strategic'
              ? 'text-strategic'
              : 'text-ink-100';
  return (
    <div>
      <Label>{label}</Label>
      <div className={cx('num mt-1 text-lg', toneClass)}>{value}</div>
      {hint && <div className="mt-0.5 text-2xs text-ink-400">{hint}</div>}
    </div>
  );
}

/** Horizontal proportion bar. Used for scores, shares and reductions. */
export function Meter({
  value,
  max = 1,
  tone = 'info',
  className,
  label,
}: {
  value: number;
  max?: number;
  tone?: 'info' | 'threat' | 'attention' | 'controlled' | 'strategic';
  className?: string;
  label?: string;
}) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max)) * 100;
  const bg: Record<string, string> = {
    info: 'bg-info',
    threat: 'bg-threat',
    attention: 'bg-attention',
    controlled: 'bg-controlled',
    strategic: 'bg-strategic',
  };
  return (
    <div
      className={cx('h-1.5 w-full overflow-hidden rounded-full bg-base-600', className)}
      role="meter"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cx('h-full rounded-full transition-all duration-500', bg[tone])} style={{ width: pct + '%' }} />
    </div>
  );
}

export function EmptyState({ title, hint, icon }: { title: string; hint?: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      {icon && <div className="text-ink-500">{icon}</div>}
      <p className="text-sm text-ink-300">{title}</p>
      {hint && <p className="max-w-md text-2xs text-ink-500">{hint}</p>}
    </div>
  );
}

/** The explanation block that sits under every headline number. */
export function DriverList({
  drivers,
  className,
}: {
  drivers: { label: string; detail: string; contribution?: number }[];
  className?: string;
}) {
  if (drivers.length === 0) return null;
  return (
    <ul className={cx('space-y-2', className)}>
      {drivers.map((d) => (
        <li key={d.label + d.detail} className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className={cx(
              'mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45',
              d.contribution === undefined
                ? 'bg-info'
                : d.contribution <= -12
                  ? 'bg-threat'
                  : d.contribution < 0
                    ? 'bg-attention'
                    : 'bg-controlled',
            )}
          />
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-ink-200">{d.label}</span>
              {d.contribution !== undefined && (
                <span className={cx('num text-2xs', d.contribution < 0 ? 'text-threat' : 'text-controlled')}>
                  {d.contribution > 0 ? '+' : ''}
                  {Math.round(d.contribution)}
                </span>
              )}
            </div>
            <p className="text-2xs leading-relaxed text-ink-400">{d.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

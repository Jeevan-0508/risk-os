export function formatCurrency(value: number, currency = 'EUR', compact = true): string {
  if (!Number.isFinite(value)) return '--';
  const abs = Math.abs(value);
  const symbol = currency === 'EUR' ? '\u20ac' : currency === 'GBP' ? '\u00a3' : currency === 'USD' ? '$' : '';
  const sign = value < 0 ? '-' : '';
  if (!compact) {
    return sign + symbol + abs.toLocaleString('en-GB', { maximumFractionDigits: 0 });
  }
  if (abs >= 1_000_000_000) return sign + symbol + (abs / 1_000_000_000).toFixed(2) + 'B';
  if (abs >= 1_000_000) return sign + symbol + (abs / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2) + 'M';
  if (abs >= 1_000) return sign + symbol + Math.round(abs / 1_000) + 'K';
  return sign + symbol + Math.round(abs).toString();
}

export function formatPercent(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return '--';
  return (value * 100).toFixed(digits) + '%';
}

export function formatNumber(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return '--';
  return value.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function formatSignedDays(days: number): string {
  if (!Number.isFinite(days)) return '--';
  if (days === 0) return 'on baseline';
  return (days > 0 ? '+' : '') + days + 'd';
}

export function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Coerces a raw dataset number into a non-negative finite value. Imported
 * programs are not trusted to be numerically clean, and a single NaN would
 * otherwise propagate through every aggregate on the screen.
 */
export function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Safe division that returns 0 instead of NaN or Infinity. */
export function ratio(numerator: number, denominator: number): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return 0;
  return numerator / denominator;
}

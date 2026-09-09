import type { ISODate } from '@/domain/types';

const MS_PER_DAY = 86_400_000;

/** Parses an ISO date defensively. Returns null rather than an Invalid Date. */
export function parseDate(value: ISODate | undefined | null): Date | null {
  if (!value) return null;
  const d = new Date(value.length === 10 ? value + 'T00:00:00Z' : value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function daysBetween(from: ISODate | undefined, to: ISODate | undefined): number | null {
  const a = parseDate(from);
  const b = parseDate(to);
  if (!a || !b) return null;
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

export function addDays(value: ISODate, days: number): ISODate {
  const d = parseDate(value);
  if (!d) return value;
  return new Date(d.getTime() + days * MS_PER_DAY).toISOString().slice(0, 10);
}

export function isBefore(a: ISODate | undefined, b: ISODate | undefined): boolean {
  const x = parseDate(a);
  const y = parseDate(b);
  if (!x || !y) return false;
  return x.getTime() < y.getTime();
}

export function formatDate(value: ISODate | undefined): string {
  const d = parseDate(value);
  if (!d) return '--';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function formatShortDate(value: ISODate | undefined): string {
  const d = parseDate(value);
  if (!d) return '--';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
}

/** Local wall-clock timestamp, for "last saved" style captions. Not forced to UTC: this
 * is a real moment in time (e.g. localStorage save), not a data field like a milestone date. */
export function formatDateTime(value: string | undefined): string {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/** Axis label for a month series. Carries the year so a 14 month programme cannot show the same tick twice. */
export function formatMonthLabel(value: ISODate | undefined): string {
  const d = parseDate(value);
  if (!d) return '--';
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' });
}

export function monthKey(value: ISODate): string {
  return value.slice(0, 7);
}

/** Inclusive list of month starts between two dates. */
export function monthsBetween(from: ISODate, to: ISODate): ISODate[] {
  const a = parseDate(from);
  const b = parseDate(to);
  if (!a || !b) return [];
  const out: ISODate[] = [];
  const cursor = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), 1));
  while (cursor.getTime() <= b.getTime() && out.length < 240) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return out;
}

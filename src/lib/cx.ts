export type ClassValue = string | false | null | undefined;

/** Minimal class joiner. Avoids a dependency and template literals. */
export function cx(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (typeof v === 'string' && v.length > 0) out.push(v);
  }
  return out.join(' ');
}

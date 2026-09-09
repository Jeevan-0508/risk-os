import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Columns3, Search } from 'lucide-react';
import { cx } from '@/lib/cx';

export interface Column<T> {
  key: string;
  header: string;
  /** Rendered cell. */
  render: (row: T) => ReactNode;
  /** Value used for sorting and searching. Omit to make the column inert. */
  sortValue?: (row: T) => string | number;
  searchValue?: (row: T) => string;
  align?: 'left' | 'right';
  width?: string;
  /** Hidden by default but available from the column menu. */
  optional?: boolean;
}

export interface FilterGroup<T> {
  key: string;
  label: string;
  options: { value: string; label: string; match: (row: T) => boolean }[];
}

/**
 * One table implementation for all thirteen screens: search, sort, status
 * filtering, column visibility and row selection. Screens supply columns and
 * filters, never their own table markup.
 */
export function DataTable<T extends { id: string }>({
  rows,
  columns,
  filters = [],
  onRowClick,
  selectedId,
  searchPlaceholder = 'Search',
  emptyMessage = 'Nothing matches the current filters.',
  initialSort,
  rightSlot,
  caption,
}: {
  rows: T[];
  columns: Column<T>[];
  filters?: FilterGroup<T>[];
  onRowClick?: (row: T) => void;
  selectedId?: string | null;
  searchPlaceholder?: string;
  emptyMessage?: string;
  initialSort?: { key: string; direction: 'asc' | 'desc' };
  rightSlot?: ReactNode;
  caption: string;
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(initialSort ?? null);
  const [active, setActive] = useState<Record<string, string>>({});
  const [hidden, setHidden] = useState<Record<string, boolean>>(
    Object.fromEntries(columns.filter((c) => c.optional).map((c) => [c.key, true])),
  );
  const [columnMenu, setColumnMenu] = useState(false);

  const visibleColumns = columns.filter((c) => !hidden[c.key]);

  const processed = useMemo(() => {
    let out = rows;

    for (const group of filters) {
      const chosen = active[group.key];
      if (!chosen) continue;
      const option = group.options.find((o) => o.value === chosen);
      if (option) out = out.filter(option.match);
    }

    const needle = query.trim().toLowerCase();
    if (needle) {
      out = out.filter((row) =>
        columns.some((column) => {
          const value = column.searchValue ? column.searchValue(row) : undefined;
          return value ? value.toLowerCase().includes(needle) : false;
        }),
      );
    }

    if (sort) {
      const column = columns.find((c) => c.key === sort.key);
      if (column?.sortValue) {
        const factor = sort.direction === 'asc' ? 1 : -1;
        out = [...out].sort((a, b) => {
          const av = column.sortValue as (row: T) => string | number;
          const x = av(a);
          const y = av(b);
          if (typeof x === 'number' && typeof y === 'number') return (x - y) * factor;
          return String(x).localeCompare(String(y)) * factor;
        });
      }
    }

    return out;
  }, [rows, filters, active, query, sort, columns]);

  const toggleSort = (key: string) => {
    setSort((current) => {
      if (!current || current.key !== key) return { key, direction: 'desc' };
      if (current.direction === 'desc') return { key, direction: 'asc' };
      return null;
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-base-600 px-3 py-2.5">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500" aria-hidden="true" />
          <input
            className="input pl-8"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
        </div>

        {filters.map((group) => (
          <label key={group.key} className="flex items-center gap-1.5 text-2xs text-ink-400">
            <span className="sr-only">{group.label}</span>
            <select
              className="input w-auto py-1"
              value={active[group.key] ?? ''}
              onChange={(e) => setActive((s) => ({ ...s, [group.key]: e.target.value }))}
              aria-label={group.label}
            >
              <option value="">{group.label}: all</option>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        {rightSlot}

        {columns.some((c) => c.optional) && (
          <div className="relative">
            <button
              className="btn px-2 py-1"
              onClick={() => setColumnMenu((v) => !v)}
              aria-expanded={columnMenu}
              aria-label="Choose visible columns"
            >
              <Columns3 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {columnMenu && (
              <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded border border-base-500 bg-base-700 p-2 shadow-xl">
                <p className="label mb-1.5">Columns</p>
                {columns.map((column) => (
                  <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-2xs text-ink-300 hover:bg-base-600">
                    <input
                      type="checkbox"
                      checked={!hidden[column.key]}
                      onChange={() => setHidden((s) => ({ ...s, [column.key]: !s[column.key] }))}
                    />
                    {column.header}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <span className="num text-2xs text-ink-500">
          {processed.length}
          {processed.length === rows.length ? '' : ' / ' + rows.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {visibleColumns.map((column) => {
                const sorted = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={cx('th', column.align === 'right' && 'text-right')}
                    style={column.width ? { width: column.width } : undefined}
                    aria-sort={sorted ? (sort?.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    {column.sortValue ? (
                      <button
                        className="inline-flex items-center gap-1 hover:text-ink-100"
                        onClick={() => toggleSort(column.key)}
                      >
                        {column.header}
                        {sorted &&
                          (sort?.direction === 'asc' ? (
                            <ArrowUp className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="h-3 w-3" aria-hidden="true" />
                          ))}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {processed.map((row) => (
              <tr
                key={row.id}
                className={cx(
                  'border-b border-base-700/70 last:border-0',
                  onRowClick && 'rowlink',
                  selectedId === row.id && 'bg-info/10',
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
              >
                {visibleColumns.map((column) => (
                  <td key={column.key} className={cx('td', column.align === 'right' && 'text-right')}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {processed.length === 0 && (
              <tr>
                <td className="td text-center text-ink-500" colSpan={visibleColumns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

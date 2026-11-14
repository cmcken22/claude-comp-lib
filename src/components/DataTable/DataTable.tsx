import { useMemo, useState, type ReactNode } from 'react';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { Select } from '../Select';
import { cx } from '../../utils/cx';
import './DataTable.scss';

export type SortDirection = 'asc' | 'desc';
export type SortValue = string | number | Date | null | undefined;

export interface DataTableColumn<T> {
  /** Unique column id. */
  id: string;
  /** Header content. */
  header: ReactNode;
  /** Raw value used for sorting, searching and the default cell. */
  accessor?: (row: T) => SortValue;
  /** Custom cell renderer. Defaults to the accessor's value. */
  cell?: (row: T) => ReactNode;
  /** Allow sorting by this column. Needs an `accessor`. */
  sortable?: boolean;
  /** Include this column's accessor value in the search text. Default true. */
  searchable?: boolean;
  align?: 'start' | 'center' | 'end';
  /** CSS width, e.g. "12rem" or "20%". */
  width?: string;
}

export interface DataTableFilterOption {
  value: string;
  label: string;
}

export interface DataTableFilter<T> {
  id: string;
  /** Accessible label; also the "all" option text (e.g. "All statuses"). */
  label: string;
  allLabel?: string;
  options: DataTableFilterOption[];
  /** The value a row has for this filter; compared to the chosen option. */
  getValue: (row: T) => string;
}

export interface DataTableSort {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Stable id for each row. */
  getRowId: (row: T) => string;
  /** Accessible name for the table. */
  caption: string;
  /** Show the caption visibly above the table. Default false (screen readers only). */
  showCaption?: boolean;
  /** Show the search field. Default true. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Text matched against the search query. Defaults to the searchable columns' accessor values. */
  getSearchText?: (row: T) => string;
  /** Dropdown filters shown in the toolbar. */
  filters?: DataTableFilter<T>[];
  /** Extra toolbar content at the end, e.g. an "Export" button. */
  toolbarActions?: ReactNode;
  /** Show row checkboxes. */
  selectable?: boolean;
  /** Actions shown when rows are selected. Receives the selected rows. */
  bulkActions?: (selectedRows: T[], clearSelection: () => void) => ReactNode;
  initialSort?: DataTableSort;
  /** Rows per page. Set to 0 to disable pagination. */
  pageSize?: number;
  pageSizeOptions?: number[];
  /** Shown when no rows match. */
  emptyState?: ReactNode;
  /** Visual density of rows. */
  density?: 'compact' | 'comfortable';
  className?: string;
}

function compare(a: SortValue, b: SortValue): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function SortIcon({ direction }: { direction?: SortDirection }) {
  return (
    <svg className="ds-data-table__sort-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M5 6.5L8 3.5l3 3" className={cx(direction === 'asc' && 'is-active')} />
      <path d="M5 9.5l3 3 3-3" className={cx(direction === 'desc' && 'is-active')} />
    </svg>
  );
}

const SearchGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
);

/**
 * A table with built-in search, dropdown filters, sortable columns,
 * row selection with bulk actions, and pagination. All client-side.
 */
export function DataTable<T>({
  data,
  columns,
  getRowId,
  caption,
  showCaption = false,
  searchable = true,
  searchPlaceholder = 'Search…',
  getSearchText,
  filters = [],
  toolbarActions,
  selectable = false,
  bulkActions,
  initialSort,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  emptyState,
  density = 'comfortable',
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<DataTableSort | undefined>(initialSort);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const searchText = useMemo(() => {
    const fn =
      getSearchText ??
      ((row: T) =>
        columns
          .filter((c) => c.accessor && c.searchable !== false)
          .map((c) => {
            const v = c.accessor!(row);
            return v instanceof Date ? v.toLocaleDateString() : String(v ?? '');
          })
          .join(' '));
    return new Map(data.map((row) => [getRowId(row), fn(row).toLowerCase()]));
  }, [data, columns, getRowId, getSearchText]);

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return data.filter((row) => {
      for (const f of filters) {
        const wanted = filterValues[f.id];
        if (wanted && f.getValue(row) !== wanted) return false;
      }
      if (terms.length === 0) return true;
      const text = searchText.get(getRowId(row)) ?? '';
      return terms.every((t) => text.includes(t));
    });
  }, [data, filters, filterValues, query, searchText, getRowId]);

  const sorted = useMemo(() => {
    const column = sort && columns.find((c) => c.id === sort.columnId);
    if (!sort || !column?.accessor) return filtered;
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => factor * compare(column.accessor!(a), column.accessor!(b)));
  }, [filtered, sort, columns]);

  const paginated = pageSize > 0;
  const pageCount = paginated ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount - 1);
  const start = paginated ? currentPage * pageSize : 0;
  const visible = paginated ? sorted.slice(start, start + pageSize) : sorted;

  const activeFilterCount = Object.values(filterValues).filter(Boolean).length;
  const hasQuery = query.trim().length > 0;

  const visibleIds = visible.map(getRowId);
  const selectedOnPage = visibleIds.filter((id) => selected.has(id)).length;
  const allOnPageSelected = visibleIds.length > 0 && selectedOnPage === visibleIds.length;
  const selectedRows = data.filter((row) => selected.has(getRowId(row)));

  const clearSelection = () => setSelected(new Set());

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const togglePage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of visibleIds) {
        if (allOnPageSelected) next.delete(id);
        else next.add(id);
      }
      return next;
    });

  const cycleSort = (columnId: string) => {
    setSort((prev) => {
      if (!prev || prev.columnId !== columnId) return { columnId, direction: 'asc' };
      if (prev.direction === 'asc') return { columnId, direction: 'desc' };
      return undefined;
    });
  };

  const resetAll = () => {
    setQuery('');
    setFilterValues({});
    setPage(0);
  };

  const colSpan = columns.length + (selectable ? 1 : 0);
  const showToolbar = searchable || filters.length > 0 || toolbarActions != null;

  return (
    <div className={cx('ds-data-table', `ds-data-table--${density}`, className)}>
      {showToolbar && (
        <div className="ds-data-table__toolbar">
          {searchable && (
            <Input
              className="ds-data-table__search"
              type="search"
              size="sm"
              value={query}
              placeholder={searchPlaceholder}
              aria-label={`Search ${caption.toLowerCase()}`}
              startAdornment={<SearchGlyph />}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
            />
          )}
          {filters.map((f) => (
            <Select
              key={f.id}
              className="ds-data-table__filter"
              size="sm"
              aria-label={f.label}
              value={filterValues[f.id] ?? ''}
              onChange={(event) => {
                setFilterValues((prev) => ({ ...prev, [f.id]: event.target.value }));
                setPage(0);
              }}
            >
              <option value="">{f.allLabel ?? `All ${f.label.toLowerCase()}`}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          ))}
          {(activeFilterCount > 0 || hasQuery) && (
            <Button variant="ghost" size="sm" onClick={resetAll}>
              Clear{activeFilterCount > 0 ? ` (${activeFilterCount + (hasQuery ? 1 : 0)})` : ''}
            </Button>
          )}
          {toolbarActions != null && <div className="ds-data-table__toolbar-actions">{toolbarActions}</div>}
        </div>
      )}

      {selectable && selected.size > 0 && (
        <div className="ds-data-table__bulk" role="region" aria-label="Bulk actions">
          <span className="ds-data-table__bulk-count">{selected.size} selected</span>
          <div className="ds-data-table__bulk-actions">
            {bulkActions?.(selectedRows, clearSelection)}
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Deselect
            </Button>
          </div>
        </div>
      )}

      <div className="ds-data-table__scroll" tabIndex={0} role="group" aria-label={`${caption}, scrollable`}>
        <table className="ds-data-table__table">
          <caption className={cx('ds-data-table__caption', !showCaption && 'ds-data-table__caption--hidden')}>
            {caption}
          </caption>
          <thead>
            <tr>
              {selectable && (
                <th scope="col" className="ds-data-table__select-cell">
                  <Checkbox
                    aria-label="Select all rows on this page"
                    checked={allOnPageSelected}
                    indeterminate={selectedOnPage > 0 && !allOnPageSelected}
                    disabled={visibleIds.length === 0}
                    onChange={togglePage}
                  />
                </th>
              )}
              {columns.map((column) => {
                const active = sort?.columnId === column.id ? sort.direction : undefined;
                const canSort = column.sortable && column.accessor;
                return (
                  <th
                    key={column.id}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    className={cx(`ds-data-table__cell--${column.align ?? 'start'}`)}
                    aria-sort={canSort ? (active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : 'none') : undefined}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        className={cx('ds-data-table__sort', active && 'ds-data-table__sort--active')}
                        onClick={() => cycleSort(column.id)}
                      >
                        {column.header}
                        <SortIcon direction={active} />
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
            {visible.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="ds-data-table__empty">
                  {emptyState ?? (
                    <div className="ds-data-table__empty-inner">
                      <strong>No results</strong>
                      <span>Try a different search or clear the filters.</span>
                      {(activeFilterCount > 0 || hasQuery) && (
                        <Button variant="secondary" size="sm" onClick={resetAll}>
                          Clear search and filters
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              visible.map((row) => {
                const id = getRowId(row);
                const isSelected = selected.has(id);
                return (
                  <tr key={id} className={cx(isSelected && 'ds-data-table__row--selected')}>
                    {selectable && (
                      <td className="ds-data-table__select-cell">
                        <Checkbox aria-label={`Select row ${id}`} checked={isSelected} onChange={() => toggleRow(id)} />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.id} className={cx(`ds-data-table__cell--${column.align ?? 'start'}`)}>
                        {column.cell ? column.cell(row) : formatDefault(column.accessor?.(row))}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {paginated && (
        <div className="ds-data-table__footer">
          <span className="ds-data-table__range" aria-live="polite">
            {sorted.length === 0
              ? 'No results'
              : `${start + 1}–${Math.min(start + pageSize, sorted.length)} of ${sorted.length}`}
            {sorted.length !== data.length && <span className="ds-data-table__range-total"> (filtered from {data.length})</span>}
          </span>
          <div className="ds-data-table__pager">
            <label className="ds-data-table__page-size">
              <span>Rows</span>
              <Select
                size="sm"
                value={String(pageSize)}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(0);
                }}
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
            </label>
            <span className="ds-data-table__page-label">
              Page {currentPage + 1} of {pageCount}
            </span>
            <Button
              variant="secondary"
              size="sm"
              aria-label="Previous page"
              startIcon={<Chevron dir="left" />}
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
            />
            <Button
              variant="secondary"
              size="sm"
              aria-label="Next page"
              startIcon={<Chevron dir="right" />}
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage(currentPage + 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function formatDefault(value: SortValue): ReactNode {
  if (value == null) return '—';
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

import { useEffect, useMemo, useState } from 'react';
import { COLUMNS, defaultHiddenColumns, type ColumnKey } from '../columns';
import { budgetLines, DIVISIONS, revisedBudget, type BudgetLine, type Division } from '../data';
import { EMPTY_FILTERS, VIEWS, type Filters, type ViewId } from '../views';

export type DivisionTab = 'all' | Division;
export type SortState = { key: ColumnKey; dir: 'asc' | 'desc' } | null;

const toggleInSet = <T,>(set: Set<T>, value: T) => {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
};

/** All table state (tab, view, search, filters, sort, columns, selection, paging) and the rows it produces. */
export function useBudgetTable(lines: BudgetLine[] = budgetLines) {
  const [division, setDivision] = useState<DivisionTab>('all');
  const [view, setView] = useState<ViewId>('default');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortState>({ key: 'costCode', dir: 'asc' });
  const [hidden, setHidden] = useState<Set<ColumnKey>>(defaultHiddenColumns);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const visibleColumns = COLUMNS.filter((c) => !hidden.has(c.key));

  // Everything except the division tab, so tab counts reflect the other filters.
  const baseRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const viewTest = VIEWS.find((v) => v.id === view)!.test;
    const min = Number(filters.minBudget) || 0;
    return lines.filter(
      (l) =>
        viewTest(l) &&
        (!q || [l.costCode, l.description, l.vendor].some((s) => s.toLowerCase().includes(q))) &&
        (!filters.statuses.length || filters.statuses.includes(l.status)) &&
        (!filters.vendor || l.vendor === filters.vendor) &&
        revisedBudget(l) >= min,
    );
  }, [lines, query, view, filters]);

  const rows = useMemo(() => {
    const list = division === 'all' ? baseRows : baseRows.filter((l) => l.division === division);
    if (!sort) return list;
    const col = COLUMNS.find((c) => c.key === sort.key)!;
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = col.sortValue(a);
      const bv = col.sortValue(b);
      return (typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))) * factor;
    });
  }, [baseRows, division, sort]);

  const tabs = [
    { id: 'all', label: 'All lines', count: baseRows.length },
    ...DIVISIONS.map((d) => ({ id: d.id, label: d.label, count: baseRows.filter((l) => l.division === d.id).length })),
  ];

  // Paging
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  useEffect(() => setPage(0), [division, view, query, filters, pageSize]);

  // Selection
  const pageIds = pageRows.map((l) => l.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someOnPageSelected = pageIds.some((id) => selected.has(id));

  return {
    // state
    division,
    view,
    query,
    filters,
    sort,
    hidden,
    selected,
    pageSize,
    // derived
    tabs,
    rows,
    pageRows,
    visibleColumns,
    currentPage,
    pageCount,
    allOnPageSelected,
    someOnPageSelected,
    selectedLines: lines.filter((l) => selected.has(l.id)),
    // actions
    setDivision,
    setView,
    setQuery,
    setFilters,
    setPage,
    setPageSize,
    toggleSort: (key: ColumnKey) =>
      setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null)),
    toggleColumn: (key: ColumnKey) => setHidden((prev) => toggleInSet(prev, key)),
    resetColumns: () => setHidden(defaultHiddenColumns()),
    toggleRow: (id: string) => setSelected((prev) => toggleInSet(prev, id)),
    togglePage: () =>
      setSelected((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => (allOnPageSelected ? next.delete(id) : next.add(id)));
        return next;
      }),
    clearSelection: () => setSelected(new Set()),
    resetAll: () => {
      setFilters(EMPTY_FILTERS);
      setQuery('');
      setView('default');
      setDivision('all');
    },
  };
}

export type BudgetTableState = ReturnType<typeof useBudgetTable>;

import { useEffect, useMemo, useRef, useState, type ReactNode, type UIEvent } from 'react';
import { Badge, Button, Card, Checkbox, Input, Progress, Select, type BadgeTone, type ProgressTone } from 'claude-comp-lib';
import { MANAGERS, PHASES, PROJECTS, STATUSES, type Project, type ProjectStatus } from '../data/projects';
import { compactMoney, formatDate, initials } from '../format';
import { Icon } from '../icons';
import { CommentsPanel, type CellComment } from './CommentsPanel';

// ── Configuration ────────────────────────────────────────────────────────────

const BATCH = 15; // rows rendered per infinite-scroll batch
const LOAD_DELAY_MS = 450; // simulated network delay; replace with a real fetch
const CURRENT_USER = 'Jordan Reyes';

const statusTone: Record<ProjectStatus, BadgeTone> = {
  'On track': 'success',
  'At risk': 'warning',
  Delayed: 'danger',
  'On hold': 'neutral',
  Completed: 'accent',
};

const progressTone: Record<ProjectStatus, ProgressTone> = {
  'On track': 'success',
  'At risk': 'warning',
  Delayed: 'danger',
  'On hold': 'accent',
  Completed: 'accent',
};

type ColumnId = 'name' | 'client' | 'manager' | 'status' | 'progress' | 'budget' | 'due';

interface Column {
  id: ColumnId;
  label: string;
  align: 'start' | 'end';
  sortValue: (p: Project) => string | number;
  /** Plain-text version of the cell, shown in the comments panel. */
  text: (p: Project) => string;
  render: (p: Project) => ReactNode;
  className?: string;
}

const spentRatio = (p: Project) => p.spent / p.budget;

const COLUMNS: Column[] = [
  {
    id: 'name',
    label: 'Project',
    align: 'start',
    sortValue: (p) => p.name,
    text: (p) => p.name,
    render: (p) => (
      <div className="cd-project">
        <span className="cd-project__name">{p.name}</span>
        <span className="cd-project__meta">
          {p.id} · {p.type}
        </span>
      </div>
    ),
  },
  {
    id: 'client',
    label: 'Client',
    align: 'start',
    sortValue: (p) => p.client,
    text: (p) => `${p.client} · ${p.location}`,
    render: (p) => (
      <div className="cd-project">
        <span>{p.client}</span>
        <span className="cd-project__meta">{p.location}</span>
      </div>
    ),
  },
  {
    id: 'manager',
    label: 'Manager',
    align: 'start',
    sortValue: (p) => p.manager,
    text: (p) => p.manager,
    render: (p) => (
      <span className="cd-person">
        <span className="cd-avatar cd-avatar--sm" aria-hidden="true">
          {initials(p.manager)}
        </span>
        {p.manager}
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    align: 'start',
    sortValue: (p) => p.status,
    text: (p) => p.status,
    render: (p) => (
      <Badge tone={statusTone[p.status]} dot>
        {p.status}
      </Badge>
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    align: 'start',
    className: 'cd-col-progress',
    sortValue: (p) => p.progress,
    text: (p) => `${p.phase} · ${p.progress}% complete`,
    render: (p) => (
      <div className="cd-phase">
        <span className="cd-phase__name">{p.phase}</span>
        <Progress value={p.progress} tone={progressTone[p.status]} size="sm" showValue label={`${p.name} progress`} />
      </div>
    ),
  },
  {
    id: 'budget',
    label: 'Budget',
    align: 'end',
    sortValue: (p) => p.budget,
    text: (p) => `${compactMoney.format(p.budget)} · ${Math.round(spentRatio(p) * 100)}% spent`,
    render: (p) => {
      const over = spentRatio(p) > p.progress / 100 + 0.05;
      return (
        <div className="cd-budget">
          <span>{compactMoney.format(p.budget)}</span>
          <span className={over ? 'cd-budget__spent cd-budget__spent--over' : 'cd-budget__spent'}>
            {Math.round(spentRatio(p) * 100)}% spent
          </span>
        </div>
      );
    },
  },
  {
    id: 'due',
    label: 'Due',
    align: 'end',
    sortValue: (p) => p.due,
    text: (p) => formatDate(p.due),
    render: (p) => formatDate(p.due),
  },
];

// Example threads so the comment markers show up on first load.
const SEED_COMMENTS: Record<string, CellComment[]> = {
  'PRJ-2492:status': [
    { id: 's1', author: 'Aisha Mensah', time: '3 days ago', text: 'Flagged at risk: the electrical sub is short-staffed through November.' },
  ],
  'PRJ-2408:due': [
    { id: 's2', author: 'Priya Nair', time: 'Yesterday', text: 'Foundation pour slipped a week for rain. Completion likely moves into early December.' },
    { id: 's3', author: 'Jordan Reyes', time: '20 min ago', text: 'Noted. Please update the schedule once the new pour date is confirmed.' },
  ],
  'PRJ-2415:budget': [
    { id: 's4', author: 'Aisha Mensah', time: '2 hours ago', text: 'Change order #14 (gym HVAC upgrade) isn’t reflected here yet.' },
  ],
};

type Sort = { column: ColumnId; dir: 'asc' | 'desc' } | null;
type Filters = { status: string; phase: string; manager: string };

const searchText = (p: Project) =>
  [p.name, p.id, p.type, p.client, p.location, p.manager, p.phase, p.status].join(' ').toLowerCase();

// ── Component ────────────────────────────────────────────────────────────────

export function ProjectsTable() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({ status: '', phase: '', manager: '' });
  const [sort, setSort] = useState<Sort>({ column: 'due', dir: 'asc' });
  const [shown, setShown] = useState(BATCH);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [comments, setComments] = useState(SEED_COMMENTS);
  const [openCell, setOpenCell] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadTimer = useRef<number>();

  useEffect(() => () => window.clearTimeout(loadTimer.current), []);

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return PROJECTS.filter(
      (p) =>
        (!filters.status || p.status === filters.status) &&
        (!filters.phase || p.phase === filters.phase) &&
        (!filters.manager || p.manager === filters.manager) &&
        terms.every((t) => searchText(p).includes(t)),
    );
  }, [query, filters]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = COLUMNS.find((c) => c.id === sort.column)!;
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const x = col.sortValue(a);
      const y = col.sortValue(b);
      const result = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
      return result * factor;
    });
  }, [filtered, sort]);

  const visible = sorted.slice(0, shown);
  const hasMore = visible.length < sorted.length;
  const filterCount = Object.values(filters).filter(Boolean).length + (query.trim() ? 1 : 0);

  // Start from the top whenever the result set changes.
  const resetScroll = () => {
    setShown(BATCH);
    setLoading(false);
    window.clearTimeout(loadTimer.current);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const loadMore = () => {
    if (!hasMore || loading) return;
    setLoading(true);
    loadTimer.current = window.setTimeout(() => {
      setShown((n) => n + BATCH);
      setLoading(false);
    }, LOAD_DELAY_MS);
  };

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) loadMore();
  };

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    resetScroll();
  };

  const clearAll = () => {
    setQuery('');
    setFilters({ status: '', phase: '', manager: '' });
    resetScroll();
  };

  const cycleSort = (column: ColumnId) =>
    setSort((s) => {
      if (!s || s.column !== column) return { column, dir: 'asc' };
      if (s.dir === 'asc') return { column, dir: 'desc' };
      return null;
    });

  // Selection
  const visibleIds = visible.map((p) => p.id);
  const selectedVisible = visibleIds.filter((id) => selected.has(id)).length;
  const allVisibleSelected = visibleIds.length > 0 && selectedVisible === visibleIds.length;
  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAllVisible = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => (allVisibleSelected ? next.delete(id) : next.add(id)));
      return next;
    });

  // Comments
  const openParts = openCell?.split(':') as [string, ColumnId] | undefined;
  const openProject = openParts && PROJECTS.find((p) => p.id === openParts[0]);
  const openColumn = openParts && COLUMNS.find((c) => c.id === openParts[1]);

  const postComment = (text: string) => {
    if (!openCell) return;
    setComments((all) => ({
      ...all,
      [openCell]: [...(all[openCell] ?? []), { id: crypto.randomUUID(), author: CURRENT_USER, time: 'Just now', text }],
    }));
  };

  const resolveThread = () => {
    if (!openCell) return;
    setComments((all) => {
      const next = { ...all };
      delete next[openCell];
      return next;
    });
    setOpenCell(null);
  };

  return (
    <Card
      padding="none"
      title="Projects"
      description="Every job in the portfolio. Search, filter by status, phase or manager, and sort any column. Hover any cell to comment on it."
      actions={
        <Button variant="secondary" size="sm" startIcon={<Icon name="download" />}>
          Export CSV
        </Button>
      }
    >
      <div className="ds-data-table ds-data-table--comfortable">
        <div className="ds-data-table__toolbar">
          <Input
            className="ds-data-table__search"
            type="search"
            size="sm"
            value={query}
            placeholder="Search by project, client, city…"
            aria-label="Search projects"
            startAdornment={<Icon name="search" />}
            onChange={(event) => {
              setQuery(event.target.value);
              resetScroll();
            }}
          />
          <Select className="ds-data-table__filter" size="sm" aria-label="Status" value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Select className="ds-data-table__filter" size="sm" aria-label="Phase" value={filters.phase} onChange={(e) => setFilter('phase', e.target.value)}>
            <option value="">All phases</option>
            {PHASES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Select className="ds-data-table__filter" size="sm" aria-label="Manager" value={filters.manager} onChange={(e) => setFilter('manager', e.target.value)}>
            <option value="">All managers</option>
            {MANAGERS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          {filterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear ({filterCount})
            </Button>
          )}
        </div>

        {selected.size > 0 && (
          <div className="ds-data-table__bulk" role="region" aria-label="Bulk actions">
            <span className="ds-data-table__bulk-count">{selected.size} selected</span>
            <div className="ds-data-table__bulk-actions">
              <Button variant="secondary" size="sm" startIcon={<Icon name="download" />}>
                Export {selected.size}
              </Button>
              <Button variant="secondary" size="sm">
                Reassign manager
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                Deselect
              </Button>
            </div>
          </div>
        )}

        <div ref={scrollRef} className="ds-data-table__scroll" tabIndex={0} role="group" aria-label="Projects table, scrollable" onScroll={onScroll}>
          <table className="ds-data-table__table">
            <caption className="ds-data-table__caption ds-data-table__caption--hidden">Projects</caption>
            <thead>
              <tr>
                <th scope="col" className="ds-data-table__select-cell">
                  <Checkbox
                    aria-label="Select all loaded rows"
                    checked={allVisibleSelected}
                    indeterminate={selectedVisible > 0 && !allVisibleSelected}
                    disabled={visibleIds.length === 0}
                    onChange={toggleAllVisible}
                  />
                </th>
                {COLUMNS.map((col) => {
                  const dir = sort?.column === col.id ? sort.dir : undefined;
                  return (
                    <th
                      key={col.id}
                      scope="col"
                      className={`ds-data-table__cell--${col.align} ${col.className ?? ''}`}
                      aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'}
                    >
                      <button
                        type="button"
                        className={`ds-data-table__sort${dir ? ' ds-data-table__sort--active' : ''}`}
                        onClick={() => cycleSort(col.id)}
                      >
                        {col.label}
                        <svg className="ds-data-table__sort-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                          <path d="M5 6.5L8 3.5l3 3" className={dir === 'asc' ? 'is-active' : undefined} />
                          <path d="M5 9.5l3 3 3-3" className={dir === 'desc' ? 'is-active' : undefined} />
                        </svg>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="ds-data-table__empty">
                    <div className="ds-data-table__empty-inner">
                      <strong>No results</strong>
                      <span>Try a different search or clear the filters.</span>
                      <Button variant="secondary" size="sm" onClick={clearAll}>
                        Clear search and filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
              {visible.map((p) => {
                const isSelected = selected.has(p.id);
                return (
                  <tr key={p.id} className={isSelected ? 'ds-data-table__row--selected' : undefined}>
                    <td className="ds-data-table__select-cell">
                      <Checkbox aria-label={`Select ${p.name}`} checked={isSelected} onChange={() => toggleRow(p.id)} />
                    </td>
                    {COLUMNS.map((col) => {
                      const key = `${p.id}:${col.id}`;
                      const count = comments[key]?.length ?? 0;
                      const classes = [
                        `ds-data-table__cell--${col.align}`,
                        'cd-cc',
                        count > 0 && 'cd-cc--has',
                        openCell === key && 'cd-cc--active',
                      ]
                        .filter(Boolean)
                        .join(' ');
                      return (
                        <td key={col.id} className={classes}>
                          <button
                            type="button"
                            className="cd-cc__btn"
                            aria-label={`${count ? `View ${count} ${count === 1 ? 'comment' : 'comments'}` : 'Comment'} on ${col.label.toLowerCase()} for ${p.name}`}
                            onClick={() => setOpenCell(key)}
                          >
                            <Icon name="comment" size={13} />
                            {count > 0 && <span className="cd-cc__count">{count}</span>}
                          </button>
                          {col.render(p)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {loading && (
                <tr className="cd-loading-row">
                  <td colSpan={COLUMNS.length + 1} role="status">
                    <span className="cd-spinner" aria-hidden="true" />
                    Loading more projects…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ds-data-table__footer">
          <span className="ds-data-table__range" aria-live="polite">
            {sorted.length === 0 ? 'No results' : `Showing ${visible.length} of ${sorted.length}`}
            {sorted.length !== PROJECTS.length && <span className="ds-data-table__range-total"> (filtered from {PROJECTS.length})</span>}
          </span>
          <span className="cd-scroll-hint">{hasMore ? 'Scroll the table to load more' : sorted.length > 0 ? 'All projects loaded' : ''}</span>
        </div>
      </div>

      {openCell && openProject && openColumn && (
        <CommentsPanel
          project={openProject.name}
          column={openColumn.label}
          value={openColumn.text(openProject)}
          comments={comments[openCell] ?? []}
          onPost={postComment}
          onResolve={resolveThread}
          onClose={() => setOpenCell(null)}
        />
      )}
    </Card>
  );
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Button, Checkbox, Input, Select, Switch } from '../../../src';
import { PHASES, PROJECTS, SECTORS, STATUSES, TODAY, type Project, type Status } from './data';
import { daysBetween, money, shortDate, variancePct } from './format';
import { CommentCell, useOpenThreadCount } from './comments';
import { Icons } from './icons';

type SortKey = 'name' | 'status' | 'phase' | 'progress' | 'budget' | 'variance' | 'due' | 'rfis';
type SortDir = 'asc' | 'desc';

const STATUS_TONE: Record<Status, string> = {
  'On track': 'success',
  'At risk': 'warning',
  Delayed: 'danger',
  Completed: 'neutral',
};
const STATUS_RANK: Record<Status, number> = { Delayed: 0, 'At risk': 1, 'On track': 2, Completed: 3 };
const MANAGERS = [...new Set(PROJECTS.map((p) => p.manager))].sort();

const sortValue = (p: Project, key: SortKey): string | number => {
  switch (key) {
    case 'name': return p.name.toLowerCase();
    case 'status': return STATUS_RANK[p.status];
    case 'phase': return PHASES.indexOf(p.phase);
    case 'variance': return variancePct(p.budget, p.forecast);
    case 'due': return p.due;
    default: return p[key];
  }
};

function SortHeader({ label, k, sort, onSort, align }: {
  label: ReactNode; k: SortKey; sort: { key: SortKey; dir: SortDir }; onSort: (k: SortKey) => void; align?: 'end';
}) {
  const active = sort.key === k;
  return (
    <th scope="col" aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={align === 'end' ? 'cd-num' : undefined}>
      <button type="button" className={`cd-sort${active ? ' cd-sort--active' : ''}`} onClick={() => onSort(k)}>
        {label}
        {active ? (sort.dir === 'asc' ? <Icons.ChevronUp width={14} height={14} /> : <Icons.ChevronDown width={14} height={14} />) : <Icons.Sort width={14} height={14} />}
      </button>
    </th>
  );
}

function PhaseMeter({ phase }: { phase: Project['phase'] }) {
  const idx = PHASES.indexOf(phase);
  return (
    <div className="cd-phase" title={`Phase ${idx + 1} of ${PHASES.length}`}>
      <span className="cd-phase__label">{phase}</span>
      <span className="cd-phase__steps" aria-hidden="true">
        {PHASES.map((ph, i) => <span key={ph} className={i <= idx ? 'is-done' : undefined} />)}
      </span>
    </div>
  );
}

function DueCell({ p }: { p: Project }) {
  const days = daysBetween(TODAY, p.due);
  let note: ReactNode;
  if (p.status === 'Completed') note = <span className="cd-muted">Handed over</span>;
  else if (days < 0) note = <span className="cd-text-danger">{-days} days late</span>;
  else if (days <= 45) note = <span className="cd-text-warning">in {days} days</span>;
  else note = <span className="cd-muted">in {Math.round(days / 30)} mo</span>;
  return (
    <div className="cd-stack">
      <span>{shortDate(p.due)}</span>
      <small>{note}</small>
    </div>
  );
}

export function ProjectTable() {
  const openThreads = useOpenThreadCount();
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('all');
  const [manager, setManager] = useState('all');
  const [overOnly, setOverOnly] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'status', dir: 'asc' });
  // Infinite scroll: rows load in batches as the bottom of the list comes into view.
  const BATCH = 20;
  const [visible, setVisible] = useState(BATCH);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const setPage = (_: number) => setVisible(BATCH);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Everything except the status tab, so tab counts reflect the other filters.
  const baseFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) =>
      (sector === 'all' || p.sector === sector) &&
      (manager === 'all' || p.manager === manager) &&
      (!overOnly || p.forecast > p.budget * 1.005) &&
      (!q || [p.name, p.id, p.client, p.city, p.manager].some((s) => s.toLowerCase().includes(q))),
    );
  }, [query, sector, manager, overOnly]);

  const rows = useMemo(() => {
    const list = status === 'all' ? baseFiltered : baseFiltered.filter((p) => p.status === status);
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = sortValue(a, sort.key), bv = sortValue(b, sort.key);
      if (av < bv) return -dir;
      if (av > bv) return dir;
      return a.due < b.due ? -1 : 1;
    });
  }, [baseFiltered, status, sort]);

  const pageRows = rows.slice(0, visible);
  const hasMore = visible < rows.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setLoading(true);
    }, { rootMargin: '120px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, visible, rows]);

  useEffect(() => {
    if (!loading) return;
    // Short delay stands in for fetching the next batch from the server.
    const t = window.setTimeout(() => { setVisible((v) => v + BATCH); setLoading(false); }, 450);
    return () => window.clearTimeout(t);
  }, [loading]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: baseFiltered.length };
    STATUSES.forEach((s) => { c[s] = baseFiltered.filter((p) => p.status === s).length; });
    return c;
  }, [baseFiltered]);

  const filtersActive = query || sector !== 'all' || manager !== 'all' || overOnly || status !== 'all';
  const clearFilters = () => { setQuery(''); setSector('all'); setManager('all'); setOverOnly(false); setStatus('all'); setPage(0); };

  const onSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' || key === 'due' || key === 'status' || key === 'phase' ? 'asc' : 'desc' }));

  const pageIds = pageRows.map((p) => p.id);
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length;
  const toggleAll = () => setSelected((prev) => {
    const next = new Set(prev);
    if (selectedOnPage === pageIds.length) pageIds.forEach((id) => next.delete(id));
    else pageIds.forEach((id) => next.add(id));
    return next;
  });
  const toggleOne = (id: string) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const selectedRows = PROJECTS.filter((p) => selected.has(p.id));

  const resetPage = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(0); };

  return (
    <section className="cd-panel" aria-labelledby="projects-heading">
      <div className="cd-panel__head">
        <div>
          <h2 id="projects-heading" className="cd-panel__title">Projects</h2>
          <p className="cd-panel__sub">
            Contract value, schedule and cost forecast for every job in the portfolio.{' '}
            <span className="cd-panel__hint"><Icons.Comment width={13} height={13} /> {openThreads ? `${openThreads} cell${openThreads > 1 ? 's' : ''} with open comments` : 'Hover a cell to comment on it'}</span>
          </p>
        </div>
        <div className="cd-tabs" role="tablist" aria-label="Filter by status">
          {(['all', ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={status === s}
              className={`cd-tab${status === s ? ' cd-tab--active' : ''}`}
              onClick={() => { setStatus(s); setPage(0); }}
            >
              {s === 'all' ? 'All' : s}
              <span className="cd-tab__count">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cd-toolbar">
        <Input
          id="project-search"
          size="sm"
          type="search"
          className="cd-toolbar__search"
          placeholder="Search name, ID, client, city…"
          aria-label="Search projects"
          value={query}
          onChange={(e) => resetPage(setQuery)(e.target.value)}
          startAdornment={<Icons.Search width={16} height={16} />}
        />
        <Select id="sector-filter" size="sm" aria-label="Sector" value={sector} onChange={(e) => resetPage(setSector)(e.target.value)}>
          <option value="all">All sectors</option>
          {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select id="manager-filter" size="sm" aria-label="Project manager" value={manager} onChange={(e) => resetPage(setManager)(e.target.value)}>
          <option value="all">All managers</option>
          {MANAGERS.map((m) => <option key={m} value={m}>{m}</option>)}
        </Select>
        <Switch id="over-budget" label="Over budget only" checked={overOnly} onChange={(e) => resetPage(setOverOnly)(e.target.checked)} />
        {filtersActive && (
          <Button variant="ghost" size="sm" className="cd-toolbar__clear" onClick={clearFilters}>Clear filters</Button>
        )}
      </div>

      {selected.size > 0 && (
        <div className="cd-bulk" role="status">
          <span><strong>{selected.size}</strong> selected · {money(selectedRows.reduce((s, p) => s + p.budget, 0))} contract value</span>
          <div className="cd-bulk__actions">
            <Button variant="secondary" size="sm" startIcon={<Icons.Download width={16} height={16} />}>Export</Button>
            <Button variant="secondary" size="sm">Assign manager</Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        </div>
      )}

      <div className="cd-table-wrap">
        <table className="cd-table">
          <thead>
            <tr>
              <th scope="col" className="cd-check">
                <Checkbox
                  aria-label="Select all loaded projects"
                  checked={pageIds.length > 0 && selectedOnPage === pageIds.length}
                  indeterminate={selectedOnPage > 0 && selectedOnPage < pageIds.length}
                  onChange={toggleAll}
                  disabled={pageIds.length === 0}
                />
              </th>
              <SortHeader label="Project" k="name" sort={sort} onSort={onSort} />
              <SortHeader label="Status" k="status" sort={sort} onSort={onSort} />
              <SortHeader label="Phase" k="phase" sort={sort} onSort={onSort} />
              <SortHeader label="Complete" k="progress" sort={sort} onSort={onSort} />
              <SortHeader label="Contract" k="budget" sort={sort} onSort={onSort} align="end" />
              <SortHeader label="Forecast var." k="variance" sort={sort} onSort={onSort} align="end" />
              <SortHeader label="Substantial completion" k="due" sort={sort} onSort={onSort} />
              <SortHeader label="Open RFIs" k="rfis" sort={sort} onSort={onSort} align="end" />
              <th scope="col">Project manager</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((p) => {
              const v = variancePct(p.budget, p.forecast);
              const isSel = selected.has(p.id);
              return (
                <tr key={p.id} className={isSel ? 'is-selected' : undefined}>
                  <td className="cd-check">
                    <Checkbox aria-label={`Select ${p.name}`} checked={isSel} onChange={() => toggleOne(p.id)} />
                  </td>
                  <CommentCell cell={`${p.id}|name`} label={`${p.name} · Project`}>
                    <div className="cd-stack cd-project">
                      <span className="cd-project__name">{p.name}</span>
                      <small>{p.id} · {p.sector} · {p.city}</small>
                    </div>
                  </CommentCell>
                  <CommentCell cell={`${p.id}|status`} label={`${p.name} · Status`}><span className={`cd-pill cd-pill--${STATUS_TONE[p.status]}`}>{p.status}</span></CommentCell>
                  <CommentCell cell={`${p.id}|phase`} label={`${p.name} · Phase`}><PhaseMeter phase={p.phase} /></CommentCell>
                  <CommentCell cell={`${p.id}|progress`} label={`${p.name} · Complete`}>
                    <div className="cd-progress" aria-label={`${p.progress}% complete`}>
                      <span className="cd-progress__track"><span className={`cd-progress__bar cd-progress__bar--${STATUS_TONE[p.status]}`} style={{ width: `${p.progress}%` }} /></span>
                      <span className="cd-progress__pct">{p.progress}%</span>
                    </div>
                  </CommentCell>
                  <CommentCell cell={`${p.id}|budget`} label={`${p.name} · Contract`} className="cd-num">{money(p.budget)}</CommentCell>
                  <CommentCell cell={`${p.id}|variance`} label={`${p.name} · Forecast var.`} className="cd-num">
                    <div className="cd-stack cd-stack--end">
                      <span className={v > 3 ? 'cd-text-danger' : v > 0.5 ? 'cd-text-warning' : 'cd-text-success'}>
                        {v > 0 ? '+' : v < 0 ? '−' : ''}{Math.abs(v).toFixed(1)}%
                      </span>
                      <small>{v >= 0 ? '+' : '−'}{money(Math.abs(p.forecast - p.budget), 2)}</small>
                    </div>
                  </CommentCell>
                  <CommentCell cell={`${p.id}|due`} label={`${p.name} · Substantial completion`}><DueCell p={p} /></CommentCell>
                  <CommentCell cell={`${p.id}|rfis`} label={`${p.name} · Open RFIs`} className="cd-num">
                    <span className={p.rfis >= 15 ? 'cd-rfi cd-rfi--high' : 'cd-rfi'}>{p.rfis}</span>
                  </CommentCell>
                  <CommentCell cell={`${p.id}|manager`} label={`${p.name} · Project manager`}>
                    <span className="cd-person">
                      <span className="cd-avatar cd-avatar--sm">{p.manager.split(' ').map((n) => n[0]).join('')}</span>
                      {p.manager}
                    </span>
                  </CommentCell>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="cd-empty">
            <Icons.Search width={24} height={24} />
            <p><strong>No projects match these filters.</strong></p>
            <p className="cd-muted">Try a different search or clear the filters to see all {PROJECTS.length} projects.</p>
            <Button variant="secondary" size="sm" onClick={clearFilters}>Clear filters</Button>
          </div>
        )}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="cd-loadmore" aria-live="polite">
          {loading ? <><span className="cd-spinner" aria-hidden="true" /> Loading more projects…</> : <span className="cd-muted">Scroll for more</span>}
        </div>
      )}

      <div className="cd-pager">
        <span className="cd-muted">
          {rows.length === 0 ? 'No results' : hasMore ? `Showing ${pageRows.length} of ${rows.length} projects` : `All ${rows.length} projects loaded`}
        </span>
        <div className="cd-pager__meter" aria-hidden="true">
          <span style={{ width: `${rows.length ? (pageRows.length / rows.length) * 100 : 0}%` }} />
        </div>
      </div>
    </section>
  );
}

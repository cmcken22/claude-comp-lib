import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Checkbox } from '../../components/Checkbox';
import { Chip } from '../../components/Chip';
import { Drawer } from '../../components/Drawer';
import { FormField } from '../../components/FormField';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Navbar, NavbarAvatar, NavbarIconButton } from '../../global/Navbar';
import { Sidebar } from '../../global/Sidebar';
import { sampleSections, Wordmark } from '../../global/navData';
import { cx } from '../../utils/cx';
import {
  budgetLines,
  DIVISIONS,
  remaining,
  revisedBudget,
  STATUS_META,
  type BudgetLine,
  type Division,
  type LineStatus,
} from './data';
import {
  BellIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ColumnsIcon,
  CommentIcon,
  DownloadIcon,
  FilterIcon,
  FolderIcon,
  HelpIcon,
  MoreIcon,
  SearchIcon,
  SortIcon,
  TrendUpIcon,
} from './icons';
import './ConstructionDashboard.scss';

// ─── Formatting ──────────────────────────────────────────────────────────────

/** Fixed "today" so the example renders the same every time. */
const TODAY = new Date('2026-11-17T00:00:00');

const money = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const moneyShort = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatMoney = (n: number, short = false) => {
  const s = (short ? moneyShort : money).format(Math.abs(n));
  return `${n < 0 ? '−' : ''}$${s}`;
};
const daysUntil = (iso: string) => Math.round((new Date(`${iso}T00:00:00`).getTime() - TODAY.getTime()) / 86_400_000);
const sum = (lines: BudgetLine[], pick: (l: BudgetLine) => number) => lines.reduce((t, l) => t + pick(l), 0);

// ─── Columns ─────────────────────────────────────────────────────────────────

type ColumnKey =
  | 'costCode'
  | 'description'
  | 'vendor'
  | 'status'
  | 'originalBudget'
  | 'approvedChanges'
  | 'revisedBudget'
  | 'pendingChanges'
  | 'spentToDate'
  | 'remaining'
  | 'progress'
  | 'dueDate';

interface Column {
  key: ColumnKey;
  header: string;
  numeric?: boolean;
  /** Can't be hidden from the Columns menu. */
  locked?: boolean;
  hiddenByDefault?: boolean;
  sortValue: (line: BudgetLine) => string | number;
  render: (line: BudgetLine) => ReactNode;
  /** Footer total for the visible rows. */
  total?: (lines: BudgetLine[]) => ReactNode;
}

const Money = ({ value, signed = false }: { value: number; signed?: boolean }) => (
  <span className={cx('cd-money', value < 0 && 'cd-money--negative', signed && value === 0 && 'cd-money--zero')}>
    {signed && value > 0 ? '+' : ''}
    {formatMoney(value)}
  </span>
);

const COLUMNS: Column[] = [
  {
    key: 'costCode',
    header: 'Cost code',
    locked: true,
    sortValue: (l) => l.costCode,
    render: (l) => <span className="cd-code">{l.costCode}</span>,
    total: (lines) => <strong>Totals · {lines.length} lines</strong>,
  },
  {
    key: 'description',
    header: 'Description',
    locked: true,
    sortValue: (l) => l.description,
    render: (l) => (
      <span className="cd-desc">
        <span className="cd-desc__title">{l.description}</span>
        <span className="cd-desc__meta">{DIVISIONS.find((d) => d.id === l.division)?.label}</span>
      </span>
    ),
  },
  { key: 'vendor', header: 'Vendor', sortValue: (l) => l.vendor, render: (l) => l.vendor },
  {
    key: 'status',
    header: 'Status',
    sortValue: (l) => STATUS_META[l.status].label,
    render: (l) => (
      <Badge color={STATUS_META[l.status].color} dot size="sm">
        {STATUS_META[l.status].label}
      </Badge>
    ),
  },
  {
    key: 'originalBudget',
    header: 'Original budget',
    numeric: true,
    sortValue: (l) => l.originalBudget,
    render: (l) => <Money value={l.originalBudget} />,
    total: (lines) => <Money value={sum(lines, (l) => l.originalBudget)} />,
  },
  {
    key: 'approvedChanges',
    header: 'Approved changes',
    numeric: true,
    sortValue: (l) => l.approvedChanges,
    render: (l) => <Money value={l.approvedChanges} signed />,
    total: (lines) => <Money value={sum(lines, (l) => l.approvedChanges)} signed />,
  },
  {
    key: 'revisedBudget',
    header: 'Revised budget',
    numeric: true,
    sortValue: revisedBudget,
    render: (l) => <Money value={revisedBudget(l)} />,
    total: (lines) => <Money value={sum(lines, revisedBudget)} />,
  },
  {
    key: 'pendingChanges',
    header: 'Pending changes',
    numeric: true,
    hiddenByDefault: true,
    sortValue: (l) => l.pendingChanges,
    render: (l) => <Money value={l.pendingChanges} signed />,
    total: (lines) => <Money value={sum(lines, (l) => l.pendingChanges)} signed />,
  },
  {
    key: 'spentToDate',
    header: 'Spent to date',
    numeric: true,
    sortValue: (l) => l.spentToDate,
    render: (l) => <Money value={l.spentToDate} />,
    total: (lines) => <Money value={sum(lines, (l) => l.spentToDate)} />,
  },
  {
    key: 'remaining',
    header: 'Remaining',
    numeric: true,
    sortValue: remaining,
    render: (l) => <Money value={remaining(l)} />,
    total: (lines) => <Money value={sum(lines, remaining)} />,
  },
  {
    key: 'progress',
    header: 'Progress',
    sortValue: (l) => l.progress,
    render: (l) => (
      <span className="cd-progress">
        <span
          className="cd-progress__track"
          role="progressbar"
          aria-valuenow={l.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${l.description} progress`}
        >
          <span className="cd-progress__fill" style={{ width: `${l.progress}%` }} />
        </span>
        <span className="cd-progress__value">{l.progress}%</span>
      </span>
    ),
  },
  {
    key: 'dueDate',
    header: 'Due',
    sortValue: (l) => l.dueDate,
    render: (l) => {
      const days = daysUntil(l.dueDate);
      const soon = l.status !== 'complete' && days >= 0 && days <= 90;
      return (
        <span className={cx('cd-due', soon && 'cd-due--soon')}>
          {dateFmt.format(new Date(`${l.dueDate}T00:00:00`))}
          {soon && <span className="cd-due__hint">in {days}d</span>}
        </span>
      );
    },
  },
];

// ─── Views & filters ─────────────────────────────────────────────────────────

type ViewId = 'default' | 'over' | 'pending' | 'due-soon';

const VIEWS: { id: ViewId; label: string; test: (l: BudgetLine) => boolean }[] = [
  { id: 'default', label: 'Default view', test: () => true },
  { id: 'over', label: 'Over budget', test: (l) => l.status === 'over-budget' || remaining(l) < 0 },
  { id: 'pending', label: 'Pending approval', test: (l) => l.pendingChanges > 0 },
  {
    id: 'due-soon',
    label: 'Due in 90 days',
    test: (l) => l.status !== 'complete' && daysUntil(l.dueDate) >= 0 && daysUntil(l.dueDate) <= 90,
  },
];

interface Filters {
  statuses: LineStatus[];
  vendor: string;
  minBudget: string;
}

const EMPTY_FILTERS: Filters = { statuses: [], vendor: '', minBudget: '' };
const VENDORS = [...new Set(budgetLines.map((l) => l.vendor))].sort();
const PAGE_SIZES = [10, 25, 50];

type SortState = { key: ColumnKey; dir: 'asc' | 'desc' } | null;

function toCsv(lines: BudgetLine[], columns: Column[]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const header = columns.map((c) => esc(c.header)).join(',');
  const body = lines.map((l) => columns.map((c) => esc(c.sortValue(l))).join(','));
  return [header, ...body].join('\n');
}

function downloadCsv(lines: BudgetLine[], columns: Column[], filename: string) {
  const blob = new Blob([toCsv(lines, columns)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Small pieces ────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  footer?: ReactNode;
  tone?: 'default' | 'warning';
}

const StatCard = ({ label, value, footer, tone = 'default' }: StatCardProps) => (
  <Card as="article" className={cx('cd-stat', tone === 'warning' && 'cd-stat--warning')}>
    <h2 className="cd-stat__label">{label}</h2>
    <p className="cd-stat__value">
      <span className="cd-stat__currency">$</span>
      {money.format(value)}
    </p>
    {footer && <div className="cd-stat__footer">{footer}</div>}
  </Card>
);

function Tabs({
  tabs,
  value,
  onChange,
  panelId,
}: {
  tabs: { id: string; label: string; count: number }[];
  value: string;
  onChange: (id: string) => void;
  panelId: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    onChange(tabs[next].id);
  };
  return (
    <div className="cd-tabs" role="tablist" aria-label="Divisions">
      {tabs.map((tab, i) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${panelId}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className={cx('cd-tabs__tab', selected && 'cd-tabs__tab--selected')}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {tab.label}
            <span className="cd-tabs__count">{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function ColumnsMenu({
  hidden,
  onToggle,
  onReset,
}: {
  hidden: Set<ColumnKey>;
  onToggle: (key: ColumnKey) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="cd-popover" ref={rootRef}>
      <button
        type="button"
        className={cx('cd-icon-button', hidden.size > 0 && 'cd-icon-button--active')}
        aria-label="Choose columns"
        title="Choose columns"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <ColumnsIcon />
      </button>
      {open && (
        <div id={menuId} className="cd-popover__panel" role="group" aria-label="Visible columns">
          <p className="cd-popover__title">Visible columns</p>
          {COLUMNS.map((c) => (
            <Checkbox
              key={c.key}
              label={c.header}
              checked={!hidden.has(c.key)}
              disabled={c.locked}
              onChange={() => onToggle(c.key)}
            />
          ))}
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset to default
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface ConstructionDashboardProps {
  /** Project shown in the navbar picker and page title. */
  projectName?: string;
}

/** Example page: budget overview for one construction project, built from the library's components. */
export function ConstructionDashboard({ projectName = 'Harbor View Tower' }: ConstructionDashboardProps) {
  const panelId = useId();
  const [navOpen, setNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('budget-budget');

  const [division, setDivision] = useState<'all' | Division>('all');
  const [view, setView] = useState<ViewId>('default');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: 'costCode', dir: 'asc' });
  const [hidden, setHidden] = useState<Set<ColumnKey>>(
    () => new Set(COLUMNS.filter((c) => c.hiddenByDefault).map((c) => c.key)),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Totals for the stat cards cover the whole project, independent of table filters.
  const totals = useMemo(() => {
    const original = sum(budgetLines, (l) => l.originalBudget);
    const approved = sum(budgetLines, (l) => l.approvedChanges);
    const pending = sum(budgetLines, (l) => l.pendingChanges);
    const spent = sum(budgetLines, (l) => l.spentToDate);
    return { original, approved, pending, spent, current: original + approved };
  }, []);

  const visibleColumns = COLUMNS.filter((c) => !hidden.has(c.key));
  const activeFilterCount = filters.statuses.length + (filters.vendor ? 1 : 0) + (filters.minBudget ? 1 : 0);

  // Everything except the division tab, so tab counts reflect the other filters.
  const baseRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const viewTest = VIEWS.find((v) => v.id === view)!.test;
    const min = Number(filters.minBudget) || 0;
    return budgetLines.filter(
      (l) =>
        viewTest(l) &&
        (!q || [l.costCode, l.description, l.vendor].some((s) => s.toLowerCase().includes(q))) &&
        (!filters.statuses.length || filters.statuses.includes(l.status)) &&
        (!filters.vendor || l.vendor === filters.vendor) &&
        revisedBudget(l) >= min,
    );
  }, [query, view, filters]);

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

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Return to the first page whenever the result set changes shape.
  useEffect(() => setPage(0), [division, view, query, filters, pageSize]);

  const tabs = [
    { id: 'all', label: 'All lines', count: baseRows.length },
    ...DIVISIONS.map((d) => ({ id: d.id, label: d.label, count: baseRows.filter((l) => l.division === d.id).length })),
  ];

  const toggleSort = (key: ColumnKey) =>
    setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null));

  const pageIds = pageRows.map((l) => l.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someOnPageSelected = pageIds.some((id) => selected.has(id));
  const togglePage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      pageIds.forEach((id) => (allOnPageSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const exportRows = (lines: BudgetLine[]) =>
    downloadCsv(lines, visibleColumns, `${projectName.toLowerCase().replace(/\W+/g, '-')}-budget.csv`);

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setQuery('');
    setView('default');
    setDivision('all');
  };

  const filterChips = [
    ...filters.statuses.map((s) => ({
      key: `status-${s}`,
      label: `Status: ${STATUS_META[s].label}`,
      remove: () => setFilters((f) => ({ ...f, statuses: f.statuses.filter((x) => x !== s) })),
    })),
    ...(filters.vendor
      ? [{ key: 'vendor', label: `Vendor: ${filters.vendor}`, remove: () => setFilters((f) => ({ ...f, vendor: '' })) }]
      : []),
    ...(filters.minBudget
      ? [
          {
            key: 'min',
            label: `Revised ≥ ${formatMoney(Number(filters.minBudget), true)}`,
            remove: () => setFilters((f) => ({ ...f, minBudget: '' })),
          },
        ]
      : []),
  ];

  const spentPct = Math.round((totals.spent / totals.current) * 100);

  return (
    <div className="cd-shell">
      <Navbar
        sticky
        brand={<Wordmark />}
        menuOpen={navOpen}
        menuControls="cd-sidebar"
        onMenuClick={() => setNavOpen((o) => !o)}
        actions={
          <>
            <NavbarIconButton label="Notifications" badge={3}>
              <BellIcon />
            </NavbarIconButton>
            <NavbarIconButton label="Help">
              <HelpIcon />
            </NavbarIconButton>
          </>
        }
        account={<NavbarAvatar name="Kai Moreno" />}
      >
        <Select size="md" aria-label="Current project" defaultValue="1042" className="cd-project-picker">
          <option value="1042">1042 | {projectName}</option>
          <option value="1077">1077 | Riverside Clinic</option>
          <option value="1101">1101 | North Depot Expansion</option>
        </Select>
        <NavbarIconButton label="Browse projects">
          <FolderIcon />
        </NavbarIconButton>
      </Navbar>

      <div className="cd-shell__body">
        <Sidebar
          id="cd-sidebar"
          className="cd-shell__sidebar"
          sections={sampleSections}
          activeId={activeNav}
          open={navOpen}
          onClose={() => setNavOpen(false)}
          onSelect={(item) => {
            setActiveNav(item.id);
            setNavOpen(false);
          }}
          footer="Summit Build · v2.4.0"
        />

        <main className="cd-main">
          <div className="cd-page">
            {/* ── Page header ── */}
            <header className="cd-header">
              <div className="cd-header__titles">
                <p className="cd-header__eyebrow">Budget &amp; Costs · Project 1042</p>
                <h1 className="cd-header__title">{projectName}</h1>
              </div>
              <div className="cd-header__actions">
                <span className="cd-header__meta">
                  <CalendarIcon /> Updated Nov 17, 2026
                </span>
                <div className="cd-button-group" role="group" aria-label="Page tools">
                  <button type="button" className="cd-button-group__item" aria-label="Comments (4)" title="Comments">
                    <CommentIcon />
                    <span className="cd-button-group__count">4</span>
                  </button>
                  <button
                    type="button"
                    className="cd-button-group__item"
                    aria-label="Export budget as CSV"
                    title="Export CSV"
                    onClick={() => exportRows(rows)}
                  >
                    <DownloadIcon />
                  </button>
                  <button type="button" className="cd-button-group__item" aria-label="More actions" title="More">
                    <MoreIcon />
                  </button>
                </div>
                <Button variant="secondary">Edit budget</Button>
                <Button>Monthly payments</Button>
              </div>
            </header>

            {/* ── Stat cards ── */}
            <section className="cd-stats" aria-label="Contract summary">
              <StatCard
                label="Current contract"
                value={totals.current}
                footer={
                  <span className="cd-trend">
                    <TrendUpIcon /> {formatMoney(totals.approved, true)} approved changes
                  </span>
                }
              />
              <StatCard
                label="Pending changes"
                value={totals.pending}
                tone="warning"
                footer={`${budgetLines.filter((l) => l.pendingChanges > 0).length} change orders awaiting approval`}
              />
              <StatCard label="Original contract" value={totals.original} footer="Signed Jan 12, 2026" />
              <StatCard
                label="Spent to date"
                value={totals.spent}
                footer={
                  <span className="cd-progress cd-progress--wide">
                    <span
                      className="cd-progress__track"
                      role="progressbar"
                      aria-valuenow={spentPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Share of current contract spent"
                    >
                      <span className="cd-progress__fill" style={{ width: `${spentPct}%` }} />
                    </span>
                    <span className="cd-progress__value">{spentPct}% of contract</span>
                  </span>
                }
              />
            </section>

            {/* ── Table panel ── */}
            <Card as="section" padding="none" className="cd-panel" aria-label="Budget lines">
              <Tabs tabs={tabs} value={division} onChange={(id) => setDivision(id as 'all' | Division)} panelId={panelId} />

              <div
                id={panelId}
                role="tabpanel"
                aria-labelledby={`${panelId}-tab-${division}`}
                className="cd-panel__body"
              >
                <div className="cd-toolbar">
                  <div className="cd-toolbar__views" role="group" aria-label="Saved views">
                    {VIEWS.map((v) => (
                      <Chip key={v.id} size="sm" selected={view === v.id} onClick={() => setView(v.id)}>
                        {v.label}
                      </Chip>
                    ))}
                  </div>
                  <div className="cd-toolbar__tools">
                    <button
                      type="button"
                      className={cx('cd-icon-button', activeFilterCount > 0 && 'cd-icon-button--active')}
                      aria-label={`Filters${activeFilterCount ? ` (${activeFilterCount} active)` : ''}`}
                      title="Filters"
                      onClick={() => {
                        setDraft(filters);
                        setFiltersOpen(true);
                      }}
                    >
                      <FilterIcon />
                      {activeFilterCount > 0 && <span className="cd-icon-button__badge">{activeFilterCount}</span>}
                    </button>
                    <ColumnsMenu
                      hidden={hidden}
                      onToggle={(key) =>
                        setHidden((prev) => {
                          const next = new Set(prev);
                          next.has(key) ? next.delete(key) : next.add(key);
                          return next;
                        })
                      }
                      onReset={() => setHidden(new Set(COLUMNS.filter((c) => c.hiddenByDefault).map((c) => c.key)))}
                    />
                    <Input
                      type="search"
                      size="md"
                      className="cd-search"
                      aria-label="Search budget lines"
                      placeholder="Search code, scope or vendor"
                      startAdornment={<SearchIcon />}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>

                {(filterChips.length > 0 || selected.size > 0) && (
                  <div className="cd-subbar">
                    {filterChips.length > 0 && (
                      <div className="cd-subbar__chips">
                        {filterChips.map((c) => (
                          <Chip key={c.key} size="sm" onRemove={c.remove} removeLabel={`Remove filter ${c.label}`}>
                            {c.label}
                          </Chip>
                        ))}
                        <Button variant="ghost" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                          Clear filters
                        </Button>
                      </div>
                    )}
                    {selected.size > 0 && (
                      <div className="cd-subbar__selection" aria-live="polite">
                        <strong>{selected.size} selected</strong>
                        <Button
                          variant="outline"
                          size="sm"
                          startIcon={<DownloadIcon />}
                          onClick={() => exportRows(budgetLines.filter((l) => selected.has(l.id)))}
                        >
                          Export selected
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="cd-table-wrap" tabIndex={0} aria-label="Budget lines table, scrolls horizontally">
                  <table className="cd-table">
                    <thead>
                      <tr>
                        <th scope="col" className="cd-table__select">
                          <Checkbox
                            aria-label="Select all rows on this page"
                            checked={allOnPageSelected}
                            indeterminate={!allOnPageSelected && someOnPageSelected}
                            onChange={togglePage}
                            disabled={pageRows.length === 0}
                          />
                        </th>
                        {visibleColumns.map((c) => {
                          const dir = sort?.key === c.key ? sort.dir : undefined;
                          return (
                            <th
                              key={c.key}
                              scope="col"
                              aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined}
                              className={cx(c.numeric && 'cd-table__num')}
                            >
                              <button
                                type="button"
                                className={cx('cd-table__sort', dir && 'cd-table__sort--active')}
                                onClick={() => toggleSort(c.key)}
                              >
                                {c.header}
                                <SortIcon direction={dir} />
                              </button>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((l) => {
                        const isSelected = selected.has(l.id);
                        return (
                          <tr key={l.id} className={cx(isSelected && 'cd-table__row--selected')}>
                            <td className="cd-table__select">
                              <Checkbox
                                aria-label={`Select ${l.costCode} ${l.description}`}
                                checked={isSelected}
                                onChange={() => toggleRow(l.id)}
                              />
                            </td>
                            {visibleColumns.map((c) => (
                              <td key={c.key} className={cx(c.numeric && 'cd-table__num')}>
                                {c.render(l)}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                      {pageRows.length === 0 && (
                        <tr>
                          <td colSpan={visibleColumns.length + 1} className="cd-table__empty">
                            <p>No budget lines match these filters.</p>
                            <Button variant="outline" size="sm" onClick={clearAll}>
                              Reset view
                            </Button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {rows.length > 0 && (
                      <tfoot>
                        <tr>
                          <td />
                          {visibleColumns.map((c) => (
                            <td key={c.key} className={cx(c.numeric && 'cd-table__num')}>
                              {c.total?.(rows)}
                            </td>
                          ))}
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>

                <div className="cd-pagination">
                  <label className="cd-pagination__size">
                    Rows per page
                    <Select size="sm" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                      {PAGE_SIZES.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <span className="cd-pagination__range" aria-live="polite">
                    {rows.length === 0
                      ? '0 lines'
                      : `${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, rows.length)} of ${rows.length} lines`}
                  </span>
                  <div className="cd-pagination__nav">
                    <button
                      type="button"
                      className="cd-icon-button"
                      aria-label="Previous page"
                      disabled={currentPage === 0}
                      onClick={() => setPage(currentPage - 1)}
                    >
                      <ChevronLeftIcon />
                    </button>
                    <span>
                      Page {currentPage + 1} of {pageCount}
                    </span>
                    <button
                      type="button"
                      className="cd-icon-button"
                      aria-label="Next page"
                      disabled={currentPage >= pageCount - 1}
                      onClick={() => setPage(currentPage + 1)}
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* ── Filters drawer ── */}
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filter budget lines"
        icon={<FilterIcon />}
        placement="right"
        size="sm"
        footer={
          <div className="cd-drawer-footer">
            <Button variant="ghost" onClick={() => setDraft(EMPTY_FILTERS)}>
              Reset
            </Button>
            <Button
              onClick={() => {
                setFilters(draft);
                setFiltersOpen(false);
              }}
            >
              Apply filters
            </Button>
          </div>
        }
      >
        <div className="cd-filter-form">
          <fieldset className="cd-fieldset">
            <legend>Status</legend>
            {(Object.keys(STATUS_META) as LineStatus[]).map((s) => (
              <Checkbox
                key={s}
                label={STATUS_META[s].label}
                checked={draft.statuses.includes(s)}
                onChange={() =>
                  setDraft((d) => ({
                    ...d,
                    statuses: d.statuses.includes(s) ? d.statuses.filter((x) => x !== s) : [...d.statuses, s],
                  }))
                }
              />
            ))}
          </fieldset>
          <FormField label="Vendor">
            <Select value={draft.vendor} onChange={(e) => setDraft((d) => ({ ...d, vendor: e.target.value }))}>
              <option value="">All vendors</option>
              {VENDORS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Minimum revised budget" hint="Only show lines at or above this amount.">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              step={10000}
              placeholder="0"
              startAdornment="$"
              value={draft.minBudget}
              onChange={(e) => setDraft((d) => ({ ...d, minBudget: e.target.value }))}
            />
          </FormField>
        </div>
      </Drawer>
    </div>
  );
}

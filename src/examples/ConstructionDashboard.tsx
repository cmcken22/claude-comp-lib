import { useMemo, useState } from 'react';
import {
  AppShell,
  Badge,
  Button,
  Card,
  DataTable,
  Input,
  Navbar,
  Progress,
  Select,
  Sidebar,
  SidebarItem,
  SidebarSection,
  StatCard,
  type BadgeTone,
  type DataTableColumn,
  type DataTableFilter,
  type ProgressTone,
} from '../index';
import {
  BellIcon,
  BuildingIcon,
  CalendarIcon,
  ChartIcon,
  ClipboardIcon,
  DollarIcon,
  DownloadIcon,
  FileIcon,
  HardHatIcon,
  HelpIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  TruckIcon,
  UsersIcon,
} from '../stories/icons';
import {
  compactCurrency,
  managers,
  phases,
  projectData,
  shortDate,
  statuses,
  type Project,
  type ProjectStatus,
} from './constructionData';
import './ConstructionDashboard.scss';

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

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('');

const columns: DataTableColumn<Project>[] = [
  {
    id: 'name',
    header: 'Project',
    accessor: (p) => p.name,
    sortable: true,
    cell: (p) => (
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
    header: 'Client',
    accessor: (p) => p.client,
    sortable: true,
    cell: (p) => (
      <div className="cd-project">
        <span>{p.client}</span>
        <span className="cd-project__meta">{p.location}</span>
      </div>
    ),
  },
  {
    id: 'manager',
    header: 'Manager',
    accessor: (p) => p.manager,
    sortable: true,
    cell: (p) => (
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
    header: 'Status',
    accessor: (p) => p.status,
    sortable: true,
    cell: (p) => (
      <Badge tone={statusTone[p.status]} dot>
        {p.status}
      </Badge>
    ),
  },
  {
    id: 'progress',
    header: 'Phase / progress',
    accessor: (p) => p.progress,
    sortable: true,
    searchable: false,
    width: '11rem',
    cell: (p) => (
      <div className="cd-phase">
        <span className="cd-phase__name">{p.phase}</span>
        <Progress value={p.progress} tone={progressTone[p.status]} size="sm" showValue label={`${p.name} progress`} />
      </div>
    ),
  },
  {
    id: 'budget',
    header: 'Budget',
    accessor: (p) => p.budget,
    sortable: true,
    searchable: false,
    align: 'end',
    cell: (p) => {
      const ratio = p.spent / p.budget;
      return (
        <div className="cd-budget">
          <span>{compactCurrency.format(p.budget)}</span>
          <span className={ratio > p.progress / 100 + 0.05 ? 'cd-budget__spent cd-budget__spent--over' : 'cd-budget__spent'}>
            {Math.round(ratio * 100)}% spent
          </span>
        </div>
      );
    },
  },
  {
    id: 'due',
    header: 'Due',
    accessor: (p) => p.dueDate,
    sortable: true,
    searchable: false,
    align: 'end',
    cell: (p) => shortDate.format(p.dueDate),
  },
];


const filters: DataTableFilter<Project>[] = [
  { id: 'status', label: 'Status', allLabel: 'All statuses', options: statuses.map((s) => ({ value: s, label: s })), getValue: (p) => p.status },
  { id: 'phase', label: 'Phase', allLabel: 'All phases', options: phases.map((s) => ({ value: s, label: s })), getValue: (p) => p.phase },
  { id: 'manager', label: 'Manager', allLabel: 'All managers', options: managers.map((s) => ({ value: s, label: s })), getValue: (p) => p.manager },
];

const searchText = (p: Project) => [p.name, p.id, p.type, p.client, p.location, p.manager, p.phase, p.status].join(' ');

const navItems = [
  { label: 'Dashboard', icon: <HomeIcon /> },
  { label: 'Projects', icon: <BuildingIcon />, badge: String(projectData.length) },
  { label: 'Schedule', icon: <CalendarIcon /> },
  { label: 'Crews', icon: <UsersIcon /> },
  { label: 'Equipment', icon: <TruckIcon /> },
];

const opsItems = [
  { label: 'Safety', icon: <ShieldIcon />, badge: '2' },
  { label: 'Daily logs', icon: <ClipboardIcon /> },
  { label: 'Documents', icon: <FileIcon /> },
  { label: 'Reports', icon: <ChartIcon /> },
];

export function ConstructionDashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');

  const stats = useMemo(() => {
    const active = projectData.filter((p) => p.status !== 'Completed');
    const contract = active.reduce((sum, p) => sum + p.budget, 0);
    const spent = active.reduce((sum, p) => sum + p.spent, 0);
    const behind = active.filter((p) => p.status === 'At risk' || p.status === 'Delayed').length;
    return { activeCount: active.length, contract, spent, utilization: spent / contract, behind };
  }, []);

  const sidebar = (
    <Sidebar
      brand={
        <>
          <span className="cd-logo" aria-hidden="true">
            <HardHatIcon />
          </span>
          <span className="cd-brand">
            Ironbridge
            <span className="cd-brand__sub">Construction</span>
          </span>
        </>
      }
      footer={
        <div className="cd-person cd-person--footer">
          <span className="cd-avatar" aria-hidden="true">
            JR
          </span>
          <span className="cd-person__text">
            <strong>Jordan Reyes</strong>
            <span>Operations Director</span>
          </span>
        </div>
      }
    >
      <SidebarSection title="Overview">
        {navItems.map((item) => (
          <SidebarItem
            key={item.label}
            href="#"
            icon={item.icon}
            active={activeNav === item.label}
            badge={item.badge && <Badge size="sm">{item.badge}</Badge>}
            onClick={(e) => {
              e.preventDefault();
              setActiveNav(item.label);
            }}
          >
            {item.label}
          </SidebarItem>
        ))}
      </SidebarSection>
      <SidebarSection title="Field operations">
        {opsItems.map((item) => (
          <SidebarItem
            key={item.label}
            href="#"
            icon={item.icon}
            active={activeNav === item.label}
            badge={item.badge && <Badge size="sm" tone="danger">{item.badge}</Badge>}
            onClick={(e) => {
              e.preventDefault();
              setActiveNav(item.label);
            }}
          >
            {item.label}
          </SidebarItem>
        ))}
      </SidebarSection>
      <SidebarSection>
        <SidebarItem href="#" icon={<SettingsIcon />} onClick={(e) => e.preventDefault()}>
          Settings
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  );

  const navbar = (
    <Navbar
      title={activeNav}
      actions={
        <>
          <Button variant="ghost" size="sm" aria-label="Help" startIcon={<HelpIcon />} className="cd-icon-button cd-hide-sm" />
          <span className="cd-bell">
            <Button variant="ghost" size="sm" aria-label="Notifications, 3 unread" startIcon={<BellIcon />} className="cd-icon-button" />
            <span className="cd-bell__dot" aria-hidden="true" />
          </span>
          <span className="cd-avatar" role="img" aria-label="Jordan Reyes">
            JR
          </span>
        </>
      }
    >
      <Input
        className="cd-global-search"
        size="sm"
        type="search"
        placeholder="Search projects, crews, documents…"
        aria-label="Search everything"
        startAdornment={<SearchIcon />}
      />
    </Navbar>
  );

  return (
    <AppShell sidebar={sidebar} navbar={navbar} maxWidth="xl">
      <div className="cd-page">
        <div className="cd-page__header">
          <div>
            <h1 className="cd-page__title">Good afternoon, Jordan</h1>
            <p className="cd-page__subtitle">
              Here’s how your portfolio is tracking as of {shortDate.format(new Date(2026, 10, 14))}.
            </p>
          </div>
          <div className="cd-page__actions">
            <Select size="sm" defaultValue="qtd" aria-label="Reporting period" className="cd-period">
              <option value="mtd">Month to date</option>
              <option value="qtd">Quarter to date</option>
              <option value="ytd">Year to date</option>
            </Select>
            <Button size="sm" startIcon={<PlusIcon />}>
              New project
            </Button>
          </div>
        </div>

        <section className="cd-stats" aria-label="Key metrics">
          <StatCard
            label="Active projects"
            value={stats.activeCount}
            icon={<BuildingIcon />}
            delta="+3"
            trend="up"
            deltaLabel="since last quarter"
          />
          <StatCard
            label="Contract value"
            value={compactCurrency.format(stats.contract)}
            icon={<DollarIcon />}
            delta="+8.4%"
            trend="up"
            deltaLabel="vs last quarter"
          />
          <StatCard
            label="Budget spent"
            value={`${Math.round(stats.utilization * 100)}%`}
            icon={<ChartIcon />}
            delta={`${stats.behind} projects at risk`}
            trend="up"
            positive={false}
            footer={
              <Progress
                value={stats.spent}
                max={stats.contract}
                tone="warning"
                size="sm"
                label="Budget spent across active projects"
                showValue
                valueText={compactCurrency.format(stats.spent)}
              />
            }
          />
          <StatCard
            label="Days without incident"
            value="127"
            icon={<ShieldIcon />}
            delta="+27"
            trend="up"
            deltaLabel="vs previous streak"
            footer={<span className="cd-stat-note">342 workers on site today</span>}
          />
        </section>

        <Card
          padding="none"
          title="Projects"
          description="Every job in the portfolio. Search, filter by status, phase or manager, and sort any column."
          actions={
            <Button variant="secondary" size="sm" startIcon={<DownloadIcon />}>
              Export CSV
            </Button>
          }
        >
          <DataTable
            caption="Projects"
            data={projectData}
            columns={columns}
            getRowId={(p) => p.id}
            getSearchText={searchText}
            searchPlaceholder="Search by project, client, city…"
            filters={filters}
            selectable
            bulkActions={(rows, clear) => (
              <>
                <Button variant="secondary" size="sm" startIcon={<DownloadIcon />}>
                  Export {rows.length}
                </Button>
                <Button variant="secondary" size="sm" onClick={clear}>
                  Reassign manager
                </Button>
              </>
            )}
            initialSort={{ columnId: 'due', direction: 'asc' }}
            pageSize={10}
          />
        </Card>
      </div>
    </AppShell>
  );
}

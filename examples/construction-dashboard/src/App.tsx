import { useEffect, useState } from 'react';
import { Button, Input, PageLayout, Select } from '../../../src';
import { PROJECTS } from './data';
import { Icons } from './icons';
import { ProjectTable } from './ProjectTable';
import { Skyline } from './Skyline';
import { CommentsProvider } from './comments';
import { Field } from './Field';
import { Fireworks } from './Fireworks';
import { StatCards } from './StatCards';

const NAV = [
  { id: 'overview', label: 'Overview', icon: Icons.Dashboard },
  { id: 'projects', label: 'Projects', icon: Icons.Projects, count: PROJECTS.filter((p) => p.status !== 'Completed').length },
  { id: 'schedule', label: 'Schedule', icon: Icons.Calendar },
  { id: 'crews', label: 'Crews', icon: Icons.Crew },
  { id: 'equipment', label: 'Equipment', icon: Icons.Equipment },
  { id: 'budget', label: 'Budget & costs', icon: Icons.Budget },
  { id: 'safety', label: 'Safety', icon: Icons.Safety, count: 3, alert: true },
  { id: 'documents', label: 'Documents', icon: Icons.Docs },
];

function Sidebar({ open, onClose, collapsed, onToggleCollapse }: { open: boolean; onClose: () => void; collapsed: boolean; onToggleCollapse: () => void }) {
  const [active, setActive] = useState('overview');
  return (
    <>
      <div className="cd-scrim" hidden={!open} onClick={onClose} />
      <aside className={`cd-sidebar${open ? ' cd-sidebar--open' : ''}`} aria-label="Primary">
        <div className="cd-brand">
          <span className="cd-brand__mark"><Icons.Logo width={20} height={20} /></span>
          <span className="cd-brand__text">
            <strong>Keystone Build</strong>
            <span>Field operations</span>
          </span>
          <Button
            className="cd-collapse-btn"
            variant="ghost"
            size="sm"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapse}
          >
            <Icons.ChevronLeft width={16} height={16} />
          </Button>
          <Button className="cd-sidebar__close" variant="ghost" size="sm" aria-label="Close menu" onClick={onClose}>
            <Icons.Close />
          </Button>
        </div>

        <nav className="cd-nav">
          <span className="cd-nav__heading">Workspace</span>
          {NAV.map(({ id, label, icon: Icon, count, alert }) => (
            <a
              key={id}
              href={`#${id === 'overview' ? '' : id}`}
              className={`cd-nav__item${active === id ? ' cd-nav__item--active' : ''}`}
              aria-current={active === id ? 'page' : undefined}
              title={collapsed ? label : undefined}
              onClick={(e) => { e.preventDefault(); setActive(id); onClose(); }}
            >
              <Icon />
              <span className="cd-nav__label">{label}</span>
              {count != null && <span className={`cd-nav__count${alert ? ' cd-nav__count--alert' : ''}`}>{count}</span>}
            </a>
          ))}
          <span className="cd-nav__heading">Account</span>
          <a href="#" className="cd-nav__item" title={collapsed ? 'Settings' : undefined} onClick={(e) => e.preventDefault()}>
            <Icons.Settings /><span className="cd-nav__label">Settings</span>
          </a>
        </nav>

        <div className="cd-sidebar__footer">
          <div className="cd-weather">
            <span className="cd-weather__label">Site conditions · Denver</span>
            <span className="cd-weather__value">41°F · Wind 12 mph</span>
            <span className="cd-weather__note">Crane ops cleared (limit 20 mph)</span>
          </div>
          <div className="cd-user">
            <span className="cd-avatar">MR</span>
            <span className="cd-user__text">
              <strong>Maya Ruiz</strong>
              <span>Operations Director</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenu, expanded }: { onMenu: () => void; expanded: boolean }) {
  return (
    <div className="cd-topbar">
      <Button className="cd-topbar__menu" variant="ghost" size="sm" aria-label="Toggle sidebar" aria-expanded={expanded} title="Toggle sidebar" onClick={onMenu}>
        <Icons.Menu />
      </Button>
      <div className="cd-topbar__search">
        <Input
          id="global-search"
          size="sm"
          type="search"
          placeholder="Search projects, RFIs, crews…"
          aria-label="Search"
          startAdornment={<Icons.Search width={16} height={16} />}
        />
      </div>
      <div className="cd-topbar__actions">
        <Select id="region" size="sm" aria-label="Region" defaultValue="all" className="cd-topbar__region">
          <option value="all">All regions</option>
          <option value="front-range">Front Range</option>
          <option value="mountain">Mountain West</option>
          <option value="southwest">Southwest</option>
        </Select>
        <Button variant="ghost" size="sm" aria-label="Notifications, 4 unread" className="cd-bell">
          <Icons.Bell />
          <span className="cd-bell__dot" aria-hidden="true" />
        </Button>
        <Button size="sm" startIcon={<Icons.Plus width={16} height={16} />}>
          <span className="cd-hide-sm">New project</span>
        </Button>
      </div>
    </div>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('cd-sidebar-collapsed') === '1'; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('cd-sidebar-collapsed', collapsed ? '1' : '0'); } catch { /* storage unavailable */ }
  }, [collapsed]);
  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
  // Desktop: collapse to an icon rail. Smaller screens: open the drawer.
  const toggleSidebar = () => (isDesktop() ? setCollapsed((c) => !c) : setMenuOpen((o) => !o));

  return (
    <div className={`cd-app${collapsed ? ' cd-app--collapsed' : ''}`} data-theme="dark">
      <Field />
      <Fireworks />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <PageLayout
        className="cd-page"
        maxWidth="full"
        stickyHeader
        header={<Topbar onMenu={toggleSidebar} expanded={!collapsed} />}
      >
        <div className="cd-content">
          <div className="cd-hero">
          <Skyline />
          <div className="cd-page-head">
            <div>
              <p className="cd-eyebrow">Week 46 · Nov 9 – Nov 15, 2026</p>
              <h1 className="cd-title">Portfolio overview</h1>
            </div>
            <Button variant="secondary" size="sm" startIcon={<Icons.Download width={16} height={16} />}>
              Weekly report
            </Button>
          </div>
          </div>
          <StatCards />
          <CommentsProvider>
            <ProjectTable />
          </CommentsProvider>
        </div>
      </PageLayout>
    </div>
  );
}

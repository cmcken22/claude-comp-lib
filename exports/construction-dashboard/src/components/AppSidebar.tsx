import { Badge, Sidebar, SidebarItem, SidebarSection, type BadgeTone } from 'claude-comp-lib';
import { Icon, type IconName } from '../icons';
import { PROJECTS } from '../data/projects';

export type NavLabel =
  | 'Dashboard'
  | 'Projects'
  | 'Schedule'
  | 'Crews'
  | 'Equipment'
  | 'Safety'
  | 'Daily logs'
  | 'Documents'
  | 'Reports'
  | 'Settings';

interface NavEntry {
  label: NavLabel;
  icon: IconName;
  badge?: string;
  badgeTone?: BadgeTone;
}

const overview: NavEntry[] = [
  { label: 'Dashboard', icon: 'home' },
  { label: 'Projects', icon: 'building', badge: String(PROJECTS.length) },
  { label: 'Schedule', icon: 'calendar' },
  { label: 'Crews', icon: 'users' },
  { label: 'Equipment', icon: 'truck' },
];

const fieldOps: NavEntry[] = [
  { label: 'Safety', icon: 'shield', badge: '2', badgeTone: 'danger' },
  { label: 'Daily logs', icon: 'clipboard' },
  { label: 'Documents', icon: 'file' },
  { label: 'Reports', icon: 'chart' },
];

interface AppSidebarProps {
  active: NavLabel;
  onNavigate: (label: NavLabel) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function AppSidebar({ active, onNavigate, collapsed, onToggleCollapsed }: AppSidebarProps) {
  const item = (entry: NavEntry) => (
    <SidebarItem
      key={entry.label}
      href="#"
      data-tip={entry.label}
      icon={<Icon name={entry.icon} />}
      active={active === entry.label}
      className={entry.badge ? 'cd-has-badge' : undefined}
      badge={entry.badge && (
        <Badge size="sm" tone={entry.badgeTone}>
          {entry.badge}
        </Badge>
      )}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(entry.label);
      }}
    >
      {entry.label}
    </SidebarItem>
  );

  const collapseText = collapsed ? 'Expand sidebar' : 'Collapse sidebar';

  return (
    <Sidebar
      brand={
        <>
          <span className="cd-logo" aria-hidden="true">
            <Icon name="hardHat" />
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
      <SidebarSection title="Overview">{overview.map(item)}</SidebarSection>
      <SidebarSection title="Field operations">{fieldOps.map(item)}</SidebarSection>
      <SidebarSection>
        {item({ label: 'Settings', icon: 'settings' })}
        <li>
          <button
            type="button"
            className="ds-sidebar__item cd-collapse-btn"
            data-tip={collapseText}
            aria-expanded={!collapsed}
            onClick={onToggleCollapsed}
          >
            <span className="ds-sidebar__item-icon" aria-hidden="true">
              <Icon name="collapse" />
            </span>
            <span className="ds-sidebar__item-label">{collapseText}</span>
          </button>
        </li>
      </SidebarSection>
    </Sidebar>
  );
}

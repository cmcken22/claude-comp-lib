import { useState, type ReactNode } from 'react';
import { Select } from '../../../components/Select';
import { Navbar, NavbarAvatar, NavbarIconButton } from '../../../global/Navbar';
import { Sidebar, type SidebarSection } from '../../../global/Sidebar';
import { sampleSections } from '../../../global/navData';
import { BellIcon, FolderIcon, GateThreeMark, HelpIcon } from '../icons';

export interface AppShellProps {
  projectName: string;
  projectNumber: string;
  userName: string;
  activeNavId: string;
  /** Extra controls at the start of the navbar's action area. */
  extraActions?: ReactNode;
  children: ReactNode;
}

/** Sample nav plus a Subcontracts group so Schedule A has a home in the sidebar. */
const sections: SidebarSection[] = sampleSections.map((s) =>
  s.id !== 'project'
    ? s
    : {
        ...s,
        items: [
          ...s.items,
          {
            id: 'contracts',
            label: 'Subcontracts',
            children: [
              { id: 'contracts-requisitions', label: 'Requisitions' },
              { id: 'contracts-schedule-a', label: 'Schedule A scopes' },
            ],
          },
        ],
      },
);

/** Global Navbar on top, Sidebar on the left (a drawer on narrow screens), scrolling content on the right. */
export function AppShell({ projectName, projectNumber, userName, activeNavId, extraActions, children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false);
  // At lg and up the sidebar is docked; the menu button collapses it instead of opening a drawer.
  // Starts collapsed so the scope gets the width; the menu button brings the navigation back.
  const [collapsed, setCollapsed] = useState(true);
  const isDocked = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
  const [activeNav, setActiveNav] = useState(activeNavId);

  return (
    <div className="sa-shell">
      <Navbar
        sticky
        brand={<GateThreeMark />}
        menuOpen={navOpen}
        menuControls="sa-sidebar"
        onMenuClick={() => (isDocked() ? setCollapsed((c) => !c) : setNavOpen((o) => !o))}
        actions={
          <>
            {extraActions}
            <NavbarIconButton label="Notifications" badge={2}>
              <BellIcon />
            </NavbarIconButton>
            <NavbarIconButton label="Help">
              <HelpIcon />
            </NavbarIconButton>
          </>
        }
        account={<NavbarAvatar name={userName} />}
      >
        <Select size="md" aria-label="Current project" defaultValue={projectNumber} className="sa-project-picker">
          <option value={projectNumber}>
            {projectNumber} | {projectName}
          </option>
          <option value="2390">2390 | Riverside Clinic</option>
          <option value="2455">2455 | North Depot Expansion</option>
        </Select>
        <NavbarIconButton label="Browse projects">
          <FolderIcon />
        </NavbarIconButton>
      </Navbar>

      <div className="sa-shell__body">
        <Sidebar
          id="sa-sidebar"
          className={`sa-shell__sidebar${collapsed ? ' sa-shell__sidebar--collapsed' : ''}`}
          sections={sections}
          activeId={activeNav}
          open={navOpen}
          onClose={() => setNavOpen(false)}
          onSelect={(item) => {
            setActiveNav(item.id);
            setNavOpen(false);
          }}
          footer="Gate Three · Prototype"
        />
        <main className="sa-main">{children}</main>
      </div>
    </div>
  );
}

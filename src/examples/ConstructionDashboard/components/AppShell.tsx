import { useState, type ReactNode } from 'react';
import { Select } from '../../../components/Select';
import { Navbar, NavbarAvatar, NavbarIconButton } from '../../../global/Navbar';
import { Sidebar } from '../../../global/Sidebar';
import { sampleSections, Wordmark } from '../../../global/navData';
import { BellIcon, FolderIcon, HelpIcon } from '../icons';

export interface AppShellProps {
  projectName: string;
  children: ReactNode;
}

/** Global Navbar on top, Sidebar on the left (a drawer on narrow screens), scrolling content on the right. */
export function AppShell({ projectName, children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('budget-budget');

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
        <main className="cd-main">{children}</main>
      </div>
    </div>
  );
}

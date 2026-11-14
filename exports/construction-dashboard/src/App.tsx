import { useState } from 'react';
import { AppShell, Button, Card, Select } from 'claude-comp-lib';
import { AppSidebar, type NavLabel } from './components/AppSidebar';
import { ParticleField } from './components/ParticleField';
import { ProjectsTable } from './components/ProjectsTable';
import { QuickActions } from './components/QuickActions';
import { StatCards } from './components/StatCards';
import { TopNavbar } from './components/TopNavbar';
import { useMediaQuery, useTheme } from './hooks';
import { Icon } from './icons';

export function App() {
  const [nav, setNav] = useState<NavLabel>('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // The navbar's menu button asks AppShell to open the sidebar. On wide screens
  // that collapses/expands the pinned sidebar; on small ones it opens the drawer.
  const onSidebarOpenChange = (open: boolean) => {
    if (isDesktop) {
      if (open) setCollapsed((c) => !c);
      return;
    }
    setDrawerOpen(open);
  };

  const showTable = nav === 'Dashboard' || nav === 'Projects';

  return (
    <>
      <ParticleField />
      <AppShell
        className={collapsed ? 'cd-collapsed' : undefined}
        maxWidth="full"
        sidebarOpen={drawerOpen && !isDesktop}
        onSidebarOpenChange={onSidebarOpenChange}
        sidebar={
          <AppSidebar
            active={nav}
            onNavigate={setNav}
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((c) => !c)}
          />
        }
        navbar={<TopNavbar title={nav} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}
      >
        <div className="cd-layout">
          <div className="cd-page">
            {nav === 'Dashboard' && (
              <>
                <div className="cd-page__header">
                  <div>
                    <h1 className="cd-page__title">Good afternoon, Jordan</h1>
                    <p className="cd-page__subtitle">Here’s how your portfolio is tracking as of Nov 14, 2026.</p>
                  </div>
                  <div className="cd-page__actions">
                    <Select size="sm" defaultValue="qtd" aria-label="Reporting period" className="cd-period">
                      <option value="mtd">Month to date</option>
                      <option value="qtd">Quarter to date</option>
                      <option value="ytd">Year to date</option>
                    </Select>
                    <Button size="sm" startIcon={<Icon name="plus" />}>
                      New project
                    </Button>
                  </div>
                </div>
                <StatCards />
              </>
            )}
            {showTable ? (
              <ProjectsTable />
            ) : (
              <Card className="cd-empty-card" title={nav} description="This screen isn’t built yet. Pick Dashboard or Projects in the sidebar." />
            )}
          </div>
          <QuickActions />
        </div>
      </AppShell>
    </>
  );
}

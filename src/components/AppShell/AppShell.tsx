import { useEffect, useId, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { AppShellContext } from './AppShellContext';
import './AppShell.scss';

export interface AppShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Sidebar slot, usually a <Sidebar />. Pinned on large screens, a drawer on small ones. */
  sidebar: ReactNode;
  /** Top bar slot, usually a <Navbar />. Rendered in a sticky <header> landmark. */
  navbar?: ReactNode;
  /** Main content. Rendered in a <main> landmark. */
  children: ReactNode;
  /** Controlled open state of the small-screen sidebar drawer. */
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** Max width of the main content. `full` lets it fill the space. */
  maxWidth?: 'lg' | 'xl' | 'full';
  /** Id for <main>, targeted by the skip link. */
  mainId?: string;
  skipLinkLabel?: string;
}

/**
 * Application frame with a sidebar on the left and a sticky top navbar above
 * the main content. Below the `lg` breakpoint the sidebar becomes an
 * off-canvas drawer, toggled by the Navbar's menu button.
 */
export function AppShell({
  sidebar,
  navbar,
  children,
  sidebarOpen: sidebarOpenProp,
  defaultSidebarOpen = false,
  onSidebarOpenChange,
  maxWidth = 'full',
  mainId = 'main-content',
  skipLinkLabel = 'Skip to content',
  className,
  ...rest
}: AppShellProps) {
  const sidebarId = `app-sidebar${useId()}`;
  const [sidebarOpen, setSidebarOpen] = useControllableState({
    value: sidebarOpenProp,
    defaultValue: defaultSidebarOpen,
    onChange: onSidebarOpenChange,
  });

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    // Move focus into the drawer so keyboard users land in it.
    document.getElementById(sidebarId)?.querySelector<HTMLElement>('a, button')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen, setSidebarOpen, sidebarId]);

  const context = useMemo(() => ({ sidebarId, sidebarOpen, setSidebarOpen }), [sidebarId, sidebarOpen, setSidebarOpen]);

  return (
    <AppShellContext.Provider value={context}>
      <div {...rest} className={cx('ds-app-shell', sidebarOpen && 'ds-app-shell--sidebar-open', className)}>
        <a className="ds-app-shell__skip-link" href={`#${mainId}`}>
          {skipLinkLabel}
        </a>
        <aside id={sidebarId} className="ds-app-shell__sidebar">
          {sidebar}
        </aside>
        <div className="ds-app-shell__overlay" aria-hidden="true" onClick={() => setSidebarOpen(false)} />
        <div className="ds-app-shell__content">
          {navbar && <header className="ds-app-shell__navbar">{navbar}</header>}
          <main id={mainId} className="ds-app-shell__main" tabIndex={-1}>
            <div className={cx('ds-app-shell__container', `ds-app-shell__container--${maxWidth}`)}>{children}</div>
          </main>
        </div>
      </div>
    </AppShellContext.Provider>
  );
}

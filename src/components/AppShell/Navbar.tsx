import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useAppShell } from './AppShellContext';

export interface NavbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Page title or breadcrumbs, at the start of the bar. */
  title?: ReactNode;
  /** Content between the title and the actions, e.g. a search field. */
  children?: ReactNode;
  /** Content at the end of the bar, e.g. icon buttons and an avatar. */
  actions?: ReactNode;
  /** Accessible label for the sidebar toggle shown on small screens. */
  menuLabel?: string;
}

/** The top bar of an AppShell. Shows a sidebar toggle on small screens. */
export function Navbar({ title, children, actions, menuLabel = 'Open navigation', className, ...rest }: NavbarProps) {
  const shell = useAppShell();

  return (
    <div {...rest} className={cx('ds-navbar', className)}>
      {shell && (
        <button
          type="button"
          className="ds-navbar__menu"
          aria-label={menuLabel}
          aria-controls={shell.sidebarId}
          aria-expanded={shell.sidebarOpen}
          onClick={() => shell.setSidebarOpen(!shell.sidebarOpen)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {title != null && <div className="ds-navbar__title">{title}</div>}
      {children != null && <div className="ds-navbar__center">{children}</div>}
      {actions != null && <div className="ds-navbar__actions">{actions}</div>}
    </div>
  );
}

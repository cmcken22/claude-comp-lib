import { useId, type AnchorHTMLAttributes, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useAppShell } from './AppShellContext';

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  /** Logo / product name at the top. */
  brand?: ReactNode;
  /** Navigation content: SidebarSection and SidebarItem elements. */
  children: ReactNode;
  /** Pinned to the bottom, e.g. the signed-in user. */
  footer?: ReactNode;
  /** Accessible name of the <nav> landmark. */
  navLabel?: string;
}

/** Vertical navigation, meant for the AppShell `sidebar` slot. */
export function Sidebar({ brand, children, footer, navLabel = 'Main', className, ...rest }: SidebarProps) {
  return (
    <div {...rest} className={cx('ds-sidebar', className)}>
      {brand != null && <div className="ds-sidebar__brand">{brand}</div>}
      <nav className="ds-sidebar__nav" aria-label={navLabel}>
        {children}
      </nav>
      {footer != null && <div className="ds-sidebar__footer">{footer}</div>}
    </div>
  );
}

export interface SidebarSectionProps {
  /** Small heading above the group. */
  title?: ReactNode;
  /** SidebarItem elements. */
  children: ReactNode;
  className?: string;
}

/** A labelled group of sidebar links. */
export function SidebarSection({ title, children, className }: SidebarSectionProps) {
  const titleId = useId();
  return (
    <div className={cx('ds-sidebar__section', className)}>
      {title != null && (
        <div id={titleId} className="ds-sidebar__section-title">
          {title}
        </div>
      )}
      <ul className="ds-sidebar__list" aria-labelledby={title != null ? titleId : undefined}>
        {children}
      </ul>
    </div>
  );
}

export interface SidebarItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  /** Icon before the label. */
  icon?: ReactNode;
  /** Marks the current page (sets `aria-current="page"`). */
  active?: boolean;
  /** Trailing content, e.g. a count Badge. */
  badge?: ReactNode;
  /** Renders a <button> when no `href` is given. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
}

/** A single sidebar link. Closes the small-screen drawer when chosen. */
export function SidebarItem({ icon, active = false, badge, href, onClick, className, children, ...rest }: SidebarItemProps) {
  const shell = useAppShell();
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    shell?.setSidebarOpen(false);
  };
  const content = (
    <>
      {icon && (
        <span className="ds-sidebar__item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="ds-sidebar__item-label">{children}</span>
      {badge != null && <span className="ds-sidebar__item-badge">{badge}</span>}
    </>
  );
  const itemClass = cx('ds-sidebar__item', active && 'ds-sidebar__item--active', className);

  return (
    <li>
      {href != null ? (
        <a {...rest} href={href} className={itemClass} aria-current={active ? 'page' : undefined} onClick={handleClick}>
          {content}
        </a>
      ) : (
        <button type="button" className={itemClass} aria-current={active ? 'page' : undefined} onClick={handleClick}>
          {content}
        </button>
      )}
    </li>
  );
}

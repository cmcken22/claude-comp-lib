import { AnchorHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode } from 'react';
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
export declare function Sidebar({ brand, children, footer, navLabel, className, ...rest }: SidebarProps): import("react").JSX.Element;
export interface SidebarSectionProps {
    /** Small heading above the group. */
    title?: ReactNode;
    /** SidebarItem elements. */
    children: ReactNode;
    className?: string;
}
/** A labelled group of sidebar links. */
export declare function SidebarSection({ title, children, className }: SidebarSectionProps): import("react").JSX.Element;
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
export declare function SidebarItem({ icon, active, badge, href, onClick, className, children, ...rest }: SidebarItemProps): import("react").JSX.Element;

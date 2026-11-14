import { HTMLAttributes, ReactNode } from 'react';
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
export declare function Navbar({ title, children, actions, menuLabel, className, ...rest }: NavbarProps): import("react").JSX.Element;

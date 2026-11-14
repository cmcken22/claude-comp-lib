import { HTMLAttributes, ReactNode } from 'react';
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
export declare function AppShell({ sidebar, navbar, children, sidebarOpen: sidebarOpenProp, defaultSidebarOpen, onSidebarOpenChange, maxWidth, mainId, skipLinkLabel, className, ...rest }: AppShellProps): import("react").JSX.Element;

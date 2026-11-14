import { HTMLAttributes, ReactNode } from 'react';
export type PageLayoutWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export interface PageLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Header slot: app bar, navigation, brand. Rendered in a <header> landmark. */
    header?: ReactNode;
    /** Body slot: the page's main content. Rendered in a <main> landmark. */
    children: ReactNode;
    /** Optional footer slot. Rendered in a <footer> landmark. */
    footer?: ReactNode;
    /** Max width of the content area. */
    maxWidth?: PageLayoutWidth;
    /** Keep the header pinned to the top while scrolling. */
    stickyHeader?: boolean;
    /** Id for <main>, targeted by the skip link. */
    mainId?: string;
    /** Text for the "skip to content" link that appears on keyboard focus. */
    skipLinkLabel?: string;
}
export declare function PageLayout({ header, children, footer, maxWidth, stickyHeader, mainId, skipLinkLabel, className, ...rest }: PageLayoutProps): import("react").JSX.Element;

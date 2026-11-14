import { HTMLAttributes, ReactNode } from 'react';
export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** Heading shown at the top of the card. */
    title?: ReactNode;
    /** Secondary text under the title. */
    description?: ReactNode;
    /** Content aligned to the end of the header, e.g. buttons. */
    actions?: ReactNode;
    /** Inner spacing. `none` lets content (like a table) run edge to edge. */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** Element to render as. */
    as?: 'section' | 'article' | 'div';
}
/** A bordered surface that groups related content. */
export declare function Card({ title, description, actions, padding, as: Component, className, children, ...rest }: CardProps): import("react").JSX.Element;

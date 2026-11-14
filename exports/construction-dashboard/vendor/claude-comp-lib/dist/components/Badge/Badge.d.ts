import { HTMLAttributes } from 'react';
export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Color meaning. */
    tone?: BadgeTone;
    /** Show a small status dot before the label. */
    dot?: boolean;
    size?: 'sm' | 'md';
}
/** A compact label for statuses, counts and categories. */
export declare function Badge({ tone, dot, size, className, children, ...rest }: BadgeProps): import("react").JSX.Element;

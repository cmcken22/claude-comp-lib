import { HTMLAttributes, ReactNode } from 'react';
export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';
export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Current value, from 0 to `max`. */
    value: number;
    max?: number;
    tone?: ProgressTone;
    size?: 'sm' | 'md';
    /** Accessible name. Required when no visible label is associated. */
    label?: string;
    /** Show the percentage next to the bar. */
    showValue?: boolean;
    /** Custom text in place of the percentage. */
    valueText?: ReactNode;
}
/** A horizontal bar showing how far along something is. */
export declare function Progress({ value, max, tone, size, label, showValue, valueText, className, ...rest }: ProgressProps): import("react").JSX.Element;

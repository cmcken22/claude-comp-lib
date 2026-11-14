import { InputHTMLAttributes, ReactNode } from 'react';
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    /** Visible label. If omitted, pass `aria-label`. */
    label?: ReactNode;
    /** Secondary text below the label. */
    description?: ReactNode;
    /** Shows a "mixed" state, e.g. for a "select all" checkbox. */
    indeterminate?: boolean;
    invalid?: boolean;
}
export declare const Checkbox: import('react').ForwardRefExoticComponent<CheckboxProps & import('react').RefAttributes<HTMLInputElement>>;

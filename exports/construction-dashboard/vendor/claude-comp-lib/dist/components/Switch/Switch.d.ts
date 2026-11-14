import { InputHTMLAttributes, ReactNode } from 'react';
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'role'> {
    /** Visible label. If omitted, pass `aria-label`. */
    label?: ReactNode;
    /** Secondary text below the label. */
    description?: ReactNode;
}
/** An on/off toggle for settings that take effect immediately. */
export declare const Switch: import('react').ForwardRefExoticComponent<SwitchProps & import('react').RefAttributes<HTMLInputElement>>;

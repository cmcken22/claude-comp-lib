import { InputHTMLAttributes, ReactNode } from 'react';
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value'> {
    value: string;
    /** Visible label. If omitted, pass `aria-label`. */
    label?: ReactNode;
    /** Secondary text below the label. */
    description?: ReactNode;
}
/** A radio button. Use inside <RadioGroup>, which manages name, value and state. */
export declare const Radio: import('react').ForwardRefExoticComponent<RadioProps & import('react').RefAttributes<HTMLInputElement>>;

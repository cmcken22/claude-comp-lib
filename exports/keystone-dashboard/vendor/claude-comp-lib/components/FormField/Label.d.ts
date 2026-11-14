import { LabelHTMLAttributes } from 'react';
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    /** Shows a visual required indicator. Pair with `required` on the control. */
    required?: boolean;
}
export declare const Label: import('react').ForwardRefExoticComponent<LabelProps & import('react').RefAttributes<HTMLLabelElement>>;

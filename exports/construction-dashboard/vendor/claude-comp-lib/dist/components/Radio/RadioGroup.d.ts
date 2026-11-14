import { FieldsetHTMLAttributes, ReactNode } from 'react';
export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'> {
    /** Group label, rendered as the fieldset legend. */
    label: ReactNode;
    /** Shared input name. Generated when omitted. */
    name?: string;
    /** Selected value (controlled). */
    value?: string;
    /** Initially selected value (uncontrolled). */
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    orientation?: 'vertical' | 'horizontal';
    required?: boolean;
    hint?: ReactNode;
    error?: ReactNode;
    children: ReactNode;
}
export declare function RadioGroup({ label, name, value, defaultValue, onValueChange, orientation, required, disabled, hint, error, className, children, ...rest }: RadioGroupProps): import("react").JSX.Element;

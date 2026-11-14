import { ReactNode } from 'react';
export interface FormFieldProps {
    /** Visible label for the control. */
    label: ReactNode;
    /** Help text shown below the control. */
    hint?: ReactNode;
    /** Error text. When present, the control is marked invalid. */
    error?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    /** Id for the control. Generated when omitted. */
    id?: string;
    className?: string;
    /** A single form control, e.g. <Input />, <TextArea /> or <Select />. */
    children: ReactNode;
}
/**
 * Wraps a control with a label, hint and error message, and wires up
 * `id`, `aria-describedby`, `aria-invalid`, `required` and `disabled`.
 */
export declare function FormField({ label, hint, error, required, disabled, id, className, children, }: FormFieldProps): import("react").JSX.Element;

export interface FormFieldContextValue {
    controlId: string;
    hintId?: string;
    errorId?: string;
    invalid: boolean;
    required: boolean;
    disabled: boolean;
}
export declare const FormFieldContext: import('react').Context<FormFieldContextValue | null>;
interface ControlProps {
    id?: string;
    describedBy?: string;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
}
/**
 * Lets a control pick up id, ARIA wiring and state from a surrounding
 * <FormField>, while still allowing explicit props to win.
 */
export declare function useFormFieldControl(props: ControlProps): {
    id: string | undefined;
    describedBy: string | undefined;
    invalid: boolean;
    required: boolean | undefined;
    disabled: boolean | undefined;
};
export {};

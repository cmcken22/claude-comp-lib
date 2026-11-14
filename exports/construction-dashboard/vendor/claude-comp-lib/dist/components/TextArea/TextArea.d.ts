import { TextareaHTMLAttributes } from 'react';
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Marks the textarea as invalid. Inferred from a parent FormField's `error`. */
    invalid?: boolean;
    /** Which directions the user can resize. */
    resize?: 'none' | 'vertical' | 'both';
}
export declare const TextArea: import('react').ForwardRefExoticComponent<TextAreaProps & import('react').RefAttributes<HTMLTextAreaElement>>;

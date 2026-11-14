import { InputHTMLAttributes, ReactNode } from 'react';
import { ControlSize } from '../../utils/types';
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: ControlSize;
    /** Marks the input as invalid. Inferred from a parent FormField's `error`. */
    invalid?: boolean;
    /** Content (usually an icon or unit) rendered inside, before the text. */
    startAdornment?: ReactNode;
    /** Content rendered inside, after the text. */
    endAdornment?: ReactNode;
    /** Class name for the outer wrapper. */
    className?: string;
}
export declare const Input: import('react').ForwardRefExoticComponent<InputProps & import('react').RefAttributes<HTMLInputElement>>;

import { SelectHTMLAttributes } from 'react';
import { ControlSize } from '../../utils/types';
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    size?: ControlSize;
    /** Marks the select as invalid. Inferred from a parent FormField's `error`. */
    invalid?: boolean;
    /** Text shown before the user picks an option. */
    placeholder?: string;
    /** Class name for the outer wrapper. */
    className?: string;
}
/** A styled native <select>. Pass <option> and <optgroup> elements as children. */
export declare const Select: import('react').ForwardRefExoticComponent<SelectProps & import('react').RefAttributes<HTMLSelectElement>>;

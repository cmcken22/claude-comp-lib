import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ControlSize } from '../../utils/types';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual emphasis. */
    variant?: ButtonVariant;
    size?: ControlSize;
    /** Shows a spinner and disables interaction. */
    loading?: boolean;
    /** Stretch to fill the container width. */
    fullWidth?: boolean;
    /** Icon rendered before the label. */
    startIcon?: ReactNode;
    /** Icon rendered after the label. */
    endIcon?: ReactNode;
}
export declare const Button: import('react').ForwardRefExoticComponent<ButtonProps & import('react').RefAttributes<HTMLButtonElement>>;

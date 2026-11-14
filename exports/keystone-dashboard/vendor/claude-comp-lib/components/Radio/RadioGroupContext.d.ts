export interface RadioGroupContextValue {
    name: string;
    value: string | undefined;
    disabled?: boolean;
    required?: boolean;
    invalid: boolean;
    select: (value: string) => void;
}
export declare const RadioGroupContext: import('react').Context<RadioGroupContextValue | null>;

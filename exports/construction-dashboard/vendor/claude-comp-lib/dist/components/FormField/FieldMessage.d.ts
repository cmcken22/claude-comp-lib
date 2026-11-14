import { ReactNode } from 'react';
interface FieldMessageProps {
    id: string;
    tone: 'hint' | 'error';
    children: ReactNode;
}
/** Hint or error text below a control. Internal, shared by FormField and RadioGroup. */
export declare function FieldMessage({ id, tone, children }: FieldMessageProps): import("react").JSX.Element;
export {};

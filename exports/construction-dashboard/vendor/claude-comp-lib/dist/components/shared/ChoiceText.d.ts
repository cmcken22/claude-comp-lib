import { ReactNode } from 'react';
interface ChoiceTextProps {
    htmlFor: string;
    label?: ReactNode;
    description?: ReactNode;
    descriptionId?: string;
}
/** Label + description shown next to a checkbox, radio or switch. Internal. */
export declare function ChoiceText({ htmlFor, label, description, descriptionId }: ChoiceTextProps): import("react").JSX.Element | null;
export declare function joinIds(...ids: Array<string | undefined | false>): string | undefined;
export {};

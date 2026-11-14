interface Options<T> {
    value?: T;
    defaultValue: T;
    onChange?: (value: T) => void;
}
/** Supports both controlled (`value`) and uncontrolled (`defaultValue`) usage. */
export declare function useControllableState<T>({ value, defaultValue, onChange }: Options<T>): readonly [T, (next: T) => void];
export {};

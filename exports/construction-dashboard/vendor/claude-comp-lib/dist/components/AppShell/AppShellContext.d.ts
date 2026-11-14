export interface AppShellContextValue {
    /** Id of the sidebar element, for `aria-controls`. */
    sidebarId: string;
    /** Whether the sidebar drawer is open (only meaningful below the `lg` breakpoint). */
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}
export declare const AppShellContext: import('react').Context<AppShellContextValue | null>;
/** Read the surrounding AppShell's sidebar state. Returns null outside an AppShell. */
export declare function useAppShell(): AppShellContextValue | null;

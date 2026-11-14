import { createContext, useContext } from 'react';

export interface AppShellContextValue {
  /** Id of the sidebar element, for `aria-controls`. */
  sidebarId: string;
  /** Whether the sidebar drawer is open (only meaningful below the `lg` breakpoint). */
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const AppShellContext = createContext<AppShellContextValue | null>(null);

/** Read the surrounding AppShell's sidebar state. Returns null outside an AppShell. */
export function useAppShell() {
  return useContext(AppShellContext);
}

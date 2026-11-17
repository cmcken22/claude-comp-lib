import { createContext, useContext } from 'react';
import type { ScheduleAController } from './useScheduleA';

export const ScheduleAContext = createContext<ScheduleAController | null>(null);

/** Access the Schedule A workspace controller from any step or panel. */
export function useSA() {
  const ctx = useContext(ScheduleAContext);
  if (!ctx) throw new Error('useSA must be used inside <ScheduleAContext.Provider>');
  return ctx;
}

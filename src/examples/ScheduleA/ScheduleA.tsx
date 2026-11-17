import { AppShell } from './components/AppShell';
import { Workbench } from './components/Workbench';
import { CURRENT_USER } from './data/project';
import { ScheduleAContext } from './hooks/context';
import { useScheduleA, type ScheduleAOptions } from './hooks/useScheduleA';
import './ScheduleA.scss';

export type ScheduleAProps = ScheduleAOptions;

/**
 * Gate Three · Schedule A scope-of-work prototype: build a structured scope, compare it with
 * reference documents using two (simulated) review agents, resolve findings, and export.
 */
export function ScheduleA(props: ScheduleAProps) {
  const controller = useScheduleA(props);
  const { meta } = controller.ws;

  return (
    <ScheduleAContext.Provider value={controller}>
      <AppShell projectName={meta.projectName} projectNumber={meta.projectNumber} userName={CURRENT_USER.name} activeNavId="contracts-schedule-a">
        <Workbench />
      </AppShell>
    </ScheduleAContext.Provider>
  );
}

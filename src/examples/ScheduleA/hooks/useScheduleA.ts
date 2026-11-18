import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { AGENTS, RUN_DURATION, sectionName } from '../config';
import { CURRENT_USER, referenceDocs, TODAY } from '../data/project';
import { blankWorkspace, initialWorkspaces } from '../data/workspaces';
import { newId } from '../lib/scope';
import type { AgentId, ScopeMeta, StepId } from '../types';
import { useAutosave } from './useAutosave';
import { useToasts } from './useToasts';
import { useUiState, type Dialog } from './useUiState';
import { storeReducer, type Action } from './workspaceReducer';

export interface ScheduleAOptions {
  /** 'start' opens on the project's scope list; a step opens the demo draft at that step. */
  initialStep?: StepId | 'start';
  initialDialog?: Dialog;
  /** Start on a brand-new, empty scope. */
  startNew?: boolean;
}

const NEW_SCOPE: ScopeMeta = {
  id: 'sa-21',
  code: 'SA-2417-21',
  title: 'Schedule A — Fire Protection Scope of Work',
  description: '',
  projectName: 'Harbourview Medical Centre — Phase 2',
  projectNumber: '2417',
  projectType: 'Healthcare · Occupied hospital expansion',
  requisition: '',
  subcontractor: '',
  trade: 'Fire Protection',
  divisions: ['21 — Fire Suppression'],
  status: 'Draft',
  owner: CURRENT_USER.name,
  updatedAt: TODAY,
  tags: ['Fire Protection', 'Div 21'],
};

/** All state and actions for the Schedule A workspace. Components reach it through useSA(). */
export function useScheduleA({ initialStep = 'start', initialDialog = null, startNew = false }: ScheduleAOptions = {}) {
  const [store, dispatch] = useReducer(storeReducer, undefined, () => {
    const workspaces = initialWorkspaces();
    if (startNew) workspaces[NEW_SCOPE.id] = blankWorkspace(NEW_SCOPE);
    return { workspaces, activeId: startNew ? NEW_SCOPE.id : 'sa-23' };
  });
  const ui = useUiState(initialStep, initialDialog);
  const toast = useToasts();
  const ws = store.workspaces[store.activeId];
  const saveState = useAutosave(ws.revision);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const createScope = useCallback((meta: Partial<ScopeMeta> = {}) => {
    const id = `sa-${Date.now().toString(36)}`;
    dispatch({ type: 'create', meta: { ...NEW_SCOPE, ...meta, id, updatedAt: TODAY } });
    ui.setLanding(false);
    ui.setStep('details');
    ui.openFinding(null);
  }, [ui]);

  const runAgent = useCallback((agent: AgentId) => {
    const docs = referenceDocs.filter((d) => ws.selectedDocIds.includes(d.id));
    const missing = agent === 'language'
      ? !docs.some((d) => d.type === 'Standard contract schedule')
      : !docs.some((d) => d.type === 'Historical scope' || d.type === 'Change-order records');
    dispatch({ type: 'runStart', agent });
    timers.current.push(window.setTimeout(() => {
      if (missing) {
        const need = agent === 'language' ? 'a standard contract schedule' : 'a historical scope or change-order register';
        dispatch({ type: 'runFail', agent, error: `Select ${need} in Reference Documents, then run again.` });
        return;
      }
      dispatch({ type: 'runDone', agent });
      toast.push(`${AGENTS[agent].name} finished. Review the recommendations before accepting.`, 'info');
    }, missing ? 900 : RUN_DURATION));
  }, [ws.selectedDocIds, toast]);

  const insertSuggestion = useCallback((findingId: string) => {
    const finding = ws.findings.find((f) => f.id === findingId);
    if (!finding) return;
    const itemId = newId('i');
    dispatch({ type: 'insertSuggestion', id: findingId, itemId });
    ui.setEditingItemId(itemId);
    ui.jumpTo(finding.sectionKey, itemId);
    toast.push(`Recommended language inserted in ${sectionName(finding.sectionKey)}. Review and edit before resolving.`);
  }, [ws.findings, ui, toast]);

  const can = useMemo(() => ({
    edit: ui.role !== 'follower',
    export: ui.role !== 'follower',
    manageVersions: ui.role === 'admin',
  }), [ui.role]);

  return {
    ws,
    register: Object.values(store.workspaces),
    activeId: store.activeId,
    dispatch: dispatch as (a: Action) => void,
    ui,
    can,
    saveState,
    toast,
    createScope,
    runAgent,
    insertSuggestion,
    /** Reopen a scope issued for tender as a draft revision (e.g. after tender questions or award). */
    reviseScope: (id: string) => {
      dispatch({ type: 'open', id });
      dispatch({ type: 'meta', patch: { status: 'Draft' } });
      ui.openFinding(null);
      ui.setLanding(false);
      ui.setStep('editor');
      toast.push('Revision started. Your changes will be saved as the next version.', 'info');
    },
    /** Choose a scope, then pick its requisition in the Attach dialog. */
    attachScope: (id: string) => {
      dispatch({ type: 'open', id });
      ui.setDialog('attach');
    },
    openScope: (id: string) => { dispatch({ type: 'open', id }); ui.openFinding(null); ui.setLanding(false); ui.setStep('editor'); },
  };
}

export type ScheduleAController = ReturnType<typeof useScheduleA>;

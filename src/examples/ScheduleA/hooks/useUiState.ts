import { useCallback, useState } from 'react';
import type { Role, StepId } from '../types';

export type Dialog = null | 'export' | 'versions' | 'newScope' | 'library' | 'createVersion';

export interface Highlight {
  sectionKey: string;
  itemId?: string;
  /** Changes on every jump so the same target can be jumped to twice. */
  nonce: number;
}

/** View state that is not part of the scope document itself. */
export function useUiState(initialStep: StepId, initialDialog: Dialog) {
  const [step, setStep] = useState<StepId>(initialStep);
  const [role, setRole] = useState<Role>('admin');
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const [librarySectionKey, setLibrarySectionKey] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [highlight, setHighlight] = useState<Highlight | null>(null);

  const jumpTo = useCallback((sectionKey: string, itemId?: string) => {
    setStep('editor');
    setPanelOpen(false);
    setHighlight({ sectionKey, itemId, nonce: Date.now() });
  }, []);

  const openLibrary = useCallback((sectionKey: string | null) => {
    setLibrarySectionKey(sectionKey);
    setDialog('library');
  }, []);

  const openFinding = useCallback((id: string | null) => {
    setSelectedFindingId(id);
    if (id) setPanelCollapsed(false);
  }, []);

  return {
    step, setStep,
    role, setRole,
    dialog, setDialog,
    librarySectionKey, openLibrary,
    editingItemId, setEditingItemId,
    selectedFindingId, openFinding,
    panelOpen, setPanelOpen,
    panelCollapsed, setPanelCollapsed,
    highlight, jumpTo,
  };
}

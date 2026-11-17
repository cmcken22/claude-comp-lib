import { CURRENT_USER, TODAY } from '../data/project';
import { templateSections } from '../data/sections';
import { blankWorkspace } from '../data/workspaces';
import { runAgent } from '../lib/agents';
import { cloneSections, insertSection, move, newId, updateSection } from '../lib/scope';
import type { AgentId, FindingStatus, Note, ScopeItem, ScopeMeta, Workspace } from '../types';

export interface StoreState {
  workspaces: Record<string, Workspace>;
  activeId: string;
}

export type Action =
  | { type: 'open'; id: string }
  | { type: 'create'; meta: ScopeMeta }
  | { type: 'meta'; patch: Partial<ScopeMeta> }
  | { type: 'addSection'; key: string }
  | { type: 'deleteSection'; sectionId: string }
  | { type: 'moveSection'; sectionId: string; dir: -1 | 1 }
  | { type: 'addItem'; sectionId: string; item: ScopeItem }
  | { type: 'addItemToKey'; sectionKey: string; item: ScopeItem }
  | { type: 'updateItem'; sectionId: string; itemId: string; patch: Partial<ScopeItem> }
  | { type: 'deleteItem'; sectionId: string; itemId: string }
  | { type: 'duplicateItem'; sectionId: string; itemId: string; newId: string }
  | { type: 'moveItem'; sectionId: string; itemId: string; dir: -1 | 1 }
  | { type: 'starter'; kind: 'template' | 'blank' }
  | { type: 'toggleDoc'; id: string }
  | { type: 'setDocs'; ids: string[] }
  | { type: 'runStart'; agent: AgentId }
  | { type: 'runDone'; agent: AgentId }
  | { type: 'runFail'; agent: AgentId; error: string }
  | { type: 'findingStatus'; id: string; status: FindingStatus }
  | { type: 'note'; id: string; note: Note }
  | { type: 'insertSuggestion'; id: string; itemId: string }
  | { type: 'createVersion'; summary: string }
  | { type: 'restoreVersion'; versionId: string };

const nextLabel = (label: string) => {
  const [major, minor] = label.replace('v', '').split('.').map(Number);
  return `v${major}.${minor + 1}`;
};

/** Content edits bump the revision, which drives autosave and outdated agent runs. */
const edited = (ws: Workspace, patch: Partial<Workspace>): Workspace => ({
  ...ws,
  ...patch,
  revision: ws.revision + 1,
  meta: { ...ws.meta, ...(patch.meta ?? {}), updatedAt: TODAY },
});

function workspaceReducer(ws: Workspace, a: Action): Workspace {
  const { sections } = ws;
  switch (a.type) {
    case 'meta':
      return edited(ws, { meta: { ...ws.meta, ...a.patch } });
    case 'addSection':
      return edited(ws, { sections: insertSection(sections, a.key) });
    case 'deleteSection':
      return edited(ws, { sections: sections.filter((s) => s.id !== a.sectionId) });
    case 'moveSection':
      return edited(ws, { sections: move(sections, sections.findIndex((s) => s.id === a.sectionId), a.dir) });
    case 'addItem':
      return edited(ws, { sections: updateSection(sections, a.sectionId, (items) => [...items, a.item]) });
    case 'addItemToKey': {
      const withSection = insertSection(sections, a.sectionKey);
      const target = withSection.find((s) => s.key === a.sectionKey)!;
      return edited(ws, { sections: updateSection(withSection, target.id, (items) => [...items, a.item]) });
    }
    case 'updateItem':
      return edited(ws, { sections: updateSection(sections, a.sectionId, (items) => items.map((i) => (i.id === a.itemId ? { ...i, ...a.patch } : i))) });
    case 'deleteItem':
      return edited(ws, { sections: updateSection(sections, a.sectionId, (items) => items.filter((i) => i.id !== a.itemId)) });
    case 'duplicateItem':
      return edited(ws, {
        sections: updateSection(sections, a.sectionId, (items) => {
          const at = items.findIndex((i) => i.id === a.itemId);
          return [...items.slice(0, at + 1), { ...items[at], id: a.newId, origin: undefined }, ...items.slice(at + 1)];
        }),
      });
    case 'moveItem':
      return edited(ws, { sections: updateSection(sections, a.sectionId, (items) => move(items, items.findIndex((i) => i.id === a.itemId), a.dir)) });
    case 'starter':
      return edited(ws, { sections: a.kind === 'template' ? cloneSections(templateSections).map((s) => ({ ...s, items: s.items.map((i) => ({ ...i, id: newId('i'), origin: { type: 'historical' as const, ref: 'Schedule A Template Rev 7' } })) })) : insertSection(insertSection([], 'general'), 'exclusions') });
    case 'toggleDoc':
      return { ...ws, selectedDocIds: ws.selectedDocIds.includes(a.id) ? ws.selectedDocIds.filter((d) => d !== a.id) : [...ws.selectedDocIds, a.id] };
    case 'setDocs':
      return { ...ws, selectedDocIds: a.ids };
    case 'runStart':
      return { ...ws, runs: { ...ws.runs, [a.agent]: { ...ws.runs[a.agent], status: 'running', error: undefined } } };
    case 'runFail':
      return { ...ws, runs: { ...ws.runs, [a.agent]: { ...ws.runs[a.agent], status: 'failed', error: a.error } } };
    case 'runDone': {
      const fresh = runAgent(ws, a.agent, a.agent === 'language' ? 'Language Review Agent' : 'Historical Scope Gap Agent', TODAY);
      return {
        ...ws,
        findings: [...ws.findings.filter((f) => f.agent !== a.agent), ...fresh],
        runs: { ...ws.runs, [a.agent]: { status: 'complete', at: TODAY, revision: ws.revision, findingCount: fresh.length } },
      };
    }
    case 'findingStatus':
      return { ...ws, findings: ws.findings.map((f) => (f.id === a.id ? { ...f, status: a.status, statusBy: CURRENT_USER.name, statusAt: TODAY } : f)) };
    case 'note':
      return { ...ws, findings: ws.findings.map((f) => (f.id === a.id ? { ...f, notes: [...f.notes, a.note] } : f)) };
    case 'insertSuggestion': {
      const finding = ws.findings.find((f) => f.id === a.id);
      if (!finding?.suggested) return ws;
      const withSection = insertSection(sections, finding.sectionKey);
      const target = withSection.find((s) => s.key === finding.sectionKey)!;
      const item: ScopeItem = { id: a.itemId, text: finding.suggested.text, kind: finding.suggested.kind, critical: finding.severity === 'critical', tags: [], origin: { type: 'ai', ref: finding.id } };
      const next = edited(ws, { sections: updateSection(withSection, target.id, (items) => [...items, item]) });
      return { ...next, findings: ws.findings.map((f) => (f.id === a.id ? { ...f, insertedItemId: a.itemId } : f)) };
    }
    case 'createVersion': {
      const label = ws.versions.length ? nextLabel(ws.currentVersion) : ws.currentVersion;
      const version = { id: newId('v'), label, author: CURRENT_USER.name, at: TODAY, summary: a.summary, sections: cloneSections(sections) };
      return { ...ws, versions: [version, ...ws.versions], currentVersion: label, versionRevision: ws.revision };
    }
    case 'restoreVersion': {
      const source = ws.versions.find((v) => v.id === a.versionId);
      if (!source) return ws;
      const label = nextLabel(ws.currentVersion);
      const restored = edited(ws, { sections: cloneSections(source.sections) });
      const version = { id: newId('v'), label, author: CURRENT_USER.name, at: TODAY, summary: `Restored from ${source.label}.`, sections: cloneSections(source.sections) };
      return { ...restored, versions: [version, ...ws.versions], currentVersion: label, versionRevision: restored.revision };
    }
    default:
      return ws;
  }
}

export function storeReducer(state: StoreState, a: Action): StoreState {
  if (a.type === 'open') return { ...state, activeId: a.id };
  if (a.type === 'create') return { workspaces: { ...state.workspaces, [a.meta.id]: blankWorkspace(a.meta) }, activeId: a.meta.id };
  const ws = state.workspaces[state.activeId];
  return { ...state, workspaces: { ...state.workspaces, [state.activeId]: workspaceReducer(ws, a) } };
}

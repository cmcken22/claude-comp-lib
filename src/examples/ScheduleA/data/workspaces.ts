import { cloneSections } from '../lib/scope';
import type { ScopeMeta, ScopeSection, Version, Workspace } from '../types';
import { gapFindings, languageFindings } from './findings';
import { DEFAULT_DOC_IDS, scopeRegister } from './project';
import { electricalSections, mechanicalSections, templateSections } from './sections';

const without = (sections: ScopeSection[], keys: string[]) => cloneSections(sections.filter((s) => !keys.includes(s.key)));

const mechanicalVersions: Version[] = [
  { id: 'v3', label: 'v0.3', author: 'Marcus Lee', at: '2026-11-12T16:22', summary: 'Incorporated estimating comments and bid clarifications 1–9.', sections: without(mechanicalSections, []) },
  { id: 'v2', label: 'v0.2', author: 'Kai Moreno', at: '2026-11-06T11:10', summary: 'Added Coordination and Testing and Commissioning sections.', sections: without(mechanicalSections, ['safety']) },
  { id: 'v1', label: 'v0.1', author: 'Priya Raman', at: '2026-11-02T09:05', summary: 'Created from Schedule A Template — Mechanical Rev 7.', sections: without(mechanicalSections, ['coordination', 'testing', 'safety']) },
];

export function blankWorkspace(meta: ScopeMeta): Workspace {
  return {
    meta,
    sections: [],
    findings: [],
    runs: { language: { status: 'idle' }, gap: { status: 'idle' } },
    selectedDocIds: [...DEFAULT_DOC_IDS],
    versions: [],
    currentVersion: 'v0.1',
    revision: 0,
    versionRevision: -1,
    confirmed: [],
  };
}

export function initialWorkspaces(): Record<string, Workspace> {
  const [mech, elec, plumb] = scopeRegister;
  return {
    [mech.id]: {
      meta: { ...mech },
      sections: cloneSections(mechanicalSections),
      findings: [...languageFindings, ...gapFindings].map((f) => ({ ...f, notes: [...f.notes] })),
      runs: {
        language: { status: 'complete', at: '2026-11-17T09:42', revision: 0, findingCount: languageFindings.length },
        gap: { status: 'complete', at: '2026-11-17T09:44', revision: 0, findingCount: gapFindings.length },
      },
      selectedDocIds: [...DEFAULT_DOC_IDS],
      versions: mechanicalVersions,
      currentVersion: 'v0.3',
      revision: 0,
      versionRevision: -1,
      confirmed: ['details', 'references'],
    },
    [elec.id]: {
      ...blankWorkspace({ ...elec }),
      sections: cloneSections(electricalSections),
      versions: [
        { id: 'e2', label: 'v1.2', author: 'Priya Raman', at: '2026-11-14T09:20', summary: 'Sent to Legal for review.', sections: cloneSections(electricalSections) },
      ],
      currentVersion: 'v1.2',
      versionRevision: 0,
      confirmed: ['details', 'references'],
    },
    [plumb.id]: {
      ...blankWorkspace({ ...plumb }),
      sections: cloneSections(templateSections),
      currentVersion: 'v2.0',
      versionRevision: 0,
      confirmed: ['details', 'references', 'export'],
    },
  };
}

// Deterministic stand-ins for the two review agents. No AI is called: findings are
// predefined for the demo scope and rule-based for any other scope.
import { gapFindings, languageFindings } from '../data/findings';
import type { AgentId, Finding, ScopeSection, Workspace } from '../types';
import { countItems } from './scope';

const textIn = (sections: ScopeSection[], key: string | null, needle: string) =>
  sections
    .filter((s) => key === null || s.key === key)
    .some((s) => s.items.some((i) => i.text.toLowerCase().includes(needle)));

/** A finding whose condition no longer holds in the draft is closed by the rerun. */
const stillApplies: Record<string, (sections: ScopeSection[]) => boolean> = {
  'LR-01': (s) => textIn(s, 'exclusions', 'fire damper'),
  'LR-03': (s) => textIn(s, 'closeout', 'one (1) year'),
  'HG-01': (s) => !textIn(s, null, 'seismic'),
  'HG-02': (s) => !textIn(s, null, 'temporary heat'),
};

function ruleBasedLanguage(sections: ScopeSection[]): Finding[] {
  const out: Finding[] = [];
  const base = { agent: 'language' as const, status: 'open' as const, notes: [] };
  if (!sections.some((s) => s.key === 'exclusions' && s.items.length)) {
    out.push({ ...base, id: 'LR-R1', title: 'Exclusions are not defined', severity: 'high', sectionKey: 'exclusions', explanation: 'The draft has no exclusions. Unstated exclusions are interpreted against the drafter in a dispute.', source: 'Schedule A Template Rev 7, clause G-12', recommendation: 'List work excluded from this subcontract and who performs it.' });
  }
  if (textIn(sections, null, 'as required')) {
    out.push({ ...base, id: 'LR-R2', title: '“As required” language is non-specific', severity: 'low', sectionKey: sections[0]?.key ?? 'general', explanation: 'One or more clauses use “as required” without defining the requirement.', source: 'Draft language', recommendation: 'Reference the specification section or quantity instead.' });
  }
  if (countItems(sections) < 5) {
    out.push({ ...base, id: 'LR-R3', title: 'Scope is thin compared with the template', severity: 'medium', sectionKey: 'general', explanation: 'The draft has fewer than five clauses. Comparable Schedule A documents average 24.', source: 'Schedule A Template Rev 7', recommendation: 'Review template sections for Labour, Materials, Installation and Testing.' });
  }
  return out;
}

export function runAgent(ws: Workspace, agent: AgentId, by: string, at: string): Finding[] {
  const isDemo = ws.meta.id === 'sa-23';
  const fresh = isDemo ? (agent === 'language' ? languageFindings : gapFindings.slice(0, 5)) : agent === 'language' ? ruleBasedLanguage(ws.sections) : gapFindings.slice(0, 2);
  const previous = new Map(ws.findings.map((f) => [f.id, f]));

  return fresh.map((f) => {
    const prev = previous.get(f.id);
    const merged: Finding = prev ? { ...f, status: prev.status, notes: prev.notes, statusBy: prev.statusBy, statusAt: prev.statusAt, insertedItemId: prev.insertedItemId } : { ...f, status: 'open', notes: [], statusBy: undefined, statusAt: undefined };
    const inserted = merged.insertedItemId && ws.sections.some((s) => s.items.some((i) => i.id === merged.insertedItemId));
    const check = stillApplies[f.id];
    if (merged.status === 'open' && (inserted || (check && !check(ws.sections)))) {
      return { ...merged, status: 'resolved', statusBy: by, statusAt: at, notes: [...merged.notes, { id: `auto-${f.id}`, author: by, at, text: 'No longer detected in the current draft.' }] };
    }
    return merged;
  });
}

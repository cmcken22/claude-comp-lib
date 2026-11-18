import type { BadgeColor } from '../../components/Badge';
import type { AgentId, DocType, FindingStatus, ItemKind, Role, ScopeStatus, Severity, StepId } from './types';

/** Reference documents come before the editor so they can be open while the scope is written. */
export const STEPS: { id: StepId; label: string }[] = [
  { id: 'details', label: 'Scope Details' },
  { id: 'references', label: 'Reference Documents' },
  { id: 'editor', label: 'Scope Editor' },
  { id: 'review', label: 'AI Review' },
  { id: 'export', label: 'Finalize and Export' },
];

/** Suggested sections, in Schedule A order. */
export const SECTION_CATALOG: { key: string; name: string }[] = [
  { key: 'general', name: 'General Requirements' },
  { key: 'labour', name: 'Labour' },
  { key: 'materials', name: 'Materials' },
  { key: 'equipment', name: 'Equipment' },
  { key: 'installation', name: 'Installation' },
  { key: 'coordination', name: 'Coordination' },
  { key: 'testing', name: 'Testing and Commissioning' },
  { key: 'closeout', name: 'Closeout and Documentation' },
  { key: 'safety', name: 'Safety and Compliance' },
  { key: 'exclusions', name: 'Exclusions' },
  { key: 'clarifications', name: 'Clarifications' },
];

export const sectionName = (key: string) => SECTION_CATALOG.find((s) => s.key === key)?.name ?? key;

export const SEVERITY: Record<Severity, { label: string; color: BadgeColor; rank: number }> = {
  critical: { label: 'Critical', color: 'red', rank: 0 },
  high: { label: 'High', color: 'orange', rank: 1 },
  medium: { label: 'Medium', color: 'yellow', rank: 2 },
  low: { label: 'Low', color: 'neutral', rank: 3 },
};

export const FINDING_STATUS: Record<FindingStatus, { label: string; color: BadgeColor }> = {
  open: { label: 'Open', color: 'blue' },
  accepted: { label: 'Accepted', color: 'purple' },
  resolved: { label: 'Resolved', color: 'green' },
  dismissed: { label: 'Dismissed', color: 'neutral' },
};

export const ITEM_KIND: Record<ItemKind, { label: string; color: BadgeColor }> = {
  inclusion: { label: 'Inclusion', color: 'jade' },
  exclusion: { label: 'Exclusion', color: 'pink' },
  clarification: { label: 'Clarification', color: 'sky' },
};

export const SCOPE_STATUS: Record<ScopeStatus, BadgeColor> = {
  'Not started': 'neutral',
  Draft: 'yellow',
  'In review': 'blue',
  'Issued for tender': 'purple',
  Attached: 'green',
};

export const AGENTS: Record<AgentId, { name: string; short: string; description: string; checks: string[]; stages: string[] }> = {
  language: {
    name: 'Language Review Agent',
    short: 'Language',
    description: 'Checks the draft against standard contract schedules and itself.',
    checks: ['Contradictions within the draft', 'Overlap with standard contract language', 'Missing or unclear responsibilities', 'Conflicting inclusions and exclusions'],
    stages: ['Reading reference schedules', 'Parsing scope clauses', 'Cross-checking inclusions and exclusions', 'Ranking findings'],
  },
  gap: {
    name: 'Historical Scope Gap Agent',
    short: 'Historical gaps',
    description: 'Compares the draft with change orders on similar past projects.',
    checks: ['Trade and division', 'Project type', 'Draft scope language', 'Similar historical projects'],
    stages: ['Matching similar projects', 'Scanning change-order records', 'Scoring likely gaps', 'Estimating price ranges'],
  },
};

export const DOC_TYPES: DocType[] = [
  'Standard contract schedule',
  'Schedule A template',
  'Project-specific schedule',
  'Historical scope',
  'Change-order records',
];

export const ROLES: Record<Role, { label: string; summary: string }> = {
  admin: { label: 'Admin', summary: 'Edit, review, export and manage versions' },
  editor: { label: 'Editor', summary: 'Edit, review and export' },
  follower: { label: 'Follower', summary: 'View scope and findings only' },
};

/** Simulated agent run time, in ms. */
export const RUN_DURATION = 2600;

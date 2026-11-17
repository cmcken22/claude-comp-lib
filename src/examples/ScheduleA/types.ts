// Domain types for the Schedule A scope-of-work workspace.

export type Role = 'admin' | 'editor' | 'follower';
export type StepId = 'details' | 'editor' | 'references' | 'review' | 'export';
export type ScopeStatus = 'Not started' | 'Draft' | 'In review' | 'Issued';
export type ItemKind = 'inclusion' | 'exclusion' | 'clarification';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'accepted' | 'resolved' | 'dismissed';
export type AgentId = 'language' | 'gap';
export type RunStatus = 'idle' | 'running' | 'complete' | 'failed';
export type SaveState = 'saved' | 'saving' | 'error';

export interface Person {
  name: string;
  title: string;
}

export interface ScopeMeta {
  id: string;
  code: string;
  title: string;
  description: string;
  projectName: string;
  projectNumber: string;
  projectType: string;
  requisition: string;
  subcontractor: string;
  trade: string;
  division: string;
  status: ScopeStatus;
  owner: string;
  updatedAt: string;
  tags: string[];
}

export interface ScopeItem {
  id: string;
  text: string;
  kind: ItemKind;
  critical: boolean;
  tags: string[];
  /** Where the language came from, when it was not typed from scratch. */
  origin?: { type: 'historical' | 'ai'; ref: string };
}

export interface ScopeSection {
  id: string;
  /** Stable key that review findings point at, e.g. 'exclusions'. */
  key: string;
  name: string;
  items: ScopeItem[];
}

export interface Note {
  id: string;
  author: string;
  at: string;
  text: string;
}

export interface Finding {
  id: string;
  agent: AgentId;
  title: string;
  severity: Severity;
  sectionKey: string;
  explanation: string;
  source: string;
  recommendation: string;
  suggested?: { text: string; kind: ItemKind };
  status: FindingStatus;
  notes: Note[];
  statusBy?: string;
  statusAt?: string;
  insertedItemId?: string;
  /** Historical gap agent only. */
  confidence?: number;
  evidence?: string[];
  priceLow?: number;
  priceHigh?: number;
}

export interface AgentRun {
  status: RunStatus;
  at?: string;
  /** Workspace revision the run was made against; older than the current one means outdated. */
  revision?: number;
  findingCount?: number;
  error?: string;
}

export interface ReferenceDoc {
  id: string;
  name: string;
  type: DocType;
  source: 'Gate Three' | 'Uploaded';
  date: string;
  detail: string;
  agents: AgentId[];
}

export type DocType =
  | 'Standard contract schedule'
  | 'Schedule A template'
  | 'Project-specific schedule'
  | 'Historical scope'
  | 'Change-order records';

export interface Version {
  id: string;
  label: string;
  author: string;
  at: string;
  summary: string;
  sections: ScopeSection[];
}

export interface HistoricalClause {
  id: string;
  sectionKey: string;
  text: string;
  kind: ItemKind;
  project: string;
  year: number;
  uses: number;
}

export interface Workspace {
  meta: ScopeMeta;
  sections: ScopeSection[];
  findings: Finding[];
  runs: Record<AgentId, AgentRun>;
  selectedDocIds: string[];
  versions: Version[];
  currentVersion: string;
  /** Increments on every content edit; used for save state and outdated agent runs. */
  revision: number;
  /** Revision captured by the latest saved version. */
  versionRevision: number;
  /** Steps the user has explicitly confirmed (details, references) or finished (export). */
  confirmed: StepId[];
}

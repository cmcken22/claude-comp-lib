import type { HistoricalClause, Person, ReferenceDoc, ScopeMeta } from '../types';

/** Fixed "now" so the prototype renders the same every time. */
export const TODAY = '2026-11-17T14:05';

export const CURRENT_USER: Person = { name: 'Kai Moreno', title: 'Project Manager' };

const PROJECT = {
  projectName: 'Harbourview Medical Centre — Phase 2',
  projectNumber: '2417',
  projectType: 'Healthcare · Occupied hospital expansion',
};

export const scopeRegister: ScopeMeta[] = [
  {
    ...PROJECT,
    id: 'sa-23',
    code: 'SA-2417-23',
    title: 'Schedule A — Mechanical HVAC Scope of Work',
    description:
      'Scope of work for the complete Division 23 HVAC installation for the Phase 2 inpatient tower, including operating rooms, isolation rooms and rooftop equipment.',
    requisition: 'REQ-2417-031 · Mechanical HVAC Subcontract',
    subcontractor: 'Northline Mechanical Ltd.',
    trade: 'Mechanical',
    divisions: ['23 — HVAC', '25 — Integrated Automation'],
    status: 'Draft',
    owner: 'Kai Moreno',
    updatedAt: '2026-11-17T13:48',
    tags: ['Mechanical', 'Div 23', 'Healthcare', 'Occupied site'],
  },
  {
    ...PROJECT,
    id: 'sa-26',
    code: 'SA-2417-26',
    title: 'Schedule A — Electrical Scope of Work',
    description: 'Electrical, communications and fire alarm scope for the Phase 2 tower. Issued to three bidders.',
    requisition: '',
    subcontractor: '',
    trade: 'Electrical',
    divisions: ['26 — Electrical', '27 — Communications', '28 — Electronic Safety and Security'],
    status: 'Issued for tender',
    owner: 'Priya Raman',
    updatedAt: '2026-11-14T09:20',
    tags: ['Electrical', 'Div 26'],
  },
  {
    ...PROJECT,
    id: 'sa-22',
    code: 'SA-2417-22',
    title: 'Schedule A — Plumbing and Medical Gas',
    description: 'Division 22 plumbing, medical gas and drainage scope.',
    requisition: 'REQ-2417-029 · Plumbing Subcontract',
    subcontractor: 'Coastal Plumbing Systems',
    trade: 'Plumbing',
    divisions: ['22 — Plumbing'],
    status: 'Attached',
    owner: 'Marcus Lee',
    updatedAt: '2026-10-28T16:02',
    tags: ['Plumbing', 'Div 22'],
  },
];

export const TRADES = ['Mechanical', 'Electrical', 'Plumbing', 'Fire Protection', 'Controls'];
export const DIVISIONS = [
  '07 — Thermal and Moisture Protection',
  '21 — Fire Suppression',
  '22 — Plumbing',
  '23 — HVAC',
  '25 — Integrated Automation',
  '26 — Electrical',
  '27 — Communications',
  '28 — Electronic Safety and Security',
];

/** Open requisitions in Gate Three that a Schedule A can be attached to. */
export const REQUISITIONS: { id: string; label: string; subcontractor: string; trade: string }[] = [
  { id: 'REQ-2417-031', label: 'REQ-2417-031 · Mechanical HVAC Subcontract', subcontractor: 'Northline Mechanical Ltd.', trade: 'Mechanical' },
  { id: 'REQ-2417-034', label: 'REQ-2417-034 · Electrical Subcontract', subcontractor: 'Brightway Electric Inc.', trade: 'Electrical' },
  { id: 'REQ-2417-036', label: 'REQ-2417-036 · Fire Protection Subcontract', subcontractor: 'Pyroguard Sprinkler Co.', trade: 'Fire Protection' },
  { id: 'REQ-2417-040', label: 'REQ-2417-040 · Building Automation Subcontract', subcontractor: 'Delta Controls Integration', trade: 'Controls' },
];
export const SUBCONTRACTORS = [
  'Northline Mechanical Ltd.',
  'Pyroguard Sprinkler Co.',
  'Brightway Electric Inc.',
  'Delta Controls Integration',
  'Coastal Plumbing Systems',
];

export const referenceDocs: ReferenceDoc[] = [
  { id: 'd1', name: 'CCDC 2 (2020) Supplementary Conditions — Harbourview Ph 2', type: 'Standard contract schedule', source: 'Gate Three', date: '2026-03-04', detail: '42 pages', agents: ['language'] },
  { id: 'd2', name: 'Summit Standard Schedule B — Site Safety and Environmental', type: 'Standard contract schedule', source: 'Gate Three', date: '2026-01-15', detail: '18 pages', agents: ['language'] },
  { id: 'd3', name: 'Summit Standard Schedule C — Insurance and Bonding', type: 'Standard contract schedule', source: 'Gate Three', date: '2026-01-15', detail: '9 pages', agents: ['language'] },
  { id: 'd4', name: 'Schedule A Template — Mechanical (Div 22/23) Rev 7', type: 'Schedule A template', source: 'Gate Three', date: '2025-09-30', detail: '64 clauses', agents: ['language'] },
  { id: 'd5', name: 'Harbourview Ph 2 — Division 01 General Requirements', type: 'Project-specific schedule', source: 'Gate Three', date: '2026-05-12', detail: '56 pages', agents: ['language', 'gap'] },
  { id: 'd6', name: 'Harbourview Ph 2 — Spec Section 23 05 00 Common Work Results', type: 'Project-specific schedule', source: 'Uploaded', date: '2026-06-02', detail: '31 pages', agents: ['language', 'gap'] },
  { id: 'd7', name: 'St. Brendan’s Hospital ICU Expansion — Mechanical Schedule A', type: 'Historical scope', source: 'Gate Three', date: '2023-08-21', detail: '2023 · $8.4M', agents: ['gap'] },
  { id: 'd8', name: 'Lakeshore Long-Term Care — HVAC Schedule A', type: 'Historical scope', source: 'Gate Three', date: '2024-02-09', detail: '2024 · $5.1M', agents: ['gap'] },
  { id: 'd9', name: 'Change Order Register — Healthcare projects 2021–2026', type: 'Change-order records', source: 'Gate Three', date: '2026-11-01', detail: '412 records', agents: ['gap'] },
  { id: 'd10', name: 'Change Order Register — Mechanical subtrade 2019–2026', type: 'Change-order records', source: 'Gate Three', date: '2026-11-01', detail: '1,086 records', agents: ['gap'] },
];

export const DEFAULT_DOC_IDS = ['d1', 'd2', 'd4', 'd5', 'd6', 'd7', 'd9', 'd10'];

export const clauseLibrary: HistoricalClause[] = [
  { id: 'h1', sectionKey: 'general', kind: 'inclusion', project: 'St. Brendan’s ICU', year: 2023, uses: 14, text: 'All work in occupied areas shall be performed behind ICRA Class IV barriers with negative pressure maintained and monitored daily.' },
  { id: 'h2', sectionKey: 'labour', kind: 'inclusion', project: 'Lakeshore LTC', year: 2024, uses: 9, text: 'Include all overtime and shift premiums required to maintain the schedule; no premium time will be paid as an extra.' },
  { id: 'h3', sectionKey: 'materials', kind: 'inclusion', project: 'Riverside Clinic', year: 2022, uses: 11, text: 'Provide attic stock of one complete set of filters for every air-handling unit and fan coil unit at turnover.' },
  { id: 'h4', sectionKey: 'equipment', kind: 'inclusion', project: 'St. Brendan’s ICU', year: 2023, uses: 7, text: 'Include all mobile crane picks, rigging and setting for rooftop equipment, including road closure permits and paid duty officers.' },
  { id: 'h5', sectionKey: 'installation', kind: 'inclusion', project: 'North Depot Expansion', year: 2025, uses: 12, text: 'Provide all sleeves, firestopping and sealing of penetrations through rated and non-rated assemblies for mechanical services.' },
  { id: 'h6', sectionKey: 'coordination', kind: 'inclusion', project: 'Lakeshore LTC', year: 2024, uses: 16, text: 'Provide a dedicated BIM coordinator and resolve all clashes assigned to mechanical within five (5) working days.' },
  { id: 'h7', sectionKey: 'testing', kind: 'inclusion', project: 'St. Brendan’s ICU', year: 2023, uses: 10, text: 'Provide room pressurization certification for all isolation and protective environment rooms, witnessed by the Owner’s infection control representative.' },
  { id: 'h8', sectionKey: 'closeout', kind: 'inclusion', project: 'Riverside Clinic', year: 2022, uses: 13, text: 'Provide eight (8) hours of on-site Owner training per major system, video recorded and delivered with the O&M manuals.' },
  { id: 'h9', sectionKey: 'safety', kind: 'inclusion', project: 'North Depot Expansion', year: 2025, uses: 8, text: 'Submit a confined space entry program and rescue plan before any work in mechanical shafts or plenums.' },
  { id: 'h10', sectionKey: 'exclusions', kind: 'exclusion', project: 'Lakeshore LTC', year: 2024, uses: 18, text: 'Excavation, backfill and concrete encasement for underground mechanical services (by Site Services).' },
  { id: 'h11', sectionKey: 'clarifications', kind: 'clarification', project: 'Riverside Clinic', year: 2022, uses: 6, text: 'Where drawings and specifications conflict, the more stringent requirement governs and is included in this Subcontract.' },
];

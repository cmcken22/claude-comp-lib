// Sample budget data for the construction dashboard example (not exported from the library).

export type Division = 'site' | 'concrete' | 'structural' | 'mep' | 'finishes';
export type LineStatus = 'on-track' | 'at-risk' | 'over-budget' | 'pending' | 'complete';

export interface BudgetLine {
  id: string;
  costCode: string;
  description: string;
  division: Division;
  vendor: string;
  status: LineStatus;
  originalBudget: number;
  approvedChanges: number;
  pendingChanges: number;
  spentToDate: number;
  /** Percent of work complete, 0–100. */
  progress: number;
  /** ISO date the scope is due. */
  dueDate: string;
}

export const DIVISIONS: { id: Division; label: string }[] = [
  { id: 'site', label: 'Site Work' },
  { id: 'concrete', label: 'Concrete' },
  { id: 'structural', label: 'Structural Steel' },
  { id: 'mep', label: 'MEP' },
  { id: 'finishes', label: 'Finishes' },
];

export const STATUS_META: Record<LineStatus, { label: string; color: 'green' | 'orange' | 'red' | 'blue' | 'neutral' }> = {
  'on-track': { label: 'On track', color: 'green' },
  'at-risk': { label: 'At risk', color: 'orange' },
  'over-budget': { label: 'Over budget', color: 'red' },
  pending: { label: 'Pending approval', color: 'blue' },
  complete: { label: 'Complete', color: 'neutral' },
};

type Row = [string, string, Division, string, LineStatus, number, number, number, number, number, string];

// prettier-ignore
const rows: Row[] = [
  ['02-100', 'Site clearing & demolition',      'site',       'Ridgeline Earthworks',   'complete',    185000,      0,     0, 183400, 100, '2026-03-14'],
  ['02-200', 'Excavation & shoring',            'site',       'Ridgeline Earthworks',   'over-budget', 420000,  38000, 12000, 471500,  92, '2026-05-02'],
  ['02-500', 'Underground utilities',           'site',       'Cascade Civil',          'on-track',    265000,   8500,     0, 201300,  78, '2026-12-11'],
  ['02-750', 'Paving & site concrete',          'site',       'Cascade Civil',          'pending',     142000,      0, 18500,  12600,   8, '2027-06-20'],
  ['02-900', 'Landscaping & irrigation',        'site',       'Greenway Landscapes',    'on-track',     96000,      0,     0,   4200,   3, '2027-08-15'],
  ['03-100', 'Foundations & footings',          'concrete',   'Keystone Concrete',      'complete',    610000,  22000,     0, 629800, 100, '2026-06-30'],
  ['03-300', 'Cast-in-place slabs (L1–L12)',    'concrete',   'Keystone Concrete',      'at-risk',     880000,  45000, 26000, 714200,  71, '2027-01-22'],
  ['03-400', 'Precast panels',                  'concrete',   'Northern Precast Co.',   'on-track',    355000,      0,     0, 118000,  30, '2027-03-05'],
  ['03-600', 'Grouting & post-tensioning',      'concrete',   'Keystone Concrete',      'pending',     128000,      0, 14000,  21000,  12, '2027-02-18'],
  ['05-100', 'Structural steel framing',        'structural', 'Ironclad Steel Works',   'at-risk',    1240000,  62000, 40000, 1010500, 76, '2027-01-08'],
  ['05-300', 'Metal decking',                   'structural', 'Ironclad Steel Works',   'on-track',    210000,      0,     0, 132600,  64, '2027-01-29'],
  ['05-500', 'Misc. metals & railings',         'structural', 'Atlas Fabrication',      'on-track',    118000,   4500,     0,  22800,  18, '2027-05-14'],
  ['15-100', 'Plumbing rough-in',               'mep',        'Bluewater Mechanical',   'on-track',    395000,  12000,     0, 188900,  47, '2027-04-02'],
  ['15-500', 'HVAC ductwork & equipment',       'mep',        'Bluewater Mechanical',   'over-budget', 720000,  58000, 31000, 702300,  81, '2027-03-19'],
  ['15-800', 'Fire protection & sprinklers',    'mep',        'Sentinel Fire Systems',  'pending',     248000,      0, 22000,  64500,  24, '2027-04-30'],
  ['16-100', 'Electrical distribution',         'mep',        'Voltline Electric',      'on-track',    530000,  16000,     0, 241700,  45, '2027-04-16'],
  ['16-500', 'Lighting & controls',             'mep',        'Voltline Electric',      'on-track',    214000,      0,     0,  41200,  15, '2027-06-04'],
  ['16-700', 'Low voltage & security',          'mep',        'Signal Systems Inc.',    'at-risk',     166000,   9000,  7500, 118700,  52, '2027-05-21'],
  ['09-200', 'Drywall & framing',               'finishes',   'Summit Interiors',       'on-track',    455000,      0,     0,  68400,  14, '2027-07-09'],
  ['09-300', 'Tile & stone',                    'finishes',   'Artisan Tile & Stone',   'pending',     188000,      0, 16000,      0,   0, '2027-08-27'],
  ['09-600', 'Flooring',                        'finishes',   'Summit Interiors',       'on-track',    176000,      0,     0,      0,   0, '2027-09-10'],
  ['09-900', 'Painting & coatings',             'finishes',   'ProCoat Painting',       'on-track',    132000,      0,     0,      0,   0, '2027-09-24'],
  ['08-400', 'Curtain wall & glazing',          'finishes',   'Clearview Glazing',      'at-risk',     940000,  31000, 22500, 512900,  49, '2027-02-26'],
  ['14-200', 'Elevators',                       'mep',        'Vertex Elevator Co.',    'on-track',    486000,      0,     0, 145800,  25, '2027-07-31'],
];

export const budgetLines: BudgetLine[] = rows.map(
  ([costCode, description, division, vendor, status, originalBudget, approvedChanges, pendingChanges, spentToDate, progress, dueDate]) => ({
    id: costCode,
    costCode,
    description,
    division,
    vendor,
    status,
    originalBudget,
    approvedChanges,
    pendingChanges,
    spentToDate,
    progress,
    dueDate,
  }),
);

export const revisedBudget = (line: BudgetLine) => line.originalBudget + line.approvedChanges;
export const remaining = (line: BudgetLine) => revisedBudget(line) - line.spentToDate;

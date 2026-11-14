// Sample data for the dashboard. Example figures, not real projects.
export type Status = 'On track' | 'At risk' | 'Delayed' | 'Completed';
export type Sector = 'Commercial' | 'Residential' | 'Healthcare' | 'Education' | 'Infrastructure' | 'Industrial';
export type Phase = 'Preconstruction' | 'Site work' | 'Foundation' | 'Structure' | 'MEP rough-in' | 'Interiors' | 'Closeout';

export interface Project {
  id: string;
  name: string;
  client: string;
  city: string;
  sector: Sector;
  phase: Phase;
  status: Status;
  manager: string;
  progress: number; // % complete
  budget: number; // contract value, USD
  forecast: number; // estimate at completion, USD
  due: string; // ISO date, substantial completion
  rfis: number; // open RFIs
  crew: number; // workers on site today
}

export const PHASES: Phase[] = ['Preconstruction', 'Site work', 'Foundation', 'Structure', 'MEP rough-in', 'Interiors', 'Closeout'];
export const STATUSES: Status[] = ['On track', 'At risk', 'Delayed', 'Completed'];
export const SECTORS: Sector[] = ['Commercial', 'Residential', 'Healthcare', 'Education', 'Infrastructure', 'Industrial'];

const p = (
  id: string, name: string, client: string, city: string, sector: Sector, phase: Phase, status: Status,
  manager: string, progress: number, budgetM: number, forecastM: number, due: string, rfis: number, crew: number,
): Project => ({ id, name, client, city, sector, phase, status, manager, progress, budget: budgetM * 1e6, forecast: forecastM * 1e6, due, rfis, crew });

const HANDPICKED: Project[] = [
  p('KB-2401', 'Riverside Medical Pavilion', 'Front Range Health', 'Denver, CO', 'Healthcare', 'MEP rough-in', 'At risk', 'Dana Whitfield', 58, 64.2, 67.9, '2027-06-30', 23, 64),
  p('KB-2403', 'Larimer Street Mixed-Use', 'Halcyon Partners', 'Denver, CO', 'Commercial', 'Structure', 'On track', 'Marcus Lee', 41, 38.5, 38.1, '2027-09-15', 9, 42),
  p('KB-2405', 'Cherry Creek Townhomes Ph. 2', 'Cobalt Living', 'Denver, CO', 'Residential', 'Interiors', 'On track', 'Priya Natarajan', 77, 18.9, 18.6, '2027-02-12', 4, 31),
  p('KB-2406', 'I-25 Frontage Rd Bridge', 'CDOT Region 1', 'Castle Rock, CO', 'Infrastructure', 'Foundation', 'Delayed', 'Tom Okafor', 22, 27.4, 30.8, '2027-11-01', 17, 28),
  p('KB-2408', 'Boulder Valley STEM Academy', 'BVSD', 'Boulder, CO', 'Education', 'Interiors', 'On track', 'Elena Vasquez', 83, 46.0, 45.2, '2027-01-08', 6, 55),
  p('KB-2410', 'Aurora Distribution Center', 'Northgate Logistics', 'Aurora, CO', 'Industrial', 'Structure', 'At risk', 'Marcus Lee', 36, 52.7, 54.4, '2027-07-22', 12, 47),
  p('KB-2411', 'Golden Ridge Senior Living', 'Evergreen Care', 'Golden, CO', 'Residential', 'Site work', 'On track', 'Priya Natarajan', 12, 33.1, 33.0, '2028-03-01', 3, 18),
  p('KB-2413', 'Union Station Office Fit-Out', 'Meridian Capital', 'Denver, CO', 'Commercial', 'Closeout', 'On track', 'Dana Whitfield', 96, 7.8, 7.6, '2026-12-05', 1, 9),
  p('KB-2414', 'Fort Collins Water Treatment', 'City of Fort Collins', 'Fort Collins, CO', 'Infrastructure', 'MEP rough-in', 'At risk', 'Tom Okafor', 49, 71.3, 74.0, '2027-10-18', 21, 38),
  p('KB-2416', 'Westminster Fire Station 7', 'City of Westminster', 'Westminster, CO', 'Commercial', 'Interiors', 'Delayed', 'Elena Vasquez', 68, 12.4, 13.9, '2026-12-19', 11, 14),
  p('KB-2417', 'Lakewood Elementary Addition', 'Jeffco Schools', 'Lakewood, CO', 'Education', 'Structure', 'On track', 'Sam Whitaker', 44, 19.6, 19.4, '2027-07-30', 5, 22),
  p('KB-2419', 'Highlands Parking Structure', 'RiNo Development', 'Denver, CO', 'Commercial', 'Foundation', 'On track', 'Sam Whitaker', 27, 22.8, 22.5, '2027-08-14', 7, 26),
  p('KB-2420', 'Colorado Springs Cancer Center', 'Pikes Peak Health', 'Colorado Springs, CO', 'Healthcare', 'Preconstruction', 'On track', 'Dana Whitfield', 4, 88.0, 88.0, '2029-01-15', 2, 4),
  p('KB-2422', 'Brighton Cold Storage', 'Arctic Chain Co.', 'Brighton, CO', 'Industrial', 'Site work', 'Delayed', 'Tom Okafor', 9, 29.5, 31.2, '2027-12-10', 14, 12),
  p('KB-2423', 'Englewood Transit Plaza', 'RTD', 'Englewood, CO', 'Infrastructure', 'Structure', 'On track', 'Marcus Lee', 52, 41.2, 40.6, '2027-05-27', 8, 36),
  p('KB-2425', 'Littleton Medical Office', 'SouthMetro Physicians', 'Littleton, CO', 'Healthcare', 'Closeout', 'On track', 'Elena Vasquez', 98, 15.3, 15.1, '2026-11-28', 0, 7),
  p('KB-2318', 'Stapleton Rec Center', 'Denver Parks & Rec', 'Denver, CO', 'Commercial', 'Closeout', 'Completed', 'Sam Whitaker', 100, 24.6, 24.2, '2026-10-02', 0, 0),
  p('KB-2322', 'Loveland Apartments Bldg C', 'Cobalt Living', 'Loveland, CO', 'Residential', 'Closeout', 'Completed', 'Priya Natarajan', 100, 21.0, 21.6, '2026-09-18', 0, 0),
  p('KB-2427', 'Arvada Library Renovation', 'City of Arvada', 'Arvada, CO', 'Education', 'MEP rough-in', 'At risk', 'Sam Whitaker', 55, 9.7, 10.3, '2027-03-20', 13, 15),
  p('KB-2428', 'Parker Retail Commons', 'Summit Retail Group', 'Parker, CO', 'Commercial', 'Site work', 'On track', 'Marcus Lee', 15, 16.2, 16.0, '2027-10-30', 2, 19),
];

export const TODAY = new Date('2026-11-14T12:00:00');

// ── Generated sample projects ───────────────────────────────────────────────
// A seeded generator fills out the portfolio to 200 jobs so the table has
// enough rows to scroll. Same seed, same projects on every load.
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}
const r = rng(2026);
const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)];
const between = (lo: number, hi: number) => lo + r() * (hi - lo);

const CITIES = [
  'Denver, CO', 'Aurora, CO', 'Boulder, CO', 'Lakewood, CO', 'Fort Collins, CO', 'Colorado Springs, CO',
  'Greeley, CO', 'Longmont, CO', 'Pueblo, CO', 'Castle Rock, CO', 'Broomfield, CO', 'Thornton, CO',
  'Cheyenne, WY', 'Laramie, WY', 'Salt Lake City, UT', 'Provo, UT', 'Ogden, UT', 'Albuquerque, NM',
  'Santa Fe, NM', 'Boise, ID', 'Grand Junction, CO', 'Durango, CO', 'Steamboat Springs, CO', 'Vail, CO',
];
const PLACES = [
  'Riverside', 'Union', 'Cherry Creek', 'Highlands', 'Sloan Lake', 'Platte', 'Aspen Grove', 'Red Rocks',
  'Front Range', 'Pikes Peak', 'Bear Creek', 'Summit', 'Clear Creek', 'Golden Triangle', 'Sunnyside',
  'Westgate', 'Eastlake', 'Northfield', 'Prairie View', 'Mesa', 'Canyon', 'Foothills', 'Timberline',
  'Copper Ridge', 'Silver Plume', 'Arapahoe', 'Larkspur', 'Wadsworth', 'Federal Heights', 'Belmar',
];
const KINDS: Record<Sector, string[]> = {
  Commercial: ['Office Tower', 'Retail Center', 'Mixed-Use Block', 'Hotel', 'Parking Structure', 'Corporate Campus', 'Office Fit-Out'],
  Residential: ['Apartments', 'Townhomes', 'Senior Living', 'Condominiums', 'Student Housing', 'Affordable Housing'],
  Healthcare: ['Medical Office', 'Surgical Center', 'Clinic Expansion', 'Hospital Tower', 'Behavioral Health Center', 'Imaging Center'],
  Education: ['Elementary School', 'High School Addition', 'Library Renovation', 'Science Building', 'Recreation Center', 'Early Learning Center'],
  Infrastructure: ['Bridge Replacement', 'Water Treatment Plant', 'Transit Station', 'Pump Station', 'Interchange', 'Stormwater Upgrade'],
  Industrial: ['Distribution Center', 'Cold Storage', 'Manufacturing Plant', 'Data Center', 'Fulfillment Hub', 'Maintenance Facility'],
};
const CLIENTS: Record<Sector, string[]> = {
  Commercial: ['Halcyon Partners', 'Meridian Capital', 'Summit Retail Group', 'RiNo Development', 'Peak Hospitality', 'Larimer Holdings'],
  Residential: ['Cobalt Living', 'Evergreen Care', 'Alpine Communities', 'Keyway Residential', 'Mile High Housing Trust'],
  Healthcare: ['Front Range Health', 'Pikes Peak Health', 'SouthMetro Physicians', 'Intermountain Care', 'Rocky Mountain Ortho'],
  Education: ['Denver Public Schools', 'Jeffco Schools', 'BVSD', 'Cherry Creek Schools', 'CSU Facilities', 'CU Boulder'],
  Infrastructure: ['CDOT Region 1', 'CDOT Region 4', 'RTD', 'Denver Water', 'City of Fort Collins', 'UDOT'],
  Industrial: ['Northgate Logistics', 'Arctic Chain Co.', 'Ridgeline Data', 'Apex Manufacturing', 'Columbine Freight'],
};
const MANAGERS = [
  'Dana Whitfield', 'Marcus Lee', 'Priya Natarajan', 'Tom Okafor', 'Elena Vasquez', 'Sam Whitaker',
  'Jordan Brooks', 'Aisha Rahman', 'Luis Moreno', 'Hannah Kowalski', 'Ben Takahashi', 'Grace Oyelaran',
];
// Contract value range by sector, $M.
const SIZE: Record<Sector, [number, number]> = {
  Commercial: [6, 70], Residential: [8, 45], Healthcare: [10, 120], Education: [6, 60], Infrastructure: [10, 95], Industrial: [12, 85],
};

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (days: number) => iso(new Date(TODAY.getTime() + days * 86_400_000));
const phaseFor = (progress: number): Phase =>
  progress < 6 ? 'Preconstruction' : progress < 18 ? 'Site work' : progress < 32 ? 'Foundation'
    : progress < 50 ? 'Structure' : progress < 68 ? 'MEP rough-in' : progress < 92 ? 'Interiors' : 'Closeout';

function generate(count: number, startId: number): Project[] {
  const out: Project[] = [];
  const used = new Set(HANDPICKED.map((p) => p.name));
  for (let i = 0; out.length < count; i++) {
    const sector = pick(SECTORS);
    const name = `${pick(PLACES)} ${pick(KINDS[sector])}`;
    if (used.has(name)) continue;
    used.add(name);

    const roll = r();
    const status: Status = roll < 0.1 ? 'Completed' : roll < 0.22 ? 'Delayed' : roll < 0.4 ? 'At risk' : 'On track';
    const progress = status === 'Completed' ? 100 : Math.round(between(2, 98));
    const budgetM = Math.round(between(...SIZE[sector]) * 10) / 10;
    const drift = status === 'On track' ? between(-0.03, 0.012) : status === 'At risk' ? between(0.015, 0.07)
      : status === 'Delayed' ? between(0.04, 0.16) : between(-0.025, 0.035);
    const remaining = (100 - progress) / 100;
    const due = status === 'Completed' ? addDays(-Math.round(between(10, 240)))
      : status === 'Delayed' && r() < 0.3 ? addDays(-Math.round(between(3, 60)))
      : addDays(Math.round(between(20, 120) + remaining * between(200, 700)));
    out.push({
      id: `KB-${startId + i}`,
      name,
      client: pick(CLIENTS[sector]),
      city: pick(CITIES),
      sector,
      phase: status === 'Completed' ? 'Closeout' : phaseFor(progress),
      status,
      manager: pick(MANAGERS),
      progress,
      budget: budgetM * 1e6,
      forecast: Math.round(budgetM * (1 + drift) * 100) / 100 * 1e6,
      due,
      rfis: status === 'Completed' ? 0 : Math.round(between(0, status === 'On track' ? 9 : 26) * (0.4 + remaining)),
      crew: status === 'Completed' ? 0 : Math.round(between(4, 70) * (progress < 6 ? 0.2 : 1)),
    });
  }
  return out;
}

export const PROJECTS: Project[] = [...HANDPICKED, ...generate(200 - HANDPICKED.length, 2430)];

const activeCrew = PROJECTS.filter((p) => p.status !== 'Completed').reduce((s, p) => s + p.crew, 0);
const activeContract = PROJECTS.filter((p) => p.status !== 'Completed').reduce((s, p) => s + p.budget, 0);

// Monthly cost to date across the portfolio, $M (Jun → Nov), scaled to the portfolio's size.
export const MONTHLY_SPEND = [18.4, 21.2, 19.8, 24.1, 26.7, 23.9].map((v) => Math.round(v * (activeContract / 614.6e6) * 10) / 10);
// Workers on site per day, last 10 working days, ending at today's count.
export const DAILY_HEADCOUNT = [0.83, 0.86, 0.87, 0.82, 0.89, 0.9, 0.94, 0.97, 0.98, 1].map((f) => Math.round(f * activeCrew));

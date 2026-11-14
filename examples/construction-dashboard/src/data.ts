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

export const PROJECTS: Project[] = [
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

// Monthly cost to date across the portfolio, $M (Jun → Nov).
export const MONTHLY_SPEND = [18.4, 21.2, 19.8, 24.1, 26.7, 23.9];
// Workers on site per day, last 10 working days.
export const DAILY_HEADCOUNT = [402, 418, 425, 397, 431, 440, 456, 471, 478, 487];

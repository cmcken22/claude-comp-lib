// Sample data for the construction dashboard example. Generated from a fixed
// seed so the story renders identically every time.

export type ProjectStatus = 'On track' | 'At risk' | 'Delayed' | 'On hold' | 'Completed';
export type ProjectPhase = 'Pre-construction' | 'Site work' | 'Foundation' | 'Framing' | 'MEP' | 'Finishes' | 'Closeout';

export interface Project {
  id: string;
  name: string;
  client: string;
  type: string;
  location: string;
  manager: string;
  phase: ProjectPhase;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  dueDate: Date;
}

export const statuses: ProjectStatus[] = ['On track', 'At risk', 'Delayed', 'On hold', 'Completed'];
export const phases: ProjectPhase[] = ['Pre-construction', 'Site work', 'Foundation', 'Framing', 'MEP', 'Finishes', 'Closeout'];
export const managers = ['Maria Alvarez', 'Devon Brooks', 'Priya Nair', 'Tom Kowalski', 'Aisha Mensah', 'Luke Harrington'];

const projects: Array<[name: string, client: string, type: string, location: string]> = [
  ['Riverside Medical Pavilion', 'Northgate Health', 'Healthcare', 'Portland, OR'],
  ['Harbor View Condominiums', 'Bluewater Living', 'Residential', 'Tacoma, WA'],
  ['Cedar Ridge Elementary', 'Cedar County Schools', 'Education', 'Boise, ID'],
  ['Summit Logistics Hub', 'Summit Freight Co.', 'Industrial', 'Spokane, WA'],
  ['Elm Street Mixed-Use', 'Oakline Partners', 'Mixed-use', 'Seattle, WA'],
  ['Westfield Parking Structure', 'City of Westfield', 'Civic', 'Eugene, OR'],
  ['Granite Peak Hotel', 'Altitude Hospitality', 'Hospitality', 'Bend, OR'],
  ['Lakeshore Water Treatment', 'Lakeshore Utilities', 'Infrastructure', 'Coeur d’Alene, ID'],
  ['Maple Grove Townhomes', 'Greenleaf Homes', 'Residential', 'Salem, OR'],
  ['Pioneer Square Office Retrofit', 'Keystone REIT', 'Commercial', 'Seattle, WA'],
  ['Columbia River Bridge Deck', 'State DOT', 'Infrastructure', 'Vancouver, WA'],
  ['Sunrise Senior Living', 'Evergreen Care', 'Healthcare', 'Olympia, WA'],
  ['Brightwater Data Center', 'Nimbus Cloud', 'Industrial', 'Hillsboro, OR'],
  ['Oak Hollow Community Center', 'Oak Hollow Parks', 'Civic', 'Medford, OR'],
  ['Northpoint Retail Plaza', 'Crescent Retail', 'Commercial', 'Everett, WA'],
  ['Valley Fire Station No. 7', 'Valley Fire District', 'Civic', 'Yakima, WA'],
  ['Ironwood Distribution Center', 'Ironwood Supply', 'Industrial', 'Kent, WA'],
  ['St. Helens University Library', 'St. Helens University', 'Education', 'Portland, OR'],
  ['Pacific Crest Apartments', 'Bluewater Living', 'Residential', 'Bellevue, WA'],
  ['Kingsgate Transit Center', 'Metro Transit', 'Infrastructure', 'Kirkland, WA'],
  ['Copper Canyon Brewery', 'Copper Canyon Brewing', 'Commercial', 'Boise, ID'],
  ['Silverleaf Clinic Expansion', 'Northgate Health', 'Healthcare', 'Gresham, OR'],
  ['Marina Bay Boardwalk', 'Port of Bellingham', 'Civic', 'Bellingham, WA'],
  ['Foothill High Gymnasium', 'Cedar County Schools', 'Education', 'Nampa, ID'],
  ['Redwood Corporate Campus', 'Redwood Systems', 'Commercial', 'Redmond, WA'],
  ['Hawthorne Lofts', 'Oakline Partners', 'Residential', 'Portland, OR'],
  ['Eastgate Cold Storage', 'FreshWay Foods', 'Industrial', 'Pasco, WA'],
  ['Willow Creek Culvert Replacement', 'State DOT', 'Infrastructure', 'Wenatchee, WA'],
  ['Aurora Performing Arts Hall', 'Aurora Arts Council', 'Civic', 'Spokane, WA'],
  ['Birchwood Assisted Living', 'Evergreen Care', 'Healthcare', 'Kennewick, WA'],
  ['Twin Pines Self Storage', 'StoreSmart', 'Commercial', 'Meridian, ID'],
  ['Highland Park Library Branch', 'City of Westfield', 'Civic', 'Corvallis, OR'],
  ['Quarry Point Warehouse', 'Summit Freight Co.', 'Industrial', 'Tukwila, WA'],
  ['Juniper Ridge Subdivision', 'Greenleaf Homes', 'Residential', 'Redmond, OR'],
  ['Seaside Hotel Renovation', 'Altitude Hospitality', 'Hospitality', 'Seaside, OR'],
  ['Union Station Restoration', 'Metro Transit', 'Civic', 'Tacoma, WA'],
  ['Mill Creek Wastewater Upgrade', 'Lakeshore Utilities', 'Infrastructure', 'Walla Walla, WA'],
  ['Alder Tech Incubator', 'Redwood Systems', 'Commercial', 'Beaverton, OR'],
];

/** Small deterministic PRNG (mulberry32). */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seeded(20261114);
const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
const today = new Date(2026, 10, 14);

export const projectData: Project[] = projects.map(([name, client, type, location], i) => {
  const phaseIndex = Math.floor(rand() * phases.length);
  const phase = phases[phaseIndex];
  const roll = rand();
  const status: ProjectStatus =
    phase === 'Closeout' && roll < 0.5 ? 'Completed' : roll < 0.58 ? 'On track' : roll < 0.78 ? 'At risk' : roll < 0.92 ? 'Delayed' : 'On hold';
  const base = (phaseIndex / phases.length) * 100;
  const progress = status === 'Completed' ? 100 : Math.min(98, Math.round(base + rand() * (100 / phases.length)));
  const budget = Math.round((1.2 + rand() * 48) * 10) * 100_000;
  // Over-budget projects skew towards "at risk" and "delayed".
  const overrun = status === 'Delayed' ? 0.08 + rand() * 0.12 : status === 'At risk' ? rand() * 0.1 : -0.06 + rand() * 0.06;
  const spent = Math.round(budget * Math.min(1.25, (progress / 100) * (1 + overrun)));
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + Math.round((status === 'Completed' ? -60 : -20) + rand() * 540));

  return {
    id: `PRJ-${String(2401 + i * 7).padStart(4, '0')}`,
    name,
    client,
    type,
    location,
    manager: pick(managers),
    phase,
    status,
    progress,
    budget,
    spent,
    dueDate,
  };
});

export const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});
export const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

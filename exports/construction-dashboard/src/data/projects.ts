// Sample portfolio data for the dashboard. Replace with your API.

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
  /** Percent complete, 0–100. */
  progress: number;
  budget: number;
  spent: number;
  /** ISO date (YYYY-MM-DD). */
  due: string;
}

export const STATUSES: ProjectStatus[] = ['On track', 'At risk', 'Delayed', 'On hold', 'Completed'];
export const PHASES: ProjectPhase[] = ['Pre-construction', 'Site work', 'Foundation', 'Framing', 'MEP', 'Finishes', 'Closeout'];
export const MANAGERS = ['Maria Alvarez', 'Devon Brooks', 'Priya Nair', 'Tom Kowalski', 'Aisha Mensah', 'Luke Harrington'];

export const PROJECTS: Project[] = [
  { id: "PRJ-2401", name: "Riverside Medical Pavilion", client: "Northgate Health", type: "Healthcare", location: "Portland, OR", manager: "Aisha Mensah", phase: "Pre-construction", status: "On track", progress: 11, budget: 10600000, spent: 1112762, due: "2027-02-16" },
  { id: "PRJ-2408", name: "Harbor View Condominiums", client: "Bluewater Living", type: "Residential", location: "Tacoma, WA", manager: "Priya Nair", phase: "Foundation", status: "At risk", progress: 31, budget: 2000000, spent: 625710, due: "2026-11-23" },
  { id: "PRJ-2415", name: "Cedar Ridge Elementary", client: "Cedar County Schools", type: "Education", location: "Boise, ID", manager: "Aisha Mensah", phase: "MEP", status: "Delayed", progress: 66, budget: 38000000, spent: 27744025, due: "2027-02-25" },
  { id: "PRJ-2422", name: "Summit Logistics Hub", client: "Summit Freight Co.", type: "Industrial", location: "Spokane, WA", manager: "Devon Brooks", phase: "Framing", status: "At risk", progress: 50, budget: 17000000, spent: 8885908, due: "2027-01-04" },
  { id: "PRJ-2429", name: "Elm Street Mixed-Use", client: "Oakline Partners", type: "Mixed-use", location: "Seattle, WA", manager: "Devon Brooks", phase: "Finishes", status: "On track", progress: 74, budget: 39700000, spent: 29112855, due: "2026-12-07" },
  { id: "PRJ-2436", name: "Westfield Parking Structure", client: "City of Westfield", type: "Civic", location: "Eugene, OR", manager: "Maria Alvarez", phase: "Closeout", status: "On hold", progress: 98, budget: 40700000, spent: 37520569, due: "2027-03-17" },
  { id: "PRJ-2443", name: "Granite Peak Hotel", client: "Altitude Hospitality", type: "Hospitality", location: "Bend, OR", manager: "Luke Harrington", phase: "Pre-construction", status: "At risk", progress: 7, budget: 10900000, spent: 810234, due: "2027-04-14" },
  { id: "PRJ-2450", name: "Lakeshore Water Treatment", client: "Lakeshore Utilities", type: "Infrastructure", location: "Coeur d’Alene, ID", manager: "Luke Harrington", phase: "MEP", status: "On track", progress: 71, budget: 14000000, spent: 9774565, due: "2026-12-11" },
  { id: "PRJ-2457", name: "Maple Grove Townhomes", client: "Greenleaf Homes", type: "Residential", location: "Salem, OR", manager: "Priya Nair", phase: "Framing", status: "On track", progress: 45, budget: 32000000, spent: 13929353, due: "2027-01-12" },
  { id: "PRJ-2464", name: "Pioneer Square Office Retrofit", client: "Keystone REIT", type: "Commercial", location: "Seattle, WA", manager: "Maria Alvarez", phase: "Finishes", status: "At risk", progress: 78, budget: 34100000, spent: 26621377, due: "2027-08-27" },
  { id: "PRJ-2471", name: "Columbia River Bridge Deck", client: "State DOT", type: "Infrastructure", location: "Vancouver, WA", manager: "Priya Nair", phase: "Framing", status: "Delayed", progress: 54, budget: 47400000, spent: 27729205, due: "2027-08-30" },
  { id: "PRJ-2478", name: "Sunrise Senior Living", client: "Evergreen Care", type: "Healthcare", location: "Olympia, WA", manager: "Tom Kowalski", phase: "Site work", status: "At risk", progress: 20, budget: 8700000, spent: 1791589, due: "2027-08-19" },
  { id: "PRJ-2485", name: "Brightwater Data Center", client: "Nimbus Cloud", type: "Industrial", location: "Hillsboro, OR", manager: "Aisha Mensah", phase: "Closeout", status: "Completed", progress: 100, budget: 43300000, spent: 41105792, due: "2028-01-01" },
  { id: "PRJ-2492", name: "Oak Hollow Community Center", client: "Oak Hollow Parks", type: "Civic", location: "Medford, OR", manager: "Aisha Mensah", phase: "MEP", status: "At risk", progress: 66, budget: 18900000, spent: 13443095, due: "2026-11-10" },
  { id: "PRJ-2499", name: "Northpoint Retail Plaza", client: "Crescent Retail", type: "Commercial", location: "Everett, WA", manager: "Aisha Mensah", phase: "Site work", status: "At risk", progress: 18, budget: 44900000, spent: 8554463, due: "2028-02-22" },
  { id: "PRJ-2506", name: "Valley Fire Station No. 7", client: "Valley Fire District", type: "Civic", location: "Yakima, WA", manager: "Tom Kowalski", phase: "Site work", status: "On track", progress: 24, budget: 9700000, spent: 2322267, due: "2027-09-12" },
  { id: "PRJ-2513", name: "Ironwood Distribution Center", client: "Ironwood Supply", type: "Industrial", location: "Kent, WA", manager: "Maria Alvarez", phase: "Framing", status: "On track", progress: 45, budget: 7800000, spent: 3504855, due: "2027-07-12" },
  { id: "PRJ-2520", name: "St. Helens University Library", client: "St. Helens University", type: "Education", location: "Portland, OR", manager: "Tom Kowalski", phase: "Framing", status: "On track", progress: 45, budget: 39100000, spent: 16591216, due: "2027-06-15" },
  { id: "PRJ-2527", name: "Pacific Crest Apartments", client: "Bluewater Living", type: "Residential", location: "Bellevue, WA", manager: "Tom Kowalski", phase: "Finishes", status: "On hold", progress: 80, budget: 28500000, spent: 22454020, due: "2026-11-27" },
  { id: "PRJ-2534", name: "Kingsgate Transit Center", client: "Metro Transit", type: "Infrastructure", location: "Kirkland, WA", manager: "Maria Alvarez", phase: "Finishes", status: "Delayed", progress: 85, budget: 16800000, spent: 16486634, due: "2027-10-01" },
  { id: "PRJ-2541", name: "Copper Canyon Brewery", client: "Copper Canyon Brewing", type: "Commercial", location: "Boise, ID", manager: "Maria Alvarez", phase: "Foundation", status: "On track", progress: 30, budget: 22600000, spent: 6373340, due: "2026-12-10" },
  { id: "PRJ-2548", name: "Silverleaf Clinic Expansion", client: "Northgate Health", type: "Healthcare", location: "Gresham, OR", manager: "Aisha Mensah", phase: "Closeout", status: "On hold", progress: 89, budget: 46800000, spent: 41139808, due: "2027-04-08" },
  { id: "PRJ-2555", name: "Marina Bay Boardwalk", client: "Port of Bellingham", type: "Civic", location: "Bellingham, WA", manager: "Priya Nair", phase: "MEP", status: "At risk", progress: 68, budget: 13800000, spent: 9785971, due: "2028-03-05" },
  { id: "PRJ-2562", name: "Foothill High Gymnasium", client: "Cedar County Schools", type: "Education", location: "Nampa, ID", manager: "Tom Kowalski", phase: "Finishes", status: "At risk", progress: 81, budget: 1600000, spent: 1346077, due: "2027-04-05" },
  { id: "PRJ-2569", name: "Redwood Corporate Campus", client: "Redwood Systems", type: "Commercial", location: "Redmond, WA", manager: "Luke Harrington", phase: "Site work", status: "On track", progress: 19, budget: 25500000, spent: 4559623, due: "2027-05-19" },
  { id: "PRJ-2576", name: "Hawthorne Lofts", client: "Oakline Partners", type: "Residential", location: "Portland, OR", manager: "Luke Harrington", phase: "Pre-construction", status: "On hold", progress: 1, budget: 5300000, spent: 49929, due: "2028-04-04" },
  { id: "PRJ-2583", name: "Eastgate Cold Storage", client: "FreshWay Foods", type: "Industrial", location: "Pasco, WA", manager: "Aisha Mensah", phase: "Finishes", status: "On track", progress: 81, budget: 7700000, spent: 5869249, due: "2027-10-29" },
  { id: "PRJ-2590", name: "Willow Creek Culvert Replacement", client: "State DOT", type: "Infrastructure", location: "Wenatchee, WA", manager: "Luke Harrington", phase: "Closeout", status: "Completed", progress: 100, budget: 46200000, spent: 44415783, due: "2026-12-01" },
  { id: "PRJ-2597", name: "Aurora Performing Arts Hall", client: "Aurora Arts Council", type: "Civic", location: "Spokane, WA", manager: "Luke Harrington", phase: "Finishes", status: "Delayed", progress: 74, budget: 13900000, spent: 12264465, due: "2027-03-19" },
  { id: "PRJ-2604", name: "Birchwood Assisted Living", client: "Evergreen Care", type: "Healthcare", location: "Kennewick, WA", manager: "Priya Nair", phase: "Closeout", status: "Completed", progress: 100, budget: 22600000, spent: 22139819, due: "2027-03-29" },
  { id: "PRJ-2611", name: "Twin Pines Self Storage", client: "StoreSmart", type: "Commercial", location: "Meridian, ID", manager: "Devon Brooks", phase: "Framing", status: "On track", progress: 52, budget: 11200000, spent: 5509262, due: "2027-06-19" },
  { id: "PRJ-2618", name: "Highland Park Library Branch", client: "City of Westfield", type: "Civic", location: "Corvallis, OR", manager: "Tom Kowalski", phase: "MEP", status: "At risk", progress: 60, budget: 47300000, spent: 31111908, due: "2027-09-21" },
  { id: "PRJ-2625", name: "Quarry Point Warehouse", client: "Summit Freight Co.", type: "Industrial", location: "Tukwila, WA", manager: "Priya Nair", phase: "Closeout", status: "Completed", progress: 100, budget: 48700000, spent: 46511414, due: "2027-06-30" },
  { id: "PRJ-2632", name: "Juniper Ridge Subdivision", client: "Greenleaf Homes", type: "Residential", location: "Redmond, OR", manager: "Luke Harrington", phase: "Pre-construction", status: "On hold", progress: 9, budget: 7300000, spent: 641757, due: "2027-08-07" },
  { id: "PRJ-2639", name: "Seaside Hotel Renovation", client: "Altitude Hospitality", type: "Hospitality", location: "Seaside, OR", manager: "Devon Brooks", phase: "Framing", status: "On track", progress: 46, budget: 41400000, spent: 17904523, due: "2027-09-30" },
  { id: "PRJ-2646", name: "Union Station Restoration", client: "Metro Transit", type: "Civic", location: "Tacoma, WA", manager: "Luke Harrington", phase: "Framing", status: "On track", progress: 45, budget: 38700000, spent: 16544834, due: "2026-12-18" },
  { id: "PRJ-2653", name: "Mill Creek Wastewater Upgrade", client: "Lakeshore Utilities", type: "Infrastructure", location: "Walla Walla, WA", manager: "Tom Kowalski", phase: "MEP", status: "On track", progress: 65, budget: 17200000, spent: 10758512, due: "2027-07-16" },
  { id: "PRJ-2660", name: "Alder Tech Incubator", client: "Redwood Systems", type: "Commercial", location: "Beaverton, OR", manager: "Priya Nair", phase: "Foundation", status: "On track", progress: 38, budget: 21100000, spent: 7705422, due: "2027-09-11" },
];

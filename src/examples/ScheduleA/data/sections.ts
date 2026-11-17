import type { ItemKind, ScopeItem, ScopeSection } from '../types';

const item = (
  id: string,
  kind: ItemKind,
  text: string,
  opts: Partial<Omit<ScopeItem, 'id' | 'kind' | 'text'>> = {},
): ScopeItem => ({ id, kind, text, critical: false, tags: [], ...opts });

const section = (key: string, name: string, items: ScopeItem[]): ScopeSection => ({
  id: `sec-${key}`,
  key,
  name,
  items,
});

/** Draft Schedule A for Northline Mechanical, Division 23 HVAC. */
export const mechanicalSections: ScopeSection[] = [
  section('general', 'General Requirements', [
    item('i-101', 'inclusion', 'Supply all labour, materials, equipment, supervision and services required to complete the Division 23 HVAC work shown on drawings M-001 to M-412 and specified in Sections 23 05 00 to 23 82 00.', { critical: true, tags: ['Div 23'] }),
    item('i-102', 'inclusion', 'Work shall be phased to suit the occupied hospital campus. Phase 2A (Levels 3–5) and Phase 2B (Levels 1–2) per the Construction Manager’s master schedule rev. 14.', { tags: ['Phasing'] }),
    item('i-103', 'clarification', 'All work in or adjacent to occupied clinical areas requires an approved Infection Control Risk Assessment (ICRA) permit before start.', { critical: true, tags: ['ICRA'] }),
  ]),
  section('labour', 'Labour', [
    item('i-201', 'inclusion', 'Provide a full-time, on-site mechanical foreperson for the duration of the Work, with authority to commit the Subcontractor.'),
    item('i-202', 'inclusion', 'Include premium time for after-hours shutdowns and tie-ins to existing services, minimum 14 planned shutdowns as listed in Appendix M-3.', { tags: ['Shutdowns'] }),
  ]),
  section('materials', 'Materials', [
    item('i-301', 'inclusion', 'Supply all ductwork, fittings, hangers, sealants and insulation to SMACNA pressure class indicated, including Seal Class A for all supply ductwork.'),
    item('i-302', 'inclusion', 'Supply HEPA filter housings and terminal filters for operating rooms OR-01 to OR-06 and isolation rooms ISO-301 to ISO-308.', { critical: true, tags: ['Healthcare'] }),
    item('i-303', 'clarification', 'Owner-furnished air-handling units AHU-5 and AHU-6 will be delivered to site by the Owner; receipt, offloading and protection are by the Subcontractor.'),
  ]),
  section('equipment', 'Equipment', [
    item('i-401', 'inclusion', 'Supply and install rooftop units RTU-1 to RTU-4, energy recovery ventilators ERV-1 and ERV-2, and fan coil units as scheduled on M-601.', { tags: ['Div 23'] }),
    item('i-402', 'inclusion', 'Provide all temporary lifting accessories, rigging and setting of mechanical equipment.'),
  ]),
  section('installation', 'Installation', [
    item('i-501', 'inclusion', 'Install fire dampers and combination fire/smoke dampers at all rated assemblies shown on the life-safety drawings, including access doors.', { critical: true, tags: ['Life safety'] }),
    item('i-502', 'inclusion', 'Install all ductwork with flexible connections at equipment and vibration isolation as per Section 23 05 48.'),
    item('i-503', 'inclusion', 'Cap, seal and protect all open duct ends during construction to CSA Z317.2 requirements.', { tags: ['Healthcare'] }),
  ]),
  section('coordination', 'Coordination', [
    item('i-601', 'inclusion', 'Participate in BIM coordination, provide LOD 350 mechanical models and attend weekly clash detection meetings.', { tags: ['BIM'] }),
    item('i-602', 'inclusion', 'Coordinate controls interfaces with the Division 25 controls contractor as required.'),
  ]),
  section('testing', 'Testing and Commissioning', [
    item('i-701', 'inclusion', 'Retain an independent AABC-certified testing, adjusting and balancing agency and submit the final TAB report for review.', { critical: true }),
    item('i-702', 'inclusion', 'Pressure test ductwork as required and provide results to the Consultant.'),
    item('i-703', 'inclusion', 'Participate in functional performance testing with the Owner’s commissioning agent, including two seasonal tests.', { tags: ['Cx'] }),
  ]),
  section('closeout', 'Closeout and Documentation', [
    item('i-801', 'inclusion', 'Provide operation and maintenance manuals, record drawings and as-built BIM models within 30 days of Substantial Performance.'),
    item('i-802', 'inclusion', 'Provide a one (1) year warranty on all labour and materials from the date of Substantial Performance.'),
  ]),
  section('safety', 'Safety and Compliance', [
    item('i-901', 'inclusion', 'Comply with Summit Site Safety Program, OHSA regulations and the Construction Manager’s hoisting plan, including all hoisting and crane lifts for mechanical work.', { critical: true }),
    item('i-902', 'inclusion', 'Provide a site-specific hot work procedure and fire watch for all brazing and welding.'),
  ]),
  section('exclusions', 'Exclusions', [
    item('i-1001', 'exclusion', 'Line voltage power wiring to mechanical equipment (by Division 26).'),
    item('i-1002', 'exclusion', 'Supply and installation of fire dampers (by others).'),
    item('i-1003', 'exclusion', 'Concrete housekeeping pads (by General Trades).'),
  ]),
];

/** A shorter scope for the Electrical subcontract, used when switching scopes. */
export const electricalSections: ScopeSection[] = [
  section('general', 'General Requirements', [
    item('e-101', 'inclusion', 'Supply all labour, materials and equipment to complete the Division 26 and 28 electrical work shown on drawings E-001 to E-520.', { critical: true }),
  ]),
  section('installation', 'Installation', [
    item('e-201', 'inclusion', 'Install line voltage power wiring and disconnects to all mechanical equipment.'),
    item('e-202', 'inclusion', 'Provide essential power branch circuits to all critical-care receptacles per CSA Z32.'),
  ]),
  section('exclusions', 'Exclusions', [
    item('e-301', 'exclusion', 'Low voltage controls wiring for HVAC equipment (by Division 25).'),
  ]),
];

/** Starter content when a new scope is created from the company template. */
export const templateSections: ScopeSection[] = [
  section('general', 'General Requirements', [
    item('t-1', 'inclusion', 'Supply all labour, materials, equipment, supervision and services required to complete the Work of this Subcontract.', { critical: true }),
  ]),
  section('safety', 'Safety and Compliance', [
    item('t-2', 'inclusion', 'Comply with the Summit Site Safety Program and all applicable Occupational Health and Safety regulations.'),
  ]),
  section('closeout', 'Closeout and Documentation', [
    item('t-3', 'inclusion', 'Provide operation and maintenance manuals and record drawings prior to Substantial Performance.'),
  ]),
  section('exclusions', 'Exclusions', []),
];

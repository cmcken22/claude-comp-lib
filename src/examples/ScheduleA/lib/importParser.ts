// Turns pasted or imported text (spec sections, drawing notes, Word/Excel exports) into
// candidate clauses. Pure functions so the same logic can run on a server later.
import type { ItemKind } from '../types';

export interface ParsedClause {
  id: string;
  text: string;
  sectionKey: string;
  kind: ItemKind;
}

/** Keywords that place a clause in a Schedule A section. First match wins. */
const SECTION_RULES: [string, RegExp][] = [
  ['exclusions', /\b(exclu\w*|by others|not included|n\.?i\.?c\.?|by division \d+)\b/i],
  ['clarifications', /\b(clarif\w*|assum\w*|note that|notwithstanding)\b/i],
  ['general', /\b(all labour, materials|complete and operating|work of this subcontract)\b/i],
  ['coordination', /\b(coordinat\w*|bim|clash\w*|shop drawings?|interface)\b/i],
  ['testing', /\b(test\w*|balanc\w*|commission\w*|tab|flush\w*|start-?up|certif\w*)\b/i],
  ['closeout', /\b(o&m|manuals?|record drawings?|as-?built|warrant\w*|training|closeout|turnover)\b/i],
  ['safety', /\b(safety|ohsa|hot work|confined space|fire watch|hoist\w*|crane)\b/i],
  ['installation', /^(install|mount|seal|connect)|\b(seismic|restrain\w*|firestop\w*|sleeves?|hangers?|penetrations?)\b/i],
  ['labour', /\b(foreperson|overtime|premium time|shift)\b/i],
  ['materials', /\b(supply|materials?|insulation|filters?|fittings?)\b/i],
  ['equipment', /\b(rtu-?\d*|ahu-?\d*|equipment|fans?|pumps?|boilers?|chillers?|erv-?\d*|units?)\b/i],
];

/** Headings that set the section for the lines under them. */
const HEADING_RULES: [string, RegExp][] = [
  ['general', /general|scope/i],
  ['materials', /material|product/i],
  ['installation', /execution|installation/i],
  ['testing', /test|commission|balanc/i],
  ['closeout', /closeout|submittal|warrant/i],
  ['exclusions', /exclu/i],
  ['safety', /safety/i],
];

const MARKER = /^\s*(?:[-•*▪◦]|\(?\d+(?:\.\d+)*[.)]?|\(?[a-z][.)]|[A-Z]\.)\s+/;

export function guessSection(text: string, fallback = 'general') {
  return SECTION_RULES.find(([, re]) => re.test(text))?.[0] ?? fallback;
}

export function guessKind(text: string): ItemKind {
  if (/\b(exclu\w*|by others|not included|n\.?i\.?c\.?|by division \d+)\b/i.test(text)) return 'exclusion';
  if (/\b(clarif\w*|assum\w*|note that|notwithstanding)\b/i.test(text)) return 'clarification';
  return 'inclusion';
}

const isHeading = (line: string) =>
  line.length < 60 && (/^(part|section|division)\b/i.test(line) || /:$/.test(line) || (line === line.toUpperCase() && /[A-Z]/.test(line)));

/** Splits text into clauses: numbered/bulleted lines start a clause; wrapped lines join the previous one. */
export function parseClauses(raw: string): ParsedClause[] {
  const clauses: ParsedClause[] = [];
  let heading: string | null = null;
  let current: string[] = [];

  const flush = () => {
    const text = current.join(' ').replace(/\s+/g, ' ').trim();
    current = [];
    if (text.length < 20) return;
    const sectionKey = guessSection(text, heading ?? 'general');
    clauses.push({ id: `p${clauses.length}`, text: text.replace(/;$/, '.'), sectionKey, kind: guessKind(text) });
  };

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) { flush(); continue; }
    if (isHeading(line) && !MARKER.test(line)) {
      flush();
      heading = HEADING_RULES.find(([, re]) => re.test(line))?.[0] ?? heading;
      continue;
    }
    if (MARKER.test(line)) { flush(); current.push(line.replace(MARKER, '')); } else current.push(line);
  }
  flush();
  return clauses;
}

/** Spec and drawing-note text used by "Load sample" and for files the prototype cannot read. */
export const SAMPLE_IMPORT = `SECTION 23 05 00 – COMMON WORK RESULTS FOR HVAC
PART 1 – GENERAL
1.1 Provide all labour, materials and equipment for a complete and operating HVAC system as shown on drawings M-001 to M-412.
1.2 Submit shop drawings for all equipment, ductwork and piping and coordinate with structural, electrical and architectural trades before fabrication.

PART 3 – EXECUTION
3.1 Install seismic restraints for all ductwork, piping and suspended equipment in accordance with OBC 4.1.8.18; restraint design to be sealed by a professional engineer.
3.2 Provide sleeves and firestopping at all penetrations of rated assemblies for mechanical services.
3.3 Seal all supply ductwork to SMACNA Seal Class A
and leak test 25% of medium pressure ductwork.
3.4 Balance all air and water systems by an AABC certified agency and submit the final TAB report.

DRAWING M-601 GENERAL NOTES:
a) Roof curbs for RTU-1 to RTU-4 supplied by mechanical, installed by roofing contractor.
b) Line voltage power wiring to all mechanical equipment by Division 26.
c) Provide 2 sets of spare filters for all air handling units at turnover.`;

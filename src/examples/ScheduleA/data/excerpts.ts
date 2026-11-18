// Mock text from linked reference documents, shown beside the editor.
export interface Excerpt { ref: string; text: string }

export const excerpts: Record<string, Excerpt[]> = {
  d6: [
    { ref: '23 05 00 · 1.4', text: 'Submit shop drawings for all equipment, ductwork and piping. Coordinate with structural, electrical and architectural trades before fabrication.' },
    { ref: '23 05 00 · 3.2', text: 'Install seismic restraints for all ductwork, piping and suspended equipment in accordance with OBC 4.1.8.18. Restraint design to be sealed by a professional engineer.' },
    { ref: '23 05 00 · 3.6', text: 'Provide sleeves and firestopping at all penetrations of rated assemblies for mechanical services.' },
    { ref: '23 05 00 · 3.9', text: 'Clean all ductwork serving clinical areas to NADCA ACR 2021 before turnover and provide cleaning certificates.' },
  ],
  d5: [
    { ref: '01 35 00 · 1.3', text: 'All work in occupied areas requires an Infection Control Risk Assessment and ICRA Class IV barriers maintained by the trade performing the work.' },
    { ref: '01 50 00 · 2.1', text: 'Temporary heat and ventilation is the responsibility of the Construction Manager until the building is enclosed. Use of permanent equipment requires Consultant approval.' },
    { ref: '01 78 00 · 1.2', text: 'Submit operation and maintenance manuals and record drawings no later than 30 days after Substantial Performance.' },
  ],
  d1: [
    { ref: 'SC-24.1', text: 'The Contractor warrants mechanical systems serving clinical areas for two (2) years from Substantial Performance.' },
    { ref: 'SC-11.3', text: 'Each Subcontractor shall carry the hoisting of its own materials except where the Construction Manager’s tower crane is scheduled.' },
  ],
  d4: [
    { ref: 'M-5.4', text: 'Supply and install all fire dampers, combination fire/smoke dampers and access doors at rated assemblies.' },
    { ref: 'M-12.1', text: 'Line voltage power wiring to mechanical equipment is excluded and provided by Division 26.' },
  ],
  d7: [
    { ref: 'Sched. A §5.7', text: 'Provide engineered seismic restraint drawings and install restraints for all mechanical services, including those within ceiling spaces.' },
    { ref: 'Sched. A §7.3', text: 'Re-balance isolation rooms after Owner fit-out and recertify pressure relationships, one return visit included.' },
  ],
};

export const FALLBACK_EXCERPT: Excerpt[] = [
  { ref: '—', text: 'This document is linked for the review agents. A text preview is not available in the prototype.' },
];

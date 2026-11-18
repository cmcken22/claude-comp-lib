import type { ScopeMeta } from '../types';

/** "23, 25" from ['23 — HVAC', '25 — Integrated Automation']. */
export const divisionNumbers = (divisions: string[]) => divisions.map((d) => d.split(' ')[0]).join(', ');

/** "Div 23 HVAC, 25 Integrated Automation" for documents. */
export const divisionsLong = (divisions: string[]) => divisions.map((d) => d.replace(' — ', ' ')).join(', ');

export const subcontractorLabel = (meta: ScopeMeta) => meta.subcontractor || 'Not yet awarded';
export const requisitionLabel = (meta: ScopeMeta) => meta.requisition || 'Not linked yet';
export const requisitionId = (meta: ScopeMeta) => meta.requisition.split(' · ')[0];

/** Drafting stage, in words the team uses. */
export const stageLabel = (meta: ScopeMeta) => (meta.requisition ? 'Subcontract' : 'Tender');

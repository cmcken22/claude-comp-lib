import { SEVERITY } from '../config';
import type { Finding, Workspace } from '../types';
import { countItems } from './scope';

export const isOpen = (f: Finding) => f.status === 'open';

export function reviewCounts(findings: Finding[]) {
  const open = findings.filter(isOpen);
  return {
    total: findings.length,
    open: open.length,
    critical: open.filter((f) => f.severity === 'critical').length,
    high: open.filter((f) => f.severity === 'high').length,
    closed: findings.length - open.length,
  };
}

/** Pricing exposure of open historical-gap findings. */
export function openExposure(findings: Finding[]) {
  return findings
    .filter((f) => f.agent === 'gap' && isOpen(f))
    .reduce((acc, f) => ({ low: acc.low + (f.priceLow ?? 0), high: acc.high + (f.priceHigh ?? 0) }), { low: 0, high: 0 });
}

/** Open first, then by severity. */
export const sortFindings = (list: Finding[]) =>
  [...list].sort(
    (a, b) => Number(isOpen(b)) - Number(isOpen(a)) || SEVERITY[a.severity].rank - SEVERITY[b.severity].rank,
  );

export const isOutdated = (ws: Workspace, agent: 'language' | 'gap') => {
  const run = ws.runs[agent];
  return run.status === 'complete' && (run.revision ?? 0) < ws.revision;
};

export interface ReadinessCheck {
  id: string;
  label: string;
  ok: boolean;
  /** Blocking checks fail the export; others only warn. */
  blocking?: boolean;
  detail: string;
}

export function readiness(ws: Workspace): ReadinessCheck[] {
  const counts = reviewCounts(ws.findings);
  const items = countItems(ws.sections);
  const ran = ws.runs.language.status === 'complete' && ws.runs.gap.status === 'complete';
  const current = ran && !isOutdated(ws, 'language') && !isOutdated(ws, 'gap');
  return [
    { id: 'details', label: 'Scope details complete', ok: Boolean(ws.meta.subcontractor && ws.meta.requisition), detail: `${ws.meta.subcontractor || 'No subcontractor'} · ${ws.meta.requisition || 'No requisition'}` },
    { id: 'content', label: 'Scope has content', ok: items > 0, blocking: true, detail: `${ws.sections.length} sections · ${items} items` },
    { id: 'refs', label: 'Reference documents selected', ok: ws.selectedDocIds.length > 0, detail: `${ws.selectedDocIds.length} documents` },
    { id: 'ran', label: 'Both review agents run on the latest draft', ok: current, detail: !ran ? 'One or more agents have not run' : current ? 'Up to date' : 'Scope changed since the last run' },
    { id: 'critical', label: 'No open critical findings', ok: counts.critical === 0, detail: counts.critical ? `${counts.critical} critical finding open` : 'All critical findings addressed' },
    { id: 'high', label: 'High-risk findings reviewed', ok: counts.high === 0, detail: counts.high ? `${counts.high} high-risk findings open` : 'None open' },
    { id: 'version', label: 'Changes saved as a version', ok: ws.versionRevision === ws.revision, detail: ws.versionRevision === ws.revision ? `Exporting ${ws.currentVersion}` : 'Unversioned changes will be saved as a new version on export' },
  ];
}

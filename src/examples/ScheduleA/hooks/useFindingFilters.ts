import { useMemo, useState } from 'react';
import { sortFindings } from '../lib/review';
import type { AgentId, Finding, FindingStatus, Severity } from '../types';

export interface FindingFilters {
  agent: AgentId | 'all';
  severity: Severity | 'all';
  status: FindingStatus | 'all';
}

/** Open findings first: that is what needs action. */
export const DEFAULT_FILTERS: FindingFilters = { agent: 'all', severity: 'all', status: 'open' };

/** Filter state for the review panel, returning the sorted, filtered list. */
export function useFindingFilters(findings: Finding[]) {
  const [filters, setFilters] = useState<FindingFilters>(DEFAULT_FILTERS);

  const visible = useMemo(
    () =>
      sortFindings(
        findings.filter(
          (f) =>
            (filters.agent === 'all' || f.agent === filters.agent) &&
            (filters.severity === 'all' || f.severity === filters.severity) &&
            (filters.status === 'all' || f.status === filters.status),
        ),
      ),
    [findings, filters],
  );

  const set = <K extends keyof FindingFilters>(key: K, value: FindingFilters[K]) => setFilters((f) => ({ ...f, [key]: value }));
  const active = filters.agent !== 'all' || filters.severity !== 'all' || filters.status !== 'open';

  return { filters, set, reset: () => setFilters(DEFAULT_FILTERS), visible, active };
}

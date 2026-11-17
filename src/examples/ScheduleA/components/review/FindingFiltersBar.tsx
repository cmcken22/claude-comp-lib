import { Chip } from '../../../../components/Chip';
import { Select } from '../../../../components/Select';
import { AGENTS, FINDING_STATUS, SEVERITY } from '../../config';
import type { FindingFilters } from '../../hooks/useFindingFilters';
import type { AgentId, FindingStatus, Severity } from '../../types';

export interface FindingFiltersBarProps {
  filters: FindingFilters;
  onChange: <K extends keyof FindingFilters>(key: K, value: FindingFilters[K]) => void;
}

/** Agent toggle chips plus severity and status selects. */
export function FindingFiltersBar({ filters, onChange }: FindingFiltersBarProps) {
  const agents: (AgentId | 'all')[] = ['all', 'language', 'gap'];
  return (
    <div className="sa-filters">
      <div className="sa-filters__chips" role="group" aria-label="Filter by agent">
        {agents.map((a) => (
          <Chip key={a} size="sm" selected={filters.agent === a} onClick={() => onChange('agent', a)}>
            {a === 'all' ? 'All agents' : AGENTS[a].short}
          </Chip>
        ))}
      </div>
      <div className="sa-filters__selects">
        <Select size="sm" aria-label="Filter by severity" value={filters.severity} onChange={(e) => onChange('severity', e.target.value as Severity | 'all')}>
          <option value="all">All severities</option>
          {(Object.keys(SEVERITY) as Severity[]).map((s) => <option key={s} value={s}>{SEVERITY[s].label}</option>)}
        </Select>
        <Select size="sm" aria-label="Filter by status" value={filters.status} onChange={(e) => onChange('status', e.target.value as FindingStatus | 'all')}>
          <option value="all">All statuses</option>
          {(Object.keys(FINDING_STATUS) as FindingStatus[]).map((s) => <option key={s} value={s}>{FINDING_STATUS[s].label}</option>)}
        </Select>
      </div>
    </div>
  );
}

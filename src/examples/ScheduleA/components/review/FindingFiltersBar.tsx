import { useState } from 'react';
import { Chip } from '../../../../components/Chip';
import { Select } from '../../../../components/Select';
import { AGENTS, FINDING_STATUS, SEVERITY } from '../../config';
import type { FindingFilters } from '../../hooks/useFindingFilters';
import { ChevronDownIcon } from '../../icons';
import type { AgentId, FindingStatus, Severity } from '../../types';

export interface FindingFiltersBarProps {
  filters: FindingFilters;
  onChange: <K extends keyof FindingFilters>(key: K, value: FindingFilters[K]) => void;
}

/** Agent chips up front; severity and status sit behind "Filters" so the panel stays quiet. */
export function FindingFiltersBar({ filters, onChange }: FindingFiltersBarProps) {
  const [open, setOpen] = useState(false);
  const agents: (AgentId | 'all')[] = ['all', 'language', 'gap'];
  const extra = Number(filters.severity !== 'all') + Number(filters.status !== 'open');

  return (
    <div className="sa-filters">
      <div className="sa-filters__row">
        <div className="sa-filters__chips" role="group" aria-label="Filter by agent">
          {agents.map((a) => (
            <Chip key={a} size="sm" selected={filters.agent === a} onClick={() => onChange('agent', a)}>
              {a === 'all' ? 'All' : AGENTS[a].short}
            </Chip>
          ))}
        </div>
        <button type="button" className="sa-filters__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          Filters{extra > 0 && ` (${extra})`}
          <ChevronDownIcon size={14} />
        </button>
      </div>
      {open && (
        <div className="sa-filters__selects">
          <Select size="sm" aria-label="Severity" value={filters.severity} onChange={(e) => onChange('severity', e.target.value as Severity | 'all')}>
            <option value="all">Any severity</option>
            {(Object.keys(SEVERITY) as Severity[]).map((s) => <option key={s} value={s}>{SEVERITY[s].label}</option>)}
          </Select>
          <Select size="sm" aria-label="Status" value={filters.status} onChange={(e) => onChange('status', e.target.value as FindingStatus | 'all')}>
            <option value="all">Any status</option>
            {(Object.keys(FINDING_STATUS) as FindingStatus[]).map((s) => <option key={s} value={s}>{FINDING_STATUS[s].label}</option>)}
          </Select>
        </div>
      )}
    </div>
  );
}

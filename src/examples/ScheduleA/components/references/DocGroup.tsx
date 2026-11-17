import { Badge } from '../../../../components/Badge';
import { Checkbox } from '../../../../components/Checkbox';
import { AGENTS } from '../../config';
import { formatDate } from '../../lib/format';
import { DocIcon } from '../../icons';
import type { DocType, ReferenceDoc } from '../../types';

export interface DocGroupProps {
  type: DocType;
  docs: ReferenceDoc[];
  selectedIds: string[];
  disabled: boolean;
  onToggle: (id: string) => void;
  onSetAll: (ids: string[], on: boolean) => void;
}

/** One document type with a select-all checkbox and a row per document. */
export function DocGroup({ type, docs, selectedIds, disabled, onToggle, onSetAll }: DocGroupProps) {
  const ids = docs.map((d) => d.id);
  const count = ids.filter((id) => selectedIds.includes(id)).length;
  const all = count === docs.length;

  return (
    <div className="sa-doc-group" role="group" aria-label={type}>
      <div className="sa-doc-group__head">
        <Checkbox
          label={<span className="sa-doc-group__title">{type.endsWith('s') ? type : `${type}s`}</span>}
          checked={all}
          indeterminate={count > 0 && !all}
          disabled={disabled}
          onChange={() => onSetAll(ids, !all)}
        />
        <span className="sa-muted sa-nowrap">{count} of {docs.length} selected</span>
      </div>
      <ul className="sa-doc-list">
        {docs.map((d) => {
          const on = selectedIds.includes(d.id);
          return (
            <li key={d.id} className={`sa-doc${on ? ' sa-doc--selected' : ''}`}>
              <Checkbox aria-label={d.name} checked={on} disabled={disabled} onChange={() => onToggle(d.id)} />
              <DocIcon className="sa-doc__icon" />
              <div className="sa-doc__main">
                <span className="sa-doc__name">{d.name}</span>
                <span className="sa-doc__meta">
                  {d.source} · {formatDate(d.date)} · {d.detail}
                </span>
              </div>
              <div className="sa-doc__agents">
                {d.agents.map((a) => (
                  <Badge key={a} size="sm" color={a === 'language' ? 'indigo' : 'teal'}>{AGENTS[a].short}</Badge>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

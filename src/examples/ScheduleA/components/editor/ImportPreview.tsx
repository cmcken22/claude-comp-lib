import { Checkbox } from '../../../../components/Checkbox';
import { Select } from '../../../../components/Select';
import { SECTION_CATALOG } from '../../config';
import type { ParsedClause } from '../../lib/importParser';
import { KindBadge } from '../common/Badges';

export interface ImportPreviewProps {
  clauses: ParsedClause[];
  picked: string[];
  source: string;
  onPick: (ids: string[]) => void;
  onChange: (clauses: ParsedClause[]) => void;
}

/** Detected clauses with a checkbox and a section choice each. */
export function ImportPreview({ clauses, picked, source, onPick, onChange }: ImportPreviewProps) {
  if (clauses.length === 0) {
    return <p className="sa-empty-inline">No clauses found. Try text with one requirement per line, or numbered items.</p>;
  }
  const all = picked.length === clauses.length;
  return (
    <div className="sa-stack">
      <div className="sa-import__head">
        <Checkbox
          label={`${clauses.length} clauses found in ${source}`}
          checked={all}
          indeterminate={picked.length > 0 && !all}
          onChange={() => onPick(all ? [] : clauses.map((c) => c.id))}
        />
      </div>
      <ul className="sa-import__list">
        {clauses.map((c) => (
          <li key={c.id} className="sa-import__item">
            <Checkbox aria-label={`Import: ${c.text.slice(0, 60)}`} checked={picked.includes(c.id)} onChange={() => onPick(picked.includes(c.id) ? picked.filter((x) => x !== c.id) : [...picked, c.id])} />
            <div className="sa-import__body">
              <p>{c.text}</p>
              <div className="sa-import__meta">
                {c.kind !== 'inclusion' && <KindBadge kind={c.kind} />}
                <Select size="sm" aria-label="Section" value={c.sectionKey} onChange={(e) => onChange(clauses.map((x) => (x.id === c.id ? { ...x, sectionKey: e.target.value } : x)))}>
                  {SECTION_CATALOG.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
                </Select>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

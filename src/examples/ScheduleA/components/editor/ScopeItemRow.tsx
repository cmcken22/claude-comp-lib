import { ArrowDownIcon, ArrowUpIcon, CopyIcon, EditIcon, FlagIcon, LibraryIcon, SparkleIcon, TrashIcon } from '../../icons';
import type { ScopeItem } from '../../types';
import { KindBadge } from '../common/Badges';

export interface ScopeItemRowProps {
  item: ScopeItem;
  number: string;
  canEdit: boolean;
  isFirst: boolean;
  isLast: boolean;
  highlighted: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}

/** One clause in read mode, with row actions. */
export function ScopeItemRow({ item, number, canEdit, isFirst, isLast, highlighted, onEdit, onDuplicate, onMove, onDelete }: ScopeItemRowProps) {
  const label = `clause ${number}`;
  return (
    <li className={`sa-item${item.critical ? ' sa-item--critical' : ''}${highlighted ? ' sa-item--flash' : ''}`} id={`item-${item.id}`}>
      <span className="sa-item__number">{number}</span>
      <div className="sa-item__body">
        <div className="sa-item__meta">
          {item.kind !== 'inclusion' && <KindBadge kind={item.kind} />}
          {item.critical && (
            <span className="sa-critical-tag">
              <FlagIcon size={12} /> Critical
            </span>
          )}
          {item.origin?.type === 'ai' && (
            <span className="sa-origin sa-origin--ai">
              <SparkleIcon size={12} /> AI suggestion {item.origin.ref}
            </span>
          )}
          {item.origin?.type === 'historical' && (
            <span className="sa-origin">
              <LibraryIcon size={12} /> {item.origin.ref}
            </span>
          )}
        </div>
        <p className="sa-item__text">{item.text}</p>
        {item.tags.length > 0 && <p className="sa-item__tags">{item.tags.join(' · ')}</p>}
      </div>
      {canEdit && (
        <div className="sa-item__actions" role="group" aria-label={`Actions for ${label}`}>
          <button type="button" className="sa-icon-btn" aria-label={`Edit ${label}`} onClick={onEdit}><EditIcon size={16} /></button>
          <button type="button" className="sa-icon-btn" aria-label={`Duplicate ${label}`} onClick={onDuplicate}><CopyIcon size={16} /></button>
          <button type="button" className="sa-icon-btn" aria-label={`Move ${label} up`} disabled={isFirst} onClick={() => onMove(-1)}><ArrowUpIcon size={16} /></button>
          <button type="button" className="sa-icon-btn" aria-label={`Move ${label} down`} disabled={isLast} onClick={() => onMove(1)}><ArrowDownIcon size={16} /></button>
          <button type="button" className="sa-icon-btn sa-icon-btn--danger" aria-label={`Delete ${label}`} onClick={onDelete}><TrashIcon size={16} /></button>
        </div>
      )}
    </li>
  );
}

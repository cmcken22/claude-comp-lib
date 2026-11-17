import { Chip } from '../../../components/Chip';
import { Input } from '../../../components/Input';
import { cx } from '../../../utils/cx';
import type { ColumnKey } from '../columns';
import { FilterIcon, SearchIcon } from '../icons';
import { VIEWS, type ViewId } from '../views';
import { ColumnsMenu } from './ColumnsMenu';

export interface TableToolbarProps {
  view: ViewId;
  onViewChange: (view: ViewId) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
  hiddenColumns: Set<ColumnKey>;
  onToggleColumn: (key: ColumnKey) => void;
  onResetColumns: () => void;
  query: string;
  onQueryChange: (query: string) => void;
}

/** Saved-view chips on the left; filters, columns and search on the right. */
export function TableToolbar({
  view,
  onViewChange,
  activeFilterCount,
  onOpenFilters,
  hiddenColumns,
  onToggleColumn,
  onResetColumns,
  query,
  onQueryChange,
}: TableToolbarProps) {
  return (
    <div className="cd-toolbar">
      <div className="cd-toolbar__views" role="group" aria-label="Saved views">
        {VIEWS.map((v) => (
          <Chip key={v.id} size="sm" selected={view === v.id} onClick={() => onViewChange(v.id)}>
            {v.label}
          </Chip>
        ))}
      </div>
      <div className="cd-toolbar__tools">
        <button
          type="button"
          className={cx('cd-icon-button', activeFilterCount > 0 && 'cd-icon-button--active')}
          aria-label={`Filters${activeFilterCount ? ` (${activeFilterCount} active)` : ''}`}
          title="Filters"
          onClick={onOpenFilters}
        >
          <FilterIcon />
          {activeFilterCount > 0 && <span className="cd-icon-button__badge">{activeFilterCount}</span>}
        </button>
        <ColumnsMenu hidden={hiddenColumns} onToggle={onToggleColumn} onReset={onResetColumns} />
        <Input
          type="search"
          size="md"
          className="cd-search"
          aria-label="Search budget lines"
          placeholder="Search code, scope or vendor"
          startAdornment={<SearchIcon />}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
    </div>
  );
}

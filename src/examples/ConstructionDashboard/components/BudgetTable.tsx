import { Button } from '../../../components/Button';
import { Checkbox } from '../../../components/Checkbox';
import { cx } from '../../../utils/cx';
import type { Column, ColumnKey } from '../columns';
import type { BudgetLine } from '../data';
import type { SortState } from '../hooks/useBudgetTable';
import { SortIcon } from '../icons';

export interface BudgetTableProps {
  columns: Column[];
  /** Rows on the current page. */
  rows: BudgetLine[];
  /** All filtered rows, used for the totals footer. */
  totalRows: BudgetLine[];
  sort: SortState;
  onSort: (key: ColumnKey) => void;
  selected: Set<string>;
  onToggleRow: (id: string) => void;
  allSelected: boolean;
  someSelected: boolean;
  onTogglePage: () => void;
  onReset: () => void;
}

/** Sortable, selectable table with a totals footer and an empty state. */
export function BudgetTable({
  columns,
  rows,
  totalRows,
  sort,
  onSort,
  selected,
  onToggleRow,
  allSelected,
  someSelected,
  onTogglePage,
  onReset,
}: BudgetTableProps) {
  return (
    <div className="cd-table-wrap" tabIndex={0} aria-label="Budget lines table, scrolls horizontally">
      <table className="cd-table">
        <thead>
          <tr>
            <th scope="col" className="cd-table__select">
              <Checkbox
                aria-label="Select all rows on this page"
                checked={allSelected}
                indeterminate={!allSelected && someSelected}
                onChange={onTogglePage}
                disabled={rows.length === 0}
              />
            </th>
            {columns.map((c) => {
              const dir = sort?.key === c.key ? sort.dir : undefined;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined}
                  className={cx(c.numeric && 'cd-table__num')}
                >
                  <button
                    type="button"
                    className={cx('cd-table__sort', dir && 'cd-table__sort--active')}
                    onClick={() => onSort(c.key)}
                  >
                    {c.header}
                    <SortIcon direction={dir} />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => {
            const isSelected = selected.has(l.id);
            return (
              <tr key={l.id} className={cx(isSelected && 'cd-table__row--selected')}>
                <td className="cd-table__select">
                  <Checkbox
                    aria-label={`Select ${l.costCode} ${l.description}`}
                    checked={isSelected}
                    onChange={() => onToggleRow(l.id)}
                  />
                </td>
                {columns.map((c) => (
                  <td key={c.key} className={cx(c.numeric && 'cd-table__num')}>
                    {c.render(l)}
                  </td>
                ))}
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="cd-table__empty">
                <p>No budget lines match these filters.</p>
                <Button variant="outline" size="sm" onClick={onReset}>
                  Reset view
                </Button>
              </td>
            </tr>
          )}
        </tbody>
        {totalRows.length > 0 && (
          <tfoot>
            <tr>
              <td />
              {columns.map((c) => (
                <td key={c.key} className={cx(c.numeric && 'cd-table__num')}>
                  {c.total?.(totalRows)}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

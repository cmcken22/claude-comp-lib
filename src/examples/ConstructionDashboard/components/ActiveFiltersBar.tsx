import { Button } from '../../../components/Button';
import { Chip } from '../../../components/Chip';
import { STATUS_META } from '../data';
import { DownloadIcon } from '../icons';
import { formatMoney } from '../lib/format';
import { EMPTY_FILTERS, type Filters } from '../views';

export interface ActiveFiltersBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  selectedCount: number;
  onExportSelected: () => void;
  onClearSelection: () => void;
}

/** Removable chips for each applied filter, plus bulk actions when rows are selected. Hidden when neither applies. */
export function ActiveFiltersBar({
  filters,
  onFiltersChange,
  selectedCount,
  onExportSelected,
  onClearSelection,
}: ActiveFiltersBarProps) {
  const chips = [
    ...filters.statuses.map((s) => ({
      key: `status-${s}`,
      label: `Status: ${STATUS_META[s].label}`,
      remove: () => onFiltersChange({ ...filters, statuses: filters.statuses.filter((x) => x !== s) }),
    })),
    ...(filters.vendor
      ? [{ key: 'vendor', label: `Vendor: ${filters.vendor}`, remove: () => onFiltersChange({ ...filters, vendor: '' }) }]
      : []),
    ...(filters.minBudget
      ? [
          {
            key: 'min',
            label: `Revised ≥ ${formatMoney(Number(filters.minBudget), true)}`,
            remove: () => onFiltersChange({ ...filters, minBudget: '' }),
          },
        ]
      : []),
  ];

  if (chips.length === 0 && selectedCount === 0) return null;

  return (
    <div className="cd-subbar">
      {chips.length > 0 && (
        <div className="cd-subbar__chips">
          {chips.map((c) => (
            <Chip key={c.key} size="sm" onRemove={c.remove} removeLabel={`Remove filter ${c.label}`}>
              {c.label}
            </Chip>
          ))}
          <Button variant="ghost" size="sm" onClick={() => onFiltersChange(EMPTY_FILTERS)}>
            Clear filters
          </Button>
        </div>
      )}
      {selectedCount > 0 && (
        <div className="cd-subbar__selection" aria-live="polite">
          <strong>{selectedCount} selected</strong>
          <Button variant="outline" size="sm" startIcon={<DownloadIcon />} onClick={onExportSelected}>
            Export selected
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

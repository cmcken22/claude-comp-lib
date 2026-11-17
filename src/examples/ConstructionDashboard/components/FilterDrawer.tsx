import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button';
import { Checkbox } from '../../../components/Checkbox';
import { Drawer } from '../../../components/Drawer';
import { FormField } from '../../../components/FormField';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { STATUS_META, type LineStatus } from '../data';
import { FilterIcon } from '../icons';
import { EMPTY_FILTERS, VENDORS, type Filters } from '../views';

export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  /** The applied filters; the drawer edits a draft copy until Apply. */
  filters: Filters;
  onApply: (filters: Filters) => void;
}

/** Side drawer for editing table filters. Changes apply only on "Apply filters". */
export function FilterDrawer({ open, onClose, filters, onApply }: FilterDrawerProps) {
  const [draft, setDraft] = useState<Filters>(filters);

  // Start each opening from the currently applied filters.
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const toggleStatus = (s: LineStatus) =>
    setDraft((d) => ({
      ...d,
      statuses: d.statuses.includes(s) ? d.statuses.filter((x) => x !== s) : [...d.statuses, s],
    }));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter budget lines"
      icon={<FilterIcon />}
      placement="right"
      size="sm"
      footer={
        <div className="cd-drawer-footer">
          <Button variant="ghost" onClick={() => setDraft(EMPTY_FILTERS)}>
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Apply filters
          </Button>
        </div>
      }
    >
      <div className="cd-filter-form">
        <fieldset className="cd-fieldset">
          <legend>Status</legend>
          {(Object.keys(STATUS_META) as LineStatus[]).map((s) => (
            <Checkbox
              key={s}
              label={STATUS_META[s].label}
              checked={draft.statuses.includes(s)}
              onChange={() => toggleStatus(s)}
            />
          ))}
        </fieldset>
        <FormField label="Vendor">
          <Select value={draft.vendor} onChange={(e) => setDraft((d) => ({ ...d, vendor: e.target.value }))}>
            <option value="">All vendors</option>
            {VENDORS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Minimum revised budget" hint="Only show lines at or above this amount.">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            step={10000}
            placeholder="0"
            startAdornment="$"
            value={draft.minBudget}
            onChange={(e) => setDraft((d) => ({ ...d, minBudget: e.target.value }))}
          />
        </FormField>
      </div>
    </Drawer>
  );
}

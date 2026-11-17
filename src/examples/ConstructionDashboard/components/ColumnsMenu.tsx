import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../../../components/Button';
import { Checkbox } from '../../../components/Checkbox';
import { cx } from '../../../utils/cx';
import { COLUMNS, type ColumnKey } from '../columns';
import { ColumnsIcon } from '../icons';

export interface ColumnsMenuProps {
  hidden: Set<ColumnKey>;
  onToggle: (key: ColumnKey) => void;
  onReset: () => void;
}

/** Icon button that opens a popover of column visibility checkboxes. */
export function ColumnsMenu({ hidden, onToggle, onReset }: ColumnsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="cd-popover" ref={rootRef}>
      <button
        type="button"
        className={cx('cd-icon-button', hidden.size > 0 && 'cd-icon-button--active')}
        aria-label="Choose columns"
        title="Choose columns"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <ColumnsIcon />
      </button>
      {open && (
        <div id={menuId} className="cd-popover__panel" role="group" aria-label="Visible columns">
          <p className="cd-popover__title">Visible columns</p>
          {COLUMNS.map((c) => (
            <Checkbox
              key={c.key}
              label={c.header}
              checked={!hidden.has(c.key)}
              disabled={c.locked}
              onChange={() => onToggle(c.key)}
            />
          ))}
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset to default
          </Button>
        </div>
      )}
    </div>
  );
}

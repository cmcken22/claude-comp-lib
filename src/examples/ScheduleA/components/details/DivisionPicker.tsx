import { Chip } from '../../../../components/Chip';
import { DIVISIONS } from '../../data/project';

export interface DivisionPickerProps {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  labelId: string;
}

/** Toggle chips for MasterFormat divisions: a trade often carries several. */
export function DivisionPicker({ value, onChange, disabled, labelId }: DivisionPickerProps) {
  const toggle = (d: string) => {
    const next = value.includes(d) ? value.filter((x) => x !== d) : [...value, d];
    // Keep MasterFormat order so the scope reads the same everywhere.
    onChange(DIVISIONS.filter((x) => next.includes(x)));
  };
  return (
    <div className="sa-divisions" role="group" aria-labelledby={labelId}>
      {DIVISIONS.map((d) => (
        <Chip key={d} size="sm" selected={value.includes(d)} disabled={disabled} onClick={() => toggle(d)}>
          {d}
        </Chip>
      ))}
    </div>
  );
}

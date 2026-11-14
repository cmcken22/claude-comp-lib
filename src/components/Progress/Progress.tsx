import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Progress.scss';

export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current value, from 0 to `max`. */
  value: number;
  max?: number;
  tone?: ProgressTone;
  size?: 'sm' | 'md';
  /** Accessible name. Required when no visible label is associated. */
  label?: string;
  /** Show the percentage next to the bar. */
  showValue?: boolean;
  /** Custom text in place of the percentage. */
  valueText?: ReactNode;
}

/** A horizontal bar showing how far along something is. */
export function Progress({
  value,
  max = 100,
  tone = 'accent',
  size = 'md',
  label,
  showValue = false,
  valueText,
  className,
  ...rest
}: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;

  return (
    <div {...rest} className={cx('ds-progress', `ds-progress--${tone}`, `ds-progress--${size}`, className)}>
      <div
        className="ds-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
      >
        <div className="ds-progress__fill" style={{ width: `${percent}%` }} />
      </div>
      {showValue && <span className="ds-progress__value">{valueText ?? `${percent}%`}</span>}
    </div>
  );
}

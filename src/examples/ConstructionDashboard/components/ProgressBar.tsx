import { cx } from '../../../utils/cx';

export interface ProgressBarProps {
  /** Percent complete, 0–100. */
  value: number;
  /** Accessible name for the bar. */
  label: string;
  /** Text after the bar. Defaults to the percentage. */
  caption?: string;
  /** Stretch to the container's width. */
  wide?: boolean;
}

export const ProgressBar = ({ value, label, caption, wide = false }: ProgressBarProps) => (
  <span className={cx('cd-progress', wide && 'cd-progress--wide')}>
    <span
      className="cd-progress__track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span className="cd-progress__fill" style={{ width: `${value}%` }} />
    </span>
    <span className="cd-progress__value">{caption ?? `${value}%`}</span>
  </span>
);

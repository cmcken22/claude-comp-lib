import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Card.scss';

export type StatTrend = 'up' | 'down' | 'flat';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** What is being measured. */
  label: ReactNode;
  /** The headline figure, already formatted. */
  value: ReactNode;
  /** Change versus a previous period, already formatted (e.g. "+12%"). */
  delta?: ReactNode;
  /** Direction of the change; sets the arrow. */
  trend?: StatTrend;
  /**
   * Whether the change is good or bad. Defaults to "up is good"; set
   * `positive` explicitly for metrics where going down is the good outcome.
   */
  positive?: boolean;
  /** Context for the delta, e.g. "vs last month". */
  deltaLabel?: ReactNode;
  /** Decorative icon in the top corner. */
  icon?: ReactNode;
  /** Extra content under the value, e.g. a Progress bar. */
  footer?: ReactNode;
}

const arrows: Record<StatTrend, string> = { up: 'M8 12V4M4 8l4-4 4 4', down: 'M8 4v8M4 8l4 4 4-4', flat: 'M3 8h10' };

/** A single key metric with an optional change indicator. */
export function StatCard({
  label,
  value,
  delta,
  trend = 'flat',
  positive,
  deltaLabel,
  icon,
  footer,
  className,
  ...rest
}: StatCardProps) {
  const isPositive = positive ?? trend !== 'down';
  const tone = trend === 'flat' ? 'neutral' : isPositive ? 'positive' : 'negative';

  return (
    <div {...rest} className={cx('ds-stat-card', className)}>
      <div className="ds-stat-card__top">
        <span className="ds-stat-card__label">{label}</span>
        {icon && (
          <span className="ds-stat-card__icon" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className="ds-stat-card__value">{value}</div>
      {delta != null && (
        <div className="ds-stat-card__meta">
          <span className={cx('ds-stat-card__delta', `ds-stat-card__delta--${tone}`)}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d={arrows[trend]} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {delta}
          </span>
          {deltaLabel != null && <span className="ds-stat-card__delta-label">{deltaLabel}</span>}
        </div>
      )}
      {footer && <div className="ds-stat-card__footer">{footer}</div>}
    </div>
  );
}

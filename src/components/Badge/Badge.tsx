import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Badge.scss';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color meaning. */
  tone?: BadgeTone;
  /** Show a small status dot before the label. */
  dot?: boolean;
  size?: 'sm' | 'md';
}

/** A compact label for statuses, counts and categories. */
export function Badge({ tone = 'neutral', dot = false, size = 'md', className, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={cx('ds-badge', `ds-badge--${tone}`, `ds-badge--${size}`, className)}>
      {dot && <span className="ds-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

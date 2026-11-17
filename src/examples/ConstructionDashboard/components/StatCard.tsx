import type { ReactNode } from 'react';
import { Card } from '../../../components/Card';
import { cx } from '../../../utils/cx';
import { money } from '../lib/format';

export interface StatCardProps {
  label: string;
  /** Dollar amount. */
  value: number;
  footer?: ReactNode;
  tone?: 'default' | 'warning';
}

/** One headline money figure with an optional supporting line. */
export const StatCard = ({ label, value, footer, tone = 'default' }: StatCardProps) => (
  <Card as="article" className={cx('cd-stat', tone === 'warning' && 'cd-stat--warning')}>
    <h2 className="cd-stat__label">{label}</h2>
    <p className="cd-stat__value">
      <span className="cd-stat__currency">$</span>
      {money.format(value)}
    </p>
    {footer && <div className="cd-stat__footer">{footer}</div>}
  </Card>
);

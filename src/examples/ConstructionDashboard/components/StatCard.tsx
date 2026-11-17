import type { ReactNode } from 'react';
import { Card } from '../../../components/Card';
import { money } from '../lib/format';

export interface StatCardProps {
  label: string;
  /** Dollar amount. */
  value: number;
  footer?: ReactNode;
}

/** One headline money figure with an optional supporting line, on the library's Card. */
export const StatCard = ({ label, value, footer }: StatCardProps) => (
  <Card as="article" padding="lg" className="cd-stat">
    <h2 className="cd-stat__label">{label}</h2>
    <p className="cd-stat__value">
      <span className="cd-stat__currency">$</span>
      {money.format(value)}
    </p>
    {footer && <div className="cd-stat__footer">{footer}</div>}
  </Card>
);

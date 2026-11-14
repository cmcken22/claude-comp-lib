import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Card.scss';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Heading shown at the top of the card. */
  title?: ReactNode;
  /** Secondary text under the title. */
  description?: ReactNode;
  /** Content aligned to the end of the header, e.g. buttons. */
  actions?: ReactNode;
  /** Inner spacing. `none` lets content (like a table) run edge to edge. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Element to render as. */
  as?: 'section' | 'article' | 'div';
}

/** A bordered surface that groups related content. */
export function Card({
  title,
  description,
  actions,
  padding = 'md',
  as: Component = 'section',
  className,
  children,
  ...rest
}: CardProps) {
  const hasHeader = title != null || description != null || actions != null;

  return (
    <Component {...rest} className={cx('ds-card', `ds-card--pad-${padding}`, className)}>
      {hasHeader && (
        <div className="ds-card__header">
          <div className="ds-card__heading">
            {title != null && <h2 className="ds-card__title">{title}</h2>}
            {description != null && <p className="ds-card__description">{description}</p>}
          </div>
          {actions != null && <div className="ds-card__actions">{actions}</div>}
        </div>
      )}
      {children}
    </Component>
  );
}

import Link from 'next/link';
import type { ReactNode } from 'react';

export type CardSurface = 'base' | 'raised' | 'glass' | 'outline';
export type CardRadius = 'md' | 'lg';
export type CardPadding = 'sm' | 'md' | 'lg';

export type CardProps = {
  title?: ReactNode;
  body?: ReactNode;
  kicker?: ReactNode;
  href?: string;
  surface?: CardSurface;
  radius?: CardRadius;
  padding?: CardPadding;
  /** Heading level for the title (defaults to h3). */
  headingLevel?: 2 | 3 | 4;
  /** Highlight with the accent border. */
  accent?: boolean;
  as?: 'article' | 'div' | 'li' | 'section';
  nodeId?: string;
  footer?: ReactNode;
  children?: ReactNode;
  'data-testid'?: string;
  'aria-labelledby'?: string;
};

export function Card({
  title,
  body,
  kicker,
  href,
  surface = 'base',
  radius = 'lg',
  padding = 'md',
  headingLevel = 3,
  accent = false,
  as = 'article',
  nodeId,
  footer,
  children,
  ...aria
}: CardProps) {
  const Heading = `h${headingLevel}` as const;
  const attrs = {
    className: 'ui-card',
    'data-surface': surface,
    'data-radius': radius,
    'data-padding': padding,
    'data-accent': accent ? 'true' : undefined,
    'data-interactive': href ? 'true' : undefined,
    'data-node-id': nodeId,
    ...aria,
  };
  const inner = (
    <>
      {kicker ? <p className="ui-card__kicker">{kicker}</p> : null}
      {title ? <Heading className="ui-card__title">{title}</Heading> : null}
      {body ? <p className="ui-card__body">{body}</p> : null}
      {children}
      {footer ? <div className="ui-card__footer">{footer}</div> : null}
    </>
  );
  if (href) {
    return (
      <Link href={href} {...attrs}>
        {inner}
      </Link>
    );
  }
  const Tag = as;
  return <Tag {...attrs}>{inner}</Tag>;
}

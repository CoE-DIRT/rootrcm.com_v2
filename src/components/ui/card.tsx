import Link from 'next/link';
import type { ReactNode } from 'react';

type CardProps = {
  title: string;
  body?: string;
  href?: string;
  kicker?: string;
  children?: ReactNode;
  className?: string;
  nodeId?: string;
};

export function Card({ title, body, href, kicker, children, className = '', nodeId }: CardProps) {
  const inner = (
    <>
      {kicker ? <p className="eyebrow">{kicker}</p> : null}
      <h3 className="text-lg font-bold">{title}</h3>
      {body ? <p className="muted mt-2 text-sm">{body}</p> : null}
      {children}
    </>
  );
  const cls = `surface block p-[18px] ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} data-node-id={nodeId}>
        {inner}
      </Link>
    );
  }
  return (
    <article className={cls} data-node-id={nodeId}>
      {inner}
    </article>
  );
}

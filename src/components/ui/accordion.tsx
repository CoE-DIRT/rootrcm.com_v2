import type { ReactNode } from 'react';

export type AccordionProps = { title: ReactNode; children: ReactNode; defaultOpen?: boolean };

/** Native <details> disclosure: keyboard and screen-reader support without JS. */
export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  return (
    <details className="ui-accordion" open={defaultOpen || undefined}>
      <summary>{title}</summary>
      <div className="ui-accordion__body">{children}</div>
    </details>
  );
}

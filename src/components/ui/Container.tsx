import type { ReactNode } from 'react';

export type ContainerProps = {
  children: ReactNode;
  width?: 'default' | 'narrow';
  as?: 'div' | 'header' | 'footer' | 'nav';
};

/** Max-width wrapper: min(1440px, 92vw), centered. */
export function Container({ children, width = 'default', as = 'div' }: ContainerProps) {
  const Tag = as;
  return (
    <Tag className="ui-container" data-width={width}>
      {children}
    </Tag>
  );
}

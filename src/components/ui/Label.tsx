import type { LabelHTMLAttributes, ReactNode } from 'react';

export type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'className' | 'style'> & {
  required?: boolean;
  children: ReactNode;
};

export function Label({ required, children, ...rest }: LabelProps) {
  return (
    <label {...rest} className="ui-label">
      {children}
      {required ? (
        <span className="ui-label__required" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}

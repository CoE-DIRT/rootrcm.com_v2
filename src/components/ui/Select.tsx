import type { ReactNode, SelectHTMLAttributes } from 'react';
import { describedById, FormField } from './FormField';

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'style' | 'id'> & {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
};

export function Select({ id, label, error, hint, required, disabled, children, ...rest }: SelectProps) {
  return (
    <FormField id={id} label={label} error={error} hint={hint} required={required} disabled={disabled}>
      <div className="ui-select">
        <select
          {...rest}
          id={id}
          className="ui-input ui-select__control"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById(id, error, hint)}
        >
          {children}
        </select>
        <svg className="ui-select__chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </FormField>
  );
}

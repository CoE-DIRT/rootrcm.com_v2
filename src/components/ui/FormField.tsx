import type { ReactNode } from 'react';
import { Label } from './Label';

export type FormFieldProps = {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Optional element aligned to the right of the label (e.g. "Forgot password?"). */
  labelAside?: ReactNode;
  children: ReactNode;
};

export function describedById(id: string, error?: string, hint?: ReactNode) {
  const ids = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

/** Label + control + hint + inline error. Errors are announced via role="alert". */
export function FormField({ id, label, error, hint, required, disabled, labelAside, children }: FormFieldProps) {
  return (
    <div className="ui-field" data-invalid={error ? 'true' : undefined} data-disabled={disabled ? 'true' : undefined}>
      <div className="ui-field__head">
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        {labelAside}
      </div>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="ui-field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="ui-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

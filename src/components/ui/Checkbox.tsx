import type { InputHTMLAttributes, ReactNode } from 'react';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'style' | 'id'> & {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
};

export function Checkbox({ id, label, error, hint, required, disabled, ...rest }: CheckboxProps) {
  const described = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className="ui-check" data-invalid={error ? 'true' : undefined} data-disabled={disabled ? 'true' : undefined}>
      <div className="ui-check__row">
        <input
          {...rest}
          id={id}
          type="checkbox"
          className="ui-check__box"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
        />
        <label htmlFor={id} className="ui-check__label">
          {label}
        </label>
      </div>
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

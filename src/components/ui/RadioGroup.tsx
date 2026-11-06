import type { ReactNode } from 'react';

export type RadioOption = { value: string; label: ReactNode; hint?: ReactNode; disabled?: boolean };

export type RadioGroupProps = {
  name: string;
  legend: ReactNode;
  options: readonly RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

export function RadioGroup({ name, legend, options, value, defaultValue, onChange, error, required, disabled }: RadioGroupProps) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <fieldset className="ui-radio-group" aria-describedby={errorId} data-invalid={error ? 'true' : undefined} disabled={disabled}>
      <legend className="ui-label">
        {legend}
        {required ? (
          <span className="ui-label__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>
      <div className="ui-radio-group__options">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          return (
            <div key={option.value} className="ui-radio">
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                className="ui-radio__dot"
                required={required}
                disabled={option.disabled}
                {...(value !== undefined ? { checked: value === option.value } : { defaultChecked: defaultValue === option.value })}
                onChange={(event) => onChange?.(event.currentTarget.value)}
              />
              <label htmlFor={id} className="ui-radio__label">
                <span>{option.label}</span>
                {option.hint ? <span className="ui-field__hint">{option.hint}</span> : null}
              </label>
            </div>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} className="ui-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

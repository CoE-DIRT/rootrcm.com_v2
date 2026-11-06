import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from 'react';
import { describedById, FormField } from './FormField';

type FieldProps = {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  labelAside?: ReactNode;
};

export type InputProps = FieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'id'> & { ref?: Ref<HTMLInputElement> };

export function Input({ id, label, error, hint, labelAside, required, disabled, ...rest }: InputProps) {
  return (
    <FormField id={id} label={label} error={error} hint={hint} required={required} disabled={disabled} labelAside={labelAside}>
      <input
        {...rest}
        id={id}
        className="ui-input"
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById(id, error, hint)}
      />
    </FormField>
  );
}

export type TextAreaProps = FieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'style' | 'id'>;

export function TextArea({ id, label, error, hint, labelAside, required, disabled, ...rest }: TextAreaProps) {
  return (
    <FormField id={id} label={label} error={error} hint={hint} required={required} disabled={disabled} labelAside={labelAside}>
      <textarea
        {...rest}
        id={id}
        className="ui-input ui-input--area"
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById(id, error, hint)}
      />
    </FormField>
  );
}

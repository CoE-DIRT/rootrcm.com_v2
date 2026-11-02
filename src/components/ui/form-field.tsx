import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

type Common = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export function describedById(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: Common & { children: ReactNode }) {
  return (
    <div className="field" data-node-id="3:42">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="muted text-sm">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput(props: Common & InputHTMLAttributes<HTMLInputElement>) {
  const { id, label, error, hint, ...rest } = props;
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <input
        {...rest}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedById(id, error, hint)}
      />
    </FormField>
  );
}

export function TextArea(props: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { id, label, error, hint, ...rest } = props;
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <textarea
        {...rest}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedById(id, error, hint)}
      />
    </FormField>
  );
}

export function SelectField(props: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  const { id, label, error, hint, children, ...rest } = props;
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <select
        {...rest}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedById(id, error, hint)}
      >
        {children}
      </select>
    </FormField>
  );
}

'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { IconButton } from './IconButton';
import { describedById, FormField } from './FormField';
import type { InputProps } from './Input';

export type PasswordInputProps = Omit<InputProps, 'type'> & {
  showLabel?: string;
  hideLabel?: string;
};

export function PasswordInput({
  id,
  label,
  error,
  hint,
  labelAside,
  required,
  disabled,
  showLabel = 'Show password',
  hideLabel = 'Hide password',
  ...rest
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <FormField id={id} label={label} error={error} hint={hint} required={required} disabled={disabled} labelAside={labelAside}>
      <div className="ui-input-group">
        <input
          {...rest}
          id={id}
          type={visible ? 'text' : 'password'}
          className="ui-input"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById(id, error, hint)}
        />
        <span className="ui-input-group__action">
          <IconButton
            aria-label={visible ? hideLabel : showLabel}
            aria-pressed={visible}
            aria-controls={id}
            disabled={disabled}
            onClick={() => setVisible((v) => !v)}
            icon={visible ? <EyeOff size={20} strokeWidth={1.75} aria-hidden="true" /> : <Eye size={20} strokeWidth={1.75} aria-hidden="true" />}
          />
        </span>
      </div>
    </FormField>
  );
}

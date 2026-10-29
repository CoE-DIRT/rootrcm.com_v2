import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  size?: 'md' | 'lg';
};

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  size = 'md',
  className = '',
  children,
  ...props
}: Props) {
  const variantClass =
    variant === 'secondary' ? 'btn-secondary' : variant === 'ghost' ? 'btn-ghost' : 'btn-primary';
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={`${variantClass} ${size === 'lg' ? 'btn-lg' : ''} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading}
      data-node-id="3:21"
    >
      {loading ? 'Working…' : children}
    </button>
  );
}

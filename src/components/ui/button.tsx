import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
};

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  size = 'md',
  icon,
  className = '',
  children,
  ...props
}: Props) {
  const variantClass =
    variant === 'secondary'
      ? 'btn-secondary'
      : variant === 'outline'
        ? 'btn-outline'
        : variant === 'ghost'
          ? 'btn-ghost'
          : 'btn-primary';
  const sizeClass = size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '';
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={`${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading}
      data-node-id="3:21"
    >
      {loading ? <span className="sr-only">Loading</span> : null}
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </button>
  );
}

import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  /** Square control sized to the button height. Use IconButton for icon-only actions. */
  iconOnly?: boolean;
  /** Content alignment for list-row style actions. */
  align?: 'center' | 'start';
  /** Renders an anchor element. Implied whenever `href` is provided. */
  asChild?: boolean;
  children?: ReactNode;
};

export type ButtonAsButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'> & {
    href?: undefined;
    ref?: Ref<HTMLButtonElement>;
  };

export type ButtonAsLinkProps = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style' | 'children' | 'href'> & {
    href: string;
    prefetch?: boolean;
    ref?: Ref<HTMLAnchorElement>;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function isExternal(href: string) {
  return /^(https?:|mailto:|tel:|#)/.test(href);
}

function Spinner() {
  return (
    <svg className="ui-btn__spinner" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The single button primitive. Every clickable CTA, control and link-styled
 * action renders through this component; variants and sizes are styled only
 * in src/styles/ui.css (.ui-btn).
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    isLoading = false,
    fullWidth = false,
    iconOnly = false,
    align = 'center',
    asChild: _asChild,
    children,
    ...rest
  } = props;
  void _asChild;

  const shared = {
    className: 'ui-btn',
    'data-variant': variant,
    'data-size': size,
    'data-full': fullWidth ? 'true' : undefined,
    'data-icon-only': iconOnly ? 'true' : undefined,
    'data-align': align === 'start' ? 'start' : undefined,
    'data-loading': isLoading ? 'true' : undefined,
  } as const;

  const content = (
    <>
      {isLoading ? <Spinner /> : leftIcon ? <span className="ui-btn__icon">{leftIcon}</span> : null}
      {children !== undefined && children !== null ? <span className="ui-btn__label">{children}</span> : null}
      {rightIcon && !isLoading ? <span className="ui-btn__icon">{rightIcon}</span> : null}
    </>
  );

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, prefetch, ref, ...anchor } = rest as Omit<ButtonAsLinkProps, keyof ButtonOwnProps>;
    if (isExternal(href)) {
      return (
        <a {...anchor} {...shared} ref={ref} href={href} aria-busy={isLoading || undefined}>
          {content}
        </a>
      );
    }
    return (
      <Link {...anchor} {...shared} ref={ref} href={href} prefetch={prefetch} aria-busy={isLoading || undefined}>
        {content}
      </Link>
    );
  }

  const { type, disabled, ref, ...button } = rest as Omit<ButtonAsButtonProps, keyof ButtonOwnProps>;
  return (
    <button
      {...button}
      {...shared}
      ref={ref}
      type={type ?? 'button'}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {content}
    </button>
  );
}

import type { ReactNode } from 'react';
import { Button, type ButtonAsButtonProps, type ButtonAsLinkProps } from './Button';

type IconButtonOwn = {
  /** Accessible name is mandatory for icon-only controls. */
  'aria-label': string;
  icon: ReactNode;
  size?: 'md' | 'lg';
};

type Stripped = 'children' | 'leftIcon' | 'rightIcon' | 'iconOnly' | 'size';

export type IconButtonProps =
  | (IconButtonOwn & Omit<ButtonAsButtonProps, Stripped>)
  | (IconButtonOwn & Omit<ButtonAsLinkProps, Stripped>);

/** 44×44 minimum tap target. Used for the nav menu toggle, drawer close and toggles. */
export function IconButton({ icon, variant = 'ghost', size = 'md', ...rest }: IconButtonProps) {
  return <Button {...(rest as ButtonAsButtonProps)} variant={variant} size={size} iconOnly leftIcon={icon} />;
}

import type { ReactNode } from 'react';

export type BadgeStatus = 'submitted' | 'pending' | 'denied' | 'paid' | 'neutral';

export type BadgeProps = {
  status: BadgeStatus;
  children: ReactNode;
  /** Hide the leading status dot. */
  plain?: boolean;
};

/** Status pill. Colour is never the only signal — the label always names the state. */
export function Badge({ status, children, plain = false }: BadgeProps) {
  return (
    <span className="ui-badge" data-status={status}>
      {plain ? null : <span className="ui-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

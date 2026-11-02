import seed from '../../../../data/seed/portal-prior-auth.example.json' with { type: 'json' };
import type { PortalPriorAuthRow } from './types.ts';

export function loadPortalPriorAuth(): readonly PortalPriorAuthRow[] {
  return seed.rows as readonly PortalPriorAuthRow[];
}

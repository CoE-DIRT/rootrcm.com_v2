import seed from '../../../../data/seed/portal-prior-auth.example.json';
import type { PortalPriorAuthRow } from './types';

export function loadPortalPriorAuth(): readonly PortalPriorAuthRow[] {
  return seed.rows as readonly PortalPriorAuthRow[];
}

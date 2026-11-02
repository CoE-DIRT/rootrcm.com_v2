import seed from '../../../../data/seed/portal-audit-log.example.json' with { type: 'json' };
import type { PortalAuditEvent } from './types.ts';

export function loadPortalAuditLog(): readonly PortalAuditEvent[] {
  return seed.events as readonly PortalAuditEvent[];
}

import seed from '../../../../data/seed/portal-audit-log.example.json';
import type { PortalAuditEvent } from './types';

export function loadPortalAuditLog(): readonly PortalAuditEvent[] {
  return seed.events as readonly PortalAuditEvent[];
}

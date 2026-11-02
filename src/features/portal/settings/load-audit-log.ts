import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PortalAuditEvent } from './types.ts';

type AuditSeed = { events: PortalAuditEvent[] };

function readAuditSeed(): AuditSeed {
  const file = join(process.cwd(), 'data', 'seed', 'portal-audit-log.example.json');
  return JSON.parse(readFileSync(file, 'utf8')) as AuditSeed;
}

let cached: readonly PortalAuditEvent[] | null = null;

export function loadPortalAuditLog(): readonly PortalAuditEvent[] {
  if (!cached) cached = readAuditSeed().events;
  return cached;
}

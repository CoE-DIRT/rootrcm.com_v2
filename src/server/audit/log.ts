export type AuditResult = 'allow' | 'deny' | 'error' | 'noop';

export type AuditEvent = {
  actorUserId: string | 'system' | 'anonymous';
  orgId?: string;
  action: string;
  result: AuditResult;
  correlationId: string;
  at: string;
};

export interface AuditLog {
  append(event: AuditEvent): Promise<void>;
}

/** Default production-shaped sink until a durable store exists. */
export const noopAuditLog: AuditLog = {
  async append() {
    return;
  },
};

export class MemoryAuditLog implements AuditLog {
  readonly events: AuditEvent[] = [];

  async append(event: AuditEvent): Promise<void> {
    this.events.push(event);
  }
}

export function createAuditEvent(
  partial: Omit<AuditEvent, 'at'> & { at?: string },
): AuditEvent {
  return {
    ...partial,
    at: partial.at ?? new Date().toISOString(),
  };
}

export function getAuditLog(): AuditLog {
  return noopAuditLog;
}

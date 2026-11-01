import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuditEvent, getAuditLog, MemoryAuditLog, noopAuditLog } from '../src/server/audit/log.ts';

test('noop audit log appends without throwing', async () => {
  await noopAuditLog.append(
    createAuditEvent({
      actorUserId: 'anonymous',
      action: 'inquiry.submit',
      result: 'noop',
      correlationId: 'corr-audit',
    }),
  );
  const configured = getAuditLog();
  await configured.append(
    createAuditEvent({
      actorUserId: 'system',
      action: 'bootstrap',
      result: 'noop',
      correlationId: 'corr-audit-2',
    }),
  );
});

test('memory audit log records appends for local tests', async () => {
  const log = new MemoryAuditLog();
  await log.append(
    createAuditEvent({
      actorUserId: 'user-a',
      orgId: 'sample-solo',
      action: 'organization.read',
      result: 'deny',
      correlationId: 'corr-mem',
    }),
  );
  assert.equal(log.events.length, 1);
  assert.equal(log.events[0]?.result, 'deny');
  assert.equal(log.events[0]?.orgId, 'sample-solo');
});

import { createHash } from 'node:crypto';
// Per-instance backstop. Deployment must additionally enforce a shared ingress limit.
const attempts = new Map<string, { count: number; until: number }>();
export function allowAuthAttempt(email: string, now = Date.now()): boolean {
  for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
  const key = createHash('sha256').update(email).digest('hex');
  const value = attempts.get(key);
  if (!value && attempts.size >= 10000) return false;
  if (value) return ++value.count <= 5;
  attempts.set(key, { count: 1, until: now + 60000 });
  return true;
}

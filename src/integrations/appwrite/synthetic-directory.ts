import type { AuthContext } from '../../server/auth/policy.ts';
import type { Role } from '../../domain/identity/roles.ts';

export type SyntheticSession = {
  secret: string;
  userId: string;
  expiresAt: number;
};

/**
 * Contract fixture for identity, session, and membership checks.
 * This is not the live Appwrite project and it does not open a network call.
 */
export class SyntheticAppwriteDirectory {
  private readonly sessions = new Map<string, SyntheticSession>();
  private readonly memberships: { userId: string; orgId: string; role: Role }[] = [];

  addMembership(userId: string, orgId: string, role: Role): void {
    this.memberships.push({ userId, orgId, role });
  }

  createSession(userId: string, secret: string, expiresAt: number): void {
    this.sessions.set(secret, { secret, userId, expiresAt });
  }

  resolve(secret: string | null | undefined, now = Date.now()): AuthContext {
    if (!secret) return { session: null, memberships: [] };
    const session = this.sessions.get(secret);
    if (!session || session.expiresAt <= now) return { session: null, memberships: [] };
    return {
      session: { userId: session.userId, email: `${session.userId}@example.invalid` },
      memberships: this.memberships
        .filter((item) => item.userId === session.userId)
        .map((item) => ({ orgId: item.orgId, role: item.role })),
    };
  }
}

/** Live Appwrite Auth is not wired. A cookie never becomes a principal here. */
export function resolveProductionAppwriteSession(cookieHeader: string | null | undefined): {
  status: 'disabled';
  session: null;
} {
  void cookieHeader;
  return { status: 'disabled', session: null };
}

import { getFeatureFlags } from '../../lib/flags.ts';
import type { AuthContext, SessionPrincipal } from './policy.ts';

/** Placeholder cookie name. Unverified cookies are never treated as sessions. */
export const SESSION_COOKIE_NAME = 'root_v2_session';

/**
 * Cookie bytes are not a session. Appwrite Auth validation is not wired;
 * this helper always returns null so untrusted cookies cannot mint a principal.
 */
export function principalFromCookieHeader(cookieHeader: string | null | undefined): SessionPrincipal | null {
  void cookieHeader;
  return null;
}

export function getAuthContext(cookieHeader?: string | null): AuthContext {
  const flags = getFeatureFlags();
  if (!flags.auth) {
    return { session: null, memberships: [] };
  }
  const session = principalFromCookieHeader(cookieHeader);
  if (!session) return { session: null, memberships: [] };
  return { session, memberships: [] };
}

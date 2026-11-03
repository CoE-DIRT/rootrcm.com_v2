import { assertLiveAuthConfigured, ROOT_AUTH_ENDPOINT, authConfig } from './live-config.ts';

export class AuthError extends Error {
  status: number;
  constructor(status: number) { super('authentication_failed'); this.status = status; }
}
/** Server-only REST transport. Never return Appwrite errors or token objects to browsers. */
export async function authRequest<T>(path: string, method = 'GET', body?: unknown, session?: string, admin = false): Promise<T> {
  if (typeof window !== 'undefined') throw new Error('server_only');
  const key = assertLiveAuthConfigured();
  const response = await fetch(`${ROOT_AUTH_ENDPOINT}${path}`, {
    method, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
    headers: { 'content-type': 'application/json', 'X-Appwrite-Project': authConfig()!.projectId,
      ...(session ? { 'X-Appwrite-Session': session } : {}),
      ...(admin ? { 'X-Appwrite-Key': key } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new AuthError(response.status);
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

/** Server-only isolated staging configuration. No public or historical project fallback. */
export const ROOT_AUTH_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
export const ROOT_AUTH_COOKIE = 'root_v2_auth';

export function stagingAuthConfig(): { projectId: string; origin: string } | null {
  const projectId = process.env.APPWRITE_AUTH_PROJECT_ID;
  const origin = process.env.ROOT_AUTH_ORIGIN;
  if (process.env.ROOT_AUTH_ENVIRONMENT !== 'staging' || !projectId ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(projectId) || !origin) return null;
  const publicProject = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (publicProject && publicProject !== projectId) return null;
  try {
    const url = new URL(origin);
    if (url.origin !== origin || ['rootrcm.com', 'www.rootrcm.com'].includes(url.hostname) ||
        (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && url.hostname === 'localhost' && url.protocol === 'http:'))) return null;
  } catch { return null; }
  return { projectId, origin };
}

export function liveAuthEnabled(): boolean {
  return process.env.ROOT_ENABLE_AUTH === 'true' && process.env.ROOT_ENABLE_LIVE_AUTH === 'true' &&
    stagingAuthConfig() !== null && !!process.env.APPWRITE_DATABASE_ID &&
    typeof process.env.APPWRITE_AUTH_API_KEY === 'string' &&
    process.env.APPWRITE_AUTH_API_KEY.trim().length > 0;
}

export function assertLiveAuthConfigured(): string {
  if (!liveAuthEnabled()) throw new Error('live_auth_not_configured');
  return process.env.APPWRITE_AUTH_API_KEY as string;
}

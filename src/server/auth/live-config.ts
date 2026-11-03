/** Server-only explicit auth configuration. No public or historical project fallback. */
export const ROOT_AUTH_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
export const ROOT_AUTH_COOKIE = 'root_v2_auth';
// Approval guard only: the environment must still supply the project explicitly.
const productionProjectId = '6ae878f400268114a480';

export function authConfig(): { projectId: string; origin: string } | null {
  const environment = process.env.ROOT_AUTH_ENVIRONMENT;
  const projectId = process.env.APPWRITE_AUTH_PROJECT_ID;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const origin = process.env.ROOT_AUTH_ORIGIN;
  const validId = (id: string | undefined) => !!id && /^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(id);
  if (!['staging', 'production'].includes(environment ?? '') || !validId(projectId) ||
      !validId(databaseId) || !origin) return null;
  if (environment === 'production' && projectId !== productionProjectId) return null;
  const publicProject = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (publicProject && publicProject !== projectId) return null;
  try {
    const url = new URL(origin);
    const localHttp = environment === 'staging' && process.env.NODE_ENV !== 'production' &&
      url.hostname === 'localhost' && url.protocol === 'http:';
    if (url.origin !== origin || (url.protocol !== 'https:' && !localHttp) ||
        (environment === 'production' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '[::1]')) ||
        (environment === 'staging' && ['rootrcm.com', 'www.rootrcm.com'].includes(url.hostname))) return null;
  } catch { return null; }
  return { projectId: projectId!, origin };
}

export function liveAuthEnabled(): boolean {
  return process.env.ROOT_ENABLE_AUTH === 'true' && process.env.ROOT_ENABLE_LIVE_AUTH === 'true' &&
    authConfig() !== null && typeof process.env.APPWRITE_AUTH_API_KEY === 'string' &&
    process.env.APPWRITE_AUTH_API_KEY.trim().length > 0;
}

export function assertLiveAuthConfigured(): string {
  if (!liveAuthEnabled()) throw new Error('live_auth_not_configured');
  return process.env.APPWRITE_AUTH_API_KEY as string;
}

export function canonicalAuthRedirect(url: URL, requestHost?: string | null): URL | null {
  if (process.env.ROOT_AUTH_ENVIRONMENT !== 'production' || !liveAuthEnabled() ||
      !/^\/(en|es)\/(sign-in|dashboard)(\/|$)/.test(url.pathname)) return null;
  const canonical = new URL(authConfig()!.origin);
  // Appwrite's edge proxy can reconstruct nextUrl using an INTERNAL hostname.
  // Its incoming Host header retains the browser's public hostname. Prefer
  // that host for GET-only canonical routing; otherwise fall back to nextUrl.
  // Login POSTs still independently require the exact trusted HTTPS Origin.
  const observedHost = requestHost && requestHost.trim()
    ? requestHost.trim().toLowerCase()
    : url.host.toLowerCase();
  if (observedHost === canonical.host.toLowerCase()) return null;
  return new URL(url.pathname + url.search, canonical.origin);
}

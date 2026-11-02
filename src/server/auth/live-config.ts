/** Server-only Appwrite V2 configuration. No fallback to V1. */
export const ROOT_AUTH_PROJECT = '6ae878f400268114a480';
export const ROOT_AUTH_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
export const ROOT_AUTH_COOKIE = 'root_v2_auth';

export function liveAuthEnabled(): boolean {
  return process.env.ROOT_ENABLE_LIVE_AUTH === 'true' &&
    typeof process.env.APPWRITE_AUTH_API_KEY === 'string' &&
    process.env.APPWRITE_AUTH_API_KEY.length > 0;
}

export function assertLiveAuthConfigured(): string {
  if (!liveAuthEnabled()) throw new Error('live_auth_not_configured');
  return process.env.APPWRITE_AUTH_API_KEY as string;
}

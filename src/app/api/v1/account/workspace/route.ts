import { handleWorkspaceProvision } from '@/server/signup/http';

export const runtime = 'nodejs';

/** Fails closed (503) unless ROOT_ENABLE_SIGNUP_PROVISIONING=true plus a dedicated provisioning key. */
export async function POST(request: Request) {
  return handleWorkspaceProvision(request);
}

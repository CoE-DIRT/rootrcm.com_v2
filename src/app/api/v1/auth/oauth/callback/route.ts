import { handleOAuthCallback } from '@/server/auth/oauth';

export const runtime = 'nodejs';
export function GET(request: Request) {
  return handleOAuthCallback(request);
}

import { handleOAuthStart } from '@/server/auth/oauth';

export const runtime = 'nodejs';
export function GET(request: Request) {
  return handleOAuthStart(request);
}

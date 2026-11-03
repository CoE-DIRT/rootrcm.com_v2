import { handleAuth } from '@/server/auth/http';
export const runtime = 'nodejs';
export async function POST(request: Request, context: { params: Promise<{ action: string }> }) {
  return handleAuth(request, (await context.params).action);
}

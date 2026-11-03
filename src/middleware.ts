import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPreviewPrefetch } from '@/server/operations/session';
import { bindPreviewCookies } from '@/server/operations/session-http';
import { canonicalAuthRedirect } from '@/server/auth/live-config';

const locales = new Set(['en', 'es']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Host-only auth cookies must never be split between preview and canonical hosts.
  const canonical = canonicalAuthRedirect(request.nextUrl, request.headers.get('host'));
  if (canonical) return NextResponse.redirect(canonical);
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const first = pathname.split('/')[1] ?? '';
  if (!locales.has(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-root-locale', first);
  const rest = pathname.slice(first.length + 1) || '/';
  requestHeaders.set('x-root-path', rest.startsWith('/') ? rest : `/${rest}`);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  // Prefetch must not mint or replace preview cookies. A cached staff click
  // can skip middleware; PreviewSessionBinder repeats the bind on a real visit.
  if (isPreviewPrefetch(request.headers)) return response;
  return bindPreviewCookies(request, response);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPreviewPrefetch } from '@/server/operations/session';
import { bindPreviewCookies } from '@/server/operations/session-http';

const locales = new Set(['en', 'es']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
  // Staff preview links to credentialing. Prefetching that route must not
  // replace the operator cookie with the client capability.
  if (isPreviewPrefetch(request.headers)) return response;
  return bindPreviewCookies(request, response);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

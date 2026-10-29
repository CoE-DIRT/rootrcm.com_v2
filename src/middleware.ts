import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = new Set(['en', 'es']);

export function middleware(request: NextRequest) {
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
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

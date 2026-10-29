import type { Locale } from '@/i18n/locales';

export const publicNav = [
  { href: '/why-root', key: 'whyRoot' as const },
  { href: '/services', key: 'services' as const },
  { href: '/technology', key: 'technology' as const },
  { href: '/plans', key: 'plans' as const },
  { href: '/resources', key: 'resources' as const },
  { href: '/company', key: 'company' as const },
];

export function localizedPath(locale: Locale, path = '') {
  const suffix = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `/${locale}${suffix}`;
}

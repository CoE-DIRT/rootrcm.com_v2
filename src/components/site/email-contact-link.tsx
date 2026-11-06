'use client';
import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

/**
 * Mail-handler extensions can rewrite SSR mailto href attributes before React
 * hydrates. Render a usable first-party contact link through hydration,
 * then enhance it to mailto after the browser has mounted the component.
 */
export function EmailContactLink({ locale }: { locale: Locale }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <a href={mounted ? 'mailto:info@rootrcm.com' : localizedPath(locale, '/contact')} className="ui-footer__link">
      <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
      info@rootrcm.com
    </a>
  );
}

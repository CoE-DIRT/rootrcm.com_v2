'use client';
import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

/**
 * Mail-handler extensions can rewrite SSR mailto href attributes before React
 * hydrates. Render a usable first-party consultation link through hydration,
 * then enhance it to mailto after the browser has mounted the component.
 * The initial server and client render remain identical; no warning suppression.
 */
export function EmailContactLink({ locale }: { locale: Locale }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <a
      href={mounted ? 'mailto:info@rootrcm.com' : localizedPath(locale, '/consultation')}
      className="inline-flex items-center gap-2 hover:text-[var(--cyan)]"
    >
      <Mail className="size-4" aria-hidden="true" />
      info@rootrcm.com
    </a>
  );
}

import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';

export function SkipLink({ locale }: { locale: Locale }) {
  return (
    <a className="skip-link" href="#main" suppressHydrationWarning>
      {copy(locale).skip}
    </a>
  );
}

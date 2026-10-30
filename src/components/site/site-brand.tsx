import Image from 'next/image';
import type { Locale } from '@/i18n/locales';

/**
 * Founder-approved Demo 6 originals in public/brand/.
 * Native ratios: mark 250×243, logo 346×220. Do not redraw.
 */
export function SiteBrand({ compact = false, locale = 'en' }: { compact?: boolean; locale?: Locale }) {
  const tagline = locale === 'es' ? 'Operaciones y resultados de ingresos' : 'Revenue operations & outcomes';
  return (
    <span className="inline-flex min-h-11 items-center gap-2.5" data-testid="root-brand-lockup">
      <span className="inline-flex shrink-0 items-center justify-center rounded-[11px] border border-[var(--border)] bg-[#071326] px-1.5 py-1 shadow-[0_6px_18px_rgba(0,0,0,.14)]">
        {compact ? (
          <Image
            src="/brand/mark.webp"
            width={250}
            height={243}
            alt=""
            aria-hidden="true"
            className="h-9 w-auto object-contain"
            priority
          />
        ) : (
          <Image
            src="/brand/logo.webp"
            width={346}
            height={220}
            alt="ROOT"
            priority
            className="h-9 w-auto object-contain sm:h-10"
          />
        )}
      </span>
      {!compact && (
        <span className="hidden text-[8px] font-bold uppercase leading-tight tracking-[0.18em] text-[var(--muted)] xl:block">
          {tagline}
        </span>
      )}
    </span>
  );
}

import Image from 'next/image';
import type { Locale } from '@/i18n/locales';

/**
 * Uses the original ROOT mark extracted unchanged from the approved Demo 6.
 * Preserve its native aspect ratio in every shared navigation/footer placement.
 */
export function SiteBrand({
  compact = false,
  locale = 'en',
}: {
  compact?: boolean;
  locale?: Locale;
}) {
  return (
    <span className="inline-flex min-h-11 items-center gap-2.5" data-testid="root-brand-lockup">
      <Image
        src="/brand/mark.webp"
        width={250}
        height={243}
        alt=""
        aria-hidden="true"
        className="h-auto w-10 shrink-0 object-contain"
      />
      <span className="flex flex-col justify-center">
        <span className="text-[25px] font-black leading-[0.98] tracking-[-0.06em] sm:text-[29px]">
          ROOT<span className="text-[var(--cyan)]">.</span>
        </span>
        {!compact && (
          <span className="mt-1 hidden text-[8px] font-bold uppercase leading-tight tracking-[0.18em] text-[var(--muted)] xl:block">
            {locale === 'es'
              ? 'Operaciones y resultados de ingresos'
              : 'Revenue operations & outcomes'}
          </span>
        )}
      </span>
    </span>
  );
}

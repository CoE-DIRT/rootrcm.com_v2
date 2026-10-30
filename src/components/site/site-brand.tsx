import Image from 'next/image';
import type { Locale } from '@/i18n/locales';

/**
 * Uses the existing ROOT icon.svg asset, rather than an invented third-party logo.
 * The favicon mark and navigation brand stay in sync across breakpoints.
 */
export function SiteBrand({ compact = false, locale = 'en' }: { compact?: boolean; locale?: Locale }) {
  return (
    <span className="inline-flex min-h-11 items-center gap-2.5" data-testid="root-brand-lockup">
      <Image src="/icon.svg" width={40} height={40} alt="" aria-hidden="true" className="size-10 shrink-0 rounded-[11px] border border-[var(--border)] shadow-[0_6px_18px_rgba(0,0,0,.14)]" />
      <span className="flex flex-col justify-center">
        <span className="text-[25px] font-black leading-[0.98] tracking-[-0.06em] sm:text-[29px]">ROOT<span className="text-[var(--cyan)]">.</span></span>
        {!compact && <span className="mt-1 hidden text-[8px] font-bold uppercase leading-tight tracking-[0.18em] text-[var(--muted)] xl:block">{locale === 'es' ? 'Operaciones y resultados de ingresos' : 'Revenue operations & outcomes'}</span>}
      </span>
    </span>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/i18n/locales';

/**
 * Shared cinematic commercial hero.
 * The illustration is original ROOT-owned SVG, with a CSS mask to preserve
 * headline contrast. Content and node IDs follow the approved Figma IA.
 */
export function PageHero({
  eyebrow,
  title,
  body,
  cta,
  ctaHref,
  nodeId,
  locale = 'en',
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta?: string;
  ctaHref?: string;
  nodeId?: string;
  locale?: Locale;
}) {
  return (
    <section
      className="root-visual-hero group relative isolate mt-5 min-h-[480px] overflow-hidden rounded-[26px] border border-[#2e5773] bg-[#071b32] px-6 py-9 text-white shadow-[0_28px_80px_rgba(3,14,29,0.25)] sm:px-9 sm:py-12 lg:min-h-[540px] lg:px-14 lg:py-16"
      data-node-id={nodeId}
      data-testid="root-visual-hero"
    >
      <Image
        src="/media/root-revenue-hero.svg"
        alt=""
        aria-hidden="true"
        fill
        priority={nodeId === '4:2' || nodeId === '4:126' || nodeId === '4:153'}
        sizes="(max-width: 768px) 100vw, 1300px"
        className="pointer-events-none absolute inset-0 object-cover object-right opacity-[0.94] transition-transform duration-700 ease-out motion-reduce:transform-none group-hover:scale-[1.018]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,16,33,0.97)_0%,rgba(5,18,35,0.94)_37%,rgba(5,18,35,0.76)_61%,rgba(5,18,35,0.22)_100%)] lg:bg-[linear-gradient(90deg,rgba(5,16,33,0.98)_0%,rgba(5,18,35,0.95)_38%,rgba(5,18,35,0.64)_62%,rgba(5,18,35,0.16)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_85%,rgba(17,225,238,0.14),transparent_55%)]" />
      <div className="relative z-[1] max-w-[890px]">
        <p className="eyebrow !text-[#7ff7ff]">{eyebrow}</p>
        <h1 className="mt-5 text-balance text-[clamp(2.15rem,4vw,3.45rem)] font-extrabold leading-[1.12] tracking-[-0.035em] text-[#f5fbff] drop-shadow-[0_2px_8px_rgba(2,9,21,0.45)]">
          {title}
        </h1>
        <p className="mt-6 max-w-[660px] text-pretty text-base leading-7 text-[#d4e6f5] sm:text-lg">
          {body}
        </p>
        {cta && ctaHref ? (
          <Link className="btn-primary btn-lg mt-8 shadow-[0_10px_36px_rgba(17,225,238,0.20)] hover:-translate-y-0.5 focus-visible:outline-offset-4" href={ctaHref}>
            {cta} <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
      <div className="pointer-events-none absolute bottom-5 right-5 hidden items-center gap-2 rounded-xl border border-white/20 bg-white/[0.07] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e3f9ff] shadow-[0_10px_36px_rgba(0,0,0,.2)] backdrop-blur-xl lg:inline-flex" aria-hidden="true">
        <span className="inline-block size-1.5 rounded-full bg-[#11e1ee] shadow-[0_0_12px_#11e1ee]" />
        {locale === 'es' ? 'Operaciones de ingresos · inteligencia conectada' : 'Revenue operations · connected intelligence'}
      </div>
    </section>
  );
}

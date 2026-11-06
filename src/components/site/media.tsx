import type { Locale } from '@/i18n/locales';

export type IllustrationName =
  | 'revenue-control-room'
  | 'claim-lifecycle'
  | 'exception-queue'
  | 'credentialing-pipeline'
  | 'reconciliation-loop'
  | 'payer-mix-dashboard';

const illustrationAlt: Record<IllustrationName, Record<Locale, string>> = {
  'revenue-control-room': {
    en: 'Isometric revenue control room: a console with three screens tracking claims, cash and status',
    es: 'Sala de control de ingresos isométrica: una consola con tres pantallas que siguen reclamos, caja y estado',
  },
  'claim-lifecycle': {
    en: 'Claim lifecycle: claims move from submitted, to in review, to paid',
    es: 'Ciclo del reclamo: los reclamos pasan de enviados a revisión y a pagados',
  },
  'exception-queue': {
    en: 'Exception queue: a flagged claim is lifted from the queue and routed to its owner',
    es: 'Cola de excepciones: un reclamo marcado sale de la cola y se dirige a su responsable',
  },
  'credentialing-pipeline': {
    en: 'Credentialing pipeline: provider files pass through four verification gates in order',
    es: 'Flujo de acreditación: los expedientes pasan por cuatro controles de verificación en orden',
  },
  'reconciliation-loop': {
    en: 'Reconciliation loop: two ledgers are matched until they agree',
    es: 'Ciclo de conciliación: dos libros se comparan hasta coincidir',
  },
  'payer-mix-dashboard': {
    en: 'Payer mix dashboard: a segmented ring and ranked bars show where revenue comes from',
    es: 'Tablero de combinación de pagadores: un anillo segmentado y barras muestran de dónde vienen los ingresos',
  },
};

/** Original ROOT SVG illustration (public/imagery/svg). 800×600, 2-colour. */
export function Illustration({ name, locale }: { name: IllustrationName; locale: Locale }) {
  return (
    <figure className="illustration">
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, intrinsic size declared */}
      <img src={`/imagery/svg/${name}.svg`} alt={illustrationAlt[name][locale]} width={800} height={600} loading="lazy" decoding="async" />
    </figure>
  );
}

export type DuotoneName = 'analytics-review' | 'revenue-charts';

/** Duotone (navy → cyan) is applied by CSS on the wrapper; the files are untouched colour WebP. */
export function DuotonePhoto({ name, alt }: { name: DuotoneName; alt: string }) {
  return (
    <figure className="duotone">
      <picture>
        <source type="image/webp" srcSet={`/imagery/photo/${name}-640.webp 640w, /imagery/photo/${name}-1280.webp 1280w`} sizes="(min-width: 900px) 46vw, 92vw" />
        {/* eslint-disable-next-line @next/next/no-img-element -- art-directed <picture> srcset */}
        <img src={`/imagery/photo/${name}-1280.webp`} alt={alt} width={1280} height={720} loading="lazy" decoding="async" />
      </picture>
    </figure>
  );
}

import { priceCatalog, type OfferId } from '@/content/catalog';
import { copy } from '@/content/messages';
import {
  catalogEntitlementsForOffer,
  offerRequiresPayment,
} from '@/domain/catalog-entitlement';
import type { Locale } from '@/i18n/locales';

const featureLabels: Record<string, { en: string; es: string }> = {
  basic_workspace: { en: 'Basic workspace', es: 'Espacio básico' },
  consultation: { en: 'Consultation workflow', es: 'Proceso de consultas' },
  diagnostic_report: { en: 'Diagnostic reporting', es: 'Informes de diagnóstico' },
  rcm_dashboard: { en: 'RCM operations dashboard', es: 'Panel de ingresos' },
  credentialing_tracker: { en: 'Credentialing tracker', es: 'Seguimiento de credencialización' },
  managed_requests: { en: 'Managed service requests', es: 'Solicitudes de servicios administrados' },
  dirt_workspace: { en: 'DIRT intelligence workspace', es: 'Espacio de inteligencia DIRT' },
  mso_reporting: { en: 'MSO partnership reporting', es: 'Informes de alianza MSO' },
  multi_location: { en: 'Multi-location controls', es: 'Controles de múltiples ubicaciones' },
};

export function EntitlementWall({
  locale,
  offerId,
}: {
  locale: Locale;
  offerId?: OfferId;
}) {
  const t = copy(locale);
  const offers = offerId ? priceCatalog.filter((item) => item.id === offerId) : priceCatalog;
  return (
    <section className="mt-8" data-testid="commercial-entitlement-wall" aria-labelledby="entitlement-wall-heading">
      <h2 id="entitlement-wall-heading" className="text-xl font-extrabold">
        {t.commercial.entitlementTitle}
      </h2>
      <p className="muted mt-2 max-w-3xl text-sm">{t.commercial.entitlementBody}</p>
      <ul className="mt-4 grid gap-3">
        {offers.map((offer) => {
          const features = catalogEntitlementsForOffer(offer.id);
          return (
            <li key={offer.id} className="surface p-4" data-testid={`entitlement-offer-${offer.id}`}>
              <p className="eyebrow">{offerRequiresPayment(offer.id) ? t.commercial.paidOffer : t.commercial.freeOffer}</p>
              <p className="mt-1 font-bold">{offer.name[locale]}</p>
              <ul className="mt-3 grid gap-2">
                {Object.keys(featureLabels).map((code) => {
                  const included = features.includes(code);
                  return (
                    <li key={code} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span>{featureLabels[code][locale]}</span>
                      <span className={included ? 'font-bold text-[var(--cyan)]' : 'muted'}>
                        {included ? t.commercial.entitlementIncluded : t.commercial.entitlementLocked}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

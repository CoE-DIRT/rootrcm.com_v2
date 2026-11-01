import Link from 'next/link';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

const cards = [
  {
    href: '/custom',
    en: 'Managed RCM',
    es: 'RCM administrado',
    bodyEn: 'Recurring operations with written inclusions. The catalog price is scoped, not a collections percentage.',
    bodyEs: 'Operaciones recurrentes con inclusiones escritas. El precio del catálogo es según alcance, no un porcentaje de cobros.',
  },
  {
    href: '/technology',
    en: 'DIRT intelligence',
    es: 'Inteligencia DIRT',
    bodyEn: 'Synthetic revenue signals until an import is authorized. Not a live claims feed.',
    bodyEs: 'Señales sintéticas de ingresos hasta autorizar una importación. No es un flujo de reclamos en vivo.',
  },
  {
    href: '/preview/credentialing',
    en: 'Credentialing',
    es: 'Acreditación',
    bodyEn: 'Enrollment readiness tracking. No live payer connectivity is claimed.',
    bodyEs: 'Seguimiento de preparación para inscripción. No se afirma conectividad real con pagadores.',
  },
] as const;

export function ServicesBento({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  return (
    <section className="mt-10" aria-labelledby="bento-heading">
      <p className="overline">{es ? 'Servicios apoyados por tecnología' : 'Software-enabled services'}</p>
      <h2 id="bento-heading" className="enterprise-title mt-2 font-extrabold">
        {es ? 'Una capa operativa. Tres frentes.' : 'One operating layer. Three fronts.'}
      </h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={localizedPath(locale, card.href)} className="surface block p-4 hover:border-[var(--cyan)]">
            <h3 className="text-lg font-bold">{es ? card.es : card.en}</h3>
            <p className="muted mt-2 text-sm">{es ? card.bodyEs : card.bodyEn}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

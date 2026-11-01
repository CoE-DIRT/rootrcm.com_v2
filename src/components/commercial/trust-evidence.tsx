import type { Locale } from '@/i18n/locales';

export function TrustEvidence({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const chips = es
    ? ['Aprobación del cliente pendiente', 'Insignias pendientes', 'Evidencia de casos pendiente']
    : ['Client approval pending', 'Badge validation pending', 'Case evidence pending'];
  return (
    <section className="mt-10" aria-labelledby="trust-heading">
      <p className="overline">{es ? 'Confianza sin pruebas inventadas' : 'Trust, without invented proof'}</p>
      <h2 id="trust-heading" className="enterprise-title mt-2 font-extrabold">
        {es ? 'La evidencia debe revisarse, no suponerse.' : 'Evidence should be inspected, not assumed.'}
      </h2>
      <p className="muted mt-3 max-w-3xl text-sm">
        {es
          ? 'Las notas de salvaguardas describen controles previstos para revisión. ROOT no afirma certificación HIPAA, SOC 2, ISO ni una alianza con pagadores. Las citas, los resultados y las licencias siguen sin publicar.'
          : 'Safeguard notes describe intended controls for review. ROOT does not claim HIPAA certification, SOC 2, ISO, or a payer partnership. Quotes, results and licenses stay unpublished.'}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip} className="chip">
            {chip}
          </li>
        ))}
      </ul>
    </section>
  );
}

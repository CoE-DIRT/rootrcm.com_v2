import type { Metadata } from 'next';
import { BusinessInquiryForm } from '@/components/forms/business-inquiry-form';
import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return publicPageMetadata(
    locale,
    es ? 'Contacto · ROOT RCM' : 'Contact · ROOT RCM',
    es
      ? 'Comuníquese con los especialistas en operaciones y ciclo de ingresos de ROOT.'
      : 'Connect with ROOT revenue cycle and healthcare operations specialists.'
  );
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  const es = locale === 'es';

  return (
    <MarketingPage
      locale={locale}
      title={es ? 'Contáctenos' : 'Contact ROOT'}
      body={
        es
          ? 'Hablemos sobre las operaciones de ingresos de su práctica, combinación de pagadores o resolución de excepciones.'
          : 'Discuss your practice revenue operations, payer mix, or exception resolution with our team.'
      }
      nodeId="5:69"
    >
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <div>
          <BusinessInquiryForm locale={locale} />
        </div>

        <div className="space-y-6">
          <div className="surface p-6 sm:p-8">
            <p className="eyebrow">{es ? 'CANALES DIRECTOS' : 'DIRECT CHANNELS'}</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--text)]">
              {es ? 'Comunicación inmediata' : 'Immediate Communication'}
            </h2>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-[var(--cyan)]" aria-hidden="true" />
                <div>
                  <p className="font-bold text-[var(--text)]">{es ? 'Teléfono principal' : 'Direct Phone'}</p>
                  <a href="tel:+13024965648" className="font-semibold text-[var(--cyan)] hover:underline">
                    +1 (302) 496-5648
                  </a>
                  <p className="muted text-xs">{es ? 'Lunes a Viernes, 9am - 6pm EST' : 'Mon–Fri, 9am – 6pm EST'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-[var(--cyan)]" aria-hidden="true" />
                <div>
                  <p className="font-bold text-[var(--text)]">{es ? 'Correo comercial' : 'Business Email'}</p>
                  <a href="mailto:info@rootrcm.com" className="font-semibold text-[var(--cyan)] hover:underline">
                    info@rootrcm.com
                  </a>
                  <p className="muted text-xs">{es ? 'Respuesta en menos de 24 horas laborables' : 'Under 24 business hours response'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-[var(--cyan)]" aria-hidden="true" />
                <div>
                  <p className="font-bold text-[var(--text)]">{es ? 'Sede' : 'Headquarters'}</p>
                  <p className="muted text-xs">New Castle County, Delaware, USA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 text-[var(--cyan)]" aria-hidden="true" />
                <div>
                  <p className="font-bold text-[var(--text)]">{es ? 'Horario de operaciones' : 'Operations Hours'}</p>
                  <p className="muted text-xs">09:00 – 18:00 EST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-2 border border-[var(--border)] p-6 text-xs text-[var(--muted)]">
            <p className="font-bold text-[var(--text)]">
              {es ? 'Límite estricto de privacidad (Sin PHI)' : 'Strict Privacy Boundary (No PHI)'}
            </p>
            <p className="mt-2 leading-relaxed">
              {t.footer.noPhi}{' '}
              {es
                ? 'Los formularios y canales públicos de ROOT están diseñados exclusivamente para contactos empresariales y acuerdos de servicios B2B.'
                : 'ROOT public communications and contact workflows are strictly designed for B2B practice administration and enterprise service agreements.'}
            </p>
          </div>
        </div>
      </div>
    </MarketingPage>
  );
}

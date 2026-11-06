import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { BusinessInquiryForm } from '@/components/forms/business-inquiry-form';
import { MarketingPage } from '@/components/site/marketing-page';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';
import { localizedPath } from '@/lib/paths';

const icon = { size: 20, strokeWidth: 1.75, 'aria-hidden': true } as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await requireLocale(params);
  const es = locale === 'es';
  return publicPageMetadata(
    locale,
    es ? 'Contacto · ROOT RCM' : 'Contact · ROOT RCM',
    es ? 'Comuníquese con los especialistas en operaciones y ciclo de ingresos de ROOT.' : 'Connect with ROOT revenue cycle and healthcare operations specialists.',
    'contact',
  );
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  const es = locale === 'es';

  return (
    <MarketingPage
      locale={locale}
      eyebrow={es ? 'Contacto' : 'Contact'}
      title={es ? '¿Dónde se atascan sus ingresos? Hablemos.' : 'Where is revenue getting stuck? Let’s talk.'}
      body={es ? 'Cuéntenos sobre su práctica, su combinación de pagadores o las excepciones que no se resuelven.' : 'Tell us about your practice, your payer mix or the exceptions that never seem to close.'}
      nodeId="5:69"
    >
      <div className="split">
        <BusinessInquiryForm locale={locale} />
        <div className="stack">
          <Card as="section" padding="lg" headingLevel={2} kicker={es ? 'Canales directos' : 'Direct channels'} title={es ? 'Hable con una persona' : 'Reach a person'}>
            <ul className="check-list">
              <li>
                <Phone {...icon} />
                <span>
                  <Button href="tel:+13024965648" variant="link">+1 (302) 496-5648</Button>
                  <br />
                  <span className="ui-field__hint">{es ? 'Lunes a viernes, 9:00–18:00 (hora del Este)' : 'Mon–Fri, 9am–6pm Eastern'}</span>
                </span>
              </li>
              <li>
                <Mail {...icon} />
                <span>
                  <Button href="mailto:info@rootrcm.com" variant="link">info@rootrcm.com</Button>
                  <br />
                  <span className="ui-field__hint">{es ? 'Procuramos responder en un día hábil' : 'We aim to reply within one business day'}</span>
                </span>
              </li>
              <li>
                <MapPin {...icon} />
                <span className="ui-field__hint">2803 Philadelphia Pike, Suite B #1864, Claymont, DE 19703, USA</span>
              </li>
              <li>
                <Clock {...icon} />
                <span className="ui-field__hint">{es ? 'Horario: 09:00–18:00 (hora del Este)' : 'Hours: 09:00–18:00 Eastern'}</span>
              </li>
            </ul>
          </Card>
          <Card as="section" surface="raised" headingLevel={2} title={es ? 'Sin información de pacientes' : 'No patient information'} body={`${t.footer.noPhi} ${es ? 'Los canales públicos de ROOT son solo para contactos empresariales.' : 'ROOT’s public channels are for business contacts only.'}`} />
          <Button href={localizedPath(locale, '/consultation#book')} variant="secondary" size="lg">
            {es ? 'Prefiere reservar una llamada' : 'Prefer to book a call?'}
          </Button>
        </div>
      </div>
    </MarketingPage>
  );
}

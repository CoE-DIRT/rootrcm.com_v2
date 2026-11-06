import Link from 'next/link';
import { ArrowUpRight, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { EmailContactLink } from '@/components/site/email-contact-link';
import { NewsletterRequest } from '@/components/site/newsletter-request';
import { Button } from './Button';
import { Container } from './Container';
import { Brand } from './Navbar';
import { LanguageToggle } from './LanguageToggle';

export type FooterProps = { locale: Locale };

type FooterLink = { href: string; en: string; es: string };

const columns: readonly { en: string; es: string; links: readonly FooterLink[] }[] = [
  {
    en: 'Services',
    es: 'Servicios',
    links: [
      { href: '/services', en: 'RCM and revenue operations', es: 'RCM y operaciones de ingresos' },
      { href: '/specialties', en: 'Medical specialties', es: 'Especialidades médicas' },
      { href: '/solutions', en: 'Where revenue stalls', es: 'Dónde se detienen los ingresos' },
      { href: '/diagnostic', en: 'Revenue diagnostic', es: 'Diagnóstico de ingresos' },
      { href: '/custom', en: 'Custom RCM scope', es: 'Alcance de RCM a medida' },
    ],
  },
  {
    en: 'Platform',
    es: 'Plataforma',
    links: [
      { href: '/technology', en: 'DIRT intelligence', es: 'Inteligencia DIRT' },
      { href: '/preview/client', en: 'Sample workspace', es: 'Espacio de muestra' },
      { href: '/preview/credentialing', en: 'Credentialing workflow', es: 'Flujo de acreditación' },
      { href: '/login', en: 'Client log in', es: 'Acceso de clientes' },
      { href: '/signup', en: 'Create an account', es: 'Crear una cuenta' },
    ],
  },
  {
    en: 'Resources',
    es: 'Recursos',
    links: [
      { href: '/faq', en: 'Questions and answers', es: 'Preguntas frecuentes' },
      { href: '/resources', en: 'Guides and insights', es: 'Guías y artículos' },
      { href: '/specialties/infectious-disease', en: 'Infectious Disease', es: 'Enfermedades infecciosas' },
      { href: '/locations/new-york', en: 'New York payers', es: 'Pagadores de Nueva York' },
      { href: '/plans', en: 'Pricing', es: 'Precios' },
    ],
  },
  {
    en: 'Company',
    es: 'Empresa',
    links: [
      { href: '/company', en: 'Our story', es: 'Nuestra historia' },
      { href: '/why-root', en: 'Our approach', es: 'Nuestro enfoque' },
      { href: '/consultation', en: 'Book a consultation', es: 'Reservar una consulta' },
      { href: '/contact', en: 'Contact ROOT', es: 'Contactar a ROOT' },
    ],
  },
];

export function Footer({ locale }: FooterProps) {
  const es = locale === 'es';
  return (
    <footer className="ui-footer" data-node-id="4:39" data-testid="root-rich-footer">
      <Container>
        <div className="ui-footer__cta">
          <div>
            <p className="ui-eyebrow">{es ? 'Empiece con un diagnóstico' : 'Start with a diagnostic'}</p>
            <h2 className="ui-footer__cta-title">{es ? '¿Dónde está su dinero? Averigüémoslo juntos.' : 'Where is your money? Let’s find out together.'}</h2>
            <p className="ui-footer__muted">
              {es
                ? 'Conserve sus sistemas. Vea sus ingresos. Dé a cada excepción un responsable.'
                : 'Keep your systems. See your revenue. Give every exception a named owner.'}
            </p>
          </div>
          <div className="ui-footer__actions">
            <Button href={localizedPath(locale, '/diagnostic')} variant="primary" size="lg" rightIcon={<ArrowUpRight size={20} strokeWidth={1.75} aria-hidden="true" />}>
              {es ? 'Revisión gratuita de fugas' : 'Free revenue leak review'}
            </Button>
            <Button href={localizedPath(locale, '/consultation#book')} variant="secondary" size="lg">
              {es ? 'Reservar consulta' : 'Book a consultation'}
            </Button>
          </div>
        </div>

        <div className="ui-footer__grid">
          <div className="ui-footer__brand">
            <Link href={localizedPath(locale)} aria-label={es ? 'ROOT — inicio' : 'ROOT — home'} className="ui-nav__logo">
              <Brand locale={locale} />
            </Link>
            <p className="ui-footer__muted">
              {es
                ? 'RCM y operaciones de ingresos para consultorios independientes de EE. UU., sin reemplazar su EHR.'
                : 'RCM and revenue operations for independent US practices — without replacing your EHR.'}
            </p>
            <NewsletterRequest locale={locale} />
            <div className="ui-footer__social">
              <Button href="https://www.linkedin.com/company/rootrcm/" target="_blank" rel="noopener noreferrer" variant="secondary" size="sm" rightIcon={<ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />}>
                LinkedIn
              </Button>
              <Button href="https://wa.me/13025064685" target="_blank" rel="noopener noreferrer" variant="secondary" size="sm" leftIcon={<MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />}>
                WhatsApp
              </Button>
            </div>
          </div>

          <nav aria-label={es ? 'Navegación del pie de página' : 'Footer navigation'} className="ui-footer__columns">
            {columns.map((column) => (
              <div key={column.en} className="ui-footer__column">
                <h3 className="ui-footer__heading">{es ? column.es : column.en}</h3>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={localizedPath(locale, link.href)} className="ui-footer__link">
                        {es ? link.es : link.en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="ui-footer__contact">
          <p className="ui-footer__address">
            <MapPin size={16} strokeWidth={1.75} aria-hidden="true" />
            2803 Philadelphia Pike, Suite B #1864, Claymont, DE 19703, USA
          </p>
          <div className="ui-footer__contact-links">
            <EmailContactLink locale={locale} />
            <a href="tel:+13024965648" className="ui-footer__link">
              <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
              +1 (302) 496-5648
            </a>
          </div>
        </div>

        <div className="ui-footer__legal">
          <p>© 2026 ROOT — Revenue Operations & Outcomes Technology.</p>
          <nav aria-label={es ? 'Enlaces legales' : 'Legal links'} className="ui-footer__legal-links">
            <Link href={localizedPath(locale, '/privacy')} className="ui-footer__link">{es ? 'Privacidad' : 'Privacy'}</Link>
            <Link href={localizedPath(locale, '/terms')} className="ui-footer__link">{es ? 'Términos' : 'Terms'}</Link>
            <Link href={localizedPath(locale, '/cookies')} className="ui-footer__link">{es ? 'Cookies' : 'Cookie choices'}</Link>
            <LanguageToggle locale={locale} />
          </nav>
        </div>
        <p className="ui-footer__fineprint">
          {es
            ? 'Solo consultas comerciales. No envíe información de pacientes por este sitio.'
            : 'Business inquiries only. Please do not send patient information through this site.'}
        </p>
      </Container>
    </footer>
  );
}

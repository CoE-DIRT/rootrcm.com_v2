import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import { SiteBrand } from './site-brand';
import { NewsletterRequest } from './newsletter-request';

type FooterLink = { href: string; en: string; es: string };
const columns: readonly { en: string; es: string; links: readonly FooterLink[] }[] = [
  { en: 'Explore ROOT', es: 'Explorar ROOT', links: [
    { href: '/why-root', en: 'Why ROOT', es: 'Por qué ROOT' },
    { href: '/services', en: 'Services', es: 'Servicios' },
    { href: '/specialties', en: 'Medical specialties', es: 'Especialidades médicas' },
    { href: '/solutions', en: 'Solutions', es: 'Soluciones' },
    { href: '/plans', en: 'Pricing & packages', es: 'Precios y paquetes' },
  ] },
  { en: 'Platform', es: 'Plataforma', links: [
    { href: '/technology', en: 'DIRT intelligence', es: 'Inteligencia DIRT' },
    { href: '/preview/client', en: 'Client workspace', es: 'Espacio del cliente' },
    { href: '/preview/credentialing', en: 'Credentialing', es: 'Acreditación' },
    { href: '/preview/sales', en: 'Sales and onboarding', es: 'Ventas e incorporación' },
    { href: '/sign-in', en: 'Client & team access', es: 'Acceso de clientes y equipo' },
  ] },
  { en: 'Resources', es: 'Recursos', links: [
    { href: '/resources', en: 'Guides and insights', es: 'Guías y artículos' },
    { href: '/specialties/infectious-disease', en: 'Infectious Disease', es: 'Enfermedades infecciosas' },
    { href: '/locations/new-york', en: 'New York coverage', es: 'Cobertura de Nueva York' },
    { href: '/locations/new-york-city', en: 'New York City', es: 'Ciudad de Nueva York' },
    { href: '/diagnostic', en: 'Revenue diagnostic', es: 'Diagnóstico de ingresos' },
  ] },
  { en: 'Company', es: 'Empresa', links: [
    { href: '/company', en: 'Our story', es: 'Nuestra historia' },
    { href: '/why-root', en: 'Our approach', es: 'Nuestro enfoque' },
    { href: '/custom', en: 'Custom RCM / MSO', es: 'RCM / MSO a medida' },
    { href: '/consultation', en: 'Contact ROOT', es: 'Contactar a ROOT' },
  ] },
];

export function SiteFooter({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-[var(--border)] bg-[var(--surface)] text-sm" data-node-id="4:39" data-testid="root-rich-footer">
      <Image
        src="/brand/waveLower.webp"
        width={1600}
        height={138}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full object-cover opacity-40"
      />
      <div className="pointer-events-none absolute -left-32 top-0 size-[420px] rounded-full bg-[var(--cyan)] opacity-[0.045] blur-[90px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-48 bottom-0 size-[520px] rounded-full bg-[var(--blue)] opacity-[0.06] blur-[90px]" aria-hidden="true" />
      <div className="page-width relative pb-28 pt-12 md:pt-16">
        <div className="grid items-center gap-7 rounded-[23px] border border-[var(--border)] bg-[var(--surface-2)] px-6 py-9 shadow-[var(--shadow)] backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_auto] md:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow">{es ? 'ROOT · OPERACIONES E INTELIGENCIA' : 'ROOT · REVENUE OPERATIONS & INTELLIGENCE'}</p>
            <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold leading-tight tracking-[-0.035em]">
              {es ? 'Una mejor atención empieza detrás de escena.' : 'Better care starts behind the scenes.'}
            </h2>
            <p className="muted mt-3 max-w-xl">{es ? 'Conserve sus sistemas. Comprenda sus ingresos. Dé a cada paso un responsable.' : 'Keep your systems. Understand your revenue. Give every next step a clear owner.'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={localizedPath(locale, '/consultation')} className="btn-primary btn-lg">
              {es ? 'Hable con ROOT' : 'Talk with ROOT'} <ArrowUpRight className="size-4" aria-hidden="true"/>
            </Link>
            <Link href={localizedPath(locale, '/services')} className="btn-secondary btn-lg">
              {es ? 'Explorar servicios' : 'Explore services'}
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-b border-[var(--border)] pb-12 lg:grid-cols-[minmax(230px,1.2fr)_minmax(0,3fr)] lg:gap-14">
          <div>
            <Link href={localizedPath(locale)} aria-label={es ? 'Inicio ROOT' : 'ROOT homepage'} className="inline-flex rounded-lg">
              <SiteBrand locale={locale}/>
            </Link>
            <p className="muted mt-5 max-w-[340px] text-sm leading-7">
              {es
                ? 'Gestión del ciclo de ingresos, operaciones de consulta e inteligencia que conserva el control de su práctica.'
                : 'Revenue cycle management, practice operations and actionable intelligence built around your practice.'}
            </p>
            <NewsletterRequest locale={locale}/>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a href="https://www.linkedin.com/company/rootrcm/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-[var(--border)] px-3 font-semibold hover:border-[var(--cyan)] hover:text-[var(--cyan)]">LinkedIn <ArrowUpRight className="ml-2 size-4" aria-hidden="true"/></a>
              <a href="https://wa.me/13025064685" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-[var(--border)] px-3 font-semibold hover:border-[var(--cyan)] hover:text-[var(--cyan)]"><MessageCircle className="mr-2 size-4" aria-hidden="true"/>WhatsApp</a>
            </div>
          </div>

          <nav aria-label={es ? 'Navegación del pie de página' : 'Footer navigation'} className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.en}>
                <h3 className="mb-5 text-[13px] font-extrabold tracking-tight">{es ? column.es : column.en}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={localizedPath(locale, link.href)} className="muted inline-flex min-h-7 items-start text-[13px] leading-5 transition-colors hover:text-[var(--cyan)]">
                        {es ? link.es : link.en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="grid gap-5 border-b border-[var(--border)] py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="font-bold">{es ? 'Hagamos más fáciles las operaciones de ingresos.' : 'Let’s make revenue operations easier to understand.'}</p>
            <p className="muted mt-1 flex items-start gap-2 text-xs"><MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true"/>2803 Philadelphia Pike, Suite B #1864, Claymont, DE 19703, USA</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 font-semibold">
            <a href="mailto:info@rootrcm.com" className="inline-flex items-center gap-2 hover:text-[var(--cyan)]"><Mail className="size-4" aria-hidden="true"/>info@rootrcm.com</a>
            <a href="tel:+13024965648" className="inline-flex items-center gap-2 hover:text-[var(--cyan)]"><Phone className="size-4" aria-hidden="true"/>+1 (302) 496-5648</a>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-[var(--muted)] md:flex-row md:items-center">
          <p>© 2026 ROOT — Revenue Operations & Outcomes Technology.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label={es ? 'Enlaces legales' : 'Legal links'}>
            <Link href={localizedPath(locale, '/privacy')} className="hover:text-[var(--cyan)]">{es ? 'Privacidad' : 'Privacy'}</Link>
            <Link href={localizedPath(locale, '/terms')} className="hover:text-[var(--cyan)]">{es ? 'Términos' : 'Terms'}</Link>
            <Link href={localizedPath(locale, '/cookies')} className="hover:text-[var(--cyan)]">{es ? 'Cookies' : 'Cookie choices'}</Link>
            <Link href={localizedPath(locale, '/resources')} className="hover:text-[var(--cyan)]">{es ? 'Recursos' : 'Resources'}</Link>
          </nav>
        </div>
        <p className="muted mt-3 text-[11px]">
          {es ? 'Consultas comerciales solamente. No envíe información del paciente. Las integraciones del entorno de demostración no verifican beneficios ni solicitudes reales.' : 'Business inquiries only. Do not submit patient information. Preview integrations do not verify real benefits or applications.'}
        </p>
      </div>
    </footer>
  );
}

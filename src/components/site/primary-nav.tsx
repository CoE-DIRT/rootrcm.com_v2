'use client';

import Link from 'next/link';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/locales';
import { localizedPath, publicNav } from '@/lib/paths';
import { copy } from '@/content/messages';

type SubItem = { path: string; en: string; es: string; hintEn: string; hintEs: string };
type MenuItem = { path: string; key: (typeof publicNav)[number]['key']; en: string; es: string; links: readonly SubItem[] };

export const rootMegaMenus: readonly MenuItem[] = [
  { path: '/why-root', key: 'whyRoot', en: 'Control without the black box', es: 'Control sin opacidad', links: [
    { path: '/why-root', en: 'Why ROOT', es: 'Por qué ROOT', hintEn: 'A practice-first approach', hintEs: 'Un enfoque centrado en la práctica' },
    { path: '/solutions', en: 'Solutions and outcomes', es: 'Soluciones y resultados', hintEn: 'Find where revenue stalls', hintEs: 'Detecte dónde se detienen los ingresos' },
    { path: '/diagnostic', en: 'Practice assessment', es: 'Evaluación de la práctica', hintEn: 'Explore a diagnostic', hintEs: 'Explore un diagnóstico' },
  ] },
  { path: '/services', key: 'services', en: 'An integrated operating partner', es: 'Un socio operativo integrado', links: [
    { path: '/services', en: 'RCM and MSO services', es: 'Servicios de RCM y MSO', hintEn: 'Revenue and practice operations', hintEs: 'Ingresos y operaciones' },
    { path: '/specialties', en: 'Medical specialties', es: 'Especialidades médicas', hintEn: 'Specialty-specific RCM', hintEs: 'RCM por especialidad' },
    { path: '/preview/credentialing', en: 'Credentialing workflows', es: 'Flujos de acreditación', hintEn: 'Payer and provider enrollment', hintEs: 'Inscripción de pagadores y proveedores' },
    { path: '/locations/new-york', en: 'New York coverage', es: 'Cobertura de Nueva York', hintEn: 'Market and payer landscape', hintEs: 'Mercado y pagadores' },
  ] },
  { path: '/technology', key: 'technology', en: 'Connected intelligence', es: 'Inteligencia conectada', links: [
    { path: '/technology', en: 'DIRT and integrations', es: 'DIRT e integraciones', hintEn: 'Go APIs and connected platforms', hintEs: 'API Go y plataformas' },
    { path: '/preview/client', en: 'Client workspace', es: 'Espacio del cliente', hintEn: 'Full-cycle operational preview', hintEs: 'Vista de operaciones' },
    { path: '/preview/dirt', en: 'Revenue analytics', es: 'Analítica de ingresos', hintEn: 'KPI and AR intelligence', hintEs: 'KPI e inteligencia de cuentas' },
    { path: '/preview/sales', en: 'Sales to onboarding', es: 'Ventas a incorporación', hintEn: 'Explore the lifecycle', hintEs: 'Explore el ciclo completo' },
  ] },
  { path: '/plans', key: 'plans', en: 'The right way to get started', es: 'La forma de comenzar', links: [
    { path: '/plans', en: 'Pricing and packages', es: 'Precios y paquetes', hintEn: 'Understand the scope', hintEs: 'Comprenda el alcance' },
    { path: '/consultation', en: 'Free consultation', es: 'Consulta gratuita', hintEn: 'Talk to an operating specialist', hintEs: 'Hable con un especialista' },
    { path: '/diagnostic', en: 'Revenue diagnostic', es: 'Diagnóstico de ingresos', hintEn: 'Structured assessment', hintEs: 'Evaluación estructurada' },
    { path: '/custom', en: 'Custom RCM / MSO', es: 'RCM / MSO personalizado', hintEn: 'Scoped services', hintEs: 'Servicios a medida' },
  ] },
  { path: '/resources', key: 'resources', en: 'Knowledge and proof', es: 'Conocimiento y pruebas', links: [
    { path: '/resources', en: 'Guides and insights', es: 'Guías y artículos', hintEn: 'Healthcare operations resources', hintEs: 'Recursos operativos' },
    { path: '/specialties/infectious-disease', en: 'Infectious Disease', es: 'Enfermedades infecciosas', hintEn: 'Specialty revenue operations', hintEs: 'Ingresos por especialidad' },
    { path: '/locations/new-york-city', en: 'New York City', es: 'Ciudad de Nueva York', hintEn: 'Local payer and RCM context', hintEs: 'Pagadores y RCM local' },
  ] },
  { path: '/company', key: 'company', en: 'Built around your practice', es: 'Diseñado para su práctica', links: [
    { path: '/company', en: 'Our story', es: 'Nuestra historia', hintEn: 'People, process and technology', hintEs: 'Personas, procesos y tecnología' },
    { path: '/why-root', en: 'Philosophy and approach', es: 'Filosofía y enfoque', hintEn: 'Accountable service delivery', hintEs: 'Entrega responsable' },
    { path: '/consultation', en: 'Contact ROOT', es: 'Contactar a ROOT', hintEn: 'Discuss your next step', hintEs: 'Hablemos del próximo paso' },
  ] },
];

export function PrimaryNav({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(null);
    }
    function closeEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || open === null) return;
      const selected = open;
      setOpen(null);
      buttonRefs.current[selected]?.focus();
    }
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeEscape);
    };
  }, [open]);

  return (
    <nav ref={rootRef} aria-label="Primary" className="relative hidden items-center gap-0.5 text-sm lg:flex" data-testid="root-mega-nav">
      {publicNav.map((entry, index) => {
        const menu = rootMegaMenus.find((m) => m.key === entry.key);
        if (!menu) return null;
        const active = pathname === localizedPath(locale, entry.href) || pathname.startsWith(`${localizedPath(locale, entry.href)}/`);
        const shown = open === index;
        return (
          <div className="relative" key={entry.href} onMouseEnter={() => setOpen(index)} onMouseLeave={() => setOpen(null)}>
            <div className={`flex items-center rounded-xl transition-colors hover:bg-[var(--surface-2)] ${active ? 'bg-[var(--surface-2)] text-[var(--text)]' : 'text-[var(--muted)]'}`}>
              <Link
                href={localizedPath(locale, entry.href)}
                className="px-2.5 py-3 font-semibold hover:text-[var(--text)]"
                aria-current={active ? 'page' : undefined}
                onFocus={() => setOpen(null)}
              >{t.nav[entry.key]}</Link>
              <button
                ref={(node) => { buttonRefs.current[index] = node; }}
                type="button"
                className="flex min-h-11 min-w-7 items-center justify-center rounded-lg hover:text-[var(--cyan)] focus-visible:outline-offset-2"
                aria-label={locale === 'es' ? `Opciones de ${t.nav[entry.key]}` : `Show ${t.nav[entry.key]} options`}
                aria-expanded={shown}
                aria-controls={`root-menu-${index}`}
                onClick={() => setOpen(index)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setOpen(index);
                    requestAnimationFrame(() => {
                      document.querySelector<HTMLAnchorElement>(`#root-menu-${index} a`)?.focus();
                    });
                  }
                }}
              ><ChevronDown className={`size-3.5 transition-transform ${shown ? 'rotate-180' : ''}`} aria-hidden="true" /></button>
            </div>
            {shown && (
              <div
                id={`root-menu-${index}`}
                className="absolute left-1/2 top-full z-40 w-[355px] -translate-x-1/2 pt-2 motion-safe:animate-[root-menu-in_180ms_ease-out]"
                data-testid="root-mega-panel"
              >
                <div className="overflow-hidden rounded-[19px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_22px_60px_rgba(0,12,29,.28)] backdrop-blur-2xl">
                  <div className="rounded-xl bg-[var(--surface-2)] p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[var(--cyan)]">{t.nav[entry.key]}</p>
                    <p className="mt-1 text-base font-bold">{locale === 'es' ? menu.es : menu.en}</p>
                  </div>
                  <div className="mt-2 grid gap-0.5">
                    {menu.links.map((item) => (
                      <Link key={item.path} href={localizedPath(locale, item.path)}
                        className="group/link flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-offset-2"
                        onClick={() => setOpen(null)}>
                        <span className="min-w-0">
                          <span className="block font-semibold">{locale === 'es' ? item.es : item.en}</span>
                          <span className="muted block text-xs">{locale === 'es' ? item.hintEs : item.hintEn}</span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-[var(--cyan)] transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden="true"/>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

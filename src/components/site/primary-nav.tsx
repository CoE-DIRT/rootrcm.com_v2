'use client';

import Link from 'next/link';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/locales';
import { localizedPath, publicNav } from '@/lib/paths';
import { copy } from '@/content/messages';
import { serviceCapabilities } from '@/content/service-catalog';
import { specialties } from '@/content/specialties';

type SubItem = { path: string; en: string; es: string; hintEn: string; hintEs: string };
type MenuItem = { path: string; key: (typeof publicNav)[number]['key']; en: string; es: string; links: readonly SubItem[] };

const serviceDeepLinks: SubItem[] = serviceCapabilities.map((capability) => ({
  path: `/services?service=${capability.id}`,
  en: capability.name.en,
  es: capability.name.es,
  hintEn: 'Opens the services explorer on this capability',
  hintEs: 'Abre el explorador de servicios en esta capacidad',
}));

const specialtyDeepLinks: SubItem[] = specialties.slice(0, 8).map((specialty, index) => ({
  path: `/specialties?spec=${index}`,
  en: specialty.name.en,
  es: specialty.name.es,
  hintEn: 'Opens specialties with this selection',
  hintEs: 'Abre especialidades con esta selección',
}));

/** Demo 6 V6_NAV destinations mapped to typed Next routes, anchors and query tabs. */
export const rootMegaMenus: readonly MenuItem[] = [
  {
    path: '/why-root',
    key: 'whyRoot',
    en: 'Control without the black box',
    es: 'Control sin opacidad',
    links: [
      { path: '/solutions#revenue-leakage', en: 'Find your challenge', es: 'Encuentre su reto', hintEn: 'Solutions explorer anchors', hintEs: 'Anclas del explorador de soluciones' },
      { path: '/solutions#aging-ar', en: 'Aging A/R', es: 'CxC envejecida', hintEn: 'Jump to aging A/R', hintEs: 'Ir a CxC envejecida' },
      { path: '/solutions#denials-appeals', en: 'Denials and appeals', es: 'Denegaciones y apelaciones', hintEn: 'Denial workflow framing', hintEs: 'Enfoque de denegaciones' },
      { path: '/why-root', en: 'How ROOT works', es: 'Cómo trabaja ROOT', hintEn: 'Practice-first approach', hintEs: 'Enfoque centrado en la práctica' },
      { path: '/diagnostic', en: 'Practice assessment', es: 'Evaluación de la práctica', hintEn: 'Structured diagnostic', hintEs: 'Diagnóstico estructurado' },
      { path: '/company#public-website', en: 'Evidence and trust', es: 'Evidencia y confianza', hintEn: 'Pending verification labels', hintEs: 'Etiquetas pendientes de verificación' },
    ],
  },
  {
    path: '/services',
    key: 'services',
    en: 'An integrated operating partner',
    es: 'Un socio operativo integrado',
    links: [
      { path: '/services', en: 'Services explorer', es: 'Explorador de servicios', hintEn: 'Sixteen connected capabilities', hintEs: 'Dieciséis capacidades conectadas' },
      { path: '/specialties', en: 'Specialties and payers', es: 'Especialidades y pagadores', hintEn: 'Specialty-aware RCM framing', hintEs: 'RCM por especialidad' },
      ...specialtyDeepLinks.slice(0, 4),
      { path: '/preview/credentialing', en: 'Credentialing workflows', es: 'Flujos de acreditación', hintEn: 'Payer and provider enrollment', hintEs: 'Inscripción de pagadores y proveedores' },
      ...serviceDeepLinks,
    ],
  },
  {
    path: '/technology',
    key: 'technology',
    en: 'Connected intelligence',
    es: 'Inteligencia conectada',
    links: [
      { path: '/technology#dirt-previews', en: 'DIRT intelligence', es: 'Inteligencia DIRT', hintEn: 'Synthetic revenue intelligence', hintEs: 'Inteligencia de ingresos sintética' },
      { path: '/preview/client', en: 'Explore the workspace', es: 'Explore el espacio', hintEn: 'Full-cycle operational preview', hintEs: 'Vista de operaciones' },
      { path: '/preview/dirt', en: 'Claim and A/R tracking', es: 'Reclamos y CxC', hintEn: 'KPI and AR intelligence', hintEs: 'KPI e inteligencia de cuentas' },
      { path: '/portal', en: 'Client portal', es: 'Portal del cliente', hintEn: 'Synthetic organization workspace', hintEs: 'Espacio sintético de la organización' },
      { path: '/technology#systems-stay', en: 'Security and standards', es: 'Seguridad y estándares', hintEn: 'Compatibility remains pending', hintEs: 'Compatibilidad pendiente' },
      { path: '/preview/sales', en: 'Sales to onboarding', es: 'Ventas a incorporación', hintEn: 'Explore the lifecycle', hintEs: 'Explore el ciclo completo' },
    ],
  },
  {
    path: '/plans',
    key: 'plans',
    en: 'The right way to get started',
    es: 'La forma de comenzar',
    links: [
      { path: '/plans?band=all', en: 'Plans and packages', es: 'Planes y paquetes', hintEn: 'Canonical price catalog', hintEs: 'Catálogo canónico de precios' },
      { path: '/plans?band=entry', en: 'Entry offers', es: 'Ofertas de entrada', hintEn: 'Free and explorer paths', hintEs: 'Rutas gratuitas y explorer' },
      { path: '/plans?band=diagnostic', en: 'Diagnostic packages', es: 'Paquetes de diagnóstico', hintEn: 'Fixed-fee assessments', hintEs: 'Evaluaciones de tarifa fija' },
      { path: '/plans?band=managed', en: 'Managed services', es: 'Servicios gestionados', hintEn: 'Scoped recurring operations', hintEs: 'Operaciones recurrentes acotadas' },
      { path: '/diagnostic', en: 'Revenue diagnostic', es: 'Diagnóstico de ingresos', hintEn: 'Structured assessment', hintEs: 'Evaluación estructurada' },
      { path: '/consultation', en: 'Free consultation', es: 'Consulta gratuita', hintEn: 'Talk to an operating specialist', hintEs: 'Hable con un especialista' },
      { path: '/custom', en: 'Custom engagement', es: 'Servicio personalizado', hintEn: 'Scoped RCM / MSO', hintEs: 'RCM / MSO a medida' },
    ],
  },
  {
    path: '/resources',
    key: 'resources',
    en: 'Knowledge and proof',
    es: 'Conocimiento y pruebas',
    links: [
      { path: '/resources', en: 'Guides and resources', es: 'Guías y recursos', hintEn: 'Healthcare operations resources', hintEs: 'Recursos operativos' },
      { path: '/resources#official-forms', en: 'Official Medicare forms', es: 'Formularios oficiales', hintEn: 'Issuer links only', hintEs: 'Solo enlaces del emisor' },
      { path: '/resources#templates', en: 'Working templates', es: 'Plantillas de trabajo', hintEn: 'Reviewed template packs', hintEs: 'Paquetes revisados' },
      { path: '/resources#education', en: 'Education', es: 'Educación', hintEn: 'Methods without fabricated results', hintEs: 'Métodos sin resultados inventados' },
      { path: '/specialties/infectious-disease', en: 'Infectious Disease', es: 'Enfermedades infecciosas', hintEn: 'Specialty revenue operations', hintEs: 'Ingresos por especialidad' },
      { path: '/locations/new-york-city', en: 'New York City', es: 'Ciudad de Nueva York', hintEn: 'Local payer and RCM context', hintEs: 'Pagadores y RCM local' },
      { path: '/faqs', en: 'FAQs', es: 'Preguntas frecuentes', hintEn: 'Common operating questions', hintEs: 'Preguntas operativas frecuentes' },
    ],
  },
  {
    path: '/company',
    key: 'company',
    en: 'Built around your practice',
    es: 'Diseñado para su práctica',
    links: [
      { path: '/company', en: 'About ROOT', es: 'Acerca de ROOT', hintEn: 'People, process and technology', hintEs: 'Personas, procesos y tecnología' },
      { path: '/company#public-website', en: 'Public website', es: 'Sitio público', hintEn: 'Discover the operating model', hintEs: 'Descubra el modelo operativo' },
      { path: '/company#client-portal', en: 'Client portal', es: 'Portal del cliente', hintEn: 'Synthetic workspace preview', hintEs: 'Vista del espacio sintético' },
      { path: '/why-root', en: 'Founder philosophy', es: 'Filosofía fundacional', hintEn: 'Accountable service delivery', hintEs: 'Entrega responsable' },
      { path: '/consultation', en: 'Contact ROOT', es: 'Contactar a ROOT', hintEn: 'Discuss your next step', hintEs: 'Hablemos del próximo paso' },
    ],
  },
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
        const dense = menu.links.length > 8;
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
                className={`absolute left-1/2 top-full z-40 -translate-x-1/2 pt-2 motion-safe:animate-[root-menu-in_180ms_ease-out] ${dense ? 'w-[min(420px,92vw)]' : 'w-[355px]'}`}
                data-testid="root-mega-panel"
              >
                <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow)] backdrop-blur-2xl">
                  <div className="rounded-xl bg-[var(--panel)] p-4 shadow-[0_0_0_1px_var(--glow)]">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[var(--cyan)]">{t.nav[entry.key]}</p>
                    <p className="mt-1 text-base font-bold">{locale === 'es' ? menu.es : menu.en}</p>
                  </div>
                  <div className={`mt-2 grid gap-0.5 ${dense ? 'max-h-[min(58vh,420px)] overflow-y-auto overscroll-contain pr-1' : ''}`}>
                    {menu.links.map((item) => (
                      <Link key={`${item.path}-${item.en}`} href={localizedPath(locale, item.path)}
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

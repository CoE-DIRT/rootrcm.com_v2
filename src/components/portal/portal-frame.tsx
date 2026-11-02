'use client';

import Link from 'next/link';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';
import {
  portalLabels,
  portalNav,
  portalOrganizations,
  type PortalPersona,
} from '@/content/portal-demo';

type PortalDemo = {
  locale: Locale;
  orgId: string;
  persona: PortalPersona;
  setOrgId: (id: string) => void;
  setPersona: (persona: PortalPersona) => void;
};

const PortalDemoContext = createContext<PortalDemo | null>(null);

export function usePortalDemo() {
  const value = useContext(PortalDemoContext);
  if (!value) throw new Error('Portal demo context is missing.');
  return value;
}

export function PortalFrame({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [orgId, setOrgId] = useState(portalOrganizations[0]?.id ?? 'sample-solo');
  const [persona, setPersona] = useState<PortalPersona>('practice-admin');
  const value = useMemo(
    () => ({ locale, orgId, persona, setOrgId, setPersona }),
    [locale, orgId, persona],
  );
  const org = portalOrganizations.find((item) => item.id === orgId) ?? portalOrganizations[0];

  return (
    <PortalDemoContext.Provider value={value}>
      <div className="portal-shell">
        <aside className="portal-sidebar" aria-label={locale === 'es' ? 'Navegación del portal' : 'Portal navigation'}>
          <p className="overline">ROOT</p>
          <p className="mt-2 text-sm font-bold">{portalLabels.synthetic[locale]}</p>
          <nav className="mt-4 grid gap-1">
            {portalNav.map((item) => (
              <Link
                key={item.href}
                href={localizedPath(locale, item.href)}
                className="min-h-11 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-2)]"
              >
                {portalLabels[item.key][locale]}
              </Link>
            ))}
          </nav>
          <Link className="btn-ghost mt-4" href={localizedPath(locale)}>
            {portalLabels.publicSite[locale]}
          </Link>
        </aside>
        <div className="min-w-0">
          <div className="flex flex-wrap items-end gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <label className="field min-w-52">
              <span>{portalLabels.orgLabel[locale]}</span>
              <select value={org?.id} onChange={(event) => setOrgId(event.target.value)} aria-label={portalLabels.orgLabel[locale]}>
                {portalOrganizations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field min-w-52">
              <span>{portalLabels.personaLabel[locale]}</span>
              <select
                value={persona}
                onChange={(event) => setPersona(event.target.value as PortalPersona)}
                aria-label={portalLabels.personaLabel[locale]}
              >
                <option value="practice-physician">{portalLabels.personaPhysician[locale]}</option>
                <option value="practice-admin">{portalLabels.personaAdmin[locale]}</option>
                <option value="root-rcm-specialist">{portalLabels.personaSpecialist[locale]}</option>
              </select>
            </label>
            <p className="muted max-w-xl text-xs">{portalLabels.personaNote[locale]}</p>
          </div>
          <main id="main" className="px-4 py-6">
            {children}
          </main>
        </div>
      </div>
    </PortalDemoContext.Provider>
  );
}

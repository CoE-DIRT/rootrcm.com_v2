'use client';

import Link from 'next/link';
import { copy } from '@/content/messages';
import { portalLabels } from '@/content/portal-demo';
import { localizedPath } from '@/lib/paths';
import { usePortalDemo } from './portal-frame';
import { PortalOrgScope } from './portal-org-scope';

export function PortalDirtPanel() {
  const { locale } = usePortalDemo();
  const t = copy(locale);
  const es = locale === 'es';
  const metrics = es
    ? ['Tasa neta de cobro', 'Tasa de denegación', 'Días en CxC']
    : ['Net collection rate', 'Denial rate', 'Days in A/R'];

  return (
    <PortalOrgScope showKpis>
      <p className="overline">{es ? 'Importación no autorizada' : 'Import not authorized'}</p>
      <h1 className="enterprise-title mt-2 font-extrabold">{portalLabels.dirt[locale]}</h1>
      <p className="muted mt-2 max-w-3xl text-sm">{t.technology.body}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric} className="surface p-4">
            <h2 className="text-sm font-bold">{metric}</h2>
            <p className="mt-2 text-3xl font-extrabold">—</p>
            <p className="muted mt-1 text-xs">{es ? 'Sin fuente verificada' : 'No verified source'}</p>
          </article>
        ))}
      </div>
      <p className="muted mt-4 text-sm">{t.adaptersOff}</p>
      <Link className="btn-secondary mt-4" href={localizedPath(locale, '/technology')}>
        {es ? 'Leer la página de tecnología' : 'Read the technology page'}
      </Link>
    </PortalOrgScope>
  );
}

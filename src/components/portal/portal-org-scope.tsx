'use client';

import type { ReactNode } from 'react';
import { copy } from '@/content/messages';
import { illustrativeAr } from '@/content/portal-demo';
import { usePortalDemo } from './portal-frame';
import { useTenant } from '@/lib/context/tenant-context';

/** Shared org-scoped chrome for portal screens that are still mostly static. */
export function PortalOrgScope({
  children,
  showKpis = false,
}: {
  children: ReactNode;
  showKpis?: boolean;
}) {
  const { locale } = usePortalDemo();
  const { activeOrg } = useTenant();
  const t = copy(locale);
  const es = locale === 'es';
  const figures = illustrativeAr(activeOrg?.id ?? 'sample-austin-asc');
  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <div>
      <p className="muted mb-4 text-sm" data-testid="portal-active-org">
        <span className="font-semibold text-[var(--text)]">{t.tenant.activeOrg}:</span>{' '}
        {activeOrg?.name ?? t.tenant.specialtyFallback}
        {activeOrg?.specialty ? ` · ${activeOrg.specialty}` : ''}
        <span className="mt-1 block">{t.tenant.queueScoped}</span>
      </p>
      {showKpis ? (
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <article className="surface p-4">
            <p className="muted text-xs">{es ? 'CxC total' : 'Total A/R'}</p>
            <p className="mt-2 text-xl font-extrabold">{money.format(figures.total)}</p>
          </article>
          <article className="surface p-4">
            <p className="muted text-xs">{es ? 'CxC > 90' : '>90 day A/R'}</p>
            <p className="mt-2 text-xl font-extrabold">{figures.over90}%</p>
          </article>
          <article className="surface p-4">
            <p className="muted text-xs">{es ? 'Tasa de denegación' : 'Denial rate'}</p>
            <p className="mt-2 text-xl font-extrabold">{figures.denial}%</p>
          </article>
        </div>
      ) : null}
      {children}
    </div>
  );
}

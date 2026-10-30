import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell/app-shell';
import { SalesJourneySimulator } from '@/components/commercial/sales-journey-simulator';
import { requireLocale } from '@/lib/locale';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SalesPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  return (
    <main id="main">
      <AppShell
        locale={locale}
        role="staff"
        orgName={locale === 'es' ? 'ROOT · Operaciones comerciales' : 'ROOT · Sales Operations'}
        title={locale === 'es' ? 'Recorrido del cliente' : 'Client journey'}
      >
        <SalesJourneySimulator locale={locale} />
      </AppShell>
    </main>
  );
}

import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await requireLocale(params);
  const t = copy(locale);
  const title = t.footer.refunds;
  const body =
    locale === 'es'
      ? 'Los reembolsos dependen del acuerdo firmado y de los entregables aprobados. Este entorno no cobra pagos.'
      : 'Refunds depend on the executed agreement and approved deliverables. This environment does not collect payment.';
  return publicPageMetadata(locale, title, body);
}

export default async function RefundsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  const es = locale === 'es';
  return (
    <MarketingPage
      locale={locale}
      title={t.footer.refunds}
      body={
        es
          ? 'Los reembolsos dependen del acuerdo firmado y de los entregables aprobados. Stripe permanece como adaptador desactivado. Este sitio no emite reembolsos.'
          : 'Refunds depend on the executed agreement and approved deliverables. Stripe stays a disabled adapter. This site does not issue refunds.'
      }
      sections={[
        {
          title: es ? 'Sin cobro en esta versión' : 'No charge in this build',
          body: es
            ? 'No hay un procesador de pagos activo. Una política de reembolso real se publica solo con el contrato que la respalda.'
            : 'There is no active payment processor. A live refund policy is published only with the contract that supports it.',
        },
        {
          title: es ? 'Enunciado de trabajo' : 'Statement of work',
          body: t.plans.sow,
        },
      ]}
    />
  );
}

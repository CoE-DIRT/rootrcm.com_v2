import type { Metadata } from 'next';
import { InfectiousDiseasePage } from '@/components/commercial/infectious-disease-page';
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
  return publicPageMetadata(locale, t.commercial.idHeadline, t.commercial.idLead);
}

export default async function InfectiousDiseaseRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  return <InfectiousDiseasePage locale={locale} />;
}

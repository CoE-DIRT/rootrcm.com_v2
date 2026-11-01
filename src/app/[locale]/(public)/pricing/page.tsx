import { redirect } from 'next/navigation';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

export default async function PricingAliasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await requireLocale(params);
  redirect(localizedPath(locale, '/plans'));
}

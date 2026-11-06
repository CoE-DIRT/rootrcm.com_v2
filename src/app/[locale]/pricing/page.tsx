import { redirect } from 'next/navigation';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

/** /pricing is the buyer-friendly alias of the canonical /plans page. */
export default async function PricingAlias({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  redirect(localizedPath(locale, '/plans'));
}

import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.signIn.title} body={t.signIn.body} nodeId="6:99">
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn-primary" href={localizedPath(locale, '/preview/client')} prefetch={false}>
          {t.signIn.clientPreview}
        </Link>
        <Link className="btn-secondary" href={localizedPath(locale, '/preview/staff')} prefetch={false}>
          {t.signIn.staffPreview}
        </Link>
      </div>
    </MarketingPage>
  );
}

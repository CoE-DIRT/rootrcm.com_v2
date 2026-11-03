import { AuthForm } from '@/components/forms/auth-form';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import { copy } from '@/content/messages';
import { requireLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/paths';

export const metadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' as const };

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  const t = copy(locale);
  return (
    <MarketingPage locale={locale} title={t.signIn.title} body={t.signIn.body} nodeId="6:99">
      <AuthForm locale={locale} /><div className="mt-6 flex flex-wrap gap-3">
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

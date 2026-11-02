import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { copy } from '@/content/messages';
import { specialtyLabel, type Specialty } from '@/content/specialties';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function SpecialtyProfile({ locale, specialty }: { locale: Locale; specialty: Specialty }) {
  const t = copy(locale);
  const title = specialtyLabel(specialty, locale);
  return (
    <main id="main" className="page-width pb-16 pt-6">
      <Breadcrumb
        items={[
          { href: localizedPath(locale), label: t.brand },
          { href: localizedPath(locale, '/specialties'), label: t.nav.specialties },
          { label: title },
        ]}
      />
      <p className="eyebrow mt-8">{t.commercial.specialtyKicker}</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
      <p className="muted mt-5 max-w-4xl text-lg">{specialty.summary[locale]}</p>
      <p className="mt-6 max-w-4xl">{specialty.body[locale]}</p>
      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {specialty.focus[locale].map((item) => (
          <li key={item} className="surface p-4 font-bold">
            {item}
          </li>
        ))}
      </ul>
      <p className="muted mt-8 text-sm">{t.commercial.codeDisclaimer}</p>
      <p className="mt-8">
        <Link className="btn-primary btn-lg" href={localizedPath(locale, '/consultation')}>
          {t.commercial.conversionCta} →
        </Link>
      </p>
    </main>
  );
}

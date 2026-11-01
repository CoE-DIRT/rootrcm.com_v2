import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { copy } from '@/content/messages';
import { specialtyBySlug } from '@/content/specialties';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function InfectiousDiseasePage({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const specialty = specialtyBySlug('infectious-disease');
  const sections = t.commercial.idSections;

  return (
    <main id="main" className="page-width pb-16 pt-6">
      <Breadcrumb
        items={[
          { href: localizedPath(locale), label: t.brand },
          { href: localizedPath(locale, '/specialties'), label: t.nav.specialties },
          { label: t.commercial.idHeadline },
        ]}
      />
      <p className="eyebrow mt-8">{t.commercial.idKicker}</p>
      <h1 className="mt-4 max-w-5xl text-4xl font-extrabold tracking-tight md:text-5xl lg:text-[50px] lg:leading-[1.1]">
        {t.commercial.idHeadline}
      </h1>
      <p className="muted mt-5 max-w-4xl text-lg">{t.commercial.idLead}</p>
      <p className="mt-4 max-w-4xl">{t.commercial.idClinicalDisclaimer}</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <li key={section.title} className="surface p-6">
            <h2 className="text-xl font-bold">{section.title}</h2>
            <p className="muted mt-3 text-sm">{section.body}</p>
          </li>
        ))}
      </ul>
      {specialty ? (
        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {specialty.focus[locale].map((item) => (
            <li key={item} className="surface-2 px-4 py-4 font-bold">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="muted mt-8 text-sm">{t.commercial.codeDisclaimer}</p>
      <p className="mt-8 flex flex-wrap gap-3">
        <Link className="btn-primary btn-lg" href={localizedPath(locale, '/consultation')}>
          {t.commercial.conversionCta} →
        </Link>
        <Link className="btn-secondary" href={localizedPath(locale, '/specialties')}>
          {t.commercial.specialtiesCta} →
        </Link>
      </p>
    </main>
  );
}

import { PageHero } from '@/components/site/page-hero';
import { BandList, TileGrid } from '@/components/site/tile-grid';
import { Accordion } from '@/components/ui/accordion';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function MarketingPage({
  locale,
  title,
  body,
  cta,
  ctaHref,
  tiles,
  sections,
  bands,
  nodeId,
  children,
}: {
  locale: Locale;
  title: string;
  body: string;
  cta?: string;
  ctaHref?: string;
  tiles?: readonly { title: string; href: string }[];
  sections?: readonly { title: string; body: string }[];
  bands?: readonly string[];
  nodeId?: string;
  children?: React.ReactNode;
}) {
  const t = copy(locale);
  return (
    <main id="main" className="page-width pb-16 pt-6">
      <Breadcrumb
        items={[
          { href: localizedPath(locale), label: t.brand },
          { label: title },
        ]}
      />
      <PageHero
        locale={locale}
        eyebrow={t.home.eyebrow}
        title={title}
        body={body}
        cta={cta}
        ctaHref={ctaHref}
        nodeId={nodeId}
      />
      {tiles ? <TileGrid locale={locale} tiles={tiles} hint={t.home.tileHint} /> : null}
      {sections ? <SectionGrid sections={sections} /> : null}
      {bands ? <BandList items={bands} /> : null}
      {children}
    </main>
  );
}

const SECTION_ANCHORS: Record<string, string> = {
  'Revenue leakage': 'revenue-leakage',
  'Fuga de ingresos': 'revenue-leakage',
  'Aging A/R': 'aging-ar',
  'A/R envejecida': 'aging-ar',
  'Denials and appeals': 'denials-appeals',
  'Denegaciones y apelaciones': 'denials-appeals',
  'Enrollment bottlenecks': 'enrollment',
  'Cuellos de inscripción': 'enrollment',
  'Operational fragmentation': 'fragmentation',
  'Fragmentación operativa': 'fragmentation',
  'DIRT previews': 'dirt-previews',
  'Vistas DIRT': 'dirt-previews',
  'Systems stay in place': 'systems-stay',
  'Los sistemas se quedan': 'systems-stay',
  'Traceable next actions': 'traceable-actions',
  'Siguientes acciones trazables': 'traceable-actions',
  'Official forms': 'official-forms',
  'Formularios oficiales': 'official-forms',
  Templates: 'templates',
  Plantillas: 'templates',
  Education: 'education',
  Educación: 'education',
  'Public website': 'public-website',
  'Sitio público': 'public-website',
  'Client portal': 'client-portal',
  'Portal del cliente': 'client-portal',
};

export function SectionGrid({ sections }: { sections: readonly { title: string; body: string }[] }) {
  return (
    <ul className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {sections.map((section) => {
        const id = SECTION_ANCHORS[section.title];
        return (
          <li key={section.title} id={id} className="surface scroll-mt-28 p-[18px]">
            <h2 className="text-lg font-bold">{section.title}</h2>
            <p className="muted mt-2 text-sm">{section.body}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function StepList({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="mt-8 grid gap-3 md:grid-cols-2">
      {steps.map((step, index) => (
        <li key={step} className="surface p-4">
          <p className="eyebrow">{String(index + 1).padStart(2, '0')}</p>
          <p className="mt-2 font-bold">{step}</p>
        </li>
      ))}
    </ol>
  );
}

export function PendingFaq({
  locale,
  faqs,
}: {
  locale: Locale;
  faqs?: readonly { title: string; body: string }[];
}) {
  const t = copy(locale);
  const items = faqs ?? [{ title: t.pending, body: t.company.body }];
  return (
    <div className="mt-8 grid gap-3">
      {items.map((item) => (
        <Accordion key={item.title} title={item.title}>
          {item.body}
        </Accordion>
      ))}
    </div>
  );
}

import { ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/site/page-intro';
import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { copy } from '@/content/messages';
import type { Locale } from '@/i18n/locales';
import { localizedPath } from '@/lib/paths';

export function MarketingPage({
  locale,
  title,
  body,
  eyebrow,
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
  eyebrow?: string;
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
    <main id="main">
      <PageIntro locale={locale} eyebrow={eyebrow ?? t.home.eyebrow} title={title} body={body} cta={cta} ctaHref={ctaHref} nodeId={nodeId} />
      <Container>
        <div className="page-body">
          {tiles ? <TileGrid locale={locale} tiles={tiles} /> : null}
          {sections ? <SectionGrid sections={sections} /> : null}
          {bands ? <BandList items={bands} /> : null}
          {children}
        </div>
      </Container>
    </main>
  );
}

export function TileGrid({ locale, tiles }: { locale: Locale; tiles: readonly { title: string; href: string }[] }) {
  return (
    <ul className="ui-grid" data-min="sm">
      {tiles.map((tile) => (
        <li key={tile.title}>
          <Card
            title={tile.title}
            href={localizedPath(locale, tile.href)}
            footer={<ArrowUpRight size={20} strokeWidth={1.75} aria-hidden="true" className="text-[var(--cyan)]" />}
          />
        </li>
      ))}
    </ul>
  );
}

export function SectionGrid({ sections }: { sections: readonly { title: string; body: string }[] }) {
  return (
    <ul className="ui-grid">
      {sections.map((section) => (
        <li key={section.title}>
          <Card title={section.title} body={section.body} headingLevel={2} />
        </li>
      ))}
    </ul>
  );
}

export function BandList({ items }: { items: readonly string[] }) {
  return (
    <ul className="ui-grid">
      {items.map((item) => (
        <li key={item}>
          <Card surface="raised" padding="md" title={item} headingLevel={3} />
        </li>
      ))}
    </ul>
  );
}

export function StepList({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="method">
      {steps.map((step) => (
        <li key={step} className="method__step">
          <p className="method__title">{step}</p>
        </li>
      ))}
    </ol>
  );
}

export function PendingFaq({ locale, faqs }: { locale: Locale; faqs?: readonly { title: string; body: string }[] }) {
  const t = copy(locale);
  const items = faqs ?? [{ title: t.pending, body: t.company.body }];
  return (
    <div>
      {items.map((item) => (
        <Accordion key={item.title} title={item.title}>
          {item.body}
        </Accordion>
      ))}
    </div>
  );
}

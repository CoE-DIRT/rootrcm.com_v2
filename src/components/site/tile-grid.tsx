import { Card } from '@/components/ui/card';
import { localizedPath } from '@/lib/paths';
import type { Locale } from '@/i18n/locales';

export function TileGrid({
  locale,
  tiles,
  hint,
}: {
  locale: Locale;
  tiles: readonly { title: string; href: string }[];
  hint: string;
}) {
  return (
    <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {tiles.map((tile) => (
        <Card key={tile.title} title={tile.title} body={hint} href={localizedPath(locale, tile.href)} />
      ))}
    </div>
  );
}

export function BandList({ items }: { items: readonly string[] }) {
  return (
    <div className="mt-6 grid gap-3">
      {items.map((item) => (
        <p key={item} className="surface-2 px-4 py-4 font-bold">
          {item}
        </p>
      ))}
    </div>
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

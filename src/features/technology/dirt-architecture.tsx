import type { Locale } from '@/i18n/locales';
import { copy } from '@/content/messages';

export function DirtArchitecture({ locale }: { locale: Locale }) {
  const t = copy(locale).technology;
  return (
    <section className="mt-10" aria-labelledby="dirt-architecture-heading" data-testid="dirt-architecture">
      <p className="eyebrow">{t.architectureEyebrow}</p>
      <h2 id="dirt-architecture-heading" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
        {t.architectureTitle}
      </h2>
      <p className="muted mt-3 max-w-3xl text-sm">{t.architectureBody}</p>
      <ol className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {t.layers.map((layer, index) => (
          <li key={layer.title} className="surface relative overflow-hidden p-4">
            <p className="eyebrow text-[var(--cyan)]">{String(index + 1).padStart(2, '0')}</p>
            <h3 className="mt-2 text-base font-bold leading-snug">{layer.title}</h3>
            <p className="muted mt-2 text-sm">{layer.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

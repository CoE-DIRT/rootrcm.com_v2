import { SectionHeader } from '@/components/commercial/section-header';
import { teamCopy, teamMembers } from '@/content/team';
import type { Locale } from '@/i18n/locales';

export function TeamGrid({ locale }: { locale: Locale }) {
  const t = teamCopy[locale];
  return (
    <section className="commercial-section mt-16" aria-labelledby="team-heading">
      <SectionHeader id="team-heading" eyebrow={t.eyebrow} title={t.title} body={t.body} />
      <ul className="mt-8 grid grid-cols-1 gap-[clamp(10px,1.25vw,18px)] sm:grid-cols-2 xl:grid-cols-4">
        {teamMembers.map((member, index) => (
          <li key={member.id} className="surface flex min-w-0 flex-col overflow-hidden">
            <div
              className="flex aspect-video items-center justify-center border-b border-[var(--border)] bg-[#071a35]"
              aria-hidden="true"
            >
              <span className="flex size-20 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-2xl font-bold tracking-tight sm:size-24 sm:text-3xl xl:size-20 xl:text-2xl">
                {member.initials}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5 p-[clamp(13px,1.45vw,21px)]">
              <p className="eyebrow">
                {t.cardKicker} · {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="break-words text-[clamp(15px,1.2vw,18px)] font-bold leading-snug">{member.name}</h3>
              <p className="text-sm font-semibold">{member.role[locale]}</p>
              <p className="muted mt-auto text-xs">{t.portraitPending}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="muted mt-5 text-sm">{t.note}</p>
    </section>
  );
}

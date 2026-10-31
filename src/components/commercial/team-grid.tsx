import { SectionHeader } from '@/components/commercial/section-header';
import { teamCopy, teamMembers } from '@/content/team';
import type { Locale } from '@/i18n/locales';

export function TeamGrid({ locale }: { locale: Locale }) {
  const t = teamCopy[locale];
  return (
    <section className="commercial-section mt-16" aria-labelledby="team-heading">
      <SectionHeader id="team-heading" eyebrow={t.eyebrow} title={t.title} body={t.body} />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {teamMembers.map((member) => (
          <li key={member.id} className="surface min-w-0 overflow-hidden">
            <div
              className="flex aspect-[4/3] items-center justify-center border-b border-[var(--border)] bg-[radial-gradient(ellipse_at_top,rgba(17,225,238,.18),transparent_70%)]"
              aria-hidden="true"
            >
              <span className="flex size-24 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-3xl font-bold tracking-tight">
                {member.initials}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="mt-2 text-sm font-semibold">{member.role[locale]}</p>
              <p className="muted mt-4 text-xs">{t.portraitPending}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="muted mt-5 text-sm">{t.note}</p>
    </section>
  );
}

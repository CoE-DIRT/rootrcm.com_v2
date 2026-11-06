import { SectionHeader } from '@/components/commercial/section-header';
import { teamCopy, teamMembers } from '@/content/team';
import type { Locale } from '@/i18n/locales';

export function TeamGrid({ locale }: { locale: Locale }) {
  const t = teamCopy[locale];
  return (
    <section className="commercial-section mt-10" aria-labelledby="team-heading">
      <SectionHeader id="team-heading" eyebrow={t.eyebrow} title={t.title} body={t.body} />
      <ul className="mt-6 grid grid-cols-1 gap-[clamp(10px,1.25vw,18px)] sm:grid-cols-2 xl:grid-cols-4">
        {teamMembers.map((member) => (
          <li key={member.id} className="surface team-member-card flex min-w-0 flex-col overflow-hidden">
            <div className="team-member-art" aria-hidden="true">
              <span className="team-member-monogram">{member.initials}</span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-[clamp(13px,1.3vw,19px)]">
              <p className="eyebrow">{t.cardKicker}</p>
              <h3 className="break-words text-[clamp(15px,1.2vw,18px)] font-bold leading-snug">{member.name}</h3>
              <p className="muted text-sm font-medium leading-snug">{member.role[locale]}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

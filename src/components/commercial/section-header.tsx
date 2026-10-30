export function SectionHeader({
  eyebrow,
  title,
  body,
  id,
  headingLevel = 2,
}: {
  eyebrow: string;
  title: string;
  body: string;
  id?: string;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  const headingClass =
    headingLevel === 1
      ? 'mt-4 text-4xl font-extrabold tracking-tight md:text-5xl'
      : 'mt-3 text-3xl font-extrabold tracking-tight md:text-4xl';
  return (
    <header className="max-w-4xl">
      <p className="eyebrow">{eyebrow}</p>
      <Heading id={id} className={headingClass}>
        {title}
      </Heading>
      <p className="muted mt-4 text-base md:text-lg">{body}</p>
    </header>
  );
}

import Link from 'next/link';

export function PageHero({
  eyebrow,
  title,
  body,
  cta,
  ctaHref,
  nodeId,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta?: string;
  ctaHref?: string;
  nodeId?: string;
}) {
  return (
    <section className="mt-6 max-w-5xl" data-node-id={nodeId}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-[50px] lg:leading-[1.1]">
        {title}
      </h1>
      <p className="muted mt-5 max-w-4xl text-lg">{body}</p>
      {cta && ctaHref ? (
        <Link className="btn-primary btn-lg mt-7" href={ctaHref}>
          {cta} →
        </Link>
      ) : null}
    </section>
  );
}

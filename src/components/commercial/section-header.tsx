import { SectionHeading } from '@/components/ui/Section';

/** Legacy API kept for commercial sections; renders the shared SectionHeading primitive. */
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
  return <SectionHeading id={id ?? ''} eyebrow={eyebrow} title={title} body={body} level={headingLevel} />;
}

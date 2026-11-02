import Link from 'next/link';

export function Breadcrumb({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="muted text-sm">
      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex gap-2">
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

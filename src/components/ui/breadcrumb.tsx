import Link from 'next/link';

export type BreadcrumbProps = { items: { href?: string; label: string }[]; label?: string };

export function Breadcrumb({ items, label = 'Breadcrumb' }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className="ui-breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

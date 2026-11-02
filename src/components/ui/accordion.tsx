export function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="surface p-4">
      <summary className="cursor-pointer font-bold">{title}</summary>
      <div className="muted mt-3 text-sm">{children}</div>
    </details>
  );
}

type Tone = 'neutral' | 'success' | 'warning' | 'danger';

export function StatusBanner({
  tone = 'neutral',
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <div className="status-banner surface-2" data-tone={tone} data-node-id="3:46" role="status">
      {children}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="surface p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="muted mt-2">{body}</p>
    </div>
  );
}

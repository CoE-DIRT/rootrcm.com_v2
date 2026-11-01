export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow" role="note">
      {children}
    </p>
  );
}

import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="page-width py-24">
      <p className="eyebrow">ROOT V2</p>
      <h1 className="mt-4 text-4xl font-extrabold">Page not found</h1>
      <p className="muted mt-4 max-w-xl">This route is not published in the current foundation. Return to the public experience.</p>
      <Button variant="primary" href="/en">
        Home
      </Button>
    </main>
  );
}

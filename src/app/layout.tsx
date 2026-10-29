import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ROOT | Revenue Operations & Outcomes Technology',
    template: '%s | ROOT',
  },
  description:
    'A technology-enabled operating partner for medical practices. Revenue cycle management, credentialing, DIRT intelligence and practice operations.',
  applicationName: 'ROOT',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon',
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

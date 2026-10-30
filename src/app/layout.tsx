import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import { ThemeScript } from '@/components/site/theme-script';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'ROOT | Revenue Operations & Outcomes Technology',
    template: '%s | ROOT',
  },
  description:
    'A technology-enabled operating partner for medical practices. Revenue cycle management, credentialing, DIRT intelligence and practice operations.',
  applicationName: 'ROOT',
  icons: {
    icon: [{ url: '/brand/mark.webp', type: 'image/webp' }, { url: '/icon.svg' }],
    apple: '/brand/mark.webp',
  },
  openGraph: {
    title: 'ROOT | Revenue Operations & Outcomes Technology',
    description:
      'A technology-enabled operating partner for medical practices. Revenue cycle management, credentialing, DIRT intelligence and practice operations.',
    images: [{ url: '/brand/banner.webp', width: 1350, height: 450, alt: 'ROOT' }],
  },
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get('x-root-locale') === 'es' ? 'es' : 'en';
  return (
    <html lang={locale} className={inter.variable} data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpecialtyProfile } from '@/components/commercial/specialty-profile';
import { specialties, specialtyBySlug } from '@/content/specialties';
import { requireLocale } from '@/lib/locale';
import { publicPageMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return specialties
    .filter((specialty) => specialty.slug !== 'infectious-disease')
    .map((specialty) => ({ slug: specialty.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await requireLocale(params);
  const specialty = specialtyBySlug(slug);
  if (!specialty) notFound();
  return publicPageMetadata(locale, specialty.name[locale], specialty.summary[locale]);
}

export default async function SpecialtyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const locale = await requireLocale(params);
  const specialty = specialtyBySlug(slug);
  if (!specialty || specialty.slug === 'infectious-disease') notFound();
  return <SpecialtyProfile locale={locale} specialty={specialty} />;
}

/**
 * Published site media. Stock photography stays unpublished until a reviewed
 * Pexels record exists in docs/design/media-reviews.json and a transformed
 * local file is added in a later PR.
 */
export type MediaOrigin = 'root-original' | 'pexels-approved';

export type PublishedMedia = {
  id: string;
  origin: MediaOrigin;
  publicPath: string;
  alt: { en: string; es: string };
};

export const publishedMedia = [
  {
    id: 'brand-mark',
    origin: 'root-original',
    publicPath: '/brand/mark.webp',
    alt: { en: 'ROOT mark', es: 'Marca ROOT' },
  },
  {
    id: 'brand-logo',
    origin: 'root-original',
    publicPath: '/brand/logo.webp',
    alt: { en: 'ROOT wordmark', es: 'Logotipo ROOT' },
  },
  {
    id: 'brand-banner',
    origin: 'root-original',
    publicPath: '/brand/banner.webp',
    alt: { en: 'ROOT revenue operations banner', es: 'Banner de operaciones de ingresos ROOT' },
  },
  {
    id: 'brand-story',
    origin: 'root-original',
    publicPath: '/brand/story.webp',
    alt: { en: 'ROOT cinematic story still', es: 'Imagen cinematográfica de ROOT' },
  },
  {
    id: 'brand-poster',
    origin: 'root-original',
    publicPath: '/brand/poster.webp',
    alt: { en: 'ROOT operations poster', es: 'Póster de operaciones ROOT' },
  },
  {
    id: 'brand-wave',
    origin: 'root-original',
    publicPath: '/brand/waveLower.webp',
    alt: { en: 'ROOT lower wave motif', es: 'Motivo de onda inferior ROOT' },
  },
  {
    id: 'root-revenue-hero',
    origin: 'root-original',
    publicPath: '/media/root-revenue-hero.svg',
    alt: {
      en: 'Abstract revenue intelligence visualization with connected workflow panels',
      es: 'Visualización abstracta de inteligencia de ingresos con paneles de flujo conectados',
    },
  },
  {
    id: 'root-workflow-network',
    origin: 'root-original',
    publicPath: '/media/root-workflow-network.svg',
    alt: {
      en: 'Abstract network of healthcare operations workflows',
      es: 'Red abstracta de flujos de operaciones sanitarias',
    },
  },
] as const satisfies readonly PublishedMedia[];

export function publishedMediaById(id: string): PublishedMedia | undefined {
  return publishedMedia.find((item) => item.id === id);
}

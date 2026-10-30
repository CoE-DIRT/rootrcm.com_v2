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

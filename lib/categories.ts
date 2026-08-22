/**
 * Catálogo de categorías estático (sin backend detrás). Las 8 macro y sus slugs son las
 * etiquetas visibles en el directorio; las micro son un set de ejemplo suficiente para
 * ejercitar el filtro.
 */

export interface MacroCategoryRow {
  id: string;
  name: string;
  slug: string;
}

export interface MicroCategoryRow {
  id: string;
  name: string;
  macro_id: string;
}

export const CATEGORY_LABEL_TO_SLUG: Readonly<Record<string, string>> = {
  'Estrategia y consultoría de crecimiento': 'estrategia-growth',
  'Branding e identidad visual': 'marca-comunicacion-branding',
  'Redes sociales y gestión de comunidad': 'contenido-social-organico',
  'Medios pagados y rendimiento de Ads': 'paid-media-performance-ads',
  'SEO y posicionamiento en buscadores': 'seo-adquisicion-organica',
  'Desarrollo web y e-commerce': 'web-conversion-cro',
  'MarTech, automatización y datos': 'automatizacion-crm-data-martech',
  'Multimedia y producción de contenido': 'produccion-multimedia-pro',
};

export const MACRO_CATEGORIES: MacroCategoryRow[] = Object.entries(CATEGORY_LABEL_TO_SLUG).map(
  ([name, slug], i) => ({ id: `macro-${i + 1}`, name, slug }),
);

const MICRO_BY_SLUG: Record<string, string[]> = {
  'estrategia-growth': ['Auditoría de crecimiento', 'Growth hacking', 'Plan de marketing 360'],
  'marca-comunicacion-branding': ['Diseño de logo', 'Manual de marca', 'Naming'],
  'contenido-social-organico': ['Community management', 'Calendario de contenido', 'Reels y shorts'],
  'paid-media-performance-ads': ['Meta Ads', 'Google Ads', 'TikTok Ads'],
  'seo-adquisicion-organica': ['SEO técnico', 'Link building', 'SEO local'],
  'web-conversion-cro': ['Landing pages', 'E-commerce Shopify', 'Optimización de conversión'],
  'automatizacion-crm-data-martech': ['Automatización de email', 'Integración CRM', 'Dashboards de datos'],
  'produccion-multimedia-pro': ['Edición de video', 'Fotografía de producto', 'Motion graphics'],
};

export const MICRO_CATEGORIES: MicroCategoryRow[] = MACRO_CATEGORIES.flatMap((macro) =>
  (MICRO_BY_SLUG[macro.slug] ?? []).map((name, i) => ({
    id: `${macro.id}-micro-${i + 1}`,
    name,
    macro_id: macro.id,
  })),
);

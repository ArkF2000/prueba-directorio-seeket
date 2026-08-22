/** Tipos del directorio público. Extraídos de la plataforma SEEKET para este proyecto de prueba. */

export type TierLevel = 'ascenso' | 'verificado' | 'premium';

/** Proyecto de portafolio resumido para la tarjeta del directorio. */
export interface DirectorioPortfolioProject {
  id: string;
  title: string;
  cover_url: string;
}

/** DTO de servicio publicado para el feed del directorio público. */
export interface PublicServiceEntry {
  service_id: string;
  service_index: 1 | 2;
  service_title: string;
  video_portfolio: string | null;
  search_tags: string[];
  service_markets: string[];
  pricing_scheme: Record<string, unknown> | null;
  published_at: string;
  profile_id: string;
  display_name: string | null;
  country: string | null;
  is_agency: boolean;
  profession: string | null;
  languages: { idioma: string; nivel: string }[];
  agency_nichos: string[];
  macro_category_name: string | null;
  macro_category_slug: string | null;
  micro_category_name: string | null;
  portfolio_projects: DirectorioPortfolioProject[];
  precio_inicial_num: number | null;
  tier_level: TierLevel;
  active_service_level: 1 | 2 | 3;
}

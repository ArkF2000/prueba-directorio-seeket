import type { TierLevel } from '@/lib/types';
import { COUNTRIES_LATAM, getCountryNameByCode } from '@/lib/constants/countries-latam';
import { IDIOMAS } from '@/lib/constants/languages';
import { CATEGORY_LABEL_TO_SLUG } from '@/lib/categories';

/** Estado compartido del panel de filtros del directorio. */
export interface DirectorioFilters {
  /** Etiqueta de perfil (tier_level del proveedor). */
  profileTier: TierLevel[];
  /** Nivel operativo del servicio (active_service_level). */
  serviceLevel: (1 | 2 | 3)[];
  budgetType: 'hourly' | 'project' | null;
  budgetRange: [number, number];
  /** ISO-2 del país del proveedor. */
  countryCodes: string[];
  talentType: 'freelancer' | 'agency' | 'both' | null;
  /** Etiquetas display de macro (FiltersPanel / analytics). */
  category: string[];
  /** Nombre de microcategoría en BD. */
  microCategory: string[];
  /** Idioma(s) del perfil (`languages[].idioma`). */
  languages: string[];
}

export const DEFAULT_DIRECTORIO_FILTERS: DirectorioFilters = {
  profileTier: [],
  serviceLevel: [],
  budgetType: null,
  budgetRange: [0, 5000],
  countryCodes: [],
  talentType: null,
  category: [],
  microCategory: [],
  languages: [],
};

export const PROFILE_TIER_OPTIONS: { id: TierLevel; label: string }[] = [
  { id: 'ascenso', label: 'Promesa en ascenso' },
  { id: 'verificado', label: 'Verificado' },
  { id: 'premium', label: 'Premium' },
];

export const SERVICE_LEVEL_OPTIONS: { id: 1 | 2 | 3; label: string }[] = [
  { id: 1, label: 'Nivel 1 · Ascenso' },
  { id: 2, label: 'Nivel 2 · Verificado' },
  { id: 3, label: 'Nivel 3 · Premium' },
];

export const TALENT_TYPE_OPTIONS = [
  { id: 'both' as const, label: 'Freelancer y agencia' },
  { id: 'freelancer' as const, label: 'Solo freelancer' },
  { id: 'agency' as const, label: 'Solo agencia' },
];

export const MACRO_CATEGORY_LABELS = Object.keys(CATEGORY_LABEL_TO_SLUG);

export const FILTER_LANGUAGE_OPTIONS = IDIOMAS.filter((lang) => lang !== 'Otro');

const EXTRA_COUNTRY_CODES: { code: string; name: string }[] = [
  { code: 'US', name: 'Estados Unidos' },
  { code: 'CA', name: 'Canadá' },
];

export const REGION_GROUPS: { id: string; label: string; codes: string[] }[] = [
  {
    id: 'norteamerica',
    label: 'Norteamérica',
    codes: ['MX', 'US', 'CA'],
  },
  {
    id: 'centroamerica',
    label: 'Centroamérica',
    codes: ['GT', 'BZ', 'HN', 'SV', 'NI', 'CR', 'PA'],
  },
  {
    id: 'sudamerica',
    label: 'Sudamérica',
    codes: ['CO', 'VE', 'EC', 'PE', 'BO', 'CL', 'AR', 'UY', 'PY', 'BR', 'GY', 'SR'],
  },
  {
    id: 'peninsular',
    label: 'América peninsular',
    codes: ['CU', 'DO', 'PR', 'HT', 'JM'],
  },
];

const countryNameByCode = new Map<string, string>([
  ...COUNTRIES_LATAM.map((c) => [c.code, c.name] as const),
  ...EXTRA_COUNTRY_CODES.map((c) => [c.code, c.name] as const),
]);

export function getFilterCountryName(code: string): string {
  return countryNameByCode.get(code) ?? getCountryNameByCode(code);
}

/** Resumen corto para filas del panel (chips / placeholder). */
export function summarizeFilterSelection(items: string[], empty = 'Cualquiera'): string {
  if (items.length === 0) return empty;
  if (items.length === 1) return items[0];
  return `${items.length} seleccionados`;
}

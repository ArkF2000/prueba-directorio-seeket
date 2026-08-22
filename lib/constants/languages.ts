/** Idiomas en español para el wizard (lista universal) */
export const IDIOMAS: string[] = [
  'Alemán',
  'Árabe',
  'Catalán',
  'Chino mandarín',
  'Español',
  'Francés',
  'Hindi',
  'Inglés',
  'Italiano',
  'Japonés',
  'Portugués',
  'Ruso',
  'Otro',
].sort((a, b) => a.localeCompare(b));

/** Niveles de dominio del idioma en español */
export const NIVELES_IDIOMA: string[] = [
  'Básico',
  'Conversacional',
  'Fluido',
  'Nativo/Bilingüe',
];

export type IdiomaEntry = { idioma: string; nivel: string };

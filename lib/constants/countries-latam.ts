/** Países LATAM: nombre en español + código ISO 3166-1 alpha-2 */
export const COUNTRIES_LATAM: { code: string; name: string }[] = [
  { code: 'AR', name: 'Argentina' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BR', name: 'Brasil' },
  { code: 'BZ', name: 'Belice' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HT', name: 'Haití' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'MX', name: 'México' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'PA', name: 'Panamá' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Perú' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
].sort((a, b) => a.name.localeCompare(b.name));

export function getCountryNameByCode(code: string): string {
  return COUNTRIES_LATAM.find((c) => c.code === code)?.name ?? code;
}

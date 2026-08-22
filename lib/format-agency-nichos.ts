/** Línea descriptiva de nichos para fichas públicas de agencia (max 4). */
export function formatAgencyNichosLine(nichos: string[]): string {
  const clean = nichos.map((n) => n.trim()).filter(Boolean).slice(0, 4);
  if (clean.length === 0) return '';
  if (clean.length === 1) return `Agencia de ${clean[0]}`;
  if (clean.length === 2) return `Agencia de ${clean[0]} y ${clean[1]}`;
  const last = clean[clean.length - 1];
  const rest = clean.slice(0, -1);
  return `Agencia de ${rest.join(', ')} y ${last}`;
}

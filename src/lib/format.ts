/** Formatage de date ISO (YYYY-MM-DD) vers JJ/MM/AAAA (registre "donnée système", design-system §3.2). */
export function formatDateFr(iso: string | null): string {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

/** "2026-05-04" → "04 MAY 2026" (or "04 MAY" when withYear is false). */
export function formatDateES(iso?: string, withYear = true): string {
  if (!iso) return "—";
  const parts = iso.split("-");
  if (parts.length < 3) return iso;
  const [y, m, d] = parts;
  const mi = parseInt(m, 10) - 1;
  const mes = MESES[mi] ?? m;
  return withYear ? `${d} ${mes} ${y}` : `${d} ${mes}`;
}

export function readingLabel(min?: number): string {
  return min ? `${min} MIN DE LECTURA` : "";
}

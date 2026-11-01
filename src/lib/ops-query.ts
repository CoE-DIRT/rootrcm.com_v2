export type OpsSortKey = 'id' | 'payer' | 'status' | 'phase';
export type OpsSortDir = 'asc' | 'desc';

export function matchesQuery(query: string, parts: readonly string[]): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return parts.some((part) => part.toLowerCase().includes(needle));
}

export function compareValues(left: string, right: string, dir: OpsSortDir): number {
  const cmp = left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
  return dir === 'desc' ? -cmp : cmp;
}

export function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

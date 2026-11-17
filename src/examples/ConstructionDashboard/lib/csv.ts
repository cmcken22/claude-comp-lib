import type { Column } from '../columns';
import type { BudgetLine } from '../data';

function toCsv(lines: BudgetLine[], columns: Column[]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const header = columns.map((c) => esc(c.header)).join(',');
  const body = lines.map((l) => columns.map((c) => esc(c.sortValue(l))).join(','));
  return [header, ...body].join('\n');
}

/** Downloads the given lines as a CSV with one column per visible table column. */
export function downloadCsv(lines: BudgetLine[], columns: Column[], filename: string) {
  const blob = new Blob([toCsv(lines, columns)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

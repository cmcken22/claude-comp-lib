const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Parses 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm' without time zone drift. */
function parts(iso: string) {
  const [date, time = '00:00'] = iso.split('T');
  const [y, m, d] = date.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  return { y, m, d, h, min };
}

export function formatDate(iso: string) {
  const { y, m, d } = parts(iso);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function formatTime(iso: string) {
  const { h, min } = parts(iso);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(min).padStart(2, '0')} ${suffix}`;
}

export function formatDateTime(iso: string) {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

/** "Today 2:05 PM", "Yesterday 4:40 PM" or a date, relative to the fixed TODAY. */
export function formatRelative(iso: string, today: string) {
  const a = parts(iso);
  const b = parts(today);
  const days = Math.round(
    (Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86_400_000,
  );
  if (days === 0) return `Today ${formatTime(iso)}`;
  if (days === 1) return `Yesterday ${formatTime(iso)}`;
  return formatDate(iso);
}

const money = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export const formatMoney = (n: number) => money.format(n);

/** Compact money for tight spaces: $48k. */
export const formatK = (n: number) => `$${Math.round(n / 1000)}k`;

export const formatRange = (low: number, high: number) => `${formatK(low)}–${formatK(high)}`;

export const plural = (n: number, word: string, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

/** Advances a fixed clock by a number of minutes, keeping the same ISO shape. */
export function addMinutes(iso: string, minutes: number) {
  const { y, m, d, h, min } = parts(iso);
  const t = new Date(Date.UTC(y, m - 1, d, h, min + minutes));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}T${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}`;
}

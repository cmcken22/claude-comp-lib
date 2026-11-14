export const compactMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** Format an ISO date (YYYY-MM-DD) without shifting it by the local time zone. */
export const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));

export const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('');

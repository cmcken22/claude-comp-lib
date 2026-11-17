import type { BudgetLine } from '../data';

/** Fixed "today" so the example renders the same every time. */
export const TODAY = new Date('2026-11-17T00:00:00');

export const money = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const moneyShort = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatMoney = (n: number, short = false) => {
  const s = (short ? moneyShort : money).format(Math.abs(n));
  return `${n < 0 ? '−' : ''}$${s}`;
};

export const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00`));

export const daysUntil = (iso: string) =>
  Math.round((new Date(`${iso}T00:00:00`).getTime() - TODAY.getTime()) / 86_400_000);

export const sum = (lines: BudgetLine[], pick: (l: BudgetLine) => number) => lines.reduce((t, l) => t + pick(l), 0);

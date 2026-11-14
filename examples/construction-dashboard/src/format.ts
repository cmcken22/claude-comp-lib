export const money = (n: number, digits = 1) =>
  n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` :
  n >= 1e6 ? `$${(n / 1e6).toFixed(digits)}M` : `$${Math.round(n / 1e3)}K`;

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export const shortDate = (iso: string) => dateFmt.format(new Date(`${iso}T12:00:00`));

export const daysBetween = (from: Date, iso: string) =>
  Math.round((new Date(`${iso}T12:00:00`).getTime() - from.getTime()) / 86_400_000);

export const variancePct = (budget: number, forecast: number) => ((forecast - budget) / budget) * 100;

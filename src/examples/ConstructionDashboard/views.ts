import { budgetLines, remaining, type BudgetLine, type LineStatus } from './data';
import { daysUntil } from './lib/format';

export type ViewId = 'default' | 'over' | 'pending' | 'due-soon';

/** Saved views: preset row filters shown as chips above the table. */
export const VIEWS: { id: ViewId; label: string; test: (l: BudgetLine) => boolean }[] = [
  { id: 'default', label: 'Default view', test: () => true },
  { id: 'over', label: 'Over budget', test: (l) => l.status === 'over-budget' || remaining(l) < 0 },
  { id: 'pending', label: 'Pending approval', test: (l) => l.pendingChanges > 0 },
  {
    id: 'due-soon',
    label: 'Due in 90 days',
    test: (l) => l.status !== 'complete' && daysUntil(l.dueDate) >= 0 && daysUntil(l.dueDate) <= 90,
  },
];

export interface Filters {
  statuses: LineStatus[];
  vendor: string;
  minBudget: string;
}

export const EMPTY_FILTERS: Filters = { statuses: [], vendor: '', minBudget: '' };
export const VENDORS = [...new Set(budgetLines.map((l) => l.vendor))].sort();
export const PAGE_SIZES = [10, 25, 50];

export const countActiveFilters = (f: Filters) => f.statuses.length + (f.vendor ? 1 : 0) + (f.minBudget ? 1 : 0);

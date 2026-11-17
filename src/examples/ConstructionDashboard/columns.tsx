import type { ReactNode } from 'react';
import { Badge } from '../../components/Badge';
import { cx } from '../../utils/cx';
import { DIVISIONS, remaining, revisedBudget, STATUS_META, type BudgetLine } from './data';
import { daysUntil, formatDate, formatMoney, sum } from './lib/format';
import { ProgressBar } from './components/ProgressBar';

export type ColumnKey =
  | 'costCode'
  | 'description'
  | 'vendor'
  | 'status'
  | 'originalBudget'
  | 'approvedChanges'
  | 'revisedBudget'
  | 'pendingChanges'
  | 'spentToDate'
  | 'remaining'
  | 'progress'
  | 'dueDate';

export interface Column {
  key: ColumnKey;
  header: string;
  numeric?: boolean;
  /** Can't be hidden from the Columns menu. */
  locked?: boolean;
  hiddenByDefault?: boolean;
  sortValue: (line: BudgetLine) => string | number;
  render: (line: BudgetLine) => ReactNode;
  /** Footer total for the visible rows. */
  total?: (lines: BudgetLine[]) => ReactNode;
}

const Money = ({ value, signed = false }: { value: number; signed?: boolean }) => (
  <span className={cx('cd-money', value < 0 && 'cd-money--negative', signed && value === 0 && 'cd-money--zero')}>
    {signed && value > 0 ? '+' : ''}
    {formatMoney(value)}
  </span>
);

/** A money column that also totals in the footer. */
const moneyColumn = (
  key: ColumnKey,
  header: string,
  pick: (l: BudgetLine) => number,
  options: { signed?: boolean; hiddenByDefault?: boolean } = {},
): Column => ({
  key,
  header,
  numeric: true,
  hiddenByDefault: options.hiddenByDefault,
  sortValue: pick,
  render: (l) => <Money value={pick(l)} signed={options.signed} />,
  total: (lines) => <Money value={sum(lines, pick)} signed={options.signed} />,
});

export const COLUMNS: Column[] = [
  {
    key: 'costCode',
    header: 'Cost code',
    locked: true,
    sortValue: (l) => l.costCode,
    render: (l) => <span className="cd-code">{l.costCode}</span>,
    total: (lines) => <strong>Totals · {lines.length} lines</strong>,
  },
  {
    key: 'description',
    header: 'Description',
    locked: true,
    sortValue: (l) => l.description,
    render: (l) => (
      <span className="cd-desc">
        <span className="cd-desc__title">{l.description}</span>
        <span className="cd-desc__meta">{DIVISIONS.find((d) => d.id === l.division)?.label}</span>
      </span>
    ),
  },
  { key: 'vendor', header: 'Vendor', sortValue: (l) => l.vendor, render: (l) => l.vendor },
  {
    key: 'status',
    header: 'Status',
    sortValue: (l) => STATUS_META[l.status].label,
    render: (l) => (
      <Badge color={STATUS_META[l.status].color} dot size="sm">
        {STATUS_META[l.status].label}
      </Badge>
    ),
  },
  moneyColumn('originalBudget', 'Original budget', (l) => l.originalBudget),
  moneyColumn('approvedChanges', 'Approved changes', (l) => l.approvedChanges, { signed: true }),
  moneyColumn('revisedBudget', 'Revised budget', revisedBudget),
  moneyColumn('pendingChanges', 'Pending changes', (l) => l.pendingChanges, { signed: true, hiddenByDefault: true }),
  moneyColumn('spentToDate', 'Spent to date', (l) => l.spentToDate),
  moneyColumn('remaining', 'Remaining', remaining),
  {
    key: 'progress',
    header: 'Progress',
    sortValue: (l) => l.progress,
    render: (l) => <ProgressBar value={l.progress} label={`${l.description} progress`} />,
  },
  {
    key: 'dueDate',
    header: 'Due',
    sortValue: (l) => l.dueDate,
    render: (l) => {
      const days = daysUntil(l.dueDate);
      const soon = l.status !== 'complete' && days >= 0 && days <= 90;
      return (
        <span className={cx('cd-due', soon && 'cd-due--soon')}>
          {formatDate(l.dueDate)}
          {soon && <span className="cd-due__hint">in {days}d</span>}
        </span>
      );
    },
  },
];

export const defaultHiddenColumns = () => new Set(COLUMNS.filter((c) => c.hiddenByDefault).map((c) => c.key));

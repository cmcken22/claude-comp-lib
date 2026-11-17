import { useMemo } from 'react';
import type { BudgetLine } from '../data';
import { TrendUpIcon } from '../icons';
import { formatMoney, sum } from '../lib/format';
import { ProgressBar } from './ProgressBar';
import { StatCard } from './StatCard';

/** The row of stat cards. Totals cover the whole project, independent of table filters. */
export function ContractSummary({ lines }: { lines: BudgetLine[] }) {
  const totals = useMemo(() => {
    const original = sum(lines, (l) => l.originalBudget);
    const approved = sum(lines, (l) => l.approvedChanges);
    const pending = sum(lines, (l) => l.pendingChanges);
    const spent = sum(lines, (l) => l.spentToDate);
    const current = original + approved;
    return {
      original,
      approved,
      pending,
      spent,
      current,
      spentPct: current ? Math.round((spent / current) * 100) : 0,
      pendingCount: lines.filter((l) => l.pendingChanges > 0).length,
    };
  }, [lines]);

  return (
    <section className="cd-stats" aria-label="Contract summary">
      <StatCard
        label="Current contract"
        value={totals.current}
        footer={
          <span className="cd-trend">
            <TrendUpIcon /> {formatMoney(totals.approved, true)} approved changes
          </span>
        }
      />
      <StatCard
        label="Pending changes"
        value={totals.pending}
        tone="warning"
        footer={`${totals.pendingCount} change orders awaiting approval`}
      />
      <StatCard label="Original contract" value={totals.original} footer="Signed Jan 12, 2026" />
      <StatCard
        label="Spent to date"
        value={totals.spent}
        footer={
          <ProgressBar
            wide
            value={totals.spentPct}
            label="Share of current contract spent"
            caption={`${totals.spentPct}% of contract`}
          />
        }
      />
    </section>
  );
}

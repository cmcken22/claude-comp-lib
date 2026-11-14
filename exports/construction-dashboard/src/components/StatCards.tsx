import { Progress, StatCard } from 'claude-comp-lib';
import { PROJECTS } from '../data/projects';
import { compactMoney } from '../format';
import { Icon } from '../icons';

// Sample figures not derivable from the project list.
const ACTIVE_DELTA = '+3';
const CONTRACT_DELTA = '+8.4%';
const DAYS_WITHOUT_INCIDENT = 127;
const STREAK_DELTA = '+27';
const WORKERS_ON_SITE = 342;

export function StatCards() {
  const active = PROJECTS.filter((p) => p.status !== 'Completed');
  const contract = active.reduce((sum, p) => sum + p.budget, 0);
  const spent = active.reduce((sum, p) => sum + p.spent, 0);
  const utilization = Math.round((spent / contract) * 100);
  const behind = active.filter((p) => p.status === 'At risk' || p.status === 'Delayed').length;

  return (
    <section className="cd-stats" aria-label="Key metrics">
      <StatCard
        label="Active projects"
        value={active.length}
        icon={<Icon name="building" />}
        delta={ACTIVE_DELTA}
        trend="up"
        deltaLabel="since last quarter"
      />
      <StatCard
        label="Contract value"
        value={compactMoney.format(contract)}
        icon={<Icon name="dollar" />}
        delta={CONTRACT_DELTA}
        trend="up"
        deltaLabel="vs last quarter"
      />
      <StatCard
        label="Budget spent"
        value={`${utilization}%`}
        icon={<Icon name="chart" />}
        delta={`${behind} projects at risk or delayed`}
        trend="up"
        positive={false}
        footer={
          <Progress
            value={spent}
            max={contract}
            tone="warning"
            size="sm"
            label="Budget spent across active projects"
            showValue
            valueText={compactMoney.format(spent)}
          />
        }
      />
      <StatCard
        label="Days without incident"
        value={DAYS_WITHOUT_INCIDENT}
        icon={<Icon name="shield" />}
        delta={STREAK_DELTA}
        trend="up"
        deltaLabel="vs previous streak"
        footer={<span className="cd-stat-note">{WORKERS_ON_SITE} workers on site today</span>}
      />
    </section>
  );
}

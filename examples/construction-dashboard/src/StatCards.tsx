import { DAILY_HEADCOUNT, MONTHLY_SPEND, PROJECTS } from './data';
import { money } from './format';
import { Icons } from './icons';
import { Spark } from './Spark';

export function StatCards() {
  const active = PROJECTS.filter((p) => p.status !== 'Completed');
  const atRisk = active.filter((p) => p.status === 'At risk').length;
  const delayed = active.filter((p) => p.status === 'Delayed').length;
  const contract = active.reduce((s, p) => s + p.budget, 0);
  const forecast = active.reduce((s, p) => s + p.forecast, 0);
  const overrun = forecast - contract;
  const earned = active.reduce((s, p) => s + p.budget * (p.progress / 100), 0);
  const crew = active.reduce((s, p) => s + p.crew, 0);
  const prevCrew = DAILY_HEADCOUNT[DAILY_HEADCOUNT.length - 2];
  const spendDelta = ((MONTHLY_SPEND[5] - MONTHLY_SPEND[4]) / MONTHLY_SPEND[4]) * 100;

  return (
    <section className="cd-stats" aria-label="Key figures">
      <article className="cd-stat">
        <header className="cd-stat__head">
          <span className="cd-stat__label">Active projects</span>
          <span className="cd-stat__icon"><Icons.Projects width={16} height={16} /></span>
        </header>
        <p className="cd-stat__value">{active.length}</p>
        <div className="cd-stat__chips">
          <span className="cd-pill cd-pill--warning">{atRisk} at risk</span>
          <span className="cd-pill cd-pill--danger">{delayed} delayed</span>
        </div>
      </article>

      <article className="cd-stat">
        <header className="cd-stat__head">
          <span className="cd-stat__label">Contract value</span>
          <span className="cd-stat__icon"><Icons.Budget width={16} height={16} /></span>
        </header>
        <p className="cd-stat__value">{money(contract)}</p>
        <p className="cd-stat__meta">
          Forecast <strong className="cd-text-danger">+{money(overrun)}</strong> over at completion
        </p>
      </article>

      <article className="cd-stat">
        <header className="cd-stat__head">
          <span className="cd-stat__label">Cost to date · Nov</span>
          <span className={`cd-delta ${spendDelta < 0 ? 'cd-delta--down' : 'cd-delta--up'}`}>
            {spendDelta < 0 ? <Icons.Down width={14} height={14} /> : <Icons.Up width={14} height={14} />}
            {Math.abs(spendDelta).toFixed(1)}%
          </span>
        </header>
        <div className="cd-stat__row">
          <p className="cd-stat__value">${MONTHLY_SPEND[5].toFixed(1)}M</p>
          <Spark values={MONTHLY_SPEND} label="Monthly cost, June to November" />
        </div>
        <p className="cd-stat__meta">Earned value {money(earned)} across active work</p>
      </article>

      <article className="cd-stat">
        <header className="cd-stat__head">
          <span className="cd-stat__label">Workers on site today</span>
          <span className={`cd-delta ${crew < prevCrew ? 'cd-delta--down' : 'cd-delta--up'}`}>
            {crew < prevCrew ? <Icons.Down width={14} height={14} /> : <Icons.Up width={14} height={14} />}
            {Math.abs(crew - prevCrew)}
          </span>
        </header>
        <div className="cd-stat__row">
          <p className="cd-stat__value">{crew}</p>
          <Spark values={DAILY_HEADCOUNT} tone="success" label="Daily headcount, last 10 working days" />
        </div>
        <p className="cd-stat__meta">
          <span className="cd-text-success">38 days</span> since last recordable incident
        </p>
      </article>
    </section>
  );
}

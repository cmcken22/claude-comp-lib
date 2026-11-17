import { useSA } from '../../hooks/context';
import { formatRange } from '../../lib/format';
import { openExposure, reviewCounts } from '../../lib/review';
import { AlertIcon } from '../../icons';

/** Open critical/high counts and pricing exposure. Compact: one line for the side panel. */
export function ReviewSummary({ compact = false }: { compact?: boolean }) {
  const { ws } = useSA();
  const counts = reviewCounts(ws.findings);
  const exposure = openExposure(ws.findings);
  const neverRun = ws.runs.language.status === 'idle' && ws.runs.gap.status === 'idle';

  if (neverRun) return <p className="sa-muted">No review has been run on this scope yet.</p>;

  const risk = counts.critical > 0 && (
    <p className="sa-risk" role="status">
      <AlertIcon size={16} />
      <span>{counts.critical} critical {counts.critical === 1 ? 'finding needs' : 'findings need'} attention before issue.</span>
    </p>
  );

  if (compact) {
    return (
      <div className="sa-summary-line">
        <p>
          <span className="sa-sev sa-sev--critical">{counts.critical} critical</span>
          <span className="sa-sev sa-sev--high">{counts.high} high</span>
          <span className="sa-muted">{counts.open} open of {counts.total}</span>
        </p>
        {exposure.high > 0 && <p className="sa-muted">Open gap exposure <span className="sa-mono">{formatRange(exposure.low, exposure.high)}</span></p>}
        {risk}
      </div>
    );
  }

  return (
    <div className="sa-summary">
      <dl className="sa-summary__stats">
        <div className={`sa-stat${counts.critical ? ' sa-stat--alert' : ''}`}><dt>Critical open</dt><dd>{counts.critical}</dd></div>
        <div className="sa-stat"><dt>High open</dt><dd>{counts.high}</dd></div>
        <div className="sa-stat"><dt>All open</dt><dd>{counts.open}<span className="sa-stat__of">/{counts.total}</span></dd></div>
        <div className="sa-stat"><dt>Gap exposure</dt><dd className="sa-stat__money">{exposure.high ? formatRange(exposure.low, exposure.high) : '$0'}</dd></div>
      </dl>
      {risk}
    </div>
  );
}

import { useSA } from '../../hooks/context';
import { formatRange } from '../../lib/format';
import { openExposure, reviewCounts } from '../../lib/review';
import { AlertIcon, CheckCircleIcon } from '../../icons';

/** Critical/high counts, open total and pricing exposure, with a risk banner. */
export function ReviewSummary({ compact = false }: { compact?: boolean }) {
  const { ws } = useSA();
  const counts = reviewCounts(ws.findings);
  const exposure = openExposure(ws.findings);
  const neverRun = ws.runs.language.status === 'idle' && ws.runs.gap.status === 'idle';

  if (neverRun) {
    return <p className="sa-muted">No review has been run on this scope yet.</p>;
  }

  return (
    <div className={`sa-summary${compact ? ' sa-summary--compact' : ''}`}>
      <dl className="sa-summary__stats">
        <div className={`sa-stat sa-stat--critical${counts.critical ? ' is-active' : ''}`}>
          <dt>Critical open</dt>
          <dd>{counts.critical}</dd>
        </div>
        <div className={`sa-stat sa-stat--high${counts.high ? ' is-active' : ''}`}>
          <dt>High open</dt>
          <dd>{counts.high}</dd>
        </div>
        <div className="sa-stat">
          <dt>All open</dt>
          <dd>{counts.open}<span className="sa-stat__of">/{counts.total}</span></dd>
        </div>
        <div className="sa-stat">
          <dt>Gap exposure</dt>
          <dd className="sa-stat__money">{exposure.high ? formatRange(exposure.low, exposure.high) : '$0'}</dd>
        </div>
      </dl>
      {counts.critical > 0 ? (
        <p className="sa-risk sa-risk--critical" role="status">
          <AlertIcon size={16} />
          <span>{counts.critical} critical {counts.critical === 1 ? 'finding is' : 'findings are'} unresolved. Address before issuing this Schedule A.</span>
        </p>
      ) : (
        <p className="sa-risk sa-risk--ok">
          <CheckCircleIcon size={16} />
          <span>No critical findings open.{counts.high ? ` ${counts.high} high-risk to review.` : ''}</span>
        </p>
      )}
    </div>
  );
}

import type { ReadinessCheck } from '../../lib/review';
import { AlertIcon, CheckCircleIcon } from '../../icons';

/** Pre-export checks with pass/warn state. */
export function ReadinessChecklist({ checks }: { checks: ReadinessCheck[] }) {
  return (
    <ul className="sa-checks">
      {checks.map((c) => (
        <li key={c.id} className={`sa-check${c.ok ? ' sa-check--ok' : c.id === 'critical' ? ' sa-check--critical' : ' sa-check--warn'}`}>
          {c.ok ? <CheckCircleIcon size={18} /> : <AlertIcon size={18} />}
          <span className="sa-check__text">
            <span className="sa-check__label">{c.label}</span>
            <span className="sa-check__detail">{c.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

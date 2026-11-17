import { SEVERITY, sectionName } from '../../config';
import { formatRange } from '../../lib/format';
import type { Finding } from '../../types';
import { StatusBadge } from '../common/Badges';

/** Compact, clickable finding summary: severity, title, where it applies. */
export function FindingCard({ finding, selected, onOpen }: { finding: Finding; selected?: boolean; onOpen: () => void }) {
  const closed = finding.status !== 'open';
  return (
    <li>
      <button
        type="button"
        className={`sa-finding-card${closed ? ' sa-finding-card--closed' : ''}${selected ? ' sa-finding-card--selected' : ''}`}
        onClick={onOpen}
      >
        <span className={`sa-sev sa-sev--${finding.severity}`}>{SEVERITY[finding.severity].label}</span>
        <span className="sa-finding-card__title">{finding.title}</span>
        <span className="sa-finding-card__meta">
          {sectionName(finding.sectionKey)}
          {finding.priceLow !== undefined && ` · ${formatRange(finding.priceLow, finding.priceHigh!)}`}
          {closed && <StatusBadge status={finding.status} />}
        </span>
      </button>
    </li>
  );
}

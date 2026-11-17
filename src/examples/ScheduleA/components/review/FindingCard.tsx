import { AGENTS, sectionName } from '../../config';
import { formatRange } from '../../lib/format';
import { ChevronRightIcon } from '../../icons';
import type { Finding } from '../../types';
import { SeverityBadge, StatusBadge } from '../common/Badges';

/** Compact, clickable finding summary for lists. */
export function FindingCard({ finding, selected, onOpen }: { finding: Finding; selected?: boolean; onOpen: () => void }) {
  const closed = finding.status !== 'open';
  return (
    <li>
      <button
        type="button"
        className={`sa-finding-card sa-finding-card--${finding.severity}${closed ? ' sa-finding-card--closed' : ''}${selected ? ' sa-finding-card--selected' : ''}`}
        onClick={onOpen}
      >
        <span className="sa-finding-card__top">
          <SeverityBadge severity={finding.severity} />
          <StatusBadge status={finding.status} />
          <span className="sa-finding-card__id">{finding.id}</span>
        </span>
        <span className="sa-finding-card__title">{finding.title}</span>
        <span className="sa-finding-card__meta">
          {AGENTS[finding.agent].short} · {sectionName(finding.sectionKey)}
          {finding.confidence !== undefined && ` · ${finding.confidence}% · ${formatRange(finding.priceLow!, finding.priceHigh!)}`}
        </span>
        <ChevronRightIcon size={16} className="sa-finding-card__chevron" />
      </button>
    </li>
  );
}

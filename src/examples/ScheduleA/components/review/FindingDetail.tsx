import { Button } from '../../../../components/Button';
import { AGENTS, FINDING_STATUS, sectionName } from '../../config';
import { CURRENT_USER, TODAY } from '../../data/project';
import { useSA } from '../../hooks/context';
import { formatMoney, formatRelative } from '../../lib/format';
import { newId } from '../../lib/scope';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '../../icons';
import type { Finding, FindingStatus } from '../../types';
import { AiLabel, SeverityBadge, StatusBadge } from '../common/Badges';
import { FindingNotes } from './FindingNotes';
import { RecommendationBlock } from './RecommendationBlock';

const ACTIONS: { status: FindingStatus; label: string; variant: 'primary' | 'outline' | 'ghost' }[] = [
  { status: 'resolved', label: 'Mark resolved', variant: 'primary' },
  { status: 'accepted', label: 'Accept risk', variant: 'outline' },
  { status: 'dismissed', label: 'Dismiss', variant: 'ghost' },
];

/** Full finding with evidence, recommended language, status actions and notes. */
export function FindingDetail({ finding, onBack }: { finding: Finding; onBack: () => void }) {
  const { ws, can, ui, dispatch, insertSuggestion, toast } = useSA();
  const inserted = Boolean(finding.insertedItemId && ws.sections.some((s) => s.items.some((i) => i.id === finding.insertedItemId)));
  const setStatus = (status: FindingStatus) => {
    dispatch({ type: 'findingStatus', id: finding.id, status });
    toast.push(`${finding.id} marked ${FINDING_STATUS[status].label.toLowerCase()}.`);
  };

  return (
    <article className="sa-detail" aria-labelledby="sa-detail-title">
      <button type="button" className="sa-back" onClick={onBack}><ArrowLeftIcon size={16} /> All findings</button>
      <div className="sa-detail__badges">
        <SeverityBadge severity={finding.severity} size="md" />
        <StatusBadge status={finding.status} />
        <AiLabel>{AGENTS[finding.agent].name}</AiLabel>
      </div>
      <h3 id="sa-detail-title" className="sa-detail__title"><span className="sa-mono">{finding.id}</span> {finding.title}</h3>

      {finding.status !== 'open' && (
        <p className={`sa-closed sa-closed--${finding.status}`}>
          <CheckCircleIcon size={16} />
          <span>{FINDING_STATUS[finding.status].label} by {finding.statusBy} · {formatRelative(finding.statusAt ?? TODAY, TODAY)}</span>
          {can.edit && <button type="button" className="sa-link" onClick={() => setStatus('open')}>Reopen</button>}
        </p>
      )}

      <button type="button" className="sa-jump" onClick={() => ui.jumpTo(finding.sectionKey)}>
        Section: {sectionName(finding.sectionKey)} <ArrowRightIcon size={14} />
      </button>

      <p className="sa-detail__text">{finding.explanation}</p>

      {finding.confidence !== undefined && (
        <dl className="sa-gap-facts">
          <div><dt>Confidence</dt><dd><span className="sa-meter"><span style={{ width: `${finding.confidence}%` }} /></span>{finding.confidence}%</dd></div>
          <div><dt>Estimated pricing</dt><dd className="sa-mono">{formatMoney(finding.priceLow!)} – {formatMoney(finding.priceHigh!)}</dd></div>
        </dl>
      )}
      {finding.evidence && (
        <div>
          <h4 className="sa-detail__label">Historical evidence</h4>
          <ul className="sa-evidence">{finding.evidence.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}
      <div>
        <h4 className="sa-detail__label">Source</h4>
        <p className="sa-detail__source">{finding.source}</p>
      </div>
      <div>
        <h4 className="sa-detail__label">Recommended action</h4>
        <p>{finding.recommendation}</p>
      </div>

      <RecommendationBlock finding={finding} inserted={inserted} canEdit={can.edit} onInsert={() => insertSuggestion(finding.id)} onViewInserted={() => { ui.setEditingItemId(finding.insertedItemId!); ui.jumpTo(finding.sectionKey, finding.insertedItemId); }} />

      {finding.status === 'open' && can.edit && (
        <div className="sa-detail__actions">
          {ACTIONS.map((a) => (
            <Button key={a.status} size="sm" variant={a.variant} onClick={() => setStatus(a.status)}>{a.label}</Button>
          ))}
        </div>
      )}

      <FindingNotes notes={finding.notes} onAdd={(text) => dispatch({ type: 'note', id: finding.id, note: { id: newId('n'), author: CURRENT_USER.name, at: TODAY, text } })} />
    </article>
  );
}

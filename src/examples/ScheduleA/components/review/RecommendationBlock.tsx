import { Button } from '../../../../components/Button';
import { sectionName } from '../../config';
import { CheckIcon, PlusIcon } from '../../icons';
import type { Finding } from '../../types';
import { AiLabel, KindBadge } from '../common/Badges';

export interface RecommendationBlockProps {
  finding: Finding;
  inserted: boolean;
  canEdit: boolean;
  onInsert: () => void;
  onViewInserted: () => void;
}

/** Suggested contract language, visibly separate from the draft until a person inserts it. */
export function RecommendationBlock({ finding, inserted, canEdit, onInsert, onViewInserted }: RecommendationBlockProps) {
  if (!finding.suggested) return null;
  return (
    <figure className="sa-reco">
      <figcaption className="sa-reco__head">
        <AiLabel>Suggested language</AiLabel>
        <KindBadge kind={finding.suggested.kind} />
      </figcaption>
      <blockquote className="sa-reco__text">{finding.suggested.text}</blockquote>
      <p className="sa-reco__note">Not contract language until a person inserts and reviews it in {sectionName(finding.sectionKey)}.</p>
      {inserted ? (
        <div className="sa-reco__done">
          <span><CheckIcon size={14} /> Inserted into the draft</span>
          <Button size="sm" variant="ghost" onClick={onViewInserted}>Edit in scope</Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" startIcon={<PlusIcon size={16} />} disabled={!canEdit} onClick={onInsert}>
          Insert into {sectionName(finding.sectionKey)}
        </Button>
      )}
    </figure>
  );
}

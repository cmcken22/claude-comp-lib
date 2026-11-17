import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { DOC_TYPES } from '../../config';
import { referenceDocs } from '../../data/project';
import { useSA } from '../../hooks/context';
import { AlertIcon, ArrowRightIcon, InfoIcon, UploadIcon } from '../../icons';
import { DocGroup } from './DocGroup';

/** Step 3: choose the documents the review agents compare against. */
export function ReferenceDocsStep() {
  const { ws, ui, can, dispatch, toast } = useSA();
  const selected = referenceDocs.filter((d) => ws.selectedDocIds.includes(d.id));
  const hasStandard = selected.some((d) => d.type === 'Standard contract schedule');
  const hasHistory = selected.some((d) => d.type === 'Historical scope' || d.type === 'Change-order records');

  return (
    <div className="sa-step-body">
      <div className="sa-step-head">
        <div>
          <h2 className="sa-step-head__title">Reference Documents</h2>
          <p className="sa-step-head__sub">{selected.length} of {referenceDocs.length} documents selected for the review agents.</p>
        </div>
        <div className="sa-toolbar">
          <Button variant="outline" size="sm" startIcon={<UploadIcon size={16} />} disabled={!can.edit} onClick={() => toast.push('Uploading is not connected in this prototype.', 'info')}>
            Upload document
          </Button>
          <Button size="sm" endIcon={<ArrowRightIcon size={16} />} onClick={() => ui.setStep('review')}>Continue to AI Review</Button>
        </div>
      </div>

      <p className="sa-banner sa-banner--info">
        <InfoIcon size={16} />
        <span><strong>Assumption:</strong> standard schedules and historical records are retrieved from Gate Three automatically; project-specific documents can also be uploaded.</span>
      </p>
      {!hasStandard && (
        <p className="sa-banner sa-banner--warning" role="alert">
          <AlertIcon size={16} /> Select at least one standard contract schedule. The Language Review Agent cannot run without one.
        </p>
      )}
      {!hasHistory && (
        <p className="sa-banner sa-banner--warning" role="alert">
          <AlertIcon size={16} /> Select a historical scope or change-order register. The Historical Scope Gap Agent needs at least one.
        </p>
      )}

      <Card padding="none" className="sa-docs">
        {DOC_TYPES.map((type) => (
          <DocGroup
            key={type}
            type={type}
            docs={referenceDocs.filter((d) => d.type === type)}
            selectedIds={ws.selectedDocIds}
            disabled={!can.edit}
            onToggle={(id) => dispatch({ type: 'toggleDoc', id })}
            onSetAll={(ids, on) =>
              dispatch({ type: 'setDocs', ids: on ? [...new Set([...ws.selectedDocIds, ...ids])] : ws.selectedDocIds.filter((d) => !ids.includes(d)) })
            }
          />
        ))}
      </Card>
    </div>
  );
}

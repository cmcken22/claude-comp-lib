import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { CURRENT_USER, TODAY } from '../../data/project';
import { useSA } from '../../hooks/context';
import { readiness, reviewCounts } from '../../lib/review';
import { ExportIcon, LockIcon } from '../../icons';
import { DocumentPreview } from './DocumentPreview';
import { ReadinessChecklist } from './ReadinessChecklist';

/** Step 5: readiness checks and a live preview of the Schedule A. */
export function FinalizeStep() {
  const { ws, ui, can } = useSA();
  const checks = readiness(ws);
  const counts = reviewCounts(ws.findings);
  const passed = checks.filter((c) => c.ok).length;

  return (
    <div className="sa-step-body">
      <div className="sa-step-head">
        <div>
          <h2 className="sa-step-head__title">Finalize and Export</h2>
          <p className="sa-step-head__sub">{passed} of {checks.length} checks passed.</p>
        </div>
        <div className="sa-toolbar">
          <Button startIcon={can.export ? <ExportIcon size={16} /> : <LockIcon size={16} />} disabled={!can.export} onClick={() => ui.setDialog('export')}>
            Preview and export
          </Button>
        </div>
      </div>
      <div className="sa-finalize">
        <Card as="section" padding="lg" aria-labelledby="sa-ready-title" className="sa-finalize__checks">
          <h3 id="sa-ready-title" className="sa-card-title">Readiness</h3>
          <ReadinessChecklist checks={checks} />
          <p className="sa-muted sa-finalize__assumption">
            Assumption: open critical findings do not block export, but the exporter must acknowledge them and the document is marked “Draft — review incomplete”.
          </p>
        </Card>
        <section aria-label="Document preview" className="sa-finalize__preview">
          <DocumentPreview
            meta={ws.meta}
            sections={ws.sections}
            version={ws.currentVersion}
            preparedBy={`${CURRENT_USER.name}, ${CURRENT_USER.title}`}
            preparedAt={TODAY}
            reviewStatus={counts.critical ? `${counts.critical} critical finding open` : 'Review complete'}
            watermark={counts.critical ? 'Draft' : undefined}
          />
        </section>
      </div>
    </div>
  );
}

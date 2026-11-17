import { useEffect, useState } from 'react';
import { Button } from '../../../../components/Button';
import { Checkbox } from '../../../../components/Checkbox';
import { CURRENT_USER, TODAY } from '../../data/project';
import { useSA } from '../../hooks/context';
import { formatDate } from '../../lib/format';
import { reviewCounts } from '../../lib/review';
import { AlertIcon, DocIcon, PaperclipIcon } from '../../icons';
import { Modal } from '../common/Modal';
import { DocumentPreview } from './DocumentPreview';
import { ExportSuccess, type ExportKind } from './ExportSuccess';

/** Export preview and confirmation: PDF, Word or attach to the Gate Three requisition. */
export function ExportDialog() {
  const { ws, ui, can, dispatch } = useSA();
  const open = ui.dialog === 'export';
  const counts = reviewCounts(ws.findings);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [ack, setAck] = useState(false);
  const [busy, setBusy] = useState<ExportKind | null>(null);
  const [done, setDone] = useState<{ kind: ExportKind; version: string } | null>(null);
  const unversioned = ws.versionRevision !== ws.revision;
  const nextVersion = unversioned && ws.versions.length ? ws.currentVersion.replace(/\.(\d+)$/, (_, n) => `.${Number(n) + 1}`) : ws.currentVersion;
  const blocked = counts.critical > 0 && !ack;

  useEffect(() => {
    if (open) { setDone(null); setAck(false); setBusy(null); }
  }, [open]);

  const run = (kind: ExportKind) => {
    setBusy(kind);
    window.setTimeout(() => {
      if (unversioned) dispatch({ type: 'createVersion', summary: kind === 'attach' ? `Attached to ${ws.meta.requisition.split(' · ')[0]}.` : `Exported as ${kind.toUpperCase()}.` });
      setBusy(null);
      setDone({ kind, version: nextVersion });
    }, 1100);
  };

  const sections = ws.sections.filter((s) => !excluded.includes(s.id));
  const reviewStatus = counts.critical ? `Draft — ${counts.critical} critical finding open` : counts.open ? `${counts.open} findings open, none critical` : 'Review complete';

  return (
    <Modal
      open={open}
      size="lg"
      onClose={() => ui.setDialog(null)}
      title={done ? 'Export complete' : 'Export Schedule A'}
      description={done ? undefined : 'Confirm what goes into the document. Files are simulated in this prototype.'}
      footer={done ? <Button onClick={() => ui.setDialog(null)}>Done</Button> : (
        <div className="sa-export__actions">
          <Button variant="ghost" onClick={() => ui.setDialog(null)}>Cancel</Button>
          <Button variant="outline" startIcon={<DocIcon size={16} />} loading={busy === 'word'} disabled={blocked || !can.export || Boolean(busy)} onClick={() => run('word')}>Export as Word</Button>
          <Button variant="outline" startIcon={<DocIcon size={16} />} loading={busy === 'pdf'} disabled={blocked || !can.export || Boolean(busy)} onClick={() => run('pdf')}>Export as PDF</Button>
          <Button startIcon={<PaperclipIcon size={16} />} loading={busy === 'attach'} disabled={blocked || !can.export || Boolean(busy)} onClick={() => run('attach')}>Attach to requisition</Button>
        </div>
      )}
    >
      {done ? (
        <ExportSuccess kind={done.kind} version={done.version} meta={ws.meta} />
      ) : (
        <div className="sa-export">
          <div className="sa-export__summary">
            {counts.critical > 0 && (
              <div className="sa-banner sa-banner--error" role="alert">
                <AlertIcon size={16} />
                <div>
                  <strong>{counts.critical} critical finding unresolved.</strong> The document will be watermarked “Draft”.
                  <Checkbox className="sa-export__ack" label="I acknowledge the open critical findings and want to export anyway." checked={ack} onChange={(e) => setAck(e.target.checked)} />
                </div>
              </div>
            )}
            <dl className="sa-facts sa-facts--stack">
              <div><dt>Document title</dt><dd>{ws.meta.title}</dd></div>
              <div><dt>Project</dt><dd>{ws.meta.projectNumber} · {ws.meta.projectName}</dd></div>
              <div><dt>Subcontractor</dt><dd>{ws.meta.subcontractor}</dd></div>
              <div><dt>Version</dt><dd><span className="sa-mono">{nextVersion}</span>{unversioned && <span className="sa-muted"> · new version created on export</span>}</dd></div>
              <div><dt>Prepared by</dt><dd>{CURRENT_USER.name}, {CURRENT_USER.title}</dd></div>
              <div><dt>Prepared date</dt><dd>{formatDate(TODAY)}</dd></div>
              <div><dt>Review status</dt><dd className={counts.critical ? 'sa-text-critical' : undefined}>{reviewStatus}</dd></div>
            </dl>
            <fieldset className="sa-export__sections">
              <legend className="sa-field-label">Included scope sections</legend>
              {ws.sections.map((s, i) => (
                <Checkbox key={s.id} label={`${i + 1}.0 ${s.name}`} description={`${s.items.length} clauses`} checked={!excluded.includes(s.id)} onChange={() => setExcluded((x) => (x.includes(s.id) ? x.filter((id) => id !== s.id) : [...x, s.id]))} />
              ))}
            </fieldset>
          </div>
          <div className="sa-export__preview">
            <DocumentPreview meta={ws.meta} sections={sections} version={nextVersion} preparedBy={CURRENT_USER.name} preparedAt={TODAY} reviewStatus={reviewStatus} watermark={counts.critical ? 'Draft' : undefined} />
          </div>
        </div>
      )}
    </Modal>
  );
}

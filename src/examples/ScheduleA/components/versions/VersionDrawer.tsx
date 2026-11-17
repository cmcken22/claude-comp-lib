import { useState } from 'react';
import { Badge } from '../../../../components/Badge';
import { Button } from '../../../../components/Button';
import { Drawer } from '../../../../components/Drawer';
import { TODAY } from '../../data/project';
import { useSA } from '../../hooks/context';
import { formatDateTime } from '../../lib/format';
import { countItems } from '../../lib/scope';
import { EyeIcon, HistoryIcon, LockIcon, PlusIcon, RestoreIcon } from '../../icons';
import type { Version } from '../../types';
import { DocumentPreview } from '../export/DocumentPreview';
import { Modal } from '../common/Modal';

/** Version history with view and restore (restore is Admin-only). */
export function VersionDrawer() {
  const { ws, ui, can, dispatch, toast } = useSA();
  const [viewing, setViewing] = useState<Version | null>(null);
  const [restoring, setRestoring] = useState<Version | null>(null);
  const unversioned = ws.versionRevision !== ws.revision;

  const restore = () => {
    if (!restoring) return;
    dispatch({ type: 'restoreVersion', versionId: restoring.id });
    toast.push(`Restored ${restoring.label}. Rerun the review agents to refresh findings.`);
    setRestoring(null);
    ui.setDialog(null);
  };

  return (
    <>
      <Drawer
        open={ui.dialog === 'versions'}
        onClose={() => ui.setDialog(null)}
        title="Version history"
        icon={<HistoryIcon />}
        footer={<Button startIcon={<PlusIcon size={16} />} disabled={!can.manageVersions} onClick={() => ui.setDialog('createVersion')}>Create version</Button>}
      >
        {!can.manageVersions && (
          <p className="sa-banner sa-banner--info"><LockIcon size={16} /> Only Admins can create or restore versions.</p>
        )}
        <ol className="sa-versions">
          {unversioned && (
            <li className="sa-version sa-version--draft">
              <div className="sa-version__head"><strong>Working draft</strong><Badge size="sm" color="yellow">Unsaved as version</Badge></div>
              <p className="sa-muted">Autosaved {formatDateTime(TODAY)} · {countItems(ws.sections)} clauses</p>
            </li>
          )}
          {ws.versions.map((v) => (
            <li key={v.id} className="sa-version">
              <div className="sa-version__head">
                <strong className="sa-mono">{v.label}</strong>
                {v.label === ws.currentVersion && !unversioned && <Badge size="sm" color="green">Current</Badge>}
              </div>
              <p className="sa-version__summary">{v.summary}</p>
              <p className="sa-muted">{v.author} · {formatDateTime(v.at)} · {v.sections.length} sections</p>
              <div className="sa-version__actions">
                <Button size="sm" variant="ghost" startIcon={<EyeIcon size={16} />} onClick={() => setViewing(v)}>View</Button>
                {can.manageVersions && v.label !== ws.currentVersion && <Button size="sm" variant="ghost" startIcon={<RestoreIcon size={16} />} onClick={() => setRestoring(v)}>Restore</Button>}
              </div>
            </li>
          ))}
          {ws.versions.length === 0 && !unversioned && <li className="sa-muted">No versions yet.</li>}
        </ol>
      </Drawer>

      <Modal open={Boolean(viewing)} size="lg" onClose={() => setViewing(null)} title={`${viewing?.label} · read only`} description={viewing ? `${viewing.author} · ${formatDateTime(viewing.at)}` : undefined}>
        {viewing && <DocumentPreview meta={ws.meta} sections={viewing.sections} version={viewing.label} preparedBy={viewing.author} preparedAt={viewing.at} reviewStatus="Historical version" />}
      </Modal>

      <Modal
        open={Boolean(restoring)}
        size="sm"
        onClose={() => setRestoring(null)}
        title={`Restore ${restoring?.label}?`}
        footer={<><Button variant="ghost" onClick={() => setRestoring(null)}>Cancel</Button><Button variant="danger" onClick={restore}>Restore version</Button></>}
      >
        <p>The draft will be replaced with {restoring?.label} ({restoring ? countItems(restoring.sections) : 0} clauses). Your current draft is kept in history as a new version, and review findings will be marked out of date.</p>
      </Modal>
    </>
  );
}

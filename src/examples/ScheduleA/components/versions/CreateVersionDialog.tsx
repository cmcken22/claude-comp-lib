import { useEffect, useState } from 'react';
import { Button } from '../../../../components/Button';
import { FormField } from '../../../../components/FormField';
import { TextArea } from '../../../../components/TextArea';
import { useSA } from '../../hooks/context';
import { Modal } from '../common/Modal';

/** Saves the current draft as a numbered version with an optional summary. */
export function CreateVersionDialog() {
  const { ws, ui, dispatch, toast } = useSA();
  const open = ui.dialog === 'createVersion';
  const [summary, setSummary] = useState('');
  const next = ws.versions.length ? ws.currentVersion.replace(/\.(\d+)$/, (_, n) => `.${Number(n) + 1}`) : ws.currentVersion;

  useEffect(() => {
    if (open) setSummary('');
  }, [open]);

  const create = () => {
    dispatch({ type: 'createVersion', summary: summary.trim() || 'No summary provided.' });
    toast.push(`Version ${next} created.`);
    ui.setDialog(null);
  };

  return (
    <Modal
      open={open}
      size="sm"
      onClose={() => ui.setDialog(null)}
      title={`Create version ${next}`}
      description="Snapshots the current draft so it can be viewed or restored later."
      footer={<><Button variant="ghost" onClick={() => ui.setDialog(null)}>Cancel</Button><Button onClick={create}>Create version</Button></>}
    >
      <FormField label="Change summary" hint="Optional. Shown in version history.">
        <TextArea rows={3} value={summary} placeholder="e.g. Resolved fire damper conflict and added seismic restraint clause" onChange={(e) => setSummary(e.target.value)} />
      </FormField>
    </Modal>
  );
}

import { useEffect, useState } from 'react';
import { Button } from '../../../../components/Button';
import { Radio, RadioGroup } from '../../../../components/Radio';
import { REQUISITIONS } from '../../data/project';
import { useSA } from '../../hooks/context';
import { Modal } from '../common/Modal';

/** Links an issued (tender) scope to the awarded requisition and attaches it in Gate Three. */
export function AttachDialog() {
  const { ws, ui, can, dispatch, toast } = useSA();
  const open = ui.dialog === 'attach';
  const matching = REQUISITIONS.filter((r) => r.trade === ws.meta.trade);
  const others = REQUISITIONS.filter((r) => r.trade !== ws.meta.trade);
  const [choice, setChoice] = useState('');

  useEffect(() => {
    if (open) setChoice(REQUISITIONS.find((r) => r.label === ws.meta.requisition)?.id ?? matching[0]?.id ?? '');
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const attach = () => {
    const req = REQUISITIONS.find((r) => r.id === choice);
    if (!req) return;
    dispatch({ type: 'meta', patch: { requisition: req.label, subcontractor: req.subcontractor, status: 'Attached' } });
    dispatch({ type: 'createVersion', summary: `Attached to ${req.id} for ${req.subcontractor}.` });
    dispatch({ type: 'confirmStep', step: 'export' });
    ui.setDialog(null);
    toast.push(`${ws.meta.code} attached to ${req.id}. ${req.subcontractor} is now the subcontractor.`);
  };

  const option = (r: (typeof REQUISITIONS)[number]) => (
    <Radio key={r.id} value={r.id} label={r.label} description={`Awarded to ${r.subcontractor}`} />
  );

  return (
    <Modal
      open={open}
      size="md"
      onClose={() => ui.setDialog(null)}
      title="Attach to requisition"
      description={`Choose the Gate Three requisition for ${ws.meta.code}. The requisition's subcontractor is added to the scope.`}
      footer={<><Button variant="ghost" onClick={() => ui.setDialog(null)}>Cancel</Button><Button disabled={!choice || !can.export} onClick={attach}>Attach</Button></>}
    >
      <RadioGroup label={matching.length ? `${ws.meta.trade} requisitions` : 'Open requisitions'} value={choice} onValueChange={setChoice}>
        {(matching.length ? matching : others).map(option)}
      </RadioGroup>
      {matching.length > 0 && others.length > 0 && (
        <details className="sa-more">
          <summary>Other open requisitions ({others.length})</summary>
          <RadioGroup label="Other requisitions" value={choice} onValueChange={setChoice}>
            {others.map(option)}
          </RadioGroup>
        </details>
      )}
    </Modal>
  );
}

import { useState } from 'react';
import { Button } from '../../../../components/Button';
import { Drawer } from '../../../../components/Drawer';
import { FormField } from '../../../../components/FormField';
import { Input } from '../../../../components/Input';
import { Select } from '../../../../components/Select';
import { DIVISIONS, SUBCONTRACTORS, TRADES } from '../../data/project';
import { useSA } from '../../hooks/context';
import { PlusIcon } from '../../icons';

/** Collects the minimum context needed to start a new Schedule A. */
export function NewScopeDrawer() {
  const { ui, createScope, toast } = useSA();
  const [trade, setTrade] = useState('Fire Protection');
  const [division, setDivision] = useState('21 — Fire Suppression');
  const [subcontractor, setSubcontractor] = useState('Pyroguard Sprinkler Co.');
  const [requisition, setRequisition] = useState('REQ-2417-036 · Fire Protection Subcontract');
  const [touched, setTouched] = useState(false);
  const invalid = !requisition.trim();

  const create = () => {
    setTouched(true);
    if (invalid) return;
    createScope({
      trade,
      division,
      subcontractor,
      requisition,
      title: `Schedule A — ${trade} Scope of Work`,
      code: `SA-2417-${division.slice(0, 2)}`,
      tags: [trade, `Div ${division.slice(0, 2)}`],
    });
    ui.setDialog(null);
    toast.push(`New ${trade} scope created as a draft.`);
  };

  return (
    <Drawer
      open={ui.dialog === 'newScope'}
      onClose={() => ui.setDialog(null)}
      title="New Schedule A scope"
      icon={<PlusIcon />}
      footer={
        <div className="sa-drawer-actions">
          <Button variant="ghost" onClick={() => ui.setDialog(null)}>Cancel</Button>
          <Button onClick={create}>Create scope</Button>
        </div>
      }
    >
      <div className="sa-stack">
        <FormField label="Contract or requisition" required error={touched && invalid ? 'Enter the Gate Three requisition this scope attaches to.' : undefined}>
          <Input value={requisition} onChange={(e) => setRequisition(e.target.value)} />
        </FormField>
        <FormField label="Subcontractor" required>
          <Select value={subcontractor} onChange={(e) => setSubcontractor(e.target.value)}>
            {SUBCONTRACTORS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Trade">
          <Select value={trade} onChange={(e) => setTrade(e.target.value)}>
            {TRADES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Division (MasterFormat)">
          <Select value={division} onChange={(e) => setDivision(e.target.value)}>
            {DIVISIONS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <p className="sa-muted">The scope starts empty. On the next screen you can start from the company template, reuse historical language or start blank.</p>
      </div>
    </Drawer>
  );
}

import { useState } from 'react';
import { Button } from '../../../../components/Button';
import { Drawer } from '../../../../components/Drawer';
import { FormField } from '../../../../components/FormField';
import { Select } from '../../../../components/Select';
import { TRADES } from '../../data/project';
import { useSA } from '../../hooks/context';
import { PlusIcon } from '../../icons';
import { DivisionPicker } from './DivisionPicker';

/** Starts a draft scope. A requisition and subcontractor are not needed yet: they come at award. */
export function NewScopeDrawer() {
  const { ui, createScope, toast } = useSA();
  const [trade, setTrade] = useState('Fire Protection');
  const [divisions, setDivisions] = useState<string[]>(['21 — Fire Suppression', '22 — Plumbing']);
  const [touched, setTouched] = useState(false);
  const invalid = divisions.length === 0;

  const create = () => {
    setTouched(true);
    if (invalid) return;
    const first = divisions[0].slice(0, 2);
    createScope({
      trade,
      divisions,
      title: `Schedule A — ${trade} Scope of Work`,
      code: `SA-2417-${first}`,
      tags: [trade, ...divisions.map((d) => `Div ${d.slice(0, 2)}`)],
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
          <Button onClick={create}>Create draft</Button>
        </div>
      }
    >
      <div className="sa-stack">
        <FormField label="Trade">
          <Select value={trade} onChange={(e) => setTrade(e.target.value)}>
            {TRADES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <div>
          <span className="sa-field-label" id="sa-new-divisions">Divisions (MasterFormat) <span className="sa-muted">· select all that apply</span></span>
          <DivisionPicker labelId="sa-new-divisions" value={divisions} onChange={setDivisions} />
          {touched && invalid && <p className="sa-field-error">Select at least one division.</p>}
        </div>
        <p className="sa-muted">
          No requisition or subcontractor is needed to start. Draft the scope for tender now, then link it to a requisition once the subcontract is awarded.
        </p>
      </div>
    </Drawer>
  );
}

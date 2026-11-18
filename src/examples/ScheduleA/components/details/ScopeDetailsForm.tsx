import { Card } from '../../../../components/Card';
import { FormField } from '../../../../components/FormField';
import { Input } from '../../../../components/Input';
import { Select } from '../../../../components/Select';
import { REQUISITIONS, SUBCONTRACTORS, TODAY, TRADES } from '../../data/project';
import { useSA } from '../../hooks/context';
import { formatRelative } from '../../lib/format';
import type { ScopeMeta, ScopeStatus } from '../../types';
import { ScopeStatusBadge } from '../common/Badges';
import { DivisionPicker } from './DivisionPicker';

const STATUSES: ScopeStatus[] = ['Draft', 'In review', 'Issued for tender', 'Attached'];

/** Contract context for the open scope. Requisition and subcontractor stay optional until award. */
export function ScopeDetailsForm() {
  const { ws, can, dispatch } = useSA();
  const { meta } = ws;
  const set = (patch: Partial<ScopeMeta>) => dispatch({ type: 'meta', patch });
  const ro = !can.edit;

  const pickRequisition = (label: string) => {
    const req = REQUISITIONS.find((r) => r.label === label);
    set({ requisition: label, subcontractor: req ? req.subcontractor : meta.subcontractor });
  };

  return (
    <Card as="section" padding="lg" aria-labelledby="sa-details-title">
      <div className="sa-card-head">
        <h3 id="sa-details-title" className="sa-card-title">Scope details</h3>
        <ScopeStatusBadge status={meta.status} />
      </div>
      <dl className="sa-facts">
        <div><dt>Project</dt><dd>{meta.projectNumber} · {meta.projectName}</dd></div>
        <div><dt>Scope ID</dt><dd className="sa-mono">{meta.code}</dd></div>
        <div><dt>Current version</dt><dd className="sa-mono">{ws.currentVersion}</dd></div>
        <div><dt>Last updated</dt><dd>{formatRelative(meta.updatedAt, TODAY)} · {meta.owner}</dd></div>
      </dl>
      <div className="sa-form-grid">
        <FormField label="Trade">
          <Select value={meta.trade} disabled={ro} onChange={(e) => set({ trade: e.target.value })}>
            {TRADES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Scope status">
          <Select value={meta.status} disabled={ro} onChange={(e) => set({ status: e.target.value as ScopeStatus })}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <div className="sa-form-grid__wide">
          <span className="sa-field-label" id="sa-detail-divisions">Divisions (MasterFormat) <span className="sa-muted">· select all that apply</span></span>
          <DivisionPicker labelId="sa-detail-divisions" value={meta.divisions} disabled={ro} onChange={(divisions) => set({ divisions })} />
        </div>
        <FormField label="Requisition" hint="Optional while drafting or tendering. Link it once the subcontract is awarded.">
          <Select value={meta.requisition} disabled={ro} onChange={(e) => pickRequisition(e.target.value)}>
            <option value="">Not linked yet</option>
            {REQUISITIONS.map((r) => <option key={r.id} value={r.label}>{r.label}</option>)}
          </Select>
        </FormField>
        <FormField label="Subcontractor" hint="Optional. Leave empty while the scope is out for tender.">
          <Select value={meta.subcontractor} disabled={ro} onChange={(e) => set({ subcontractor: e.target.value })}>
            <option value="">Not yet awarded</option>
            {SUBCONTRACTORS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Project type" hint="Used by the Historical Scope Gap Agent to match similar projects.">
          <Input value={meta.projectType} readOnly />
        </FormField>
      </div>
    </Card>
  );
}

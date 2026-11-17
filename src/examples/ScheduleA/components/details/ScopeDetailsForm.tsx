import { Card } from '../../../../components/Card';
import { FormField } from '../../../../components/FormField';
import { Input } from '../../../../components/Input';
import { Select } from '../../../../components/Select';
import { DIVISIONS, SUBCONTRACTORS, TODAY, TRADES } from '../../data/project';
import { useSA } from '../../hooks/context';
import { formatRelative } from '../../lib/format';
import type { ScopeMeta, ScopeStatus } from '../../types';
import { ScopeStatusBadge } from '../common/Badges';

const STATUSES: ScopeStatus[] = ['Draft', 'In review', 'Issued'];

/** Contract context for the open scope. */
export function ScopeDetailsForm() {
  const { ws, can, dispatch } = useSA();
  const { meta } = ws;
  const set = (patch: Partial<ScopeMeta>) => dispatch({ type: 'meta', patch });
  const ro = !can.edit;

  return (
    <Card as="section" padding="lg" aria-labelledby="sa-details-title">
      <div className="sa-card-head">
        <h3 id="sa-details-title" className="sa-card-title">Scope details</h3>
        <ScopeStatusBadge status={meta.status} />
      </div>
      <dl className="sa-facts">
        <div><dt>Project</dt><dd>{meta.projectName}</dd></div>
        <div><dt>Project number</dt><dd className="sa-mono">{meta.projectNumber}</dd></div>
        <div><dt>Scope ID</dt><dd className="sa-mono">{meta.code}</dd></div>
        <div><dt>Current version</dt><dd className="sa-mono">{ws.currentVersion}</dd></div>
        <div><dt>Last updated</dt><dd>{formatRelative(meta.updatedAt, TODAY)}</dd></div>
        <div><dt>Owner</dt><dd>{meta.owner}</dd></div>
      </dl>
      <div className="sa-form-grid">
        <FormField label="Contract or requisition" required>
          <Input value={meta.requisition} readOnly={ro} onChange={(e) => set({ requisition: e.target.value })} />
        </FormField>
        <FormField label="Subcontractor" required>
          <Select value={meta.subcontractor} disabled={ro} onChange={(e) => set({ subcontractor: e.target.value })}>
            {SUBCONTRACTORS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Trade">
          <Select value={meta.trade} disabled={ro} onChange={(e) => set({ trade: e.target.value })}>
            {TRADES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Division (MasterFormat)">
          <Select value={meta.division} disabled={ro} onChange={(e) => set({ division: e.target.value })}>
            {DIVISIONS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Scope status">
          <Select value={meta.status} disabled={ro} onChange={(e) => set({ status: e.target.value as ScopeStatus })}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Project type" hint="Used by the Historical Scope Gap Agent to match similar projects.">
          <Input value={meta.projectType} readOnly />
        </FormField>
      </div>
    </Card>
  );
}

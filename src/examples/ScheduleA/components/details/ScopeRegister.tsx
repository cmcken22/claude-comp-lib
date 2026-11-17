import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { TODAY } from '../../data/project';
import { useSA } from '../../hooks/context';
import { formatRelative } from '../../lib/format';
import { reviewCounts } from '../../lib/review';
import { PlusIcon } from '../../icons';
import { ScopeStatusBadge } from '../common/Badges';

/** All Schedule A scopes on the project, with open and create actions. */
export function ScopeRegister() {
  const { register, activeId, can, ui, openScope } = useSA();

  return (
    <Card as="section" padding="none" aria-labelledby="sa-register-title">
      <div className="sa-card-head sa-card-head--padded">
        <div>
          <h3 id="sa-register-title" className="sa-card-title">Schedule A scopes on this project</h3>
          <p className="sa-muted">Open an existing draft or start a new scope for another subcontract.</p>
        </div>
        <Button startIcon={<PlusIcon size={16} />} disabled={!can.edit} onClick={() => ui.setDialog('newScope')}>
          New scope
        </Button>
      </div>
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th scope="col">Scope</th>
              <th scope="col">Subcontractor</th>
              <th scope="col">Trade / Division</th>
              <th scope="col">Status</th>
              <th scope="col">Version</th>
              <th scope="col">Open findings</th>
              <th scope="col">Updated</th>
              <th scope="col">Owner</th>
              <th scope="col"><span className="sa-visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {register.map((w) => {
              const current = w.meta.id === activeId;
              const counts = reviewCounts(w.findings);
              return (
                <tr key={w.meta.id} className={current ? 'sa-table__row--current' : undefined} aria-current={current || undefined}>
                  <th scope="row">
                    <span className="sa-mono sa-table__code">{w.meta.code}</span>
                    <span className="sa-table__sub">{w.meta.requisition}</span>
                  </th>
                  <td>{w.meta.subcontractor}</td>
                  <td className="sa-nowrap">{w.meta.trade} · {w.meta.division.split(' ')[0]}</td>
                  <td><ScopeStatusBadge status={w.meta.status} /></td>
                  <td className="sa-mono">{w.currentVersion}</td>
                  <td className="sa-mono">{w.runs.language.status === 'idle' ? '—' : counts.open}</td>
                  <td className="sa-nowrap">{formatRelative(w.meta.updatedAt, TODAY)}</td>
                  <td className="sa-nowrap">{w.meta.owner}</td>
                  <td>
                    {current ? (
                      <span className="sa-muted sa-nowrap">Open now</span>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => openScope(w.meta.id)}>Open</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

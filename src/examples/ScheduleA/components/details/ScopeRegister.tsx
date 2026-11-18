import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { TODAY } from '../../data/project';
import { useSA } from '../../hooks/context';
import { formatRelative } from '../../lib/format';
import { divisionNumbers, requisitionId } from '../../lib/meta';
import { PaperclipIcon, PlusIcon } from '../../icons';
import { ScopeStatusBadge } from '../common/Badges';

/** All Schedule A scopes on the project. Tender issues can be revised or attached once awarded. */
export function ScopeRegister() {
  const { register, can, ui, openScope, reviseScope, attachScope } = useSA();

  return (
    <Card as="section" padding="none" aria-labelledby="sa-register-title">
      <div className="sa-card-head sa-card-head--padded">
        <div>
          <h3 id="sa-register-title" className="sa-card-title">Schedule A scopes on this project</h3>
          <p className="sa-muted">Open a draft, or revise and attach a scope that was issued for tender.</p>
        </div>
        <Button variant="outline" startIcon={<PlusIcon size={16} />} disabled={!can.edit} onClick={() => ui.setDialog('newScope')}>
          New scope
        </Button>
      </div>
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th scope="col">Scope</th>
              <th scope="col">Trade · Divisions</th>
              <th scope="col">Status</th>
              <th scope="col">Subcontractor</th>
              <th scope="col">Version</th>
              <th scope="col">Updated</th>
              <th scope="col"><span className="sa-visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {register.map((w) => {
              const tender = w.meta.status === 'Issued for tender';
              return (
                <tr key={w.meta.id}>
                  <th scope="row">
                    <span className="sa-mono sa-table__code">{w.meta.code}</span>
                    <span className="sa-table__sub">{w.meta.title.replace(/^Schedule A — /, '')}</span>
                  </th>
                  <td>{w.meta.trade}<span className="sa-table__sub">Div {divisionNumbers(w.meta.divisions)}</span></td>
                  <td><ScopeStatusBadge status={w.meta.status} /></td>
                  <td>
                    {w.meta.subcontractor || <span className="sa-muted">{tender ? 'Out for tender' : 'Not yet awarded'}</span>}
                    {w.meta.requisition && <span className="sa-table__sub">{requisitionId(w.meta)}</span>}
                  </td>
                  <td className="sa-mono">{w.currentVersion}</td>
                  <td className="sa-nowrap">{formatRelative(w.meta.updatedAt, TODAY)}</td>
                  <td>
                    <div className="sa-row-actions">
                      {tender ? (
                        <>
                          <Button variant="ghost" size="sm" disabled={!can.edit} onClick={() => reviseScope(w.meta.id)}>Revise</Button>
                          <Button variant="outline" size="sm" startIcon={<PaperclipIcon size={14} />} disabled={!can.export} onClick={() => attachScope(w.meta.id)}>Attach to requisition</Button>
                        </>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => openScope(w.meta.id)}>Open</Button>
                      )}
                    </div>
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

import { Button } from '../../../components/Button';
import { Select } from '../../../components/Select';
import { ROLES } from '../config';
import { useSA } from '../hooks/context';
import { reviewCounts } from '../lib/review';
import { ExportIcon, HistoryIcon, LockIcon, PanelIcon } from '../icons';
import type { Role } from '../types';
import { ScopeStatusBadge } from './common/Badges';
import { SaveIndicator } from './common/SaveIndicator';

export function PageHeader() {
  const { ws, ui, can, saveState } = useSA();
  const { meta } = ws;
  const counts = reviewCounts(ws.findings);
  const unversioned = ws.versionRevision !== ws.revision;

  return (
    <header className="sa-header">
      <nav aria-label="Breadcrumb" className="sa-crumbs">
        <ol>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#project">{meta.projectNumber} · Harbourview Ph 2</a></li>
          <li><a href="#subcontracts">Subcontracts</a></li>
          <li><a href="#req">{meta.requisition.split(' · ')[0]}</a></li>
          <li aria-current="page">Schedule A</li>
        </ol>
      </nav>

      <div className="sa-header__row">
        <div className="sa-header__titles">
          <h1 className="sa-header__title">{meta.title}</h1>
          <p className="sa-header__meta">
            <span>{meta.subcontractor}</span>
            <span aria-hidden="true">·</span>
            <span>{meta.trade} · Div {meta.division}</span>
            <span aria-hidden="true">·</span>
            <ScopeStatusBadge status={meta.status} />
            <span className="sa-version-tag" title="Current version">
              {ws.currentVersion}
              {unversioned && <span className="sa-version-tag__draft"> + draft changes</span>}
            </span>
            <SaveIndicator state={saveState} />
          </p>
        </div>

        <div className="sa-header__actions">
          <label className="sa-role">
            <span className="sa-role__label">Viewing as</span>
            <Select size="sm" value={ui.role} onChange={(e) => ui.setRole(e.target.value as Role)} aria-label="Role (prototype)">
              {(Object.keys(ROLES) as Role[]).map((r) => (
                <option key={r} value={r}>{ROLES[r].label}</option>
              ))}
            </Select>
          </label>
          <Button variant="outline" size="md" startIcon={<HistoryIcon />} onClick={() => ui.setDialog('versions')}>
            Versions
          </Button>
          <Button
            variant="outline"
            className="sa-header__panel-toggle"
            startIcon={<PanelIcon />}
            aria-expanded={ui.panelOpen}
            onClick={() => ui.setPanelOpen(true)}
          >
            Review{counts.open > 0 && <span className="sa-count-pill">{counts.open}</span>}
          </Button>
          <Button
            startIcon={can.export ? <ExportIcon /> : <LockIcon />}
            disabled={!can.export}
            title={can.export ? undefined : 'Followers cannot export'}
            onClick={() => ui.setDialog('export')}
          >
            Export
          </Button>
        </div>
      </div>

      {!can.edit && (
        <p className="sa-banner sa-banner--info" role="note">
          <LockIcon size={16} /> You are viewing as a Follower. You can read the scope and review findings, but cannot edit or export.
        </p>
      )}
    </header>
  );
}

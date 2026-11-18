import { Button } from '../../../components/Button';
import { useSA } from '../hooks/context';
import { divisionNumbers } from '../lib/meta';
import { reviewCounts } from '../lib/review';
import { ExportIcon, HistoryIcon, LockIcon, SparkleIcon } from '../icons';
import { ScopeStatusBadge } from './common/Badges';
import { SaveIndicator } from './common/SaveIndicator';

export function PageHeader() {
  const { ws, ui, can, saveState } = useSA();
  const { meta } = ws;
  const counts = reviewCounts(ws.findings);
  const unversioned = ws.versionRevision !== ws.revision;
  // The editor shows the review panel inline on wide screens; the AI Review step is the review.
  const reviewToggle = ui.step === 'review' ? null : ui.step === 'editor' ? 'sa-header__review sa-header__review--editor' : 'sa-header__review';

  return (
    <header className="sa-header">
      <nav aria-label="Breadcrumb" className="sa-crumbs">
        <ol>
          <li><a href="#project">{meta.projectNumber} · Harbourview Ph 2</a></li>
          <li><button type="button" className="sa-crumb-btn" onClick={() => ui.setLanding(true)}>Schedule A scopes</button></li>
          <li aria-current="page">{meta.code}</li>
        </ol>
      </nav>

      <div className="sa-header__row">
        <div className="sa-header__titles">
          <h1 className="sa-header__title">{meta.title.replace(/^Schedule A — /, '')}</h1>
          <p className="sa-header__meta">
            <ScopeStatusBadge status={meta.status} />
            <span>{meta.subcontractor || 'Tender · not yet awarded'}</span>
            <span aria-hidden="true">·</span>
            <span>{meta.trade} · Div {divisionNumbers(meta.divisions)}</span>
            <span aria-hidden="true">·</span>
            <span className="sa-mono" title={unversioned ? 'Draft changes since this version' : 'Current version'}>
              {ws.currentVersion}{unversioned ? ' draft' : ''}
            </span>
            <SaveIndicator state={saveState} />
          </p>
        </div>

        <div className="sa-header__actions">
          {reviewToggle && (ui.step === 'editor' || counts.total > 0) && (
            <Button variant="ghost" className={reviewToggle} startIcon={<SparkleIcon size={16} />} aria-expanded={ui.panelOpen} onClick={() => ui.setPanelOpen(true)}>
              {ui.step === 'editor' ? 'Documents & findings' : 'Review'}{counts.open > 0 && <span className="sa-count-pill">{counts.open}</span>}
            </Button>
          )}
          <Button variant="ghost" startIcon={<HistoryIcon size={16} />} onClick={() => ui.setDialog('versions')}>
            Versions
          </Button>
          <Button
            startIcon={can.export ? <ExportIcon size={16} /> : <LockIcon size={16} />}
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
          <LockIcon size={16} /> View only. Followers can read the scope and comment on findings, but cannot edit or export.
        </p>
      )}
    </header>
  );
}

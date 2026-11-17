import { Button } from '../../../components/Button';
import { CalendarIcon, CommentIcon, DownloadIcon, MoreIcon } from '../icons';

export interface PageHeaderProps {
  projectName: string;
  onExport: () => void;
}

/** Title, last-updated date, page tools and primary actions. */
export function PageHeader({ projectName, onExport }: PageHeaderProps) {
  return (
    <header className="cd-header">
      <div className="cd-header__titles">
        <p className="cd-header__eyebrow">Budget &amp; Costs · Project 1042</p>
        <h1 className="cd-header__title">{projectName}</h1>
      </div>
      <div className="cd-header__actions">
        <span className="cd-header__meta">
          <CalendarIcon /> Updated Nov 17, 2026
        </span>
        <div className="cd-button-group" role="group" aria-label="Page tools">
          <button type="button" className="cd-button-group__item" aria-label="Comments (4)" title="Comments">
            <CommentIcon />
            <span className="cd-button-group__count">4</span>
          </button>
          <button
            type="button"
            className="cd-button-group__item"
            aria-label="Export budget as CSV"
            title="Export CSV"
            onClick={onExport}
          >
            <DownloadIcon />
          </button>
          <button type="button" className="cd-button-group__item" aria-label="More actions" title="More">
            <MoreIcon />
          </button>
        </div>
        <Button variant="secondary">Edit budget</Button>
        <Button>Monthly payments</Button>
      </div>
    </header>
  );
}

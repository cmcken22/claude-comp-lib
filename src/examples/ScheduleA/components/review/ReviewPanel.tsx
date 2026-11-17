import { Button } from '../../../../components/Button';
import { useSA } from '../../hooks/context';
import { useFindingFilters } from '../../hooks/useFindingFilters';
import { reviewCounts } from '../../lib/review';
import { ChevronRightIcon, SparkleIcon } from '../../icons';
import { FindingCard } from './FindingCard';
import { FindingDetail } from './FindingDetail';
import { FindingFiltersBar } from './FindingFiltersBar';
import { ReviewSummary } from './ReviewSummary';

/** AI review summary, filters, findings and detail. Used inline on wide screens and in a drawer. */
export function ReviewPanel({ inDrawer = false }: { inDrawer?: boolean }) {
  const { ws, ui } = useSA();
  const { filters, set, reset, visible, active } = useFindingFilters(ws.findings);
  const selected = ws.findings.find((f) => f.id === ui.selectedFindingId);
  const counts = reviewCounts(ws.findings);

  if (!inDrawer && ui.panelCollapsed) {
    return (
      <aside className="sa-panel sa-panel--collapsed" aria-label="AI review">
        <button type="button" className="sa-panel__expand" aria-expanded={false} onClick={() => ui.setPanelCollapsed(false)}>
          <SparkleIcon size={18} />
          <span className="sa-panel__vertical">AI Review</span>
          {counts.critical > 0 && <span className="sa-step__issues sa-step__issues--critical">{counts.critical}</span>}
          {counts.high > 0 && <span className="sa-step__issues sa-step__issues--warning">{counts.high}</span>}
        </button>
      </aside>
    );
  }

  return (
    <aside className={`sa-panel${inDrawer ? ' sa-panel--drawer' : ''}`} aria-label="AI review">
      {!inDrawer && (
        <header className="sa-panel__head">
          <h2 className="sa-panel__title"><SparkleIcon size={18} /> AI Review</h2>
          <button type="button" className="sa-icon-btn" aria-label="Collapse review panel" aria-expanded onClick={() => ui.setPanelCollapsed(true)}>
            <ChevronRightIcon size={18} />
          </button>
        </header>
      )}
      <p className="sa-panel__disclaimer">Recommendations only. Nothing changes the scope until you insert it.</p>

      {selected ? (
        <FindingDetail finding={selected} onBack={() => ui.openFinding(null)} />
      ) : (
        <>
          {ws.findings.length > 0 && <ReviewSummary compact />}
          {ws.findings.length > 0 && <FindingFiltersBar filters={filters} onChange={set} />}
          {ws.findings.length === 0 ? (
            <div className="sa-empty-inline">
              <p>No findings yet. Run the review agents to check this draft.</p>
              <Button size="sm" variant="outline" onClick={() => { ui.setStep('review'); ui.setPanelOpen(false); }}>Go to AI Review</Button>
            </div>
          ) : visible.length === 0 ? (
            <div className="sa-empty-inline">
              <p>{active ? 'No findings match these filters.' : 'No open findings. Nice work.'}</p>
              <Button size="sm" variant="ghost" onClick={() => (active ? reset() : set('status', 'all'))}>{active ? 'Clear filters' : 'Show all findings'}</Button>
            </div>
          ) : (
            <ul className="sa-finding-list" aria-label={`${visible.length} findings`}>
              {visible.map((f) => (
                <FindingCard key={f.id} finding={f} onOpen={() => ui.openFinding(f.id)} />
              ))}
            </ul>
          )}
        </>
      )}
    </aside>
  );
}

import { useRef, type KeyboardEvent } from 'react';
import { useSA } from '../../hooks/context';
import { reviewCounts } from '../../lib/review';
import { ChevronRightIcon, DocIcon } from '../../icons';
import { ReviewPanel } from '../review/ReviewPanel';
import { DocumentsTab } from './DocumentsTab';

type Tab = 'documents' | 'findings';

/** Beside the editor: the linked reference documents and the AI findings, one tab at a time. */
export function SidePanel({ inDrawer = false }: { inDrawer?: boolean }) {
  const { ws, ui } = useSA();
  const counts = reviewCounts(ws.findings);
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'documents', label: 'Documents', count: ws.selectedDocIds.length },
    { id: 'findings', label: 'AI findings', count: counts.open },
  ];
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!inDrawer && ui.panelCollapsed) {
    return (
      <aside className="sa-panel sa-panel--collapsed" aria-label="Documents and findings">
        <button type="button" className="sa-panel__expand" aria-expanded={false} onClick={() => ui.setPanelCollapsed(false)}>
          <DocIcon size={18} />
          <span className="sa-panel__vertical">Documents & findings</span>
          {counts.critical > 0 && <span className="sa-step__issues sa-step__issues--critical">{counts.critical}</span>}
        </button>
      </aside>
    );
  }

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (i + 1) % tabs.length;
    ui.setSideTab(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <aside className={`sa-panel${inDrawer ? ' sa-panel--drawer' : ''}`} aria-label="Documents and findings">
      <header className="sa-panel__head">
        <div className="sa-tabs" role="tablist" aria-label="Side panel">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="tab"
              id={`sa-tab-${t.id}`}
              aria-selected={ui.sideTab === t.id}
              aria-controls={`sa-tabpanel-${t.id}`}
              tabIndex={ui.sideTab === t.id ? 0 : -1}
              className="sa-tab"
              onClick={() => ui.setSideTab(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {t.label}
              {t.count ? <span className={`sa-tab__count${t.id === 'findings' && counts.critical ? ' sa-tab__count--alert' : ''}`}>{t.count}</span> : null}
            </button>
          ))}
        </div>
        {!inDrawer && (
          <button type="button" className="sa-icon-btn" aria-label="Collapse side panel" aria-expanded onClick={() => ui.setPanelCollapsed(true)}>
            <ChevronRightIcon size={18} />
          </button>
        )}
      </header>
      <div role="tabpanel" id={`sa-tabpanel-${ui.sideTab}`} aria-labelledby={`sa-tab-${ui.sideTab}`} className="sa-panel__body">
        {ui.sideTab === 'documents' ? <DocumentsTab /> : <ReviewPanel embedded />}
      </div>
    </aside>
  );
}

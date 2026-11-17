import { useEffect } from 'react';
import { Drawer } from '../../../components/Drawer';
import { useSA } from '../hooks/context';
import { SparkleIcon } from '../icons';
import type { StepId } from '../types';
import { Toasts } from './common/Toasts';
import { ScopeDetailsStep } from './details/ScopeDetailsStep';
import { NewScopeDrawer } from './details/NewScopeDrawer';
import { ClauseLibraryDrawer } from './editor/ClauseLibraryDrawer';
import { ScopeEditorStep } from './editor/ScopeEditorStep';
import { ExportDialog } from './export/ExportDialog';
import { FinalizeStep } from './export/FinalizeStep';
import { PageHeader } from './PageHeader';
import { StartScreen } from './StartScreen';
import { StepFooter } from './StepFooter';
import { ReferenceDocsStep } from './references/ReferenceDocsStep';
import { AiReviewStep } from './review/AiReviewStep';
import { ReviewPanel } from './review/ReviewPanel';
import { StepNav } from './StepNav';
import { CreateVersionDialog } from './versions/CreateVersionDialog';
import { VersionDrawer } from './versions/VersionDrawer';

const STEP_VIEWS: Record<StepId, () => JSX.Element> = {
  details: ScopeDetailsStep,
  editor: ScopeEditorStep,
  references: ReferenceDocsStep,
  review: AiReviewStep,
  export: FinalizeStep,
};

/** Header, step rail, active step and review panel, plus overlays. */
export function Workbench() {
  const { ws, ui, toast } = useSA();
  const StepView = STEP_VIEWS[ui.step];
  // Findings sit beside the draft only while editing; the AI Review step shows them in full.
  const showPanel = ui.step === 'editor' && ws.findings.length > 0;

  // New step starts at the top; a jump-to-section scrolls afterwards in SectionCard.
  useEffect(() => {
    document.querySelector('.sa-main')?.scrollTo({ top: 0 });
  }, [ui.step, ui.landing]);

  if (ui.landing) {
    return (
      <div className="sa-page">
        <StartScreen />
        <NewScopeDrawer />
        <Toasts toasts={toast.toasts} onDismiss={toast.dismiss} />
      </div>
    );
  }

  return (
    <div className="sa-page">
      <PageHeader />
      <StepNav />
      <div className={`sa-workspace${showPanel ? ' sa-workspace--with-panel' : ''}${ui.panelCollapsed ? ' sa-workspace--panel-collapsed' : ''}`}>
        <div className="sa-workspace__main" key={ui.step}>
          <StepView />
          <StepFooter />
        </div>
        {showPanel && (
          <div className="sa-workspace__panel">
            <ReviewPanel />
          </div>
        )}
      </div>

      <Drawer className="sa-review-drawer" open={ui.panelOpen} onClose={() => ui.setPanelOpen(false)} title="AI Review" icon={<SparkleIcon />} size="md">
        <ReviewPanel inDrawer />
      </Drawer>
      <ClauseLibraryDrawer />
      <NewScopeDrawer />
      <VersionDrawer />
      <CreateVersionDialog />
      <ExportDialog />
      <Toasts toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  );
}

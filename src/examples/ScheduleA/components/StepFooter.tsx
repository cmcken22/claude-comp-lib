import { Button } from '../../../components/Button';
import { STEPS } from '../config';
import { useSA } from '../hooks/context';
import { reviewCounts } from '../lib/review';
import { countItems } from '../lib/scope';
import { ArrowLeftIcon, ArrowRightIcon, ExportIcon, SparkleIcon } from '../icons';
import type { StepId } from '../types';

interface NextAction {
  hint: string;
  label: string;
  disabled?: boolean;
  icon?: JSX.Element;
  run: () => void;
}

/** Pinned bar at the bottom of every step: what to do next, and the button that does it. */
export function StepFooter() {
  const { ws, ui, can, dispatch, runAgent } = useSA();
  const index = STEPS.findIndex((s) => s.id === ui.step);
  const go = (step: StepId) => ui.setStep(step);
  const items = countItems(ws.sections);
  const counts = reviewCounts(ws.findings);
  const ran = ws.runs.language.status === 'complete' && ws.runs.gap.status === 'complete';
  const running = ws.runs.language.status === 'running' || ws.runs.gap.status === 'running';

  const actions: Record<StepId, NextAction> = {
    details: {
      hint: 'Check the requisition and subcontractor, then confirm.',
      label: 'Confirm and continue',
      disabled: !(ws.meta.subcontractor && ws.meta.requisition.trim()),
      run: () => { dispatch({ type: 'confirmStep', step: 'details' }); go('editor'); },
    },
    editor: items === 0
      ? { hint: 'Add clauses first: use the template, browse the library or start blank.', label: 'Continue to Reference Documents', disabled: true, run: () => go('references') }
      : { hint: `${items} ${items === 1 ? 'clause' : 'clauses'} drafted. Next, choose what the review agents compare against.`, label: 'Continue to Reference Documents', run: () => go('references') },
    references: {
      hint: ws.selectedDocIds.length ? `${ws.selectedDocIds.length} documents selected for review.` : 'Select at least one reference document.',
      label: 'Continue to AI Review',
      disabled: ws.selectedDocIds.length === 0,
      run: () => { dispatch({ type: 'confirmStep', step: 'references' }); go('review'); },
    },
    review: !ran
      ? { hint: running ? 'Agents are reviewing the draft…' : 'Run both agents to check the draft for conflicts and likely gaps.', label: 'Run both agents', icon: <SparkleIcon size={16} />, disabled: running || !can.edit, run: () => { (['language', 'gap'] as const).forEach((a) => ws.runs[a].status !== 'complete' && runAgent(a)); } }
      : { hint: counts.critical ? `${counts.critical} critical finding open. Open it in the list below to resolve it, or continue and acknowledge it on export.` : `${counts.open} findings open, none critical.`, label: 'Continue to Finalize', run: () => go('export') },
    export: {
      hint: ws.confirmed.includes('export') ? `Exported ${ws.currentVersion}. You can export again after changes.` : 'Preview the Schedule A, then export or attach it to the requisition.',
      label: 'Preview and export',
      icon: <ExportIcon size={16} />,
      disabled: !can.export,
      run: () => ui.setDialog('export'),
    },
  };
  const next = actions[ui.step];

  return (
    <div className="sa-step-footer" role="region" aria-label="Next step">
      <p className="sa-step-footer__hint">
        <span className="sa-step-footer__count">Step {index + 1} of {STEPS.length}</span>
        {next.hint}
      </p>
      <div className="sa-step-footer__actions">
        {index > 0 && (
          <Button variant="ghost" startIcon={<ArrowLeftIcon size={16} />} onClick={() => go(STEPS[index - 1].id)}>
            Back
          </Button>
        )}
        <Button disabled={next.disabled} startIcon={next.icon} endIcon={next.icon ? undefined : <ArrowRightIcon size={16} />} onClick={next.run}>
          {next.label}
        </Button>
      </div>
    </div>
  );
}

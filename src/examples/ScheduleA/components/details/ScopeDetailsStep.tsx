import { Button } from '../../../../components/Button';
import { useSA } from '../../hooks/context';
import { ArrowRightIcon } from '../../icons';
import { ScopeDetailsForm } from './ScopeDetailsForm';
import { ScopeRegister } from './ScopeRegister';

/** Step 1: select or create a scope and confirm its contract context. */
export function ScopeDetailsStep() {
  const { ws, ui, dispatch } = useSA();
  const ready = Boolean(ws.meta.subcontractor && ws.meta.requisition.trim());
  return (
    <div className="sa-step-body">
      <div className="sa-step-head">
        <div>
          <h2 className="sa-step-head__title">Scope Details</h2>
          <p className="sa-step-head__sub">Project, requisition and subcontractor context for this Schedule A.</p>
        </div>
        <div className="sa-toolbar">
          <Button size="sm" disabled={!ready} endIcon={<ArrowRightIcon size={16} />} onClick={() => { dispatch({ type: 'confirmStep', step: 'details' }); ui.setStep('editor'); }}>
            {ws.confirmed.includes('details') ? 'Continue to Scope Editor' : 'Confirm and continue'}
          </Button>
        </div>
      </div>
      <ScopeDetailsForm />
      <ScopeRegister />
    </div>
  );
}

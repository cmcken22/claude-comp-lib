import { ScopeDetailsForm } from './ScopeDetailsForm';
import { ScopeRegister } from './ScopeRegister';

/** Step 1: select or create a scope and confirm its contract context. */
export function ScopeDetailsStep() {
  return (
    <div className="sa-step-body">
      <div className="sa-step-head">
        <div>
          <h2 className="sa-step-head__title">Scope Details</h2>
          <p className="sa-step-head__sub">Project, requisition and subcontractor context for this Schedule A.</p>
        </div>
      </div>
      <ScopeDetailsForm />
      <ScopeRegister />
    </div>
  );
}

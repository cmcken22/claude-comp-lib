import { ScopeDetailsForm } from './ScopeDetailsForm';

/** Step 1: confirm the scope's contract context. Choosing a scope happens on the start screen. */
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
    </div>
  );
}

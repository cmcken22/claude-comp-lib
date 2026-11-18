import { Button } from '../../../components/Button';
import { STEPS } from '../config';
import { useSA } from '../hooks/context';
import { PlusIcon } from '../icons';
import { ScopeRegister } from './details/ScopeRegister';

/** Entry point: start a new Schedule A or open an existing draft on the project. */
export function StartScreen() {
  const { ws, ui, can } = useSA();

  return (
    <>
      <header className="sa-header">
        <nav aria-label="Breadcrumb" className="sa-crumbs">
          <ol>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#project">{ws.meta.projectNumber} · Harbourview Ph 2</a></li>
            <li><a href="#subcontracts">Subcontracts</a></li>
            <li aria-current="page">Schedule A scopes</li>
          </ol>
        </nav>
        <h1 className="sa-header__title">Schedule A scopes</h1>
        <p className="sa-header__meta">{ws.meta.projectNumber} · {ws.meta.projectName}</p>
      </header>

      <section className="sa-start" aria-labelledby="sa-start-title">
        <div className="sa-start__intro">
          <h2 id="sa-start-title" className="sa-start__title">Create a scope of work</h2>
          <p>Draft the scope of work for tender, check it against standard schedules and past change orders, then attach it to the requisition once the subcontract is awarded. No requisition or subcontractor is needed to start.</p>
          <Button size="lg" startIcon={<PlusIcon size={18} />} disabled={!can.edit} onClick={() => ui.setDialog('newScope')}>
            Start a new scope
          </Button>
        </div>
        <ol className="sa-start__steps" aria-label="Workflow">
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <span className="sa-step__marker" aria-hidden="true">{i + 1}</span>
              {s.label}
            </li>
          ))}
        </ol>
      </section>

      <ScopeRegister />
    </>
  );
}

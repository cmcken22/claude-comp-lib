import { Button } from '../../../../components/Button';
import { Select } from '../../../../components/Select';
import { SECTION_CATALOG } from '../../config';
import { useSA } from '../../hooks/context';
import { countCritical, countItems } from '../../lib/scope';
import { ArrowRightIcon, HistoryIcon, LibraryIcon } from '../../icons';
import { EmptyScope } from './EmptyScope';
import { ScopeOverview } from './ScopeOverview';
import { SectionCard } from './SectionCard';

/** Step 2: structured scope editor (the default screen). */
export function ScopeEditorStep() {
  const { ws, ui, can, dispatch } = useSA();
  const missing = SECTION_CATALOG.filter((c) => !ws.sections.some((s) => s.key === c.key));

  return (
    <div className="sa-step-body">
      <div className="sa-step-head">
        <div>
          <h2 className="sa-step-head__title">Scope Editor</h2>
          <p className="sa-step-head__sub">
            {ws.sections.length} sections · {countItems(ws.sections)} clauses · {countCritical(ws.sections)} critical
          </p>
        </div>
        {can.edit && ws.sections.length > 0 && (
          <div className="sa-toolbar">
            <Select
              size="sm"
              aria-label="Add section"
              placeholder="Add section…"
              value=""
              disabled={missing.length === 0}
              onChange={(e) => e.target.value && dispatch({ type: 'addSection', key: e.target.value })}
            >
              {missing.map((m) => (
                <option key={m.key} value={m.key}>{m.name}</option>
              ))}
            </Select>
            <Button variant="outline" size="sm" startIcon={<LibraryIcon size={16} />} onClick={() => ui.openLibrary(null)}>
              Clause library
            </Button>
            <Button variant="outline" size="sm" startIcon={<HistoryIcon size={16} />} disabled={!can.manageVersions} title={can.manageVersions ? undefined : 'Only Admins can create versions'} onClick={() => ui.setDialog('createVersion')}>
              Create version
            </Button>
          </div>
        )}
      </div>

      <ScopeOverview />

      {ws.sections.length === 0 ? (
        <EmptyScope />
      ) : (
        <div className="sa-sections">
          {ws.sections.map((s, i) => (
            <SectionCard key={s.id} section={s} index={i} total={ws.sections.length} />
          ))}
        </div>
      )}

      {ws.sections.length > 0 && (
        <div className="sa-step-next">
          <p className="sa-muted">
            {countItems(ws.sections) > 0
              ? 'Next, choose the documents the review agents will compare this scope against.'
              : 'Add at least one clause to continue.'}
          </p>
          <Button endIcon={<ArrowRightIcon size={16} />} disabled={countItems(ws.sections) === 0} onClick={() => ui.setStep('references')}>
            Continue to Reference Documents
          </Button>
        </div>
      )}
    </div>
  );
}

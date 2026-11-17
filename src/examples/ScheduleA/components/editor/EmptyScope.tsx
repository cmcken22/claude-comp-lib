import { Button } from '../../../../components/Button';
import { useSA } from '../../hooks/context';
import { DocIcon, LibraryIcon, PlusIcon } from '../../icons';

/** First-run state for a scope with no sections yet. */
export function EmptyScope() {
  const { ws, ui, can, dispatch, toast } = useSA();

  const options = [
    {
      icon: <DocIcon size={22} />,
      title: 'Start from company template',
      body: 'Schedule A Template Rev 7 with mandatory General, Safety and Closeout clauses pre-filled.',
      action: 'Use template',
      primary: true,
      run: () => { dispatch({ type: 'starter', kind: 'template' }); toast.push('Template applied. Mandatory clauses were added.'); },
    },
    {
      icon: <LibraryIcon size={22} />,
      title: 'Reuse historical language',
      body: 'Browse clauses from past Schedule A documents and insert the ones that fit.',
      action: 'Browse library',
      run: () => { dispatch({ type: 'starter', kind: 'blank' }); ui.openLibrary(null); },
    },
    {
      icon: <PlusIcon size={22} />,
      title: 'Start blank',
      body: 'Begin with empty General Requirements and Exclusions sections.',
      action: 'Start blank',
      run: () => dispatch({ type: 'starter', kind: 'blank' }),
    },
  ];

  return (
    <div className="sa-empty">
      <div className="sa-empty__intro">
        <h2 className="sa-empty__title">Build the scope for {ws.meta.subcontractor}</h2>
        <p>
          {ws.meta.code} · {ws.meta.trade} · Div {ws.meta.division}. Choose how to start. You can add, reorder and edit sections at any time.
        </p>
      </div>
      <ul className="sa-empty__options">
        {options.map((o) => (
          <li key={o.title} className="sa-empty__option">
            <span className="sa-empty__icon">{o.icon}</span>
            <h3>{o.title}</h3>
            <p>{o.body}</p>
            <Button variant={o.primary ? 'primary' : 'outline'} size="sm" disabled={!can.edit} onClick={o.run}>
              {o.action}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

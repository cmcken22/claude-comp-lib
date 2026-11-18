import { Button } from '../../../../components/Button';
import { useSA } from '../../hooks/context';
import { divisionNumbers } from '../../lib/meta';
import { DocIcon, ImportIcon, LibraryIcon, PlusIcon } from '../../icons';

/** First-run state for a scope with no sections yet. */
export function EmptyScope() {
  const { ws, ui, can, dispatch, toast } = useSA();

  const options = [
    {
      icon: <ImportIcon size={22} />,
      title: 'Import from drawings and specs',
      body: 'Paste or upload the notes from your drawing and specification review. Each line becomes a clause you can sort and edit.',
      action: 'Import text',
      primary: true,
      run: () => ui.setDialog('import'),
    },
    {
      icon: <DocIcon size={22} />,
      title: 'Start from company template',
      body: 'Schedule A Template Rev 7 with mandatory General, Safety and Closeout clauses pre-filled.',
      action: 'Use template',
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
      body: 'Empty General Requirements and Exclusions sections to write into.',
      action: 'Start blank',
      run: () => dispatch({ type: 'starter', kind: 'blank' }),
    },
  ];

  return (
    <div className="sa-empty">
      <div className="sa-empty__intro">
        <h2 className="sa-empty__title">Next: add clauses to the {ws.meta.trade.toLowerCase()} scope</h2>
        <p>
          {ws.meta.code} · Div {divisionNumbers(ws.meta.divisions)}. Import text from your drawing and specification review, start from the template, or reuse past clauses. You can edit everything afterwards.
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

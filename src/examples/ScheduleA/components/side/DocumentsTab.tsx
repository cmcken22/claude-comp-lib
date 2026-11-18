import { DOC_TYPES, sectionName } from '../../config';
import { excerpts, FALLBACK_EXCERPT } from '../../data/excerpts';
import { referenceDocs } from '../../data/project';
import { useSA } from '../../hooks/context';
import { formatDate } from '../../lib/format';
import { guessKind, guessSection } from '../../lib/importParser';
import { newId } from '../../lib/scope';
import { ArrowLeftIcon, ChevronRightIcon, DocIcon, PlusIcon } from '../../icons';

/** Linked reference documents, readable beside the editor; excerpts can become clauses. */
export function DocumentsTab() {
  const { ws, ui, can, dispatch, toast } = useSA();
  const docs = referenceDocs.filter((d) => ws.selectedDocIds.includes(d.id));
  const doc = docs.find((d) => d.id === ui.docId);

  if (doc) {
    const list = excerpts[doc.id] ?? FALLBACK_EXCERPT;
    const add = (ref: string, text: string) => {
      const sectionKey = guessSection(text);
      const id = newId('i');
      dispatch({ type: 'addItemToKey', sectionKey, item: { id, text, kind: guessKind(text), critical: false, tags: [], origin: { type: 'import', ref: `${doc.name.split(' — ')[0]} ${ref}` } } });
      ui.jumpTo(sectionKey, id);
      toast.push(`Added to ${sectionName(sectionKey)}. Edit it in place if it needs adjusting.`);
    };
    return (
      <div className="sa-doc-reader">
        <button type="button" className="sa-back" onClick={() => ui.setDocId(null)}><ArrowLeftIcon size={16} /> All documents</button>
        <h3 className="sa-doc-reader__title">{doc.name}</h3>
        <p className="sa-muted">{doc.type} · {doc.source} · {formatDate(doc.date)}</p>
        <ol className="sa-excerpts">
          {list.map((e) => (
            <li key={e.ref} className="sa-excerpt">
              <span className="sa-excerpt__ref sa-mono">{e.ref}</span>
              <p>{e.text}</p>
              {can.edit && excerpts[doc.id] && (
                <button type="button" className="sa-excerpt__add" onClick={() => add(e.ref, e.text)}>
                  <PlusIcon size={14} /> Add as clause in {sectionName(guessSection(e.text))}
                </button>
              )}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="sa-doc-tab">
      <p className="sa-panel__disclaimer">Documents linked in step 2. Open one to read it while you write.</p>
      {DOC_TYPES.map((type) => {
        const group = docs.filter((d) => d.type === type);
        if (!group.length) return null;
        return (
          <section key={type} aria-label={type}>
            <h4 className="sa-doc-tab__type">{type}</h4>
            <ul className="sa-doc-tab__list">
              {group.map((d) => (
                <li key={d.id}>
                  <button type="button" className="sa-doc-link" onClick={() => ui.setDocId(d.id)}>
                    <DocIcon size={16} />
                    <span>{d.name}</span>
                    <ChevronRightIcon size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {docs.length === 0 && (
        <div className="sa-empty-inline">
          <p>No documents linked.</p>
          <button type="button" className="sa-link" onClick={() => ui.setStep('references')}>Link reference documents</button>
        </div>
      )}
    </div>
  );
}

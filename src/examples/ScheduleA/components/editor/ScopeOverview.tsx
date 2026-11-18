import { useState, type FormEvent } from 'react';
import { Button } from '../../../../components/Button';
import { Chip } from '../../../../components/Chip';
import { FormField } from '../../../../components/FormField';
import { Input } from '../../../../components/Input';
import { TextArea } from '../../../../components/TextArea';
import { useSA } from '../../hooks/context';
import { EditIcon, PlusIcon } from '../../icons';

/** Description and tags. Reads as a short summary; opens into a form when edited. */
export function ScopeOverview() {
  const { ws, can, dispatch } = useSA();
  const { meta } = ws;
  const [editing, setEditing] = useState(!meta.description && can.edit);
  const [tag, setTag] = useState('');

  const addTag = (e: FormEvent) => {
    e.preventDefault();
    const value = tag.trim();
    if (value && !meta.tags.includes(value)) dispatch({ type: 'meta', patch: { tags: [...meta.tags, value] } });
    setTag('');
  };

  if (!editing) {
    return (
      <section className="sa-overview sa-overview--summary" aria-label="Scope overview">
        <div className="sa-overview__text">
          <p>{meta.description || <span className="sa-muted">No description yet.</span>}</p>
          {meta.tags.length > 0 && <p className="sa-overview__tagline">{meta.tags.join(' · ')}</p>}
        </div>
        {can.edit && (
          <Button variant="ghost" size="sm" startIcon={<EditIcon size={16} />} onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </section>
    );
  }

  return (
    <section className="sa-overview" aria-label="Scope overview">
      <FormField label="Scope title" required>
        <Input value={meta.title} onChange={(e) => dispatch({ type: 'meta', patch: { title: e.target.value } })} />
      </FormField>
      <FormField label="General description" hint="Appears at the top of the exported Schedule A.">
        <TextArea rows={6} value={meta.description} placeholder="Summarize the work of this subcontract…" onChange={(e) => dispatch({ type: 'meta', patch: { description: e.target.value } })} />
      </FormField>
      <div>
        <span className="sa-field-label" id="sa-tags-label">Trade and division tags</span>
        <div className="sa-overview__chips" aria-labelledby="sa-tags-label">
          {meta.tags.map((t) => (
            <Chip key={t} size="sm" onRemove={() => dispatch({ type: 'meta', patch: { tags: meta.tags.filter((x) => x !== t) } })}>{t}</Chip>
          ))}
          <form className="sa-overview__add-tag" onSubmit={addTag}>
            <Input size="sm" value={tag} placeholder="Add tag" aria-label="Add tag" onChange={(e) => setTag(e.target.value)} />
            <button type="submit" className="sa-icon-btn" aria-label="Add tag"><PlusIcon size={16} /></button>
          </form>
        </div>
      </div>
      <div className="sa-overview__done">
        <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Done</Button>
      </div>
    </section>
  );
}

import { useState, type FormEvent } from 'react';
import { Card } from '../../../../components/Card';
import { Chip } from '../../../../components/Chip';
import { FormField } from '../../../../components/FormField';
import { Input } from '../../../../components/Input';
import { TextArea } from '../../../../components/TextArea';
import { useSA } from '../../hooks/context';
import { PlusIcon } from '../../icons';

/** Scope title, general description and trade/division tags. */
export function ScopeOverview() {
  const { ws, can, dispatch } = useSA();
  const { meta } = ws;
  const [tag, setTag] = useState('');

  const addTag = (e: FormEvent) => {
    e.preventDefault();
    const value = tag.trim();
    if (value && !meta.tags.includes(value)) dispatch({ type: 'meta', patch: { tags: [...meta.tags, value] } });
    setTag('');
  };

  return (
    <Card as="section" padding="lg" className="sa-overview" aria-label="Scope overview">
      <FormField label="Scope title" required>
        <Input value={meta.title} readOnly={!can.edit} onChange={(e) => dispatch({ type: 'meta', patch: { title: e.target.value } })} />
      </FormField>
      <FormField label="General description" hint="Appears at the top of the exported Schedule A.">
        <TextArea rows={3} value={meta.description} readOnly={!can.edit} placeholder="Summarize the work of this subcontract…" onChange={(e) => dispatch({ type: 'meta', patch: { description: e.target.value } })} />
      </FormField>
      <div className="sa-overview__tags">
        <span className="sa-field-label" id="sa-tags-label">Trade and division tags</span>
        <div className="sa-overview__chips" aria-labelledby="sa-tags-label">
          {meta.tags.map((t) => (
            <Chip
              key={t}
              size="sm"
              onRemove={can.edit ? () => dispatch({ type: 'meta', patch: { tags: meta.tags.filter((x) => x !== t) } }) : undefined}
            >
              {t}
            </Chip>
          ))}
          {can.edit && (
            <form className="sa-overview__add-tag" onSubmit={addTag}>
              <Input size="sm" value={tag} placeholder="Add tag" aria-label="Add tag" onChange={(e) => setTag(e.target.value)} />
              <button type="submit" className="sa-icon-btn" aria-label="Add tag"><PlusIcon size={16} /></button>
            </form>
          )}
        </div>
      </div>
    </Card>
  );
}

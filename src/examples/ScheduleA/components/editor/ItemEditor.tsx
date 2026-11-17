import { useState } from 'react';
import { Button } from '../../../../components/Button';
import { Checkbox } from '../../../../components/Checkbox';
import { FormField } from '../../../../components/FormField';
import { Input } from '../../../../components/Input';
import { RadioGroup, Radio } from '../../../../components/Radio';
import { TextArea } from '../../../../components/TextArea';
import { ITEM_KIND } from '../../config';
import type { ItemKind, ScopeItem } from '../../types';
import { AiLabel } from '../common/Badges';

export interface ItemEditorProps {
  item: ScopeItem;
  number: string;
  onSave: (patch: Partial<ScopeItem>) => void;
  onCancel: () => void;
}

/** Inline editor for one clause. Holds an unsaved draft until Save. */
export function ItemEditor({ item, number, onSave, onCancel }: ItemEditorProps) {
  const [text, setText] = useState(item.text);
  const [kind, setKind] = useState<ItemKind>(item.kind);
  const [critical, setCritical] = useState(item.critical);
  const [tags, setTags] = useState(item.tags.join(', '));
  const fromAi = item.origin?.type === 'ai';
  const empty = text.trim().length === 0;

  const save = () =>
    onSave({
      text: text.trim(),
      kind,
      critical,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

  return (
    <li className={`sa-item sa-item--editing${fromAi ? ' sa-item--ai' : ''}`} id={`item-${item.id}`}>
      <span className="sa-item__number">{number}</span>
      <div className="sa-item__body sa-editor-form">
        {fromAi && (
          <p className="sa-editor-form__ai">
            <AiLabel>{`Inserted from AI recommendation ${item.origin?.ref ?? ""}`}</AiLabel>
            <span>Review and edit before it becomes contract language.</span>
          </p>
        )}
        <FormField label={`Clause ${number} text`} required error={empty ? 'Clause text is required.' : undefined}>
          <TextArea value={text} rows={4} onChange={(e) => setText(e.target.value)} autoFocus />
        </FormField>
        <div className="sa-editor-form__row">
          <RadioGroup label="Type" value={kind} onValueChange={(v) => setKind(v as ItemKind)} orientation="horizontal">
            {(Object.keys(ITEM_KIND) as ItemKind[]).map((k) => (
              <Radio key={k} value={k} label={ITEM_KIND[k].label} />
            ))}
          </RadioGroup>
          <Checkbox label="Critical item" description="Flags the clause for reviewers and in the export." checked={critical} onChange={(e) => setCritical(e.target.checked)} />
        </div>
        <FormField label="Tags" hint="Separate with commas, e.g. Div 23, Healthcare">
          <Input size="sm" value={tags} onChange={(e) => setTags(e.target.value)} />
        </FormField>
        <div className="sa-editor-form__actions">
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" disabled={empty} onClick={save}>Save clause</Button>
        </div>
      </div>
    </li>
  );
}

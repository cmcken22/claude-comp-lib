import { useState } from 'react';
import { Button } from '../../../../components/Button';
import { TextArea } from '../../../../components/TextArea';
import { TODAY } from '../../data/project';
import { formatRelative } from '../../lib/format';
import type { Note } from '../../types';

/** Reviewer notes on a finding. Anyone who can view the scope may comment. */
export function FindingNotes({ notes, onAdd }: { notes: Note[]; onAdd: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <section className="sa-notes" aria-label="Notes">
      <h4 className="sa-detail__label">Notes ({notes.length})</h4>
      {notes.length > 0 && (
        <ul className="sa-notes__list">
          {notes.map((n) => (
            <li key={n.id} className="sa-note">
              <span className="sa-note__meta"><strong>{n.author}</strong> · {formatRelative(n.at, TODAY)}</span>
              <p>{n.text}</p>
            </li>
          ))}
        </ul>
      )}
      <form
        className="sa-notes__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          onAdd(text.trim());
          setText('');
        }}
      >
        <TextArea rows={2} value={text} aria-label="Add a note" placeholder="Add a note for the review record…" onChange={(e) => setText(e.target.value)} />
        <Button type="submit" size="sm" variant="outline" disabled={!text.trim()}>Add note</Button>
      </form>
    </section>
  );
}

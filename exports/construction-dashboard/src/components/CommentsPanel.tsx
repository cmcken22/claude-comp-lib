import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Button, FormField, TextArea } from 'claude-comp-lib';
import { initials } from '../format';
import { Icon } from '../icons';

export interface CellComment {
  id: string;
  author: string;
  time: string;
  text: string;
}

interface CommentsPanelProps {
  project: string;
  column: string;
  value: string;
  comments: CellComment[];
  onPost: (text: string) => void;
  onResolve: () => void;
  onClose: () => void;
}

/** Side panel for one table cell's comment thread. */
export function CommentsPanel({ project, column, value, comments, onPost, onResolve, onClose }: CommentsPanelProps) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // A new cell opens with an empty draft and the cursor in the box.
  useEffect(() => {
    setDraft('');
    inputRef.current?.focus();
  }, [project, column]);

  const post = () => {
    const text = draft.trim();
    if (!text) return;
    onPost(text);
    setDraft('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') onClose();
  };

  return (
    <>
      <div className="cd-cpanel__scrim" aria-hidden="true" onClick={onClose} />
      <aside className="cd-cpanel" role="dialog" aria-labelledby="cd-cpanel-title" onKeyDown={onKeyDown}>
        <div className="cd-cpanel__head">
          <div>
            <div className="cd-cpanel__eyebrow">Comments · {column}</div>
            <h2 id="cd-cpanel-title" className="cd-cpanel__title">
              {project}
            </h2>
            <div className="cd-cpanel__value">{value}</div>
          </div>
          <Button variant="ghost" size="sm" className="cd-icon-button" aria-label="Close comments" startIcon={<Icon name="close" />} onClick={onClose} />
        </div>

        <div className="cd-cpanel__list" aria-live="polite">
          {comments.length === 0 ? (
            <p className="cd-cpanel__empty">No comments on this cell yet. Start the conversation below.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="cd-comment">
                <span className="cd-avatar cd-avatar--sm" aria-hidden="true">
                  {initials(c.author)}
                </span>
                <div className="cd-comment__body">
                  <div className="cd-comment__meta">
                    <strong>{c.author}</strong>
                    <span>{c.time}</span>
                  </div>
                  <p className="cd-comment__text">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cd-cpanel__compose">
          <FormField label="Add a comment">
            <TextArea
              ref={inputRef}
              rows={3}
              placeholder="Write a comment…"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  post();
                }
              }}
            />
          </FormField>
          <div className="cd-cpanel__actions">
            <span className="cd-cpanel__hint">Ctrl/⌘ + Enter to post</span>
            <div className="cd-cpanel__actions-end">
              {comments.length > 0 && (
                <Button variant="secondary" size="sm" onClick={onResolve}>
                  Resolve
                </Button>
              )}
              <Button size="sm" disabled={!draft.trim()} onClick={post}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

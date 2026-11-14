import {
  createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
  type ReactNode, type TdHTMLAttributes,
} from 'react';
import { Button, TextArea } from '../../../src';
import { Icons } from './icons';

// Cell-level comments. Shared and saved through the artifact's `db`
// capability when the page runs in claude.ai; otherwise kept in this
// browser only, so the feature still works in a local preview.

export interface CellComment {
  id: string;
  cell: string; // `${projectId}|${column}`
  text: string;
  author: string | null;
  createdAt: number;
  resolved: boolean;
}

interface Store {
  mode: 'shared' | 'local' | 'loading';
  myId: string | null;
  canWrite: boolean;
  subscribe(cb: (rows: CellComment[]) => void): () => void;
  add(c: Omit<CellComment, 'id'>): Promise<void>;
  setResolved(ids: string[], resolved: boolean): Promise<void>;
  remove(id: string): Promise<void>;
  names(ids: string[]): Promise<Record<string, string>>;
}

declare global {
  interface Window { claude?: { use(name: string): Promise<any> } }
}

const LOCAL_KEY = 'cd-cell-comments';
const COLLECTION = 'cellComments';

function localStore(): Store {
  let rows: CellComment[] = [];
  try { rows = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { rows = []; }
  const subs = new Set<(r: CellComment[]) => void>();
  const save = () => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(rows)); } catch { /* storage unavailable */ }
    subs.forEach((s) => s(rows));
  };
  return {
    mode: 'local', myId: 'me', canWrite: true,
    subscribe(cb) { subs.add(cb); cb(rows); return () => subs.delete(cb); },
    async add(c) { rows = [...rows, { ...c, id: Math.random().toString(36).slice(2) }]; save(); },
    async setResolved(ids, resolved) { rows = rows.map((r) => (ids.includes(r.id) ? { ...r, resolved } : r)); save(); },
    async remove(id) { rows = rows.filter((r) => r.id !== id); save(); },
    async names(ids) { return Object.fromEntries(ids.map((i) => [i, 'You'])); },
  };
}

async function sharedStore(): Promise<Store | null> {
  if (!window.claude?.use) return null;
  const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
  if (!db) return null;
  const myId: string | null = user ? await user.id() : null;
  const canWriteFlag: boolean | null = user ? await user.can('data.write') : null;
  const col = db.collection(COLLECTION);
  return {
    mode: 'shared',
    myId,
    canWrite: canWriteFlag !== false,
    subscribe(cb) {
      return col.orderBy('createdAt').onSnapshot(
        (snap: any) => cb(snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as object) }) as CellComment)),
        () => cb([]),
      );
    },
    async add(c) { await col.add(c); },
    async setResolved(ids, resolved) { for (const id of ids) await col.doc(id).update({ resolved }); },
    async remove(id) { await col.doc(id).delete(); },
    async names(ids) {
      if (!user || ids.length === 0) return {};
      const ps = await user.profiles(ids);
      return Object.fromEntries(ids.map((i) => [i, ps[i]?.isMe ? 'You' : ps[i]?.name || 'Someone']));
    },
  };
}

interface Ctx {
  store: Store | null;
  byCell: Map<string, CellComment[]>;
  openCell: string | null;
  open(cell: string, el: HTMLElement, label: string): void;
  close(): void;
}
const CommentsContext = createContext<Ctx | null>(null);
export const useComments = () => useContext(CommentsContext)!;

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [rows, setRows] = useState<CellComment[]>([]);
  const [target, setTarget] = useState<{ cell: string; el: HTMLElement; label: string } | null>(null);

  useEffect(() => {
    let alive = true;
    let fallback = window.setTimeout(() => alive && setStore((s) => s ?? localStore()), 10_500);
    sharedStore()
      .then((s) => { if (alive) setStore(s ?? localStore()); })
      .catch(() => { if (alive) setStore(localStore()); })
      .finally(() => window.clearTimeout(fallback));
    return () => { alive = false; window.clearTimeout(fallback); };
  }, []);

  useEffect(() => (store ? store.subscribe(setRows) : undefined), [store]);

  const byCell = useMemo(() => {
    const m = new Map<string, CellComment[]>();
    rows.forEach((r) => { const list = m.get(r.cell) ?? []; list.push(r); m.set(r.cell, list); });
    m.forEach((list) => list.sort((a, b) => a.createdAt - b.createdAt));
    return m;
  }, [rows]);

  const value = useMemo<Ctx>(() => ({
    store, byCell,
    openCell: target?.cell ?? null,
    open: (cell, el, label) => setTarget({ cell, el, label }),
    close: () => setTarget(null),
  }), [store, byCell, target]);

  return (
    <CommentsContext.Provider value={value}>
      {children}
      {target && store && (
        <CommentPopover
          key={target.cell}
          store={store}
          anchor={target.el}
          label={target.label}
          cell={target.cell}
          comments={byCell.get(target.cell) ?? []}
          onClose={() => { setTarget(null); target.el.querySelector<HTMLElement>('.cd-cmt-btn')?.focus(); }}
        />
      )}
    </CommentsContext.Provider>
  );
}

/** Count of cells with unresolved comments. */
export function useOpenThreadCount() {
  const { byCell } = useComments();
  let n = 0;
  byCell.forEach((list) => { if (list.some((c) => !c.resolved)) n++; });
  return n;
}

/** A table cell that can carry a comment thread. */
export function CommentCell({ cell, label, children, className, ...rest }: {
  cell: string; label: string; children: ReactNode;
} & TdHTMLAttributes<HTMLTableCellElement>) {
  const { byCell, open, openCell, store } = useComments();
  const ref = useRef<HTMLTableCellElement>(null);
  const list = byCell.get(cell);
  const openCount = list?.filter((c) => !c.resolved).length ?? 0;
  const resolvedOnly = !!list?.length && openCount === 0;
  const active = openCell === cell;
  const cls = ['cd-ccell', openCount ? 'cd-ccell--has' : '', resolvedOnly ? 'cd-ccell--resolved' : '', active ? 'cd-ccell--active' : '', className].filter(Boolean).join(' ');
  const show = () => ref.current && open(cell, ref.current, label);

  return (
    <td ref={ref} className={cls} {...rest}>
      {children}
      {store && (
        <button
          type="button"
          className="cd-cmt-btn"
          aria-label={openCount ? `${openCount} comment${openCount > 1 ? 's' : ''} on ${label}` : `Comment on ${label}`}
          title={openCount ? `${openCount} comment${openCount > 1 ? 's' : ''}` : 'Add comment'}
          onClick={(e) => { e.stopPropagation(); show(); }}
        >
          {openCount ? <span className="cd-cmt-btn__count">{openCount}</span> : <Icons.Comment width={13} height={13} />}
        </button>
      )}
    </td>
  );
}

const rel = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
function ago(t: number) {
  const s = (t - Date.now()) / 1000;
  if (Math.abs(s) < 60) return 'just now';
  if (Math.abs(s) < 3600) return rel.format(Math.round(s / 60), 'minute');
  if (Math.abs(s) < 86400) return rel.format(Math.round(s / 3600), 'hour');
  return rel.format(Math.round(s / 86400), 'day');
}

function CommentPopover({ store, anchor, label, cell, comments, onClose }: {
  store: Store; anchor: HTMLElement; label: string; cell: string; comments: CellComment[]; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean }>({ top: -9999, left: -9999, above: false });
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [showResolved, setShowResolved] = useState(false);

  const visible = comments.filter((c) => showResolved || !c.resolved);
  const resolvedCount = comments.filter((c) => c.resolved).length;
  const openIds = comments.filter((c) => !c.resolved).map((c) => c.id);

  const authorKey = comments.map((c) => c.author ?? '').join(',');
  useEffect(() => {
    const ids = [...new Set(comments.map((c) => c.author).filter(Boolean) as string[])];
    store.names(ids).then(setNames).catch(() => {});
  }, [authorKey, store]); // eslint-disable-line react-hooks/exhaustive-deps

  const place = useCallback(() => {
    const r = anchor.getBoundingClientRect();
    const el = ref.current;
    const w = el?.offsetWidth ?? 340, h = el?.offsetHeight ?? 260;
    const vw = window.innerWidth, vh = window.innerHeight;
    const above = r.bottom + 8 + h > vh && r.top - 8 - h > 0;
    const left = Math.min(Math.max(12, r.left), vw - w - 12);
    setPos({ top: above ? r.top - h - 8 : r.bottom + 8, left, above });
  }, [anchor]);

  useLayoutEffect(() => { place(); }, [place, visible.length]);
  useEffect(() => {
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    const table = anchor.closest('.cd-table-wrap');
    table?.addEventListener('scroll', place);
    inputRef.current?.focus();
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      table?.removeEventListener('scroll', place);
    };
  }, [place, anchor]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !anchor.contains(t)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [onClose, anchor]);

  const submit = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true); setError(null);
    try {
      await store.add({ cell, text: text.slice(0, 2000), author: store.myId, createdAt: Date.now(), resolved: false });
      setDraft('');
    } catch (e: any) {
      setError(e?.code === 'quota_exceeded'
        ? 'The comment store is full. Delete old comments, then try again.'
        : 'Your comment was not saved. Check your connection and try again.');
    } finally { setBusy(false); }
  };

  const resolveAll = async () => {
    setBusy(true);
    try { await store.setResolved(openIds, true); } catch { setError('Could not resolve this thread. Try again.'); }
    finally { setBusy(false); }
  };

  return (
    <div
      ref={ref}
      className={`cd-pop${pos.above ? ' cd-pop--above' : ''}`}
      style={{ top: pos.top, left: pos.left }}
      role="dialog"
      aria-label={`Comments on ${label}`}
    >
      <header className="cd-pop__head">
        <span className="cd-pop__icon"><Icons.Comment width={14} height={14} /></span>
        <span className="cd-pop__title" title={label}>{label}</span>
        <Button variant="ghost" size="sm" aria-label="Close comments" onClick={onClose}><Icons.Close width={16} height={16} /></Button>
      </header>

      {visible.length > 0 && (
        <ol className="cd-pop__list">
          {visible.map((c) => {
            const name = c.author ? names[c.author] || (c.author === store.myId ? 'You' : 'Someone') : 'Someone';
            return (
              <li key={c.id} className={`cd-pop__item${c.resolved ? ' is-resolved' : ''}`}>
                <span className="cd-avatar cd-avatar--sm">{name === 'You' ? 'Y' : name.split(' ').map((s) => s[0]).join('').slice(0, 2)}</span>
                <div className="cd-pop__body">
                  <div className="cd-pop__meta">
                    <strong>{name}</strong>
                    <span>{ago(c.createdAt)}</span>
                    {c.resolved && <span className="cd-pop__tag">Resolved</span>}
                    {c.author === store.myId && store.canWrite && (
                      <button type="button" className="cd-pop__delete" onClick={() => store.remove(c.id).catch(() => setError('Could not delete that comment.'))}>
                        Delete
                      </button>
                    )}
                  </div>
                  <p>{c.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      {visible.length === 0 && (
        <p className="cd-pop__empty">{resolvedCount ? 'All comments here are resolved.' : 'No comments on this cell yet.'}</p>
      )}
      {resolvedCount > 0 && (
        <button type="button" className="cd-pop__toggle" onClick={() => setShowResolved((v) => !v)}>
          {showResolved ? 'Hide' : 'Show'} {resolvedCount} resolved
        </button>
      )}

      {store.canWrite ? (
        <form className="cd-pop__form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <TextArea
            ref={inputRef}
            id={`cmt-${cell}`}
            rows={2}
            resize="none"
            maxLength={2000}
            placeholder={visible.length ? 'Reply…' : 'Add a comment…'}
            aria-label="Comment"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit(); } }}
          />
          {error && <p className="cd-pop__error" role="alert">{error}</p>}
          <div className="cd-pop__actions">
            {openIds.length > 0 && (
              <Button variant="ghost" size="sm" onClick={resolveAll} disabled={busy}>Resolve</Button>
            )}
            <span className="cd-pop__hint">{store.mode === 'local' ? 'Saved in this browser' : 'Ctrl + Enter'}</span>
            <Button type="submit" size="sm" loading={busy} disabled={!draft.trim()}>Comment</Button>
          </div>
        </form>
      ) : (
        <p className="cd-pop__empty">You can read comments here but not add them.</p>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../../components/Button';
import { Drawer } from '../../../../components/Drawer';
import { Input } from '../../../../components/Input';
import { Select } from '../../../../components/Select';
import { SECTION_CATALOG, sectionName } from '../../config';
import { clauseLibrary } from '../../data/project';
import { useSA } from '../../hooks/context';
import { newId } from '../../lib/scope';
import { CheckIcon, LibraryIcon, PlusIcon, SearchIcon } from '../../icons';
import { KindBadge } from '../common/Badges';

/** Reuse language from historical Schedule A documents. */
export function ClauseLibraryDrawer() {
  const { ws, ui, can, dispatch, toast } = useSA();
  const open = ui.dialog === 'library';
  const [query, setQuery] = useState('');
  const [sectionKey, setSectionKey] = useState('all');
  const [inserted, setInserted] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSectionKey(ui.librarySectionKey ?? 'all');
      setInserted([]);
    }
  }, [open, ui.librarySectionKey]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clauseLibrary.filter(
      (c) => (sectionKey === 'all' || c.sectionKey === sectionKey) && (!q || c.text.toLowerCase().includes(q) || c.project.toLowerCase().includes(q)),
    );
  }, [query, sectionKey]);

  const insert = (id: string) => {
    const clause = clauseLibrary.find((c) => c.id === id)!;
    dispatch({
      type: 'addItemToKey',
      sectionKey: clause.sectionKey,
      item: { id: newId('i'), text: clause.text, kind: clause.kind, critical: false, tags: [], origin: { type: 'historical', ref: `${clause.project} (${clause.year})` } },
    });
    setInserted((list) => [...list, id]);
    toast.push(`Clause added to ${sectionName(clause.sectionKey)}.`);
  };

  return (
    <Drawer
      open={open}
      onClose={() => ui.setDialog(null)}
      title="Historical clause library"
      icon={<LibraryIcon />}
      size="lg"
      footer={<Button variant="outline" onClick={() => ui.setDialog(null)}>Done</Button>}
    >
      <p className="sa-muted">Language from issued Schedule A documents on similar {ws.meta.trade.toLowerCase()} projects. Inserted clauses can be edited like any other.</p>
      <div className="sa-library__filters">
        <Input size="sm" placeholder="Search clauses or projects" aria-label="Search clauses" value={query} startAdornment={<SearchIcon size={16} />} onChange={(e) => setQuery(e.target.value)} />
        <Select size="sm" aria-label="Section" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)}>
          <option value="all">All sections</option>
          {SECTION_CATALOG.map((s) => (
            <option key={s.key} value={s.key}>{s.name}</option>
          ))}
        </Select>
      </div>
      {results.length === 0 ? (
        <div className="sa-empty-inline">
          <p>No clauses match “{query}”.</p>
          <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setSectionKey('all'); }}>Clear search</Button>
        </div>
      ) : (
        <ul className="sa-library">
          {results.map((c) => {
            const done = inserted.includes(c.id);
            return (
              <li key={c.id} className="sa-library__item">
                <div className="sa-library__meta">
                  <KindBadge kind={c.kind} />
                  <span>{sectionName(c.sectionKey)}</span>
                  <span>·</span>
                  <span>{c.project} {c.year}</span>
                  <span>·</span>
                  <span>Used {c.uses}×</span>
                </div>
                <p className="sa-library__text">{c.text}</p>
                <Button size="sm" variant={done ? 'ghost' : 'outline'} disabled={done || !can.edit} startIcon={done ? <CheckIcon size={16} /> : <PlusIcon size={16} />} onClick={() => insert(c.id)}>
                  {done ? 'Inserted' : 'Insert'}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../components/Button';
import { useSA } from '../../hooks/context';
import { isOpen } from '../../lib/review';
import { newId } from '../../lib/scope';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, LibraryIcon, PlusIcon, SparkleIcon, TrashIcon } from '../../icons';
import type { ScopeSection } from '../../types';
import { ItemEditor } from './ItemEditor';
import { ScopeItemRow } from './ScopeItemRow';

export interface SectionCardProps {
  section: ScopeSection;
  index: number;
  total: number;
}

/** One Schedule A section with its clauses and section-level actions. */
export function SectionCard({ section, index, total }: SectionCardProps) {
  const { ws, ui, can, dispatch, toast } = useSA();
  const [collapsed, setCollapsed] = useState(false);
  const [flash, setFlash] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const highlight = ui.highlight?.sectionKey === section.key ? ui.highlight : null;
  const findings = ws.findings.filter((f) => f.sectionKey === section.key && isOpen(f));
  const sectionId = section.id;
  const bodyId = `${section.id}-body`;

  useEffect(() => {
    if (!highlight) return;
    setCollapsed(false);
    setFlash(true);
    requestAnimationFrame(() => {
      const target = highlight.itemId ? document.getElementById(`item-${highlight.itemId}`) : ref.current;
      (target ?? ref.current)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    const t = window.setTimeout(() => setFlash(false), 1800);
    return () => window.clearTimeout(t);
  }, [highlight]);

  const addItem = () => {
    const id = newId('i');
    dispatch({ type: 'addItem', sectionId, item: { id, text: '', kind: section.key === 'exclusions' ? 'exclusion' : section.key === 'clarifications' ? 'clarification' : 'inclusion', critical: false, tags: [] } });
    ui.setEditingItemId(id);
  };

  return (
    <section ref={ref} className={`sa-section${flash ? ' sa-section--flash' : ''}`} aria-labelledby={`${section.id}-title`}>
      <header className="sa-section__header">
        <button type="button" className="sa-section__toggle" aria-expanded={!collapsed} aria-controls={bodyId} onClick={() => setCollapsed((c) => !c)}>
          <ChevronDownIcon size={16} className="sa-section__chevron" />
          <span className="sa-section__index">{index + 1}.0</span>
          <h3 id={`${section.id}-title`} className="sa-section__title">{section.name}</h3>
          <span className="sa-section__count">{section.items.length} {section.items.length === 1 ? 'item' : 'items'}</span>
        </button>
        {findings.length > 0 && (
          <button type="button" className="sa-section__findings" onClick={() => { ui.openFinding(findings[0].id); ui.setPanelOpen(true); }}>
            <SparkleIcon size={13} /> {findings.length} open {findings.length === 1 ? 'finding' : 'findings'}
          </button>
        )}
        {can.edit && (
          <div className="sa-section__actions" role="group" aria-label={`${section.name} actions`}>
            <button type="button" className="sa-icon-btn" aria-label={`Move ${section.name} up`} disabled={index === 0} onClick={() => dispatch({ type: 'moveSection', sectionId, dir: -1 })}><ArrowUpIcon size={16} /></button>
            <button type="button" className="sa-icon-btn" aria-label={`Move ${section.name} down`} disabled={index === total - 1} onClick={() => dispatch({ type: 'moveSection', sectionId, dir: 1 })}><ArrowDownIcon size={16} /></button>
            <button type="button" className="sa-icon-btn sa-icon-btn--danger" aria-label={`Delete ${section.name}`} onClick={() => { dispatch({ type: 'deleteSection', sectionId }); toast.push(`${section.name} removed.`); }}><TrashIcon size={16} /></button>
          </div>
        )}
      </header>

      {!collapsed && (
        <div id={bodyId} className="sa-section__body">
          {section.items.length === 0 ? (
            <p className="sa-section__empty">No clauses yet. Add one or reuse language from historical scopes.</p>
          ) : (
            <ol className="sa-items">
              {section.items.map((item, i) => {
                const number = `${index + 1}.${i + 1}`;
                return ui.editingItemId === item.id && can.edit ? (
                  <ItemEditor
                    key={item.id}
                    item={item}
                    number={number}
                    onSave={(patch) => { dispatch({ type: 'updateItem', sectionId, itemId: item.id, patch }); ui.setEditingItemId(null); }}
                    onCancel={() => { if (!item.text) dispatch({ type: 'deleteItem', sectionId, itemId: item.id }); ui.setEditingItemId(null); }}
                  />
                ) : (
                  <ScopeItemRow
                    key={item.id}
                    item={item}
                    number={number}
                    canEdit={can.edit}
                    isFirst={i === 0}
                    isLast={i === section.items.length - 1}
                    highlighted={flash && highlight?.itemId === item.id}
                    onEdit={() => ui.setEditingItemId(item.id)}
                    onDuplicate={() => dispatch({ type: 'duplicateItem', sectionId, itemId: item.id, newId: newId('i') })}
                    onMove={(dir) => dispatch({ type: 'moveItem', sectionId, itemId: item.id, dir })}
                    onDelete={() => { dispatch({ type: 'deleteItem', sectionId, itemId: item.id }); toast.push(`Clause ${number} deleted.`); }}
                  />
                );
              })}
            </ol>
          )}
          {can.edit && (
            <div className="sa-section__footer">
              <Button variant="ghost" size="sm" startIcon={<PlusIcon size={16} />} onClick={addItem}>Add clause</Button>
              <Button variant="ghost" size="sm" startIcon={<LibraryIcon size={16} />} onClick={() => ui.openLibrary(section.key)}>Insert historical language</Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

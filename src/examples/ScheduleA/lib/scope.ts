import { SECTION_CATALOG } from '../config';
import type { ScopeItem, ScopeSection } from '../types';

let counter = 0;
/** Ids for items and sections created in the browser. */
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

export const cloneSections = (sections: ScopeSection[]): ScopeSection[] =>
  sections.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i, tags: [...i.tags] })) }));

export function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** Inserts a section where it belongs in the catalog order. */
export function insertSection(sections: ScopeSection[], key: string): ScopeSection[] {
  if (sections.some((s) => s.key === key)) return sections;
  const meta = SECTION_CATALOG.find((s) => s.key === key);
  const section: ScopeSection = { id: newId('sec'), key, name: meta?.name ?? key, items: [] };
  const order = (k: string) => SECTION_CATALOG.findIndex((s) => s.key === k);
  const at = sections.findIndex((s) => order(s.key) > order(key));
  if (at === -1) return [...sections, section];
  return [...sections.slice(0, at), section, ...sections.slice(at)];
}

export function updateSection(
  sections: ScopeSection[],
  sectionId: string,
  fn: (items: ScopeItem[]) => ScopeItem[],
): ScopeSection[] {
  return sections.map((s) => (s.id === sectionId ? { ...s, items: fn(s.items) } : s));
}

export const countItems = (sections: ScopeSection[]) => sections.reduce((n, s) => n + s.items.length, 0);

export const countCritical = (sections: ScopeSection[]) =>
  sections.reduce((n, s) => n + s.items.filter((i) => i.critical).length, 0);

/** "5.1" style clause number for an item. */
export function clauseNumber(sections: ScopeSection[], itemId: string) {
  for (let s = 0; s < sections.length; s++) {
    const i = sections[s].items.findIndex((it) => it.id === itemId);
    if (i !== -1) return `${s + 1}.${i + 1}`;
  }
  return '';
}

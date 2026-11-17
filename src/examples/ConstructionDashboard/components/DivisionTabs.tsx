import { useRef, type KeyboardEvent } from 'react';
import { cx } from '../../../utils/cx';

export interface DivisionTab {
  id: string;
  label: string;
  count: number;
}

export interface DivisionTabsProps {
  tabs: DivisionTab[];
  value: string;
  onChange: (id: string) => void;
  /** Id of the tab panel the tabs control. */
  panelId: string;
}

export const tabId = (panelId: string, id: string) => `${panelId}-tab-${id}`;

/** Tab list with counts. Arrow keys move between tabs (roving tabindex). */
export function DivisionTabs({ tabs, value, onChange, panelId }: DivisionTabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    onChange(tabs[next].id);
  };

  return (
    <div className="cd-tabs" role="tablist" aria-label="Divisions">
      {tabs.map((tab, i) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={tabId(panelId, tab.id)}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className={cx('cd-tabs__tab', selected && 'cd-tabs__tab--selected')}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {tab.label}
            <span className="cd-tabs__count">{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

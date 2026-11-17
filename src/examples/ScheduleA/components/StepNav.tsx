import { useRef, type KeyboardEvent } from 'react';
import { STEPS } from '../config';
import { useSA } from '../hooks/context';
import { readiness, reviewCounts } from '../lib/review';
import { countItems } from '../lib/scope';
import { plural } from '../lib/format';
import { CheckIcon } from '../icons';
import type { StepId } from '../types';

interface StepState {
  done: boolean;
  hint: string;
  issues?: number;
  tone?: 'critical' | 'warning';
}

/** Step-based workflow navigation: vertical rail on desktop, scrolling strip on narrow screens. */
export function StepNav() {
  const { ws, ui } = useSA();
  const listRef = useRef<HTMLOListElement>(null);
  const counts = reviewCounts(ws.findings);
  const items = countItems(ws.sections);
  const checks = readiness(ws);
  const failing = checks.filter((c) => !c.ok).length;
  const ran = ws.runs.language.status === 'complete' && ws.runs.gap.status === 'complete';
  const running = ws.runs.language.status === 'running' || ws.runs.gap.status === 'running';

  const state: Record<StepId, StepState> = {
    details: { done: ws.confirmed.includes('details'), hint: ws.confirmed.includes('details') ? 'Confirmed' : 'To confirm' },
    editor: { done: items > 0, hint: items ? `${items} clauses` : 'Not started' },
    references: { done: ws.confirmed.includes('references') && ws.selectedDocIds.length > 0, hint: `${ws.selectedDocIds.length} selected`, issues: ws.selectedDocIds.length ? undefined : 1, tone: 'warning' },
    review: {
      done: ran && counts.critical === 0,
      hint: running ? 'Running…' : ran ? `${counts.open} open` : 'Not run',
      issues: counts.critical || undefined,
      tone: counts.critical ? 'critical' : 'warning',
    },
    export: {
      done: ws.confirmed.includes('export'),
      hint: ws.confirmed.includes('export') ? `Exported ${ws.currentVersion}` : failing ? `${plural(failing, 'check')} open` : 'Ready',
    },
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
    const next = (index + dir + STEPS.length) % STEPS.length;
    listRef.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  };

  return (
    <nav className="sa-steps" aria-label="Schedule A workflow">
      <ol ref={listRef} className="sa-steps__list">
        {STEPS.map((step, index) => {
          const s = state[step.id];
          const active = ui.step === step.id;
          return (
            <li key={step.id}>
              <button
                type="button"
                className={`sa-step${active ? ' sa-step--active' : ''}${s.done ? ' sa-step--done' : ''}`}
                aria-current={active ? 'step' : undefined}
                onClick={() => ui.setStep(step.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
              >
                <span className="sa-step__marker" aria-hidden="true">
                  {s.done ? <CheckIcon size={14} /> : index + 1}
                </span>
                <span className="sa-step__text">
                  <span className="sa-step__label">{step.label}</span>
                  <span className="sa-step__hint">{s.hint}</span>
                </span>
                {s.issues ? (
                  <span className={`sa-step__issues sa-step__issues--${s.tone}`} aria-label={`${s.issues} critical or blocking issues`}>
                    {s.issues}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

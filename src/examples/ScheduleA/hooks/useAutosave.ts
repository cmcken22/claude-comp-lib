import { useEffect, useRef, useState } from 'react';
import type { SaveState } from '../types';

/** Simulates autosave: every revision change shows "Saving…" then "Saved". */
export function useAutosave(revision: number, delay = 800) {
  const [state, setState] = useState<SaveState>('saved');
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setState('saving');
    const t = window.setTimeout(() => setState('saved'), delay);
    return () => window.clearTimeout(t);
  }, [revision, delay]);

  return state;
}

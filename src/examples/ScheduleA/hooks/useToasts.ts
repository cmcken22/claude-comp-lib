import { useCallback, useEffect, useRef, useState } from 'react';

export interface Toast {
  id: number;
  tone: 'success' | 'info' | 'error';
  message: string;
}

/** A small queue of auto-dismissing confirmations. */
export function useToasts(timeout = 4500) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const timers = useRef<number[]>([]);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (message: string, tone: Toast['tone'] = 'success') => {
      const id = ++seq.current;
      setToasts((t) => [...t.slice(-2), { id, tone, message }]);
      timers.current.push(window.setTimeout(() => dismiss(id), timeout));
    },
    [dismiss, timeout],
  );

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  return { toasts, push, dismiss };
}

import { useEffect, useState } from 'react';

/** Track a CSS media query. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export type Theme = 'light' | 'dark';

/** Light/dark theme, starting from the OS preference, applied to <html data-theme>. */
export function useTheme() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState<Theme | null>(null);
  const active: Theme = theme ?? (prefersDark ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = active;
  }, [active]);

  return [active, setTheme] as const;
}

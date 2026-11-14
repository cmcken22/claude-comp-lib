import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75,
  strokeLinecap: 'round', strokeLinejoin: 'round', width: 18, height: 18,
  'aria-hidden': true, focusable: false,
};
const icon = (d: React.ReactNode) => (p: SVGProps<SVGSVGElement>) => <svg {...base} {...p}>{d}</svg>;

export const Icons = {
  Logo: icon(<><path d="M3 21h18" /><path d="M5 21V9l7-5 7 5v12" /><path d="M9 21v-6h6v6" /></>),
  Dashboard: icon(<><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>),
  Projects: icon(<><path d="M2 20h20" /><path d="M4 20V10l4-2v12" /><path d="M8 8l6-4v16" /><path d="M14 10h6v10" /></>),
  Crew: icon(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0113 0" /><path d="M16 4.5a3.5 3.5 0 010 7" /><path d="M18 14a6.5 6.5 0 013.5 6" /></>),
  Equipment: icon(<><path d="M3 17h10V9H7L3 13z" /><circle cx="6" cy="18" r="2" /><circle cx="12" cy="18" r="2" /><path d="M13 13l4-8 4 2-3 6" /></>),
  Safety: icon(<><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>),
  Docs: icon(<><path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z" /><path d="M14 3v5h5" /><path d="M8 13h8M8 17h5" /></>),
  Budget: icon(<><path d="M12 2v20" /><path d="M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>),
  Calendar: icon(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  Settings: icon(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></>),
  Search: icon(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>),
  Bell: icon(<><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 003.4 0" /></>),
  Plus: icon(<path d="M12 5v14M5 12h14" />),
  Menu: icon(<path d="M4 6h16M4 12h16M4 18h16" />),
  Close: icon(<path d="M6 6l12 12M18 6L6 18" />),
  Download: icon(<><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></>),
  ChevronUp: icon(<path d="M6 15l6-6 6 6" />),
  ChevronDown: icon(<path d="M6 9l6 6 6-6" />),
  ChevronLeft: icon(<path d="M15 6l-6 6 6 6" />),
  ChevronRight: icon(<path d="M9 6l6 6-6 6" />),
  Sort: icon(<path d="M8 9l4-4 4 4M8 15l4 4 4-4" />),
  Warning: icon(<><path d="M12 3l10 18H2z" /><path d="M12 10v4M12 17.5v.01" /></>),
  Comment: icon(<path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1121 12z" />),
  Up: icon(<path d="M7 17L17 7M9 7h8v8" />),
  Down: icon(<path d="M7 7l10 10M17 9v8H9" />),
};

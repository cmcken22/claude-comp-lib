// Inline icons used by the construction dashboard example.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  width: 16,
  height: 16,
  'aria-hidden': true,
  focusable: false,
};

export const CommentIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8M8 13h5" /></svg>
);
export const DownloadIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
);
export const MoreIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>
);
export const FilterIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 6h18M7 12h10M10 18h4" /></svg>
);
export const ColumnsIcon = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></svg>
);
export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
export const SortIcon = ({ direction, ...p }: IconProps & { direction?: 'asc' | 'desc' }) => (
  <svg {...base} width={12} height={12} {...p}>
    <path d="M8 9l4-4 4 4" opacity={direction === 'desc' ? 0.3 : 1} />
    <path d="M16 15l-4 4-4-4" opacity={direction === 'asc' ? 0.3 : 1} />
  </svg>
);
export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M15 6l-6 6 6 6" /></svg>
);
export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9 6l6 6-6 6" /></svg>
);
export const TrendUpIcon = (p: IconProps) => (
  <svg {...base} width={14} height={14} {...p}><path d="M3 17l6-6 4 4 8-8M15 7h6v6" /></svg>
);
export const CalendarIcon = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const BellIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);
export const HelpIcon = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></svg>
);
export const FolderIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
);

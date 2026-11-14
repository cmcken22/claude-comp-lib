import type { SVGProps } from 'react';

// Stroke icons drawn on a 24×24 grid. Each entry is one SVG path.
const paths = {
  home: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
  building: 'M4 3h16v18H4zM9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3',
  calendar: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
  calendarCheck: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4M9 15l2 2 4-4',
  users: 'M12.5 8a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6',
  truck: 'M2 6h11v10H2zM13 10h4l4 4v2h-8M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0M19 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  clipboard: 'M5 4h14v17H5zM9 4V3h6v1M9 11h6M9 15h4',
  file: 'M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  settings: 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  collapse: 'M11 17l-5-5 5-5M18 17l-5-5 5-5',
  hardHat: 'M3 17h18v2H3zM5 17a7 7 0 0 1 14 0M10 10V6h4v4',
  search: 'M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0M20 20l-3.5-3.5',
  help: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0',
  plus: 'M12 5v14M5 12h14',
  download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
  upload: 'M12 15V3M7 8l5-5 5 5M5 21h14',
  dollar: 'M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  alert: 'M12 3l9.5 17h-19zM12 10v4M12 17h.01',
  printer: 'M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z',
  comment: 'M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z',
  close: 'M6 6l12 12M18 6L6 18',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
} as const;

export type IconName = keyof typeof paths;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

/** Decorative icon. Give the surrounding control an accessible name. */
export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}

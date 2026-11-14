# Ironbridge construction dashboard

A React + TypeScript (Vite) dashboard built on the **claude-comp-lib** component library.
The library is bundled with the project as a prebuilt package in `vendor/claude-comp-lib`,
so the app installs and builds on its own, with no access to the library's repository.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

Node 18 or newer.

## What's in it

- **App shell** (`AppShell`, `Sidebar`, `Navbar` from the library): a sidebar that stays in view
  as the page scrolls and collapses to an icon rail (bottom-of-menu button or the ☰ button), a
  slide-out drawer below 1024px, and a light/dark theme toggle.
- **Stat cards** (`StatCard`, `Progress`) with hover animation.
- **Projects table** (`src/components/ProjectsTable.tsx`) built from the library's `Input`,
  `Select`, `Checkbox`, `Badge`, `Progress` and `Button`, styled with its `ds-data-table` styles:
  search, status/phase/manager filters, sortable columns, row selection with bulk actions,
  infinite scroll with a sticky header, and **cell-level comments** in a side panel.
- **Quick-actions toolbar** on the right (a horizontal bar on small screens).
- **Interactive background** (`src/components/ParticleField.tsx`): a canvas particle field that
  reacts to the mouse, shockwaves on click, and parallax layers on scroll. It is switched off for
  people who prefer reduced motion.

## Things that are placeholders

- `src/data/projects.ts` is sample data, and some numbers on the stat cards are constants at the
  top of `src/components/StatCards.tsx`.
- Infinite scroll fakes a short network delay (`LOAD_DELAY_MS` in `ProjectsTable.tsx`); swap in a
  real paged fetch.
- Comments live in React state only: they are lost on reload and every new comment is posted as
  `CURRENT_USER`. Persist them through your API.
- New project, Export, Reassign manager, the period picker, the top search bar and most
  quick actions are not wired up. "Print dashboard" calls `window.print()`.

## The vendored library

`vendor/claude-comp-lib` holds the library's built output (`dist/`: ES module, CommonJS, type
declarations and `styles.css`) plus its SCSS tokens (`tokens/`). The app depends on it with
`"claude-comp-lib": "file:./vendor/claude-comp-lib"` and imports it like any package:

```ts
import 'claude-comp-lib/styles.css';
import { AppShell, Button } from 'claude-comp-lib';
```

To pick up library changes, rebuild and re-copy it, then reinstall:

```bash
npm run vendor:update -- /path/to/claude-comp-lib
npm install
```

With no path, the script assumes this folder sits at `exports/construction-dashboard` inside the
library's repository.

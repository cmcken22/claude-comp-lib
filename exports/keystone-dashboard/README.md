# Keystone Build — Operations Dashboard

A dark-mode construction operations dashboard written in React + TypeScript (Vite), built on the `claude-comp-lib` component library.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then production build to dist/
npm run preview    # serve the production build
```

Requires Node 18+.

## Component library (vendored)

`claude-comp-lib` is bundled in `vendor/claude-comp-lib/` as a prebuilt package and installed from there (`"claude-comp-lib": "file:./vendor/claude-comp-lib"`), so the project needs no access to the library's repository or a registry.

| Path | What it is |
| --- | --- |
| `vendor/claude-comp-lib/index.js` / `index.cjs` | Compiled components (ESM + CommonJS) |
| `vendor/claude-comp-lib/**/*.d.ts` | Type definitions |
| `vendor/claude-comp-lib/styles.css` | Component styles and design-token CSS variables (imported once in `src/main.tsx`) |
| `vendor/claude-comp-lib/tokens/` | SCSS token functions and mixins (`@use 'claude-comp-lib/tokens' as *;` in `src/dashboard.scss`) |

Components used: `PageLayout`, `Button`, `Input`, `Select`, `Checkbox`, `Switch`, `TextArea`.

To update the library, rebuild it in its own repository (`npm run build`), copy the contents of its `dist/` (without `.map` files) into `vendor/claude-comp-lib/`, copy `src/tokens/*.scss` into `vendor/claude-comp-lib/tokens/`, then run `npm install` here again.

## Project layout

```
src/
  main.tsx          Entry: library styles, dashboard styles, <App />
  App.tsx           Sidebar (collapsible), top bar, page layout
  StatCards.tsx     KPI cards with sparklines (Spark.tsx)
  ProjectTable.tsx  Filtering, sorting, selection, infinite scroll
  comments.tsx      Cell-level comment threads
  Skyline.tsx       Parallax job-site header
  Field.tsx         Mouse-reactive background canvas
  Fireworks.tsx     Click fireworks overlay
  data.ts           20 hand-written + 180 generated sample projects (seeded, deterministic)
  format.ts         Money and date helpers
  icons.tsx         Inline SVG icons
  dashboard.scss    Dashboard styles, built from the library's tokens
```

## Notes

- **Sample data.** All projects, people and figures are fictional examples. Replace `src/data.ts` with your own data source.
- **Cell comments.** Inside a claude.ai artifact, comments are shared through the artifact's database. Run anywhere else, they are saved in the browser's `localStorage` (the comment box says "Saved in this browser"). To share them between users, replace `localStore()` in `src/comments.tsx` with calls to your own API.
- **Motion.** The parallax, background field, fireworks and hover effects all tone down when the OS "reduce motion" setting is on.
- **Buttons without actions.** "New project", "Weekly report", "Export" and "Assign manager" are placeholders with no handlers yet.

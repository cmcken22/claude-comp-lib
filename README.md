# claude-comp-lib

React + TypeScript component library styled with SCSS design tokens, showcased in Storybook.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Storybook at http://localhost:6006 |
| `npm run build` | Type-check, then build the library to `dist/` (ESM + CJS + `.d.ts` + `styles.css`) |
| `npm run build-storybook` | Static Storybook in `storybook-static/` |

## Components

`Button` · `Input` · `TextArea` · `Select` · `Checkbox` · `RadioGroup` / `Radio` · `Switch` · `FormField` / `Label` · `Badge` · `Progress` · `Card` / `StatCard` · `DataTable` · `PageLayout` · `AppShell` / `Sidebar` / `Navbar`

- `FormField` wires label, hint and error to the control inside it (`id`, `aria-describedby`, `aria-invalid`, `required`, `disabled`) through context.
- `PageLayout` has a `header` slot, a body (`children`), an optional `footer`, a `maxWidth`, an optional sticky header, and a skip link.
- `AppShell` frames an app with a `Sidebar` (pinned from 1024px, an off-canvas drawer below) and a sticky `Navbar`, which shows the drawer toggle on small screens.
- `DataTable` does client-side search, dropdown filters, column sorting, row selection with bulk actions, and pagination.
- **Examples/Construction Dashboard** in Storybook puts these together into a full page.
- Every control uses `forwardRef` and passes through its native HTML attributes.

## Design tokens

```
src/tokens/
  _primitives.scss  Tier 1: raw palette + scales (space, radius, type, shadow, motion…)
  _semantic.scss    Tier 2: purpose-named colors per theme (light, dark); themes are checked for parity
  _tokens.scss      Flattens tiers into emit-ready maps + the list of valid names
  _functions.scss   token('name') → var(--ds-name), and fails the build on unknown names
  _mixins.scss      focus-ring, control-surface, text(), transition(), breakpoint-up()…
src/styles/
  _theme.scss       Emits CSS custom properties for :root, [data-theme='dark'], prefers-color-scheme
```

Tier 3 lives in each component's SCSS as private custom properties (`--_bg`, `--_height`). Variants and sizes only override those properties.

Switch themes by setting `data-theme="light" | "dark"` on any ancestor. With no attribute, the OS preference applies.

## Consuming

```tsx
import 'claude-comp-lib/styles.css';
import { Button, FormField, Input } from 'claude-comp-lib';
```

```scss
@use 'claude-comp-lib/tokens' as *;
.card { padding: token('space-6'); background: token('color-bg-surface'); }
```

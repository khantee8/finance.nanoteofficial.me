# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **This is Next.js 16 with React 19.** APIs and conventions differ from training data. Read `node_modules/next/dist/docs/` before writing Next.js-specific code.

## Commands

```bash
npm run dev          # dev server — http://localhost:3000 (Turbopack)
npm run build        # production build
npm run start        # serve production build
npx tsc --noEmit    # type-check only (no build output)
```

No test runner is configured. TypeScript strict mode is on — `npx tsc --noEmit` is the verification step after every change.

## Architecture

### SPA pattern inside App Router

The entire app is a single-page application rendered from `app/page.tsx`. There is **one route** — `"use client"` owns everything. The `Shell` component manages all global state and passes it down via a render-prop:

```
app/page.tsx (auth gate: ScreenLogin → Shell)
└── Shell (view, route, persona, ccy, dark, density, aiOpen)
    ├── sidebar + topbar (navigation, toggles)
    └── render prop → page.tsx switches on {route, view} → mounts screen
```

`Shell` is the only stateful container. Screens receive `{ ccy, persona, onNav }` and are otherwise self-contained with their own `useState`/`useMemo`.

### Three views, three nav sets

`Shell.tsx` defines three nav arrays — `NAV_ADVISOR`, `NAV_CLIENT`, `NAV_ADMIN` — and derives `RouteId` as their union. The view toggle in the topbar switches between them. Route reset on view-switch is handled by a `useEffect` watching `view`.

| View | Entry route | Nav array |
|---|---|---|
| `advisor` | `Dashboard` | `NAV_ADVISOR` |
| `client` | `ClientHome` | `NAV_CLIENT` |
| `admin` | `AdminHome` | `NAV_ADMIN` |

To add a new screen: (1) add an entry to the relevant nav array in `Shell.tsx`, (2) create `components/screens/Screen<Name>.tsx`, (3) add the route case in `app/page.tsx`.

### Data layer — all mock, no backend

`lib/data.ts` exports a single `DATA: AppData` object (typed in `lib/types.ts`) containing all mock data. Everything is in-memory — there is no database, no fetch calls to a data API, no persistence.

- `DATA.PERSONAS` — three client profiles keyed by `PersonaKey` (`conservative` | `balanced` | `aggressive`). Most screens read from the active persona.
- `DATA.ALLOC`, `DATA.HOLDINGS`, `DATA.PERF`, `DATA.GOALS`, `DATA.REBALANCE` — per-persona arrays.
- `DATA.CLIENTS`, `DATA.TASKS`, `DATA.MEETINGS`, `DATA.REPORTS`, `DATA.COMPLIANCE`, `DATA.NEWS` — advisor-level shared data.
- `DATA.FX` — exchange rate multipliers relative to THB. Apply as `value * DATA.FX[ccy]` to convert.
- `DATA.fmt` — `money()`, `moneyFull()`, `pct()`, `pctAbs()` formatters. Use these everywhere — do not inline number formatting.

### UI components (`components/ui.tsx`)

All shared primitives live in one file. Key exports:

| Component | Purpose |
|---|---|
| `Icon` | SVG stroke icons — 30+ names, see `IconName` union for valid values |
| `Money` | Currency-aware formatted value; applies FX automatically |
| `Delta` | Coloured up/down/flat percentage chip |
| `AreaPerf` | ResizeObserver area chart; accepts `series[]`, optional `periods` filter and `showNominalToggle` |
| `Sparkline` | Mini trend line with hover tooltip |
| `Donut` | SVG donut chart with optional per-segment hover labels |
| `ProgressRing` | Semicircle progress arc |
| `HBar` | Labelled horizontal bar chart |
| `ScatterPlot` | Risk/return scatter with hover |
| `GaugeChart` | Semicircular needle gauge with coloured zones |
| `Tabs`, `Seg`, `FilterPill` | Navigation primitives |

All charts are pure SVG — no charting library dependency. `AreaPerf` uses `ResizeObserver` to fill its container width; always place it inside a width-constrained parent.

### Styling — CSS custom properties, no Tailwind utilities on screens

`app/globals.css` defines all design tokens as CSS custom properties on `:root`. Dark mode overrides are on `.dark` (toggled on `<html>`). Compact density overrides are on `.density-compact`.

Use CSS class names defined in `globals.css` for layout (`.shell`, `.card`, `.card-head`, `.grid-4`, `.metric`, `.tbl`, `.tabs`, `.btn`, `.chip`, `.kvs`, etc.). Use inline `style={{ color: "var(--ink-3)" }}` for one-off token values. Do **not** add Tailwind utility classes to screen components — Tailwind is not used in the app layer.

Key token groups:
- Colours: `--accent`, `--pos`, `--neg`, `--warn` (each has `-soft` and `-deep` variants)
- Surfaces: `--bg`, `--surface`, `--surface-2`, `--border`, `--border-strong`
- Text: `--ink`, `--ink-2`, `--ink-3`, `--ink-4`
- Typography: `--sans` (Plus Jakarta Sans), `--mono` (JetBrains Mono)

### AI assistant (`app/api/ai/route.ts`)

POST endpoint — validates input (max 1000 chars, persona allowlist), reads `ANTHROPIC_API_KEY` from env server-side, calls `claude-haiku-4-5-20251001` with 300 max tokens. Returns `{ reply: string }`. Gracefully degrades when the key is absent. The client-side panel is `components/AIPanel.tsx`.

### Security headers (`next.config.ts`)

CSP, HSTS, X-Frame-Options, nosniff, and Referrer-Policy are applied globally via `next.config.ts` `headers()`. The CSP allows `connect-src https://api.anthropic.com` (for the AI route) and `font-src https://fonts.gstatic.com`.

## Context — Thai financial market

All monetary values are in **THB** by default. Currency switcher converts display only — underlying data stays in THB. The platform targets Thai SEC-regulated advisory practices with PDPA compliance context. Three persona clients (Anucha/conservative, Somchai/balanced, Nattaya/aggressive) represent the real client personas used throughout demos.

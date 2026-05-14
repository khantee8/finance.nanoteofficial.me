# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **This is Next.js 16 with React 19.** APIs and conventions differ from training data. Read `node_modules/next/dist/docs/` before writing Next.js-specific code.

## Commands

```bash
npm run dev          # dev server — http://localhost:3001 (port 3000 is taken by another project)
npm run build        # production build
npm run start        # serve production build
npx tsc --noEmit     # type-check only — run after every change
```

No test runner is configured. `npx tsc --noEmit` is the verification step after every change, before every commit.

## Architecture

### Auth gate (v0.3+)

Authentication is handled by `@auth0/nextjs-auth0` v4. The middleware file is `proxy.ts` (Next.js 16 uses `proxy.ts`, not `middleware.ts`). Auth routes are at `/auth/*` (not `/api/auth/*`).

```
Request
  └── proxy.ts (Next.js 16 edge middleware)
        ├── /auth/*, /login → auth0.middleware() [public]
        └── everything else → require session or redirect to /login

app/page.tsx (server component)
  ├── getRole() → reads role from ID token (lib/auth.ts)
  ├── pending  → <ScreenPending />
  ├── advisor  → <AppShell initialView="advisor" />
  ├── client   → <AppShell initialView="client" />
  └── admin    → <AppShell initialView="admin" />  ← starts in advisor view, footer link unlocks admin console
```

**Critical:** `@auth0/nextjs-auth0` v4 strips custom namespace claims from `session.user`. The role claim (`https://finance.nanoteofficial.me/role`) must be read by decoding `session.tokenSet.idToken` directly — see `lib/auth.ts`.

### SPA pattern inside App Router

`app/page.tsx` is a server component (auth + role check only). All client-side state lives in `AppShell` → `Shell`:

```
app/page.tsx (server — reads role, renders AppShell or ScreenPending)
└── components/AppShell.tsx (client — owns render prop, all screen imports)
    └── components/Shell.tsx (client — view, route, persona, ccy, dark, aiOpen state)
        ├── sidebar + topbar
        └── render prop → AppShell switches on {route, view} → mounts screen
```

`Shell` is the only stateful container. Screens receive `{ ccy, persona, onNav }` and manage their own local state. Do **not** lift screen state into Shell.

**Server → client boundary rule:** never pass functions as props from server to client components. `app/page.tsx` passes only serialisable values (`initialView` string) to `AppShell`.

### Three views, three nav sets

`Shell.tsx` defines `NAV_ADVISOR`, `NAV_CLIENT`, `NAV_ADMIN` and derives `RouteId` as their union. The view toggle was removed in v0.3 — users are locked to their Auth0 role.

| Role | `initialView` passed | Shell starts in | Admin console |
|---|---|---|---|
| `advisor` | `"advisor"` | advisor | — |
| `client` | `"client"` | client | — |
| `admin` | `"admin"` | advisor | gear icon in sidebar footer |

Shell initialises `view` state as `"advisor"` when `initialView === "admin"`. The footer gear link is only rendered when `initialView === "admin"`.

To add a new screen: (1) add entry to the relevant nav array in `Shell.tsx`, (2) create `components/screens/Screen<Name>.tsx`, (3) add the route case in `components/AppShell.tsx`.

### Data layer — all mock, no backend

`lib/data.ts` exports a single `DATA: AppData` object (typed in `lib/types.ts`). No database, no API calls, no persistence.

- `DATA.PERSONAS` — three profiles keyed by `PersonaKey` (`conservative` | `balanced` | `aggressive`)
- `DATA.ALLOC`, `DATA.HOLDINGS`, `DATA.PERF`, `DATA.GOALS`, `DATA.REBALANCE` — per-persona
- `DATA.CLIENTS`, `DATA.TASKS`, `DATA.MEETINGS`, `DATA.REPORTS`, `DATA.COMPLIANCE`, `DATA.NEWS` — advisor-level
- `DATA.FX` — exchange rate multipliers relative to THB. Convert with `value * DATA.FX[ccy]`
- `DATA.fmt` — `money()`, `moneyFull()`, `pct()`, `pctAbs()` — use these everywhere, never inline number formatting

### UI components (`components/ui.tsx`)

All shared primitives in one file. Key exports: `Icon` (30+ SVG stroke icons — see `IconName` union), `Money`, `Delta`, `AreaPerf` (ResizeObserver area chart), `Sparkline`, `Donut`, `ProgressRing`, `HBar`, `ScatterPlot`, `GaugeChart`, `Tabs`, `Seg`, `FilterPill`.

All charts are pure SVG — no charting library. `AreaPerf` uses `ResizeObserver` — always place it inside a width-constrained parent.

### Styling

`app/globals.css` defines all design tokens as CSS custom properties on `:root`. Dark mode on `.dark` (toggled on `<html>`). Compact density on `.density-compact`.

Use CSS class names from `globals.css` (`.shell`, `.card`, `.card-head`, `.grid-4`, `.metric`, `.tbl`, `.btn`, `.chip`, `.kvs`, etc.). Use `style={{ color: "var(--ink-3)" }}` for one-off tokens. **Do not add Tailwind utility classes to screen components.**

Key tokens: `--accent`, `--pos`, `--neg`, `--warn` (each with `-soft`/`-deep`), surfaces `--bg`/`--surface`/`--surface-2`/`--border`, text `--ink` through `--ink-4`, fonts `--sans` / `--mono`.

### AI assistant

`app/api/ai/route.ts` is **disabled until v1** — returns a static stub message. Do not re-enable without explicit instruction. The client panel is `components/AIPanel.tsx`.

### Security headers

CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy set in `next.config.ts` `headers()`. CSP `connect-src` includes `https://nanoteofficial.au.auth0.com`. Any new external API domain must be added to CSP before deploying.

## Auth0 tenant

- Tenant: `nanoteofficial.au.auth0.com`
- Callback URL: `https://finance.nanoteofficial.me/auth/callback`
- Custom claim namespace: `https://finance.nanoteofficial.me/role`
- Role stored in `app_metadata.role` (not `user_metadata`) — injected into ID token via Post-Login Action
- Env vars: `AUTH0_SECRET`, `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `APP_BASE_URL`

## Context — Thai financial market

All monetary values in **THB** by default. Currency switcher converts display only. Three demo personas: Anucha (conservative), Somchai (balanced), Nattaya (aggressive). Platform targets Thai SEC-regulated advisory practices with PDPA compliance context.

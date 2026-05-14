# NaNote Finance v0.3 — Implementation Plan

**Spec:** `2026-05-14-v03-auth0-design.md`  
**Date:** 2026-05-14

Batches are ordered so each one is independently verifiable before the next starts. Do not skip ahead.

---

## Pre-flight checklist (do before any code)

- [ ] Create Auth0 account at auth0.com (free tier is sufficient)
- [ ] Create a new tenant (e.g. `nanote-finance`)
- [ ] Create a Regular Web App → copy `CLIENT_ID` and `CLIENT_SECRET`
- [ ] Enable Google OAuth2 social connection
- [ ] Enable Instagram connection (requires Facebook Developer App with Instagram Basic Display API)
- [ ] Enable Username-Password-Authentication (email/password)
- [ ] Set Callback URL: `https://finance.nanoteofficial.me/api/auth/callback, http://localhost:3001/api/auth/callback`
- [ ] Set Logout URL: `https://finance.nanoteofficial.me, http://localhost:3001`
- [ ] Set Allowed Web Origins: `https://finance.nanoteofficial.me, http://localhost:3001`
- [ ] Add Post-Login Action (paste JS from spec, deploy it)
- [ ] Generate `AUTH0_SECRET`: run `openssl rand -hex 32`
- [ ] Add all 5 env vars to `.env.local`
- [ ] Add all 5 env vars to Vercel (Settings → Environment Variables)

---

## Batch 1 — SDK + API route + CSP

**Goal:** Auth0 is wired up and the callback URL works. Nothing visible changes yet.

### Steps

1. **Install SDK**
   ```bash
   cd /project/src/finance.nanoteofficial.me
   npm install @auth0/nextjs-auth0
   ```

2. **Create `app/api/auth/[auth0]/route.ts`**
   ```ts
   import { handleAuth } from "@auth0/nextjs-auth0";
   export const GET = handleAuth();
   ```

3. **Update `next.config.ts`** — add Auth0 tenant to CSP:
   - `connect-src`: add `https://<tenant>.auth0.com`
   - `frame-src`: add `https://<tenant>.auth0.com`

4. **Verify:** `npx tsc --noEmit` → clean. `npm run build` → clean.

5. **Test:** Visit `http://localhost:3001/api/auth/login` → should redirect to Auth0 login page.

---

## Batch 2 — Middleware

**Goal:** Unauthenticated visitors are redirected to `/login`. Authenticated users pass through.

### Steps

1. **Create `middleware.ts`** at project root:
   ```ts
   import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

   export default withMiddlewareAuthRequired();

   export const config = {
     matcher: [
       "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
     ],
   };
   ```

2. **Create `app/login/page.tsx`** — public page that renders `<ScreenLogin />`:
   ```ts
   import { ScreenLogin } from "@/components/screens/ScreenLogin";
   export default function LoginPage() {
     return <ScreenLogin />;
   }
   ```
   Remove `"use client"` — this is a server page that just renders the client component.

3. **Verify:** `npx tsc --noEmit` → clean.

4. **Test:**
   - Visit `http://localhost:3001` without a session → should redirect to `/login`
   - Visit `http://localhost:3001/login` → should show the login card (no redirect loop)

---

## Batch 3 — Role helper + server-side page

**Goal:** `app/page.tsx` reads the Auth0 session and routes by role.

### Steps

1. **Create `lib/auth.ts`**:
   ```ts
   import { getSession } from "@auth0/nextjs-auth0";

   export type Role = "advisor" | "client" | "admin" | "pending";

   export async function getRole(): Promise<Role> {
     const session = await getSession();
     if (!session?.user) return "pending";
     const role = session.user["https://finance.nanoteofficial.me/role"];
     if (role === "advisor" || role === "client" || role === "admin") return role;
     return "pending";
   }
   ```

2. **Rewrite `app/page.tsx`** as a server component:
   - Remove `"use client"`, `useState`, `ScreenLogin` import
   - Call `getRole()` at the top
   - Render `<ScreenPending />` for `pending`
   - Render `<Shell initialView={role}>` with all existing route cases for `advisor`/`client`/`admin`
   - Keep all existing screen imports and route switch logic unchanged

3. **Verify:** `npx tsc --noEmit` → clean.

---

## Batch 4 — Pending screen

**Goal:** Users with no approved role see a clear holding screen with a logout button.

### Steps

1. **Create `components/screens/ScreenPending.tsx`**:
   - Same left panel as `ScreenLogin` (brand + tagline + feature list)
   - Right panel: centred card with:
     - NaNote logo mark
     - Heading: "Account pending approval"
     - Body: "Your account has been created. An admin will review and assign your access role. This usually takes less than 24 hours."
     - Logout button → links to `/api/auth/logout`
     - Footer: "Wrong account? Sign in with a different account" → `/api/auth/logout`
   - No `useState` needed — static

2. **Verify:** `npx tsc --noEmit` → clean.

3. **Test:** Create a test user in Auth0 with no `app_metadata.role` → log in → should see pending screen.

---

## Batch 5 — Login screen: real redirects

**Goal:** Login buttons trigger real Auth0 OAuth flows. Role tabs removed.

### Steps

1. **Update `components/screens/ScreenLogin.tsx`**:
   - Remove `stage`, `loading`, `handleAuth` state and logic
   - Remove role tab UI (`login-role-tabs`, `login-role-blurb`, `ROLE_COPY`)
   - Add `useRouter` from `next/navigation`
   - Replace button `onClick` handlers:
     - Google → `router.push("/api/auth/login?connection=google-oauth2")`
     - Facebook → `router.push("/api/auth/login?connection=facebook")`
     - Instagram → `router.push("/api/auth/login?connection=instagram")`
     - Email submit → `router.push("/api/auth/login?login_hint=" + encodeURIComponent(email))`
   - Keep the full card layout, social SVG icons, `divlbl`, `fld` inputs, legal text — only handlers change
   - Remove `type Role` and `onLogin` prop — no longer needed

2. **Update `app/login/page.tsx`** — remove the `onLogin` prop (no longer exists).

3. **Verify:** `npx tsc --noEmit` → clean.

4. **Test:** Click Google button → redirects to Google OAuth → completes → lands on dashboard.

---

## Batch 6 — Shell: remove view toggle, add admin footer link

**Goal:** Users are locked to their role. Admin has a discreet footer link to the console.

### Steps

1. **Update `components/Shell.tsx`**:

   **Remove** the view toggle from the topbar:
   ```tsx
   // DELETE this entire block:
   <div className="viewtoggle">
     <button ...>Advisor</button>
     <button ...>Client</button>
     <button ...>Admin</button>
   </div>
   ```
   Also remove the persona `<select>` for non-advisor views (keep it for advisor).

   **Remove** `setView` calls — `view` is set once from `initialView` prop and never changes.

   **Add** admin footer link in `sidebar-foot`, after the gear icon, only when `view === "admin"` is reachable (i.e. render it when `initialView === "admin"`):
   ```tsx
   {initialView === "admin" && (
     <div
       className="nav-item"
       style={{ opacity: view === "admin" ? 1 : 0.45, cursor: "pointer" }}
       onClick={() => { setView("admin"); setRoute("Admin"); }}
       title="Admin console"
     >
       <Icon name="gear" size={14}/>
     </div>
   )}
   ```
   Keep the existing gear icon in the foot — the admin link sits beside it.

2. **Verify:** `npx tsc --noEmit` → clean.

3. **Test:**
   - Log in as advisor → no view toggle visible, stuck to advisor nav
   - Log in as admin → no toggle, but small gear link in footer → click → Admin console opens

---

## Batch 7 — End-to-end test + deploy

**Goal:** Full flow works on production.

### Steps

1. `npx tsc --noEmit` → must be clean
2. `npm run build` → must be clean
3. Run `/base-deployment v0.3` to commit, confirm, and push to Vercel
4. After deploy, test on `https://finance.nanoteofficial.me`:
   - Unauthenticated visit → redirected to `/login` ✓
   - Google login → OAuth flow → role-correct dashboard ✓
   - Pending user → pending screen ✓
   - Admin login → advisor view + footer gear link → admin console ✓
   - Logout → back to `/login` ✓

---

## Rollback

If anything goes wrong after deploy:

```bash
git revert HEAD --no-edit
git push origin main
```

Vercel will redeploy v0.2 automatically. Auth0 tenant config is independent and can stay.

---

## File change summary

| File | Action |
|---|---|
| `package.json` | Add `@auth0/nextjs-auth0` |
| `middleware.ts` | **New** |
| `app/api/auth/[auth0]/route.ts` | **New** |
| `app/login/page.tsx` | **New** |
| `app/page.tsx` | Rewrite (server component) |
| `lib/auth.ts` | **New** |
| `next.config.ts` | CSP update |
| `components/screens/ScreenLogin.tsx` | Remove role tabs, real redirects |
| `components/screens/ScreenPending.tsx` | **New** |
| `components/Shell.tsx` | Remove view toggle, add admin footer link |

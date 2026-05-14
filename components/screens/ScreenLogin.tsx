"use client";
import { useState } from "react";
import { Icon } from "@/components/ui";

type Role = "advisor" | "client" | "admin";

const ROLE_COPY: Record<Role, { title: string; sub: string; icon: "briefcase" | "user" | "gear" }> = {
  advisor: { title: "Advisor workspace", sub: "Full client book · recommendations · compliance", icon: "briefcase" },
  client:  { title: "Investor portal",   sub: "My portfolio · my goals · snapshots",           icon: "user"     },
  admin:   { title: "Admin console",     sub: "Firm settings · users · audit · licensing",      icon: "gear"     },
};

export function ScreenLogin({ onLogin }: { onLogin: (role: Role) => void }) {
  const [role, setRole] = useState<Role>("advisor");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const social = (_provider: string) => {
    setBusy(true);
    setTimeout(() => { setBusy(false); onLogin(role); }, 700);
  };

  const submit = () => {
    if (!email || !pwd) { setErr("Email and password are required."); return; }
    setErr("");
    setBusy(true);
    setTimeout(() => { setBusy(false); onLogin(role); }, 500);
  };

  const rc = ROLE_COPY[role];

  return (
    <div className="login-wrap">
      <div className="login-bg">
        <div className="login-bg-grid"/>
        <div className="login-bg-glow"/>
      </div>

      <div className="login-shell">
        {/* Left marquee */}
        <div className="login-marquee">
          <div className="brand brand-lg" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="brand-mark" style={{ width: 38, height: 38, fontSize: 18 }}>N</div>
            <div>
              <div className="brand-name" style={{ fontSize: 19 }}>NaNote Finance</div>
              <div className="brand-sub">Wealth Platform · Thailand</div>
            </div>
          </div>
          <h1 className="login-title">
            Plan portfolios.<br/>
            Earn trust.<br/>
            <span style={{ color: "var(--accent)" }}>Stay compliant.</span>
          </h1>
          <p className="login-lede">A unified workspace for financial advisors, investors and compliance officers. Real-time analytics, Monte Carlo planning, and shareable client snapshots — built for the Thai market.</p>
          <ul className="login-feat">
            <li><Icon name="shield" size={14}/> PDPA-aligned · SEC Thailand</li>
            <li><Icon name="chart" size={14}/> Live portfolio &amp; risk analytics</li>
            <li><Icon name="sparkles" size={14}/> AI insights for every client meeting</li>
          </ul>
          <div className="login-foot-note">© 2026 NaNote Co., Ltd · Licensed wealth-tech provider</div>
        </div>

        {/* Right card */}
        <div className="login-card fadein">
          {/* Role tabs */}
          <div className="login-role-tabs">
            {(["advisor", "client", "admin"] as Role[]).map(r => (
              <button key={r} className={role === r ? "on" : ""} onClick={() => setRole(r)}>
                <Icon name={ROLE_COPY[r].icon} size={14}/>
                <span>{r === "advisor" ? "Advisor" : r === "client" ? "Client" : "Admin"}</span>
              </button>
            ))}
          </div>
          <div className="login-role-blurb">
            <div style={{ fontSize: 13, fontWeight: 700 }}>{rc.title}</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{rc.sub}</div>
          </div>

          {/* Social auth */}
          <div className="login-socials">
            <button className="soc google" onClick={() => social("google")} disabled={busy}>
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6 29.2 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6.6 29.2 4.5 24 4.5 16.4 4.5 9.8 8.8 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.3l-6.2-5.2C29.2 35 26.7 36 24 36c-5.1 0-9.6-3.3-11.2-8l-6.6 5.1C9.7 39.6 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.2 5.2C40.1 36.4 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z"/>
              </svg>
              Continue with Google
            </button>
            <div className="soc-row">
              <button className="soc fb" onClick={() => social("facebook")} disabled={busy} title="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z"/>
                </svg>
                Facebook
              </button>
              <button className="soc ig" onClick={() => social("instagram")} disabled={busy} title="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="iggrad" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0" stopColor="#FFD600"/>
                      <stop offset="0.4" stopColor="#FF7A00"/>
                      <stop offset="0.7" stopColor="#FF0069"/>
                      <stop offset="1" stopColor="#8C00FF"/>
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#iggrad)"/>
                  <circle cx="12" cy="12" r="4.5" fill="none" stroke="#fff" strokeWidth="1.8"/>
                  <circle cx="17.2" cy="6.8" r="1.2" fill="#fff"/>
                </svg>
                Instagram
              </button>
            </div>
          </div>

          <div className="divlbl"><span>or sign in with email</span></div>

          <div className="login-form">
            <label className="fld">
              <span>Email</span>
              <input type="email" placeholder="name@firm.co.th" value={email} onChange={e => setEmail(e.target.value)}/>
            </label>
            <label className="fld">
              <span>Password</span>
              <input type="password" placeholder="••••••••" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => { if (e.key === "Enter") submit(); }}/>
            </label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "var(--ink-3)", cursor: "pointer" }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/> Keep me signed in
              </label>
              <a href="#" style={{ fontSize: 12, color: "var(--accent-deep)" }}>Forgot password?</a>
            </div>
            {err && <div className="login-err">{err}</div>}
            <button className="btn primary" onClick={submit} disabled={busy} style={{ justifyContent: "center", padding: "11px 14px" }}>
              {busy ? "Signing you in…" : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
            <div style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center" }}>
              New here? <a href="#" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>Request access</a>
            </div>
          </div>

          <div className="login-legal">
            By continuing you agree to our Terms &amp; PDPA-aligned Privacy Notice. We never share data without your consent.
          </div>
        </div>
      </div>
    </div>
  );
}

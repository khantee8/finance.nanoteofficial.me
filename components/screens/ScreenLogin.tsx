"use client";
import { useState } from "react";

type Role = "advisor" | "client" | "admin";

export function ScreenLogin({ onLogin }: { onLogin: (role: Role) => void }) {
  const [stage, setStage] = useState<"auth" | "role">("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = (_provider?: string) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStage("role"); }, 800);
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "55fr 45fr",
      height: "100vh",
      fontFamily: "var(--sans)"
    }}>
      {/* LEFT PANEL */}
      <div style={{
        background: "linear-gradient(145deg, #0B0F1A 0%, #0D1535 40%, #1A1060 70%, #0B0F1A 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Animated geometric pattern - CSS-only */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 20% 50%, rgba(88,80,236,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(88,80,236,0.10) 0%, transparent 40%), radial-gradient(circle at 60% 80%, rgba(120,40,200,0.12) 0%, transparent 45%)`, pointerEvents: "none" }}/>
        {/* Grid dots */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }}/>

        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "white", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18, color: "#0D1535", letterSpacing: "-0.04em" }}>N</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>NaNote Finance</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Wealth · Thailand</div>
            </div>
          </div>
          <div style={{ color: "white" }}>
            <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 20 }}>Professional<br/>Portfolio Analytics<br/><span style={{ color: "rgba(120,100,255,0.9)" }}>& Planning</span></div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 380 }}>The advisor-grade platform for Thai wealth managers — built for SEC-regulated advisory practices with full PDPA compliance.</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { value: "127", label: "Active clients" },
            { value: "฿18.4B", label: "AUM managed" },
            { value: "99.4%", label: "Client satisfaction" },
            { value: "SEC", label: "Regulated · PDPA" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "white", letterSpacing: "-0.02em", fontFamily: "var(--mono)" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          {stage === "auth" ? (
            <div className="fadein">
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--ink)" }}>Welcome back</h1>
              <p style={{ color: "var(--ink-3)", fontSize: 14, marginBottom: 32 }}>Sign in to your NaNote Finance workspace</p>

              {/* Social auth buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[
                  { label: "Continue with Google", bg: "var(--surface)", border: "var(--border)", color: "var(--ink)", icon: "G" },
                  { label: "Continue with Facebook", bg: "#1877F2", border: "#1877F2", color: "white", icon: "f" },
                  { label: "Continue with Instagram", bg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", border: "transparent", color: "white", icon: "Ⓘ" },
                ].map(btn => (
                  <button key={btn.label} onClick={() => handleAuth(btn.label)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: `1px solid ${btn.border}`, background: btn.bg, color: btn.color, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", transition: "opacity 0.15s", opacity: loading ? 0.6 : 1 }}>
                    <span style={{ width: 20, height: 20, borderRadius: 4, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, background: btn.color === "var(--ink)" ? "var(--surface-2)" : "rgba(255,255,255,0.2)" }}>{btn.icon}</span>
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
                <span style={{ fontSize: 12, color: "var(--ink-4)" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
              </div>

              {/* Email form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address"
                  style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", outline: "none", width: "100%" }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
                />
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password"
                  style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", outline: "none", width: "100%" }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
                />
                <button onClick={() => handleAuth("email")} disabled={loading}
                  style={{ padding: "12px", borderRadius: 10, background: "var(--accent)", color: "white", border: "none", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </div>

              <p style={{ fontSize: 11, color: "var(--ink-4)", textAlign: "center", lineHeight: 1.6 }}>
                Thai SEC-regulated · PDPA compliant · Data stored in Thailand
              </p>
            </div>
          ) : (
            <div className="fadein">
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--ink)" }}>Select your role</h2>
              <p style={{ color: "var(--ink-3)", fontSize: 14, marginBottom: 28 }}>Choose how you want to access NaNote Finance</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { role: "advisor" as Role, icon: "💼", title: "Financial Advisor", desc: "Manage client portfolios, run analyses, view compliance logs and recommendations.", accent: "#5858EC", soft: "#EDEDFD" },
                  { role: "client" as Role, icon: "📊", title: "Investor / Client", desc: "View your portfolio, track goals, run projections, and share progress snapshots.", accent: "#059669", soft: "#D1FAE5" },
                  { role: "admin" as Role, icon: "⚙️", title: "Administrator", desc: "Manage platform users, review audit logs, configure system settings and roles.", accent: "#B45309", soft: "#FEF3C7" },
                ].map(r => (
                  <button key={r.role} onClick={() => onLogin(r.role)}
                    style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)", transition: "border-color 0.15s, box-shadow 0.15s", width: "100%" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = r.accent; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px ${r.soft}`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: r.soft, display: "grid", placeItems: "center", fontSize: 20, flexShrink: 0 }}>{r.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.55 }}>{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { Icon } from "@/components/ui";

export function ScreenPending() {
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
        <div className="login-card fadein" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, textAlign: "center" }}>
          <div className="brand-mark" style={{ width: 52, height: 52, fontSize: 24 }}>N</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Account pending approval</div>
            <div style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6, maxWidth: 300 }}>
              Your account has been created. An admin will review and assign your access role. This usually takes less than 24 hours.
            </div>
          </div>
          <a
            href="/auth/logout"
            className="btn primary"
            style={{ justifyContent: "center", padding: "11px 28px", textDecoration: "none" }}
          >
            Sign out
          </a>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
            Wrong account?{" "}
            <a href="/auth/logout" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>
              Sign in with a different account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

const fmt = (n: number) => "฿" + (n >= 1_000_000_000 ? (n / 1_000_000_000).toFixed(1) + "B" : n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n.toLocaleString());

const ACTIVITY = [
  { ts: "09:41", actor: "pakorn.v@nanote.th", action: "Logged in", target: "System", severity: "info" as const },
  { ts: "09:38", actor: "admin@nanote.th", action: "Role assigned: Advisor", target: "User: chaiya.s", severity: "info" as const },
  { ts: "09:22", actor: "pakorn.v@nanote.th", action: "Client created", target: "Nattaya T.", severity: "info" as const },
  { ts: "09:15", actor: "system", action: "Compliance flag raised", target: "Portfolio: BLC-204", severity: "warn" as const },
  { ts: "08:57", actor: "somchai.k@nanote.th", action: "Report exported", target: "Q1 2026 Review — Anucha", severity: "info" as const },
  { ts: "08:44", actor: "system", action: "Backup completed", target: "DB snapshot v2026-05-12", severity: "info" as const },
  { ts: "08:31", actor: "admin@nanote.th", action: "User deactivated", target: "User: wanchai.b", severity: "warn" as const },
  { ts: "08:10", actor: "system", action: "Daily sync", target: "Market data · SET, BKK", severity: "info" as const },
];

const ADVISORS = [
  { name: "Pakorn Visarut", clients: 34, aum: 5_800_000_000, ytd: 12.4, status: "Active" },
  { name: "Somchai Kruawan", clients: 28, aum: 4_200_000_000, ytd: 9.7, status: "Active" },
  { name: "Nattaporn W.", clients: 22, aum: 3_900_000_000, ytd: 11.1, status: "Active" },
  { name: "Chaiya Suwan", clients: 19, aum: 2_800_000_000, ytd: 7.3, status: "Active" },
  { name: "Wanchai Burin", clients: 11, aum: 1_700_000_000, ytd: -1.2, status: "Inactive" },
];

const ROLE_DIST = [
  { label: "Advisors", count: 8, total: 149, color: "var(--accent)" },
  { label: "Clients", count: 127, total: 149, color: "var(--pos)" },
  { label: "Inactive", count: 14, total: 149, color: "var(--ink-4)" },
];

export function ScreenAdminDashboard() {
  return (
    <div className="fadein" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 className="h-page" style={{ margin: 0 }}>Platform Overview</h1>
            <span className="chip warn" style={{ fontSize: 11 }}>Admin View</span>
          </div>
          <p style={{ color: "var(--ink-3)", fontSize: 13, margin: 0 }}>System status, users, and platform-wide analytics — as of today, 12 May 2026</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-4">
        {[
          { label: "Total Advisors", value: "8", sub: "2 senior · 6 associate", color: "var(--accent)" },
          { label: "Total Clients", value: "127", sub: "+3 this month", color: "var(--pos)" },
          { label: "Platform AUM", value: fmt(18_400_000_000), sub: "+8.6% YTD", color: "var(--pos)" },
          { label: "Open Issues", value: "3", sub: "2 warn · 1 critical", color: "var(--warn)" },
        ].map(k => (
          <div key={k.label} className="card">
            <div style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>{k.label}</div>
            <div className="metric" style={{ fontSize: 28, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-col: Activity + System Health */}
      <div className="grid grid-2">

        {/* Recent Activity */}
        <div className="card" style={{ padding: 0 }}>
          <div className="card-head" style={{ padding: "16px 20px" }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Activity</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-4)" }}>Live feed</span>
          </div>
          <div>
            {ACTIVITY.map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 20px", borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--ink-4)", minWidth: 36, paddingTop: 2 }}>{ev.ts}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.action}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.target} &mdash; <span style={{ color: "var(--ink-4)" }}>{ev.actor}</span></div>
                </div>
                <span className={`chip ${ev.severity === "warn" ? "warn" : "accent"}`} style={{ fontSize: 10, flexShrink: 0 }}>
                  {ev.severity === "warn" ? "WARN" : "INFO"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health + Role Distribution */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* System Health */}
          <div className="card">
            <div className="card-head" style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>System Health</span>
              <span className="chip pos" style={{ fontSize: 10, marginLeft: "auto" }}>Operational</span>
            </div>
            <div className="kvs">
              {[
                { k: "Uptime", v: "99.94%", color: "var(--pos)" },
                { k: "DB response", v: "12 ms", color: "var(--pos)" },
                { k: "Last backup", v: "2h ago", color: "var(--ink-2)" },
                { k: "Active sessions", v: "14", color: "var(--ink-2)" },
                { k: "API latency (p95)", v: "84 ms", color: "var(--pos)" },
                { k: "Error rate (24h)", v: "0.02%", color: "var(--pos)" },
              ].map(row => (
                <div key={row.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{row.k}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--mono)", color: row.color }}>{row.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role Distribution */}
          <div className="card">
            <div className="card-head" style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>User Role Distribution</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-4)" }}>149 total</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ROLE_DIST.map(r => (
                <div key={r.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontFamily: "var(--mono)", color: r.color, fontWeight: 700 }}>{r.count}</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 99, background: "var(--border)" }}>
                    <div style={{ height: "100%", borderRadius: 99, background: r.color, width: `${(r.count / r.total) * 100}%`, transition: "width 0.5s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advisor Performance Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="card-head" style={{ padding: "16px 20px" }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Advisor Performance</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-4)" }}>YTD as of May 2026</span>
        </div>
        <table className="tbl" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Advisor</th>
              <th style={{ textAlign: "right" }}>Clients</th>
              <th style={{ textAlign: "right" }}>AUM</th>
              <th style={{ textAlign: "right" }}>YTD Return</th>
              <th style={{ textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {ADVISORS.map(a => (
              <tr key={a.name}>
                <td style={{ fontWeight: 600, color: "var(--ink)" }}>{a.name}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--mono)", color: "var(--ink-2)" }}>{a.clients}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--mono)", color: "var(--ink-2)" }}>{fmt(a.aum)}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--mono)", fontWeight: 700, color: a.ytd >= 0 ? "var(--pos)" : "var(--neg)" }}>
                  {a.ytd >= 0 ? "+" : ""}{a.ytd.toFixed(1)}%
                </td>
                <td style={{ textAlign: "center" }}>
                  <span className={`chip ${a.status === "Active" ? "pos" : "neg"}`} style={{ fontSize: 11 }}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

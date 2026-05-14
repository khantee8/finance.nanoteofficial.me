"use client";
import { useState } from "react";
import { DATA } from "@/lib/data";
import { Icon, Avatar, Badge, Delta, Tabs } from "@/components/ui";

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

const USERS = [
  { name: "Pakorn Vichaichotikul", initials: "PV", role: "Senior Advisor", clients: 28, status: "Active", last: "2m ago" },
  { name: "Naphat Charoenrat", initials: "NC", role: "Senior Advisor", clients: 22, status: "Active", last: "11m ago" },
  { name: "Sirin Pongpetra", initials: "SP", role: "Advisor", clients: 14, status: "Active", last: "1h ago" },
  { name: "Niran Klangsuk", initials: "NK", role: "Compliance", clients: 0, status: "Active", last: "Just now" },
  { name: "Wattana Sae-Lim", initials: "WS", role: "Operations", clients: 0, status: "Active", last: "30m ago" },
  { name: "Pen Charoenchai", initials: "PC", role: "Advisor", clients: 9, status: "On leave", last: "3d ago" },
];

function fmt(n: number) {
  return "฿" + (n >= 1e9 ? (n/1e9).toFixed(1)+"B" : n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n.toLocaleString());
}

function AdminOverview() {
  return (
    <>
      <div className="grid grid-4">
        {[
          { label: "Total AUM", value: "฿2.84B", sub: <Delta value={6.4}/> },
          { label: "Active clients", value: "120", sub: <span><span className="num">+8</span> this month</span> },
          { label: "Advisors / Staff", value: "20", sub: "4 senior · 11 advisors · 5 ops" },
          { label: "Compliance alerts", value: "3", sub: "1 SLA breach risk", warn: true },
        ].map(m => (
          <div key={m.label} className={`card metric${m.warn ? "" : ""}`} style={m.warn ? { borderColor: "var(--warn-soft)", background: "linear-gradient(180deg, var(--warn-soft), var(--surface))" } : {}}>
            <div className="label">{m.label}</div>
            <div className="value">{m.value}</div>
            <div className="sub">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head"><h3>Firm health</h3><div className="spacer"/><Badge tone="pos">All systems normal</Badge></div>
          <div className="kvs" style={{ rowGap: 12 }}>
            <span className="k">PDPA framework</span><span className="v">v2.4 · enforced</span>
            <span className="k">SEC Thailand quarterly filing</span><span className="v">Filed 31 Mar 2026 · next due 30 Jun</span>
            <span className="k">AML watchlist screen</span><span className="v">Daily · last clear at 03:00</span>
            <span className="k">KYC re-verification due</span><span className="v">2 clients within 30 days</span>
            <span className="k">Data residency</span><span className="v">AWS ap-southeast-1 · encrypted</span>
            <span className="k">Uptime (90d)</span><span className="v">99.98%</span>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Recent firm events</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Risk policy updated", "Concentration cap raised to 35% for HNW Aggressive", "2h ago", "info"],
              ["New advisor onboarded", "Naphat C. — Senior Advisor · 4 clients reassigned", "Yesterday", "info"],
              ["Compliance review opened", "Apirak Chaiyaporn — suitability review", "2d", "warn"],
              ["Quarterly SEC filing accepted", "2026-Q1 report acknowledged", "5d", "info"],
            ].map(([t, s, when, sev], i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, display: "grid", placeItems: "center", background: sev === "warn" ? "var(--warn-soft)" : "var(--accent-soft)", color: sev === "warn" ? "var(--warn)" : "var(--accent-deep)", flex: "none" }}>
                  <Icon name={sev === "warn" ? "warn" : "info"} size={14}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{s}</div>
                </div>
                <span style={{ fontSize: 11, color: "var(--ink-4)" }}>{when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function AdminUsers() {
  return (
    <div className="card flush">
      <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Firm users · 20 staff · 120 clients</h3>
        <div className="spacer"/>
        <button className="btn sm"><Icon name="plus" size={12}/> Invite user</button>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th className="num">Clients</th>
            <th>Status</th>
            <th>Last active</th>
            <th style={{ width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {USERS.map((u, i) => (
            <tr key={i} className="clickable">
              <td>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Avatar initials={u.initials} size={28}/>
                  <span style={{ fontWeight: 600 }}>{u.name}</span>
                </div>
              </td>
              <td>{u.role}</td>
              <td className="num">{u.clients}</td>
              <td>{u.status === "Active" ? <Badge tone="pos">Active</Badge> : <Badge tone="warn">On leave</Badge>}</td>
              <td style={{ color: "var(--ink-3)" }}>{u.last}</td>
              <td><Icon name="chevronRight" size={14}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminCompliance() {
  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="card-head"><h3>Policy controls</h3></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            ["Concentration cap (HNW Aggressive)", "35%"],
            ["Concentration cap (HNW Balanced)", "25%"],
            ["Concentration cap (Mass Affluent)", "20%"],
            ["Max single-issuer (all clients)", "10%"],
            ["Risk reassessment cadence", "Annual + on event"],
            ["Cooling-off period (Aggressive switch)", "48 hours"],
            ["IPS refresh cadence", "Annual"],
            ["KYC renewal", "Every 24 months"],
          ].map(([k, v], i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : 0 }}>
              <span style={{ fontSize: 13 }}>{k}</span>
              <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--ink-2)", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Suitability rule matrix</h3></div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Risk profile</th>
              <th className="num">Equity cap</th>
              <th className="num">Crypto cap</th>
              <th className="num">Single name</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Conservative</td><td className="num">30%</td><td className="num">0%</td><td className="num">5%</td></tr>
            <tr><td>Moderate</td><td className="num">50%</td><td className="num">2%</td><td className="num">7%</td></tr>
            <tr><td>Balanced</td><td className="num">65%</td><td className="num">5%</td><td className="num">8%</td></tr>
            <tr><td>Growth</td><td className="num">80%</td><td className="num">8%</td><td className="num">10%</td></tr>
            <tr><td>Aggressive</td><td className="num">95%</td><td className="num">15%</td><td className="num">12%</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminAudit() {
  const D = DATA;
  return (
    <div className="card flush">
      <table className="tbl">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Actor</th>
            <th>Action</th>
            <th>Target</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {D.COMPLIANCE.map(l => (
            <tr key={l.id}>
              <td className="num" style={{ color: "var(--ink-3)", fontSize: 12 }}>{l.ts}</td>
              <td style={{ fontWeight: 600 }}>{l.actor}</td>
              <td>{l.action}</td>
              <td>{l.target}</td>
              <td>{l.severity === "warn" ? <Badge tone="warn">{l.category}</Badge> : <Badge>{l.category}</Badge>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminBilling() {
  return (
    <div className="grid grid-3">
      {[
        { label: "Plan", value: "Enterprise", sub: "Annual · auto-renew Jan 2027" },
        { label: "Seats used", value: "20 / 30", sub: "10 seats available" },
        { label: "Next invoice", value: "฿284,000", sub: "Due 01 Jun 2026" },
      ].map(m => (
        <div key={m.label} className="card metric">
          <div className="label">{m.label}</div>
          <div className="value">{m.value}</div>
          <div className="sub">{m.sub}</div>
        </div>
      ))}
    </div>
  );
}

export function ScreenAdminDashboard() {
  const [tab, setTab] = useState("Overview");

  return (
    <div className="col fadein">
      <div>
        <h1 className="h-page">Admin console</h1>
        <p className="h-page-sub">Firm-wide controls · user access · compliance · billing</p>
      </div>

      <Tabs items={["Overview", "Users & roles", "Compliance", "Audit trail", "Billing"]} value={tab} onChange={setTab}/>

      {tab === "Overview" && <AdminOverview/>}
      {tab === "Users & roles" && <AdminUsers/>}
      {tab === "Compliance" && <AdminCompliance/>}
      {tab === "Audit trail" && <AdminAudit/>}
      {tab === "Billing" && <AdminBilling/>}
    </div>
  );
}

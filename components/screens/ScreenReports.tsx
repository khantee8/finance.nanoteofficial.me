"use client";
import { useState } from "react";
import { DATA } from "@/lib/data";
import { Icon, FilterPill } from "@/components/ui";

export function ScreenReports() {
  const D = DATA;
  const [type, setType] = useState("All");
  const [q, setQ] = useState("");
  const types = ["All", ...Array.from(new Set(D.REPORTS.map(r => r.type)))];
  const rows = D.REPORTS.filter(r => (type === "All" || r.type === type) && (!q || (r.title + r.client).toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="col fadein">
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Reports</h1>
          <p className="h-page-sub">Portfolio reviews, IPS, goal plans and advisory documents</p>
        </div>
        <div className="spacer"/>
        <button className="btn primary"><Icon name="plus" size={14}/> New report</button>
      </div>

      <div className="grid grid-4">
        {[
          { label: "Generated this month", value: "24" },
          { label: "Pending signoff", value: "3" },
          { label: "Scheduled (auto)", value: "18" },
          { label: "Avg. review cycle", value: "2.4 days" },
        ].map(m => (
          <div className="card metric" key={m.label}>
            <div className="label">{m.label}</div>
            <div className="value">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card flush">
        <div style={{ padding: "12px 18px", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
          <div className="search" style={{ width: 280 }}>
            <Icon name="search" size={14}/>
            <input placeholder="Search reports..." value={q} onChange={e => setQ(e.target.value)}/>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {types.map(t => <FilterPill key={t} active={type === t} onClick={() => setType(t)}>{t}</FilterPill>)}
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Report</th>
              <th>Client</th>
              <th>Type</th>
              <th className="num">Generated</th>
              <th className="num">Size</th>
              <th>Status</th>
              <th style={{ width: 100 }}/>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="clickable">
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 44, background: "var(--surface-2)", borderRadius: 4, display: "grid", placeItems: "center", color: "var(--accent)" }}>
                      <Icon name="doc" size={16}/>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{r.pages} pages</div>
                    </div>
                  </div>
                </td>
                <td>{r.client}</td>
                <td><span className="chip">{r.type}</span></td>
                <td className="num" style={{ color: "var(--ink-3)" }}>{r.generated}</td>
                <td className="num" style={{ color: "var(--ink-3)" }}>{r.size}</td>
                <td><span className={`chip ${r.status === "Signed" || r.status === "Delivered" ? "pos" : r.status === "Pending Signoff" ? "warn" : ""}`}>{r.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button className="btn ghost sm"><Icon name="download" size={12}/></button>
                    <button className="btn ghost sm"><Icon name="send" size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

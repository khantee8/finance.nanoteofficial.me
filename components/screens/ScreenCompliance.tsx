"use client";
import { useState } from "react";
import { DATA } from "@/lib/data";
import { Icon, FilterPill } from "@/components/ui";

export function ScreenCompliance() {
  const D = DATA;
  const [cat, setCat] = useState("All");
  const [sev, setSev] = useState("All");

  const cats = ["All", ...Array.from(new Set(D.COMPLIANCE.map(c => c.category)))];
  const rows = D.COMPLIANCE.filter(c => (cat === "All" || c.category === cat) && (sev === "All" || c.severity === sev));

  return (
    <div className="col fadein">
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Compliance &amp; Audit Trail</h1>
          <p className="h-page-sub">PDPA · KYC · AML · Suitability · SEC Thailand reporting</p>
        </div>
        <div className="spacer"/>
        <button className="btn"><Icon name="download" size={14}/> Export audit pack</button>
      </div>

      <div className="grid grid-4">
        <div className="card metric"><div className="label">PDPA consent</div><div className="value">98%</div><div className="sub">11 of 12 clients</div></div>
        <div className="card metric"><div className="label">KYC current</div><div className="value">100%</div><div className="sub" style={{ color: "var(--pos)" }}>All verified</div></div>
        <div className="card metric"><div className="label">Suitability breaches (30d)</div><div className="value">2</div><div className="sub">Both mitigated</div></div>
        <div className="card metric"><div className="label">Next SEC filing</div><div className="value" style={{ fontSize: 18 }}>Jun 5</div><div className="sub">Monthly suitability report</div></div>
      </div>

      <div className="card flush">
        <div style={{ padding: "12px 18px", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {cats.map(c => <FilterPill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</FilterPill>)}
          </div>
          <div style={{ width: 1, height: 20, background: "var(--border)" }}/>
          {["All","info","warn"].map(s => (
            <FilterPill key={s} active={sev === s} onClick={() => setSev(s)}>{s === "info" ? "Info" : s === "warn" ? "Warnings" : "All"}</FilterPill>
          ))}
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Target</th><th>Category</th></tr>
          </thead>
          <tbody>
            {rows.map(l => (
              <tr key={l.id}>
                <td className="num" style={{ color: "var(--ink-3)" }}>{l.ts}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {l.severity === "warn" ? <Icon name="warn" size={14} stroke={1.8}/> : <Icon name="info" size={14}/>}
                    {l.actor}
                  </div>
                </td>
                <td>{l.action}</td>
                <td>{l.target}</td>
                <td><span className={`chip ${l.severity === "warn" ? "warn" : ""}`}>{l.category}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

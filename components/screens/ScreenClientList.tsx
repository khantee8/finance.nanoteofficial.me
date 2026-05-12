"use client";
import { useState, useMemo } from "react";
import type { Currency, Client } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, Money, Delta, Avatar, Sparkline, FilterPill } from "@/components/ui";

export function ScreenClientList({ ccy, onOpenClient }: { ccy: Currency; onOpenClient: (c: Client) => void }) {
  const D = DATA;
  const [q, setQ] = useState("");
  const [seg, setSeg] = useState("All");
  const [cat, setCat] = useState("All");
  const [sortKey, setSortKey] = useState<keyof Client>("aum");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");

  const rows = useMemo(() => {
    let r = D.CLIENTS.filter(c =>
      (seg === "All" || c.segment === seg) &&
      (cat === "All" || c.category === cat) &&
      (!q || c.name.toLowerCase().includes(q.toLowerCase()))
    );
    r.sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return r;
  }, [q, seg, cat, sortKey, sortDir]);

  const totalAUM = rows.reduce((s, r) => s + r.aum, 0);
  const sort = (k: keyof Client) => () => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  };
  const arrow = (k: keyof Client) => sortKey === k ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="col fadein">
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Clients</h1>
          <p className="h-page-sub">{rows.length} of {D.CLIENTS.length} clients · <Money value={totalAUM} ccy={ccy}/> AUM in view</p>
        </div>
        <div className="spacer"/>
        <button className="btn"><Icon name="download" size={14}/> Export</button>
        <button className="btn primary"><Icon name="plus" size={14}/> Add client</button>
      </div>

      <div className="card flush">
        <div style={{ padding: "12px 18px", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
          <div className="search" style={{ width: 280 }}>
            <Icon name="search" size={14}/>
            <input placeholder="Search clients..." value={q} onChange={e => setQ(e.target.value)}/>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "HNW", "Mass Affluent"].map(s => (
              <FilterPill key={s} active={seg === s} onClick={() => setSeg(s)}>{s}</FilterPill>
            ))}
          </div>
          <div style={{ width: 1, height: 20, background: "var(--border)" }}/>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", "Conservative", "Moderate", "Balanced", "Growth", "Aggressive"].map(s => (
              <FilterPill key={s} active={cat === s} onClick={() => setCat(s)}>{s}</FilterPill>
            ))}
          </div>
        </div>
        <div className="scroll-x">
          <table className="tbl">
            <thead>
              <tr>
                <th onClick={sort("name")}>Client{arrow("name")}</th>
                <th onClick={sort("segment")}>Segment{arrow("segment")}</th>
                <th onClick={sort("category")}>Risk{arrow("category")}</th>
                <th className="num" onClick={sort("aum")}>AUM{arrow("aum")}</th>
                <th className="num" onClick={sort("ytd")}>YTD{arrow("ytd")}</th>
                <th style={{ width: 90 }}>Trend</th>
                <th onClick={sort("status")}>Status{arrow("status")}</th>
                <th onClick={sort("lastReview")}>Last Review{arrow("lastReview")}</th>
                <th style={{ width: 40 }}/>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id} className="clickable" onClick={() => onOpenClient(c)}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={c.initials} size={30}/>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>{c.id.toUpperCase()}</div>
                      </div>
                      {c.alerts > 0 && <span className="chip neg" style={{ marginLeft: 4 }}>{c.alerts}</span>}
                    </div>
                  </td>
                  <td><span className="chip">{c.segment}</span></td>
                  <td>{c.category}</td>
                  <td className="num"><Money value={c.aum} ccy={ccy}/></td>
                  <td className="num"><Delta value={c.ytd} dec={1}/></td>
                  <td><Sparkline data={[100,100.6,101.2,100.9,101.8,102.4,102.1,103.2,103.8,104.4,105.1,100+c.ytd]} width={80} height={26}/></td>
                  <td><span className={`chip ${c.status === "Healthy" ? "pos" : c.status === "Review" ? "warn" : ""}`}>{c.status}</span></td>
                  <td className="num" style={{ color: "var(--ink-3)" }}>{c.lastReview}</td>
                  <td><Icon name="chevronRight" size={14}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

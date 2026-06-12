"use client";
import { useState } from "react";
import type { Currency, PersonaKey } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, Money } from "@/components/ui";

export function ScreenRecommend({ ccy, persona }: { ccy: Currency; persona: PersonaKey }) {
  const D = DATA;
  const P = D.PERSONAS[persona];
  const rebalance = D.REBALANCE[persona] || [];
  const [rationale, setRationale] = useState("Quarterly rebalance — strategic drift correction and risk management in line with IPS.");
  const [confirmed, setConfirmed] = useState<Set<number>>(new Set());

  const toggle = (i: number) => setConfirmed(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  return (
    <div className="col fadein">
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Recommendation Builder</h1>
          <p className="h-page-sub">{P.name} · {rebalance.length} proposed changes</p>
        </div>
        <div className="spacer"/>
        <button className="btn"><Icon name="doc" size={14}/> Save draft</button>
        <button className="btn primary" disabled={confirmed.size === 0}><Icon name="send" size={14}/> Send to client</button>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head"><h3>Rebalance proposals</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {rebalance.map((r, i) => {
              const delta = r.target - r.current;
              return (
                <div key={i} onClick={() => toggle(i)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--border)", cursor: "pointer",
                    opacity: confirmed.has(i) ? 0.6 : 1 }}>
                  <div style={{ width: 20, height: 20, marginTop: 2, borderRadius: 4, border: `2px solid ${confirmed.has(i) ? "var(--pos)" : "var(--border)"}`, background: confirmed.has(i) ? "var(--pos)" : "transparent", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    {confirmed.has(i) && <Icon name="check" size={12} stroke={2.5}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{r.asset}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{r.rationale}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="num" style={{ fontSize: 12 }}>{r.current}% → {r.target}%</div>
                    <span className={`delta ${delta > 0 ? "up" : "down"}`}>{delta > 0 ? "▲" : "▼"} {Math.abs(delta)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--ink-3)" }}>
            {confirmed.size}/{rebalance.length} changes confirmed
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Advisory rationale</h3></div>
          <textarea
            value={rationale}
            onChange={e => setRationale(e.target.value)}
            rows={6}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--r)", background: "var(--surface-2)", fontSize: 13, lineHeight: 1.6, resize: "vertical", outline: "none", color: "var(--ink)" }}
          />
          <div className="card-head" style={{ marginTop: 8 }}><h3>Summary</h3></div>
          <div className="kvs">
            <span className="k">Client</span><span className="v">{P.name}</span>
            <span className="k">Risk profile</span><span className="v">{P.risk.category}</span>
            <span className="k">Portfolio value</span><span className="v num"><Money value={P.portfolioValue} ccy={ccy}/></span>
            <span className="k">Changes proposed</span><span className="v">{rebalance.length}</span>
            <span className="k">Changes confirmed</span><span className="v">{confirmed.size}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn" style={{ flex: 1 }}><Icon name="doc" size={14}/> Generate PDF</button>
            <button className="btn primary" style={{ flex: 1 }} disabled={confirmed.size === 0}><Icon name="send" size={14}/> Send for approval</button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import type { Currency, PersonaKey } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, Money, Delta, Donut, AreaPerf, ProgressRing } from "@/components/ui";

export function ScreenClientView({ ccy, persona }: { ccy: Currency; persona: PersonaKey }) {
  const D = DATA;
  const P = D.PERSONAS[persona];
  const alloc = D.ALLOC[persona];
  const perf = D.PERF[persona];
  const goals = D.GOALS[persona];

  return (
    <div className="col fadein">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div>
          <h1 className="h-page">Welcome back, {P.name.split(" ")[1]}</h1>
          <p className="h-page-sub">Your portfolio as of today · last updated 09:00</p>
        </div>
        <div className="spacer"/>
        <button className="btn primary"><Icon name="send" size={14}/> Message advisor</button>
      </div>

      <div className="grid grid-4">
        <div className="card metric">
          <div className="label">Portfolio value</div>
          <div className="value"><Money value={P.portfolioValue} ccy={ccy}/></div>
          <div className="sub"><Delta value={P.ytdReturn}/> YTD</div>
        </div>
        <div className="card metric">
          <div className="label">Cash balance</div>
          <div className="value"><Money value={P.cashBalance} ccy={ccy}/></div>
          <div className="sub" style={{ color: "var(--ink-3)" }}>Available</div>
        </div>
        <div className="card metric">
          <div className="label">1-Year return</div>
          <div className="value"><Delta value={P.oneYearReturn}/></div>
          <div className="sub" style={{ color: "var(--ink-3)" }}>Benchmark {DATA.fmt.pct(P.benchmark)}</div>
        </div>
        <div className="card metric">
          <div className="label">Portfolio health</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <ProgressRing value={P.healthScore} size={50} thickness={5} color={P.healthScore >= 80 ? "var(--pos)" : "var(--warn)"} label="Score"/>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{P.healthScore >= 80 ? "Good standing" : "Review needed"}</div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="card">
          <div className="card-head"><h3>Performance</h3><span className="sub">vs benchmark</span></div>
          <AreaPerf
            series={[
              { name: "Your portfolio", data: perf.client, color: "var(--accent)" },
              { name: "Benchmark", data: perf.bench, color: "var(--ink-4)", style: "dashed" },
            ]}
            height={200}
          />
        </div>
        <div className="card" style={{ alignItems: "center" }}>
          <div className="card-head"><h3>Allocation</h3></div>
          <Donut data={alloc.map(a => ({ weight: a.weight, color: a.color }))} size={180} thickness={26} centerLabel="Invested" centerValue={DATA.fmt.money(P.portfolioValue, ccy)}/>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>My goals</h3></div>
        <div className="grid grid-2" style={{ gap: 12 }}>
          {goals.map(g => {
            const pct = Math.min(100, (g.current / g.target) * 100);
            return (
              <div key={g.id} style={{ padding: 14, border: "1px solid var(--border)", borderRadius: "var(--r-lg)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <span className="num" style={{ fontSize: 12 }}>{pct.toFixed(0)}%</span>
                </div>
                <div className="bar">
                  <i style={{ width: `${pct}%`, background: pct >= 80 ? "var(--pos)" : pct >= 50 ? "var(--accent)" : "var(--warn)" }}/>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
                  <span><Money value={g.current} ccy={ccy}/> saved</span>
                  <span>Target: <Money value={g.target} ccy={ccy}/></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

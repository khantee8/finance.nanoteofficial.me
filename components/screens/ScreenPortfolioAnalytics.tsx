"use client";
import { useState } from "react";
import type { Currency, PersonaKey } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, Money, Delta, Donut, AreaPerf, HBar, Tabs, Seg, FilterPill } from "@/components/ui";

export function ScreenPortfolioAnalytics({ ccy, persona }: { ccy: Currency; persona: PersonaKey }) {
  const D = DATA;
  const P = D.PERSONAS[persona];
  const alloc = D.ALLOC[persona];
  const holdings = D.HOLDINGS[persona] || [];
  const perf = D.PERF[persona];
  const [tab, setTab] = useState("Allocation");
  const [classFilter, setClassFilter] = useState("All");

  const classes = ["All", ...Array.from(new Set(holdings.map(h => h.class)))];
  const filteredHoldings = holdings.filter(h => classFilter === "All" || h.class === classFilter);

  const byClass = classes.filter(c => c !== "All").map(cls => ({
    label: cls,
    value: holdings.filter(h => h.class === cls).reduce((s, h) => s + h.weight, 0),
    color: cls === "Equity" ? "oklch(0.55 0.13 270)" : cls === "Fixed Income" ? "oklch(0.65 0.10 240)" : cls === "Cash" ? "oklch(0.75 0.04 240)" : "oklch(0.60 0.13 60)",
  }));

  return (
    <div className="col fadein">
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Portfolio Analytics</h1>
          <p className="h-page-sub">{P.name} · <Money value={P.portfolioValue} ccy={ccy}/> AUM</p>
        </div>
        <div className="spacer"/>
        <Seg items={[{value:"1M",label:"1M"},{value:"3M",label:"3M"},{value:"YTD",label:"YTD"},{value:"1Y",label:"1Y"}]} value="YTD" onChange={()=>{}}/>
        <button className="btn"><Icon name="download" size={14}/> Export</button>
      </div>

      <div className="grid grid-4">
        {[
          { label: "YTD Return", value: DATA.fmt.pct(P.ytdReturn), delta: P.ytdReturn - P.benchmark, sub: `Benchmark ${DATA.fmt.pct(P.benchmark)}` },
          { label: "1-Year Return", value: DATA.fmt.pct(P.oneYearReturn), delta: null as number | null, sub: "Annualised" },
          { label: "Volatility", value: DATA.fmt.pctAbs(P.volatility), delta: null as number | null, sub: "Annualised σ" },
          { label: "Sharpe Ratio", value: P.sharpe.toFixed(2), delta: null as number | null, sub: `Max drawdown ${P.drawdown}%` },
        ].map(m => (
          <div key={m.label} className="card metric">
            <div className="label">{m.label}</div>
            <div className="value">{m.value}</div>
            <div className="sub">{m.delta !== null ? <><Delta value={m.delta} dec={1}/> {m.sub}</> : m.sub}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "0 18px" }}>
        <Tabs items={["Allocation","Holdings","Performance","Risk"]} value={tab} onChange={setTab}/>
      </div>

      {tab === "Allocation" && (
        <div className="grid grid-23">
          <div className="card">
            <div className="card-head"><h3>Asset allocation</h3></div>
            <HBar items={alloc.map(a => ({ label: a.name, value: a.weight, color: a.color, display: `${a.weight}%` }))} max={100}/>
          </div>
          <div className="card" style={{ alignItems: "center" }}>
            <div className="card-head"><h3>By class</h3></div>
            <Donut data={byClass.map(b => ({ weight: b.value, color: b.color }))} size={200} thickness={30} centerLabel="Total" centerValue="100%"/>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
              {byClass.map(b => (
                <div key={b.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: b.color, display: "inline-block" }}/>
                    <span style={{ fontSize: 12 }}>{b.label}</span>
                  </div>
                  <span className="num" style={{ fontSize: 12, fontWeight: 600 }}>{b.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "Holdings" && (
        <div className="card flush">
          <div style={{ padding: "10px 18px", display: "flex", gap: 8, borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
            {classes.map(c => <FilterPill key={c} active={classFilter === c} onClick={() => setClassFilter(c)}>{c}</FilterPill>)}
          </div>
          <div className="scroll-x">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Class</th>
                  <th>Region</th>
                  <th className="num">Weight</th>
                  <th className="num">Value</th>
                  <th className="num">Gain</th>
                  <th className="num">YTD</th>
                </tr>
              </thead>
              <tbody>
                {filteredHoldings.map(h => (
                  <tr key={h.ticker}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{h.ticker}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{h.name}</div>
                    </td>
                    <td><span className="chip">{h.class}</span></td>
                    <td style={{ color: "var(--ink-3)" }}>{h.region}</td>
                    <td className="num">{DATA.fmt.pctAbs(h.weight)}</td>
                    <td className="num"><Money value={h.value} ccy={ccy}/></td>
                    <td className="num"><Delta value={h.gain} dec={1}/></td>
                    <td className="num"><Delta value={h.ytd} dec={1}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Performance" && (
        <div className="card">
          <div className="card-head"><h3>12-month performance vs benchmark</h3></div>
          <AreaPerf
            series={[
              { name: "Portfolio", data: perf.client, color: "var(--accent)" },
              { name: "Benchmark", data: perf.bench, color: "var(--ink-4)", style: "dashed" },
            ]}
            height={280}
          />
        </div>
      )}

      {tab === "Risk" && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-head"><h3>Risk metrics</h3></div>
            <div className="kvs">
              <span className="k">Annualised volatility</span><span className="v num">{P.volatility}%</span>
              <span className="k">Max drawdown</span><span className="v num" style={{ color: "var(--neg)" }}>{P.drawdown}%</span>
              <span className="k">Sharpe ratio</span><span className="v num">{P.sharpe}</span>
              <span className="k">Concentration</span><span className="v">{P.concentration}</span>
              <span className="k">Benchmark</span><span className="v num">{DATA.fmt.pct(P.benchmark)}</span>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Concentration by class</h3></div>
            <HBar items={byClass.map(b => ({ ...b, display: `${b.value.toFixed(1)}%` }))} max={100}/>
          </div>
        </div>
      )}
    </div>
  );
}

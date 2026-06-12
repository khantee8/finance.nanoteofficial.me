"use client";
import { useState } from "react";
import type { Currency, PersonaKey } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, Money, Delta, Avatar, AreaPerf, ProgressRing, Tabs } from "@/components/ui";

export function ScreenClientProfile({ ccy, persona, onNav }: { ccy: Currency; persona: PersonaKey; onNav: (r: string) => void }) {
  const D = DATA;
  const P = D.PERSONAS[persona];
  const [tab, setTab] = useState("Overview");
  const networth = P.assets - P.liabilities;
  const holdings = D.HOLDINGS[persona] || [];
  const perf = D.PERF[persona];

  return (
    <div className="col fadein">
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Avatar initials={P.initials} size={64}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
              <h1 className="h-page" style={{ fontSize: 22 }}>{P.name}</h1>
              <span className="chip">{P.tier}</span>
              <span className="chip" style={{ background: P.risk.color + "22", color: P.risk.color }}>
                <span className="swatch" style={{ background: P.risk.color }}/>
                {P.risk.category}
              </span>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
              {P.occupation} · {P.location} · Client since {P.since} · Age {P.age}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn"><Icon name="send" size={14}/> Message</button>
            <button className="btn"><Icon name="calendar" size={14}/> Schedule</button>
            <button className="btn primary" onClick={() => onNav("Recommendations")}><Icon name="sparkles" size={14}/> Build recommendation</button>
          </div>
        </div>
        <div className="grid grid-4" style={{ marginTop: 18 }}>
          <div className="metric">
            <div className="label">Portfolio value</div>
            <div className="value"><Money value={P.portfolioValue} ccy={ccy}/></div>
            <div className="sub"><Delta value={P.ytdReturn}/> YTD</div>
          </div>
          <div className="metric">
            <div className="label">Net worth</div>
            <div className="value"><Money value={networth} ccy={ccy}/></div>
            <div className="sub" style={{ color: "var(--ink-3)" }}>Assets − Liabilities</div>
          </div>
          <div className="metric">
            <div className="label">Sharpe ratio</div>
            <div className="value num">{P.sharpe.toFixed(2)}</div>
            <div className="sub">vs benchmark {(P.sharpe - 0.12).toFixed(2)}</div>
          </div>
          <div className="metric">
            <div className="label">Portfolio health</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
              <ProgressRing value={P.healthScore} size={60} thickness={6} color={P.healthScore >= 80 ? "var(--pos)" : P.healthScore >= 60 ? "var(--warn)" : "var(--neg)"} label="Score"/>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{P.healthScore >= 80 ? "Good standing" : P.healthScore >= 60 ? "Review needed" : "Needs attention"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "0 18px" }}>
        <Tabs items={["Overview","Holdings","Performance","Financial profile"]} value={tab} onChange={setTab}/>
      </div>

      {tab === "Overview" && (
        <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
          <div className="card">
            <div className="card-head"><h3>12-month performance</h3></div>
            <AreaPerf
              series={[
                { name: "Portfolio", data: perf.client, color: "var(--accent)" },
                { name: "Benchmark", data: perf.bench, color: "var(--ink-4)", style: "dashed" },
              ]}
              height={200}
            />
          </div>
          <div className="card">
            <div className="card-head"><h3>Risk metrics</h3></div>
            <div className="kvs">
              <span className="k">Volatility (annualised)</span><span className="v num">{P.volatility}%</span>
              <span className="k">Max drawdown</span><span className="v num" style={{ color: "var(--neg)" }}>{P.drawdown}%</span>
              <span className="k">Concentration</span><span className="v">{P.concentration}</span>
              <span className="k">Risk horizon</span><span className="v">{P.horizon}</span>
              <span className="k">Benchmark</span><span className="v num">{DATA.fmt.pct(P.benchmark)}</span>
              <span className="k">Liquidity needs</span><span className="v">{P.liquidityNeeds}</span>
            </div>
          </div>
        </div>
      )}

      {tab === "Holdings" && (
        <div className="card flush">
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
                {holdings.map(h => (
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
          <div className="card-head"><h3>Performance vs benchmark</h3></div>
          <AreaPerf
            series={[
              { name: "Portfolio", data: perf.client, color: "var(--accent)" },
              { name: "Benchmark", data: perf.bench, color: "var(--ink-4)", style: "dashed" },
            ]}
            height={260}
          />
          <div className="grid grid-3" style={{ marginTop: 8 }}>
            {[
              { label: "YTD Return", value: DATA.fmt.pct(P.ytdReturn), color: P.ytdReturn > 0 ? "var(--pos)" : "var(--neg)" },
              { label: "1-Year Return", value: DATA.fmt.pct(P.oneYearReturn), color: P.oneYearReturn > 0 ? "var(--pos)" : "var(--neg)" },
              { label: "3-Year Return", value: DATA.fmt.pct(P.threeYearReturn), color: "var(--ink)" },
            ].map(m => (
              <div key={m.label} className="metric">
                <div className="label">{m.label}</div>
                <div className="value" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Financial profile" && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-head"><h3>Client details</h3></div>
            <div className="kvs">
              <span className="k">Objective</span><span className="v">{P.objective}</span>
              <span className="k">Experience</span><span className="v">{P.experience}</span>
              <span className="k">Annual income</span><span className="v num"><Money value={P.income} ccy={ccy}/></span>
              <span className="k">Annual expenses</span><span className="v num"><Money value={P.expenses} ccy={ccy}/></span>
              <span className="k">Total assets</span><span className="v num"><Money value={P.assets} ccy={ccy}/></span>
              <span className="k">Total liabilities</span><span className="v num"><Money value={P.liabilities} ccy={ccy}/></span>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Risk profile</h3></div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
              <ProgressRing value={P.risk.score} size={80} thickness={8} color={P.risk.color} label="Score"/>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{P.risk.category}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{P.horizon}</div>
              </div>
            </div>
            <div className="kvs">
              <span className="k">Liquidity</span><span className="v">{P.liquidityNeeds}</span>
              <span className="k">Volatility</span><span className="v num">{P.volatility}%</span>
              <span className="k">Max drawdown</span><span className="v num" style={{ color: "var(--neg)" }}>{P.drawdown}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

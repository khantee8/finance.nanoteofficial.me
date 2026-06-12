"use client";
import { useState, useMemo } from "react";
import type { PersonaKey, Currency } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, ProgressRing, HBar, Tabs, Badge, Money } from "@/components/ui";

const CURRENCY_EXPOSURE: Record<PersonaKey, { label: string; value: number; color: string }[]> = {
  conservative: [
    { label: "Thai Baht (THB)", value: 72, color: "var(--accent)" },
    { label: "US Dollar (USD)", value: 19, color: "var(--pos)" },
    { label: "Other", value: 9, color: "var(--ink-4)" },
  ],
  balanced: [
    { label: "Thai Baht (THB)", value: 50, color: "var(--accent)" },
    { label: "US Dollar (USD)", value: 31, color: "var(--pos)" },
    { label: "Euro/Other", value: 19, color: "var(--ink-4)" },
  ],
  aggressive: [
    { label: "Thai Baht (THB)", value: 35, color: "var(--accent)" },
    { label: "US Dollar (USD)", value: 43, color: "var(--pos)" },
    { label: "Other", value: 22, color: "var(--ink-4)" },
  ],
};

const GEO_EXPOSURE: Record<PersonaKey, { label: string; value: number }[]> = {
  conservative: [
    { label: "Thailand", value: 68 },
    { label: "Global Developed Markets", value: 23 },
    { label: "Emerging Markets", value: 6 },
    { label: "Other", value: 3 },
  ],
  balanced: [
    { label: "Thailand", value: 40 },
    { label: "Global Developed Markets", value: 44 },
    { label: "Emerging Markets", value: 12 },
    { label: "Other", value: 4 },
  ],
  aggressive: [
    { label: "Thailand", value: 27 },
    { label: "Global Developed Markets", value: 38 },
    { label: "Emerging Markets", value: 28 },
    { label: "Other", value: 7 },
  ],
};

const GEO_COLORS = ["var(--accent)", "var(--pos)", "var(--warn)", "var(--ink-4)"];

const STRESS_SCENARIOS = [
  { event: "2008 Global Financial Crisis", base: -38, recovery: "3.5 years" },
  { event: "2020 COVID-19 Crash", base: -22, recovery: "8 months" },
  { event: "2022 Rate Hike Shock", base: -18, recovery: "14 months" },
  { event: "2013 Taper Tantrum", base: -12, recovery: "6 months" },
  { event: "2011 European Debt Crisis", base: -16, recovery: "12 months" },
];

const SCALE_FACTORS: Record<PersonaKey, number> = {
  conservative: 0.45,
  balanced: 0.75,
  aggressive: 1.0,
};

export function ScreenClientRiskAnalysis({ ccy, persona }: { ccy: Currency; persona: PersonaKey }) {
  const [tab, setTab] = useState("Concentration");
  const P = DATA.PERSONAS[persona];
  const alloc = DATA.ALLOC[persona];
  const holdings = DATA.HOLDINGS[persona];

  const beta = parseFloat((P.volatility / 16).toFixed(2));
  const scaleFactor = SCALE_FACTORS[persona];

  const classGroups = useMemo(() => {
    const map: Record<string, number> = {};
    alloc.forEach(a => {
      map[a.class] = (map[a.class] || 0) + a.weight;
    });
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  }, [alloc]);

  const top5Holdings = useMemo(
    () => [...holdings].sort((a, b) => b.weight - a.weight).slice(0, 5),
    [holdings]
  );

  const stressScenarios = useMemo(() =>
    STRESS_SCENARIOS.map(s => ({
      ...s,
      impact: parseFloat((s.base * scaleFactor).toFixed(1)),
      lossAmount: P.portfolioValue * Math.abs(s.base * scaleFactor) / 100,
    })),
    [scaleFactor, P.portfolioValue]
  );

  const worstImpactIdx = useMemo(
    () => stressScenarios.reduce((wi, s, i, arr) => s.impact < arr[wi].impact ? i : wi, 0),
    [stressScenarios]
  );

  const currencyData = CURRENCY_EXPOSURE[persona];
  const geoData = GEO_EXPOSURE[persona];

  const foreignCurrencyPct = useMemo(() => {
    const thb = currencyData.find(c => c.label.includes("THB"));
    return thb ? 100 - thb.value : 100;
  }, [currencyData]);

  const insights = useMemo(() => {
    const result: { text: string; tone: "pos" | "warn" | "neg" }[] = [];
    if (P.risk.score < 40) {
      result.push({ text: "Your conservative risk profile means your portfolio is positioned for stability over growth.", tone: "pos" });
    }
    const maxHolding = Math.max(...holdings.map(h => h.weight));
    if (maxHolding > 18) {
      result.push({ text: "Concentration risk detected — consider diversifying your largest positions.", tone: "warn" });
    }
    if (P.volatility > 15) {
      result.push({ text: "Your portfolio has relatively high volatility. Large short-term swings are expected.", tone: "neg" });
    }
    if (foreignCurrencyPct > 40) {
      result.push({ text: "Significant foreign currency exposure means exchange rate movements directly affect your THB returns.", tone: "warn" });
    }
    return result;
  }, [P, holdings, foreignCurrencyPct]);

  const toneColor: Record<string, string> = {
    pos: "var(--pos)",
    warn: "var(--warn)",
    neg: "var(--neg)",
  };

  const toneBg: Record<string, string> = {
    pos: "var(--pos-soft)",
    warn: "var(--warn-soft)",
    neg: "var(--neg-soft)",
  };

  return (
    <div className="col fadein">
      {/* Page header */}
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Portfolio Risk Analysis</h1>
          <p className="h-page-sub">Updated daily · As of May 2026</p>
        </div>
        <div className="spacer" />
        <button className="btn"><Icon name="download" size={14} /> Export</button>
      </div>

      {/* Risk score hero card */}
      <div className="card">
        <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
          {/* Left: ProgressRing */}
          <div style={{ flexShrink: 0 }}>
            <ProgressRing value={P.risk.score} max={100} size={120} thickness={12} color={P.risk.color} label="Score" />
          </div>

          {/* Middle: category + description */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Badge tone="accent">{P.risk.category}</Badge>
              <span className="num" style={{ fontSize: 22, fontWeight: 700, color: P.risk.color }}>{P.risk.score}</span>
              <span style={{ fontSize: 13, color: "var(--ink-3)" }}>/ 100</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: 340 }}>
              {P.risk.score < 40
                ? "This portfolio prioritises capital preservation with lower exposure to market swings. Suitable for income-focused or short-horizon investors."
                : P.risk.score < 65
                ? "A balanced risk posture that balances growth potential with downside protection. Moderate fluctuations are expected over the investment horizon."
                : "This portfolio is positioned for maximum long-term growth with significant exposure to volatile assets. Short-term drawdowns may be material."}
            </p>
          </div>

          {/* Right: 4 quick-stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flexShrink: 0 }}>
            {[
              { label: "Volatility", value: `${P.volatility}%` },
              { label: "Max Drawdown", value: `${P.drawdown}%` },
              { label: "Sharpe Ratio", value: P.sharpe.toFixed(2) },
              { label: "Beta", value: beta.toFixed(2) },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center", padding: "10px 16px", background: "var(--surface-2)", borderRadius: "var(--r)" }}>
                <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{stat.label}</div>
                <div className="num" style={{ fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: "0 18px" }}>
        <Tabs items={["Concentration", "Currency", "Geography", "Stress Tests"]} value={tab} onChange={setTab} />
      </div>

      {/* Concentration tab */}
      {tab === "Concentration" && (
        <div className="col" style={{ gap: "var(--gutter)" }}>
          <div className="grid grid-2">
            <div className="card">
              <div className="card-head"><h3>Asset class breakdown</h3></div>
              <HBar
                items={classGroups.map(g => ({ label: g.label, value: parseFloat(g.value.toFixed(1)) }))}
                max={100}
              />
            </div>

            <div className="card">
              <div className="card-head"><h3>Top 5 holdings by weight</h3></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {top5Holdings.map(h => (
                  <div key={h.ticker}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{h.ticker}</span>
                        <span style={{ fontSize: 11, color: "var(--ink-3)", marginLeft: 8 }}>{h.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {h.weight > 20 && <span className="chip warn">High</span>}
                        <span className="num" style={{ fontSize: 12, fontWeight: 600 }}>{h.weight.toFixed(1)}%</span>
                        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                          <Money value={h.value} ccy={ccy} />
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 999 }}>
                      <div style={{ width: `${h.weight}%`, height: "100%", background: h.weight > 20 ? "var(--warn)" : "var(--accent)", borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Currency tab */}
      {tab === "Currency" && (
        <div className="card">
          <div className="card-head"><h3>Currency exposure</h3></div>
          <HBar items={currencyData.map(c => ({ label: c.label, value: c.value, color: c.color }))} max={100} />
          <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--surface-2)", borderRadius: "var(--r)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <Icon name="info" size={14} /> &nbsp;Currency risk means your portfolio value in THB can change when foreign exchange rates move.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {currencyData.map(c => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{c.label}</span>
                <span className="num" style={{ fontSize: 12, fontWeight: 600 }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geography tab */}
      {tab === "Geography" && (
        <div className="card">
          <div className="card-head"><h3>Geographic exposure</h3></div>
          <HBar
            items={geoData.map((g, i) => ({ label: g.label, value: g.value, color: GEO_COLORS[i] }))}
            max={100}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {geoData.map((g, i) => (
              <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: GEO_COLORS[i], display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{g.label}</span>
                <span className="num" style={{ fontSize: 12, fontWeight: 600 }}>{g.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stress Tests tab */}
      {tab === "Stress Tests" && (
        <div className="card flush">
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: 0 }}>Historical stress scenarios</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--ink-3)" }}>
              Impact scaled to {P.risk.category} risk profile (×{scaleFactor})
            </p>
          </div>
          <div className="scroll-x">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Event</th>
                  <th className="num">Market Impact</th>
                  <th className="num">Portfolio Impact</th>
                  <th className="num">Est. Loss (THB)</th>
                  <th>Recovery</th>
                </tr>
              </thead>
              <tbody>
                {stressScenarios.map((s, i) => (
                  <tr key={s.event} style={i === worstImpactIdx ? { background: "var(--warn-soft)" } : {}}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{s.event}</div>
                      {i === worstImpactIdx && <span className="chip warn" style={{ marginTop: 4 }}>Worst scenario</span>}
                    </td>
                    <td className="num" style={{ color: "var(--neg)" }}>{s.base}%</td>
                    <td className="num" style={{ color: "var(--neg)", fontWeight: 600 }}>{s.impact.toFixed(1)}%</td>
                    <td className="num" style={{ color: "var(--neg)" }}>
                      <Money value={s.lossAmount} ccy={ccy} />
                    </td>
                    <td style={{ color: "var(--ink-3)", fontSize: 13 }}>{s.recovery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights panel */}
      {insights.length > 0 && (
        <div className="card">
          <div className="card-head"><h3>Key insights</h3><Icon name="sparkles" size={16} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {insights.map((ins, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "12px 14px",
                background: toneBg[ins.tone],
                borderRadius: "var(--r)",
                borderLeft: `3px solid ${toneColor[ins.tone]}`,
              }}>
                <Icon
                  name={ins.tone === "pos" ? "check" : ins.tone === "warn" ? "warn" : "info"}
                  size={16}
                />
                <span style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p style={{ fontSize: 11, color: "var(--ink-4)", textAlign: "center", padding: "0 0 8px" }}>
        Risk metrics are based on historical data. Past risk levels do not guarantee future risk. All figures in THB unless stated.
      </p>
    </div>
  );
}

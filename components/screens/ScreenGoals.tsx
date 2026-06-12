"use client";
import { useState, useMemo } from "react";
import type { Currency, PersonaKey } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, Money, AreaPerf } from "@/components/ui";

export function ScreenGoals({ ccy, persona }: { ccy: Currency; persona: PersonaKey }) {
  const D = DATA;
  const P = D.PERSONAS[persona];
  const goals = D.GOALS[persona];
  const [activeId, setActiveId] = useState(goals[0].id);
  const goal = goals.find(g => g.id === activeId) ?? goals[0];

  const [target, setTarget] = useState(goal.target);
  const [current, setCurrent] = useState(goal.current);
  const [monthly, setMonthly] = useState(goal.monthly);
  const [years, setYears] = useState(goal.targetYear - 2026);
  const [growth, setGrowth] = useState(persona === "aggressive" ? 9 : persona === "conservative" ? 4 : 6.5);
  const [inflation, setInflation] = useState(2.5);

  const selectGoal = (id: string) => {
    setActiveId(id);
    const g = goals.find(x => x.id === id) ?? goals[0];
    setTarget(g.target); setCurrent(g.current); setMonthly(g.monthly);
    setYears(g.targetYear - 2026);
  };

  const projection = useMemo(() => {
    const months = Math.max(1, years * 12);
    const rMonthly = growth / 100 / 12;
    const series: number[] = [];
    let v = current;
    for (let i = 0; i <= months; i++) { series.push(v); v = v * (1 + rMonthly) + monthly; }
    return series;
  }, [current, monthly, years, growth]);

  const projected = projection[projection.length - 1];
  const inflAdjTarget = target * Math.pow(1 + inflation / 100, years);
  const gap = projected - inflAdjTarget;

  const downsampledProjection = useMemo(() => {
    const step = Math.max(1, Math.floor(projection.length / 12));
    return projection.filter((_, i) => i % step === 0).slice(0, 12);
  }, [projection]);

  return (
    <div className="col fadein">
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Financial Goals</h1>
          <p className="h-page-sub">{P.name} · {goals.length} goals tracked</p>
        </div>
        <div className="spacer"/>
        <button className="btn primary"><Icon name="plus" size={14}/> Add goal</button>
      </div>

      <div className="grid grid-2">
        <div className="card flush">
          {goals.map(g => {
            const pct = Math.min(100, (g.current / g.target) * 100);
            return (
              <div key={g.id} onClick={() => selectGoal(g.id)}
                style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                  background: activeId === g.id ? "var(--accent-soft)" : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: activeId === g.id ? "var(--accent)" : "var(--surface-2)", color: activeId === g.id ? "#fff" : "var(--ink-3)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14 }}>{g.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{g.category} · Target {g.targetYear}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="num" style={{ fontSize: 13, fontWeight: 600 }}>{pct.toFixed(0)}%</div>
                    <span className={`chip ${g.priority === "High" ? "neg" : g.priority === "Medium" ? "warn" : ""}`}>{g.priority}</span>
                  </div>
                </div>
                <div className="bar" style={{ marginTop: 10 }}>
                  <i style={{ width: `${pct}%`, background: pct >= 80 ? "var(--pos)" : pct >= 50 ? "var(--accent)" : "var(--warn)" }}/>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col" style={{ gap: "var(--gutter)" }}>
          <div className="card">
            <div className="card-head">
              <h3>{goal.name}</h3>
              <span className="chip">{goal.category}</span>
            </div>
            <div className="grid grid-2">
              <div className="metric">
                <div className="label">Current savings</div>
                <div className="value"><Money value={goal.current} ccy={ccy}/></div>
              </div>
              <div className="metric">
                <div className="label">Target</div>
                <div className="value"><Money value={goal.target} ccy={ccy}/></div>
              </div>
              <div className="metric">
                <div className="label">Monthly contribution</div>
                <div className="value"><Money value={goal.monthly} ccy={ccy}/></div>
              </div>
              <div className="metric">
                <div className="label">Target year</div>
                <div className="value">{goal.targetYear}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Goal planner</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Growth rate (%)", value: growth, onChange: setGrowth, min: 0, max: 20, step: 0.5 },
                { label: `Years (${years}y → ${2026 + years})`, value: years, onChange: setYears, min: 1, max: 40, step: 1 },
                { label: "Inflation (%)", value: inflation, onChange: setInflation, min: 0, max: 10, step: 0.5 },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--ink-3)" }}>{s.label}</span>
                    <span className="num" style={{ fontWeight: 600 }}>{s.value}%</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={e => s.onChange(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent)" }}/>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px", background: gap >= 0 ? "var(--pos-soft)" : "var(--neg-soft)", borderRadius: "var(--r)", marginTop: 8 }}>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Projected vs inflation-adjusted target</div>
              <div className="num" style={{ fontSize: 18, fontWeight: 700, color: gap >= 0 ? "var(--pos)" : "var(--neg)", marginTop: 4 }}>
                {gap >= 0 ? "Surplus: " : "Gap: "}<Money value={Math.abs(gap)} ccy={ccy}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Projected growth — {goal.name}</h3></div>
        <AreaPerf series={[{ name: "Projected value", data: downsampledProjection, color: "var(--accent)" }]} height={200}/>
      </div>
    </div>
  );
}

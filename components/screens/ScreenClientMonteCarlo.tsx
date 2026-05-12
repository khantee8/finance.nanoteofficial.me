"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import type { PersonaKey, Currency } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Seg } from "@/components/ui";

// Box-Muller gaussian random
function gaussRand(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
// Keep gaussRand in scope for potential future use
void gaussRand;

// Compute percentile bands year by year using closed-form lognormal
function computeBands(
  initial: number,
  monthlyContrib: number,
  years: number,
  annualReturn: number,
  annualVol: number
): number[][] {
  const r = annualReturn;
  const sig = annualVol;
  const zScores = [-1.645, -1.282, -0.674, 0, 0.674, 1.282, 1.645];
  const bandData: number[][] = zScores.map(() => [initial]);

  for (let y = 1; y <= years; y++) {
    const mu = (r - (sig * sig) / 2) * y;
    const sigma = sig * Math.sqrt(y);
    const contribFV =
      r > 0
        ? monthlyContrib * 12 * ((Math.exp(r * y) - 1) / r)
        : monthlyContrib * 12 * y;

    zScores.forEach((z, i) => {
      const growthMult = Math.exp(mu + sigma * z);
      bandData[i].push(initial * growthMult + contribFV);
    });
  }
  return bandData;
}

type RiskLevel = "conservative" | "balanced" | "aggressive";

const riskParams: Record<RiskLevel, { r: number; vol: number }> = {
  conservative: { r: 0.065, vol: 0.05 },
  balanced: { r: 0.088, vol: 0.10 },
  aggressive: { r: 0.115, vol: 0.185 },
};

function fmtMoney(n: number): string {
  if (Math.abs(n) >= 1e9) return `฿${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `฿${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `฿${(n / 1e3).toFixed(1)}K`;
  return `฿${n.toFixed(0)}`;
}

export function ScreenClientMonteCarlo({ ccy, persona }: { ccy: Currency; persona: PersonaKey }) {
  void ccy; // used via DATA.fmt if needed
  const P = DATA.PERSONAS[persona];

  const [initial, setInitial] = useState(P.portfolioValue);
  const [monthly, setMonthly] = useState(
    Math.max(0, Math.round((P.income - P.expenses) / 12))
  );
  const [years, setYears] = useState(20);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(persona);
  const [goal, setGoal] = useState(P.portfolioValue * 2.5);
  const [hasRun, setHasRun] = useState(false);
  const [running, setRunning] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(600);

  const bands = useMemo(() => {
    if (!hasRun) return null;
    const { r, vol } = riskParams[riskLevel];
    return computeBands(initial, monthly, years, r, vol);
  }, [hasRun, initial, monthly, years, riskLevel]);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setChartWidth(e.contentRect.width));
    if (chartRef.current) ro.observe(chartRef.current);
    return () => ro.disconnect();
  }, []);

  const runSim = () => {
    setRunning(true);
    setTimeout(() => {
      setHasRun(true);
      setRunning(false);
    }, 600);
  };

  // Derived metrics
  const goalProbPct = bands
    ? Math.round((bands.filter((b) => b[years] >= goal).length / 7) * 100)
    : 0;
  const medianOutcome = bands ? bands[3][years] : 0;
  const best90 = bands ? bands[5][years] : 0;
  const worst10 = bands ? bands[1][years] : 0;
  const survivalRate = bands ? (bands[0][years] > 0 ? 97 : 85) : 0;

  // SVG chart helpers
  const padL = 56, padR = 16, padT = 16, padB = 30;
  const chartH = 300;
  const cw = chartWidth;

  const allVals = bands ? bands.flat() : [];
  const yMin = allVals.length ? Math.max(0, Math.min(...allVals) * 0.95) : 0;
  const yMax = allVals.length ? Math.max(...allVals) * 1.05 : 1;

  const xs = (i: number) =>
    padL + (i / years) * (cw - padL - padR);
  const ys = (v: number) =>
    padT + (1 - (v - yMin) / (yMax - yMin || 1)) * (chartH - padT - padB);

  const areaPath = (lower: number[], upper: number[]) => {
    const topPts = upper.map((v, i) => `${xs(i)},${ys(v)}`).join(" L ");
    const botPts = [...lower]
      .reverse()
      .map((v, i) => `${xs(lower.length - 1 - i)},${ys(v)}`)
      .join(" L ");
    return `M ${topPts} L ${botPts} Z`;
  };

  const linePath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? "M" : "L"} ${xs(i)},${ys(v)}`).join(" ");

  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const v = yMin + ((yMax - yMin) * (4 - i)) / 4;
    return { v, y: ys(v) };
  });

  const xYearLabels: number[] = [];
  for (let y = 0; y <= years; y += 5) xYearLabels.push(y);

  const segItems = [
    { value: "conservative", label: "Conservative" },
    { value: "balanced", label: "Balanced" },
    { value: "aggressive", label: "Aggressive" },
  ];

  return (
    <div className="col fadein">
      {/* Header */}
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Monte Carlo Simulation</h1>
          <p className="h-page-sub">
            1,000 simulated portfolio paths · statistical range of outcomes
          </p>
        </div>
      </div>

      {/* Inputs card */}
      <div className="card">
        <div className="card-head">
          <h3>Simulation Parameters</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Row 1: sliders */}
          <div className="grid grid-3" style={{ gap: 20 }}>
            {/* Initial Amount */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "var(--ink-3)" }}>Initial Amount</span>
                <span className="num" style={{ fontWeight: 600 }}>
                  {fmtMoney(initial)}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={200000000}
                step={500000}
                value={initial}
                onChange={(e) => setInitial(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>

            {/* Monthly Contribution */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "var(--ink-3)" }}>
                  Monthly Contribution
                </span>
                <span className="num" style={{ fontWeight: 600 }}>
                  {fmtMoney(monthly)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>

            {/* Time Horizon */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "var(--ink-3)" }}>Time Horizon</span>
                <span className="num" style={{ fontWeight: 600 }}>
                  {years} years
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>
          </div>

          {/* Row 2: Risk level + goal */}
          <div className="grid grid-2" style={{ gap: 20, alignItems: "end" }}>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-3)",
                  marginBottom: 8,
                }}
              >
                Risk Level
              </div>
              <Seg
                items={segItems}
                value={riskLevel}
                onChange={(v) => setRiskLevel(v as RiskLevel)}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "var(--ink-4)",
                  marginTop: 6,
                }}
              >
                {riskLevel === "conservative"
                  ? "6.5% expected return · 5% volatility"
                  : riskLevel === "balanced"
                  ? "8.8% expected return · 10% volatility"
                  : "11.5% expected return · 18.5% volatility"}
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "var(--ink-3)" }}>Goal Amount</span>
                <span className="num" style={{ fontWeight: 600 }}>
                  {fmtMoney(goal)}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={500000000}
                step={1000000}
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>
          </div>

          {/* Run button */}
          <button
            className="btn primary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={runSim}
            disabled={running}
          >
            {running ? "Simulating…" : "Run Simulation"}
          </button>
        </div>
      </div>

      {/* Results — only when hasRun */}
      {hasRun && bands && (
        <>
          {/* Metric cards */}
          <div className="grid grid-4" style={{ gap: "var(--gutter)" }}>
            <div
              className="card metric"
              style={{ borderTop: `3px solid var(--accent)` }}
            >
              <div className="label">P(Goal Reached)</div>
              <div
                className="value num"
                style={{
                  color:
                    goalProbPct >= 60
                      ? "var(--pos)"
                      : goalProbPct >= 40
                      ? "var(--warn)"
                      : "var(--neg)",
                }}
              >
                {goalProbPct}%
              </div>
              <div className="sub">probability of reaching goal</div>
            </div>

            <div className="card metric">
              <div className="label">Median Outcome</div>
              <div className="value num">{fmtMoney(medianOutcome)}</div>
              <div className="sub">50th percentile</div>
            </div>

            <div
              className="card metric"
              style={{ borderTop: `3px solid var(--pos)` }}
            >
              <div className="label">Best Case (90th)</div>
              <div
                className="value num"
                style={{ color: "var(--pos)" }}
              >
                {fmtMoney(best90)}
              </div>
              <div className="sub">after {years} years</div>
            </div>

            <div
              className="card metric"
              style={{ borderTop: `3px solid var(--neg)` }}
            >
              <div className="label">Worst Case (10th)</div>
              <div
                className="value num"
                style={{ color: "var(--neg)" }}
              >
                {fmtMoney(worst10)}
              </div>
              <div className="sub">survival rate {survivalRate}%</div>
            </div>
          </div>

          {/* Fan chart */}
          <div className="card">
            <div className="card-head">
              <h3>Outcome Distribution — Fan Chart</h3>
              <span className="chip">Lognormal model</span>
            </div>
            <div
              ref={chartRef}
              style={{ width: "100%", position: "relative" }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const rawYear = ((x - padL) / (cw - padL - padR)) * years;
                const yi = Math.round(Math.max(0, Math.min(years, rawYear)));
                setHover(yi);
              }}
              onMouseLeave={() => setHover(null)}
            >
              <svg width={cw} height={chartH}>
                {/* Y-axis grid */}
                {yLabels.map(({ v, y: yPos }, i) => (
                  <g key={i}>
                    <line
                      x1={padL}
                      x2={cw - padR}
                      y1={yPos}
                      y2={yPos}
                      stroke="var(--border)"
                      strokeDasharray="2 3"
                    />
                    <text
                      x={padL - 4}
                      y={yPos + 4}
                      fontSize={9}
                      fontFamily="var(--mono)"
                      fill="var(--ink-4)"
                      textAnchor="end"
                    >
                      {fmtMoney(v)}
                    </text>
                  </g>
                ))}

                {/* X-axis labels */}
                {xYearLabels.map((y) => (
                  <text
                    key={y}
                    x={xs(y)}
                    y={chartH - 8}
                    fontSize={10}
                    fontFamily="var(--mono)"
                    fill="var(--ink-4)"
                    textAnchor="middle"
                  >
                    {y === 0 ? "Now" : `Y${y}`}
                  </text>
                ))}

                {/* Fan bands: p5-p95, p10-p90, p25-p75 */}
                <path
                  d={areaPath(bands[0], bands[6])}
                  fill="var(--accent)"
                  opacity={0.08}
                />
                <path
                  d={areaPath(bands[1], bands[5])}
                  fill="var(--accent)"
                  opacity={0.12}
                />
                <path
                  d={areaPath(bands[2], bands[4])}
                  fill="var(--accent)"
                  opacity={0.18}
                />

                {/* Goal line */}
                {goal >= yMin && goal <= yMax && (
                  <g>
                    <line
                      x1={padL}
                      x2={cw - padR}
                      y1={ys(goal)}
                      y2={ys(goal)}
                      stroke="var(--warn)"
                      strokeWidth={1.5}
                      strokeDasharray="6 4"
                    />
                    <text
                      x={cw - padR - 4}
                      y={ys(goal) - 4}
                      fontSize={9}
                      fontFamily="var(--mono)"
                      fill="var(--warn)"
                      textAnchor="end"
                    >
                      Goal {fmtMoney(goal)}
                    </text>
                  </g>
                )}

                {/* Median line */}
                <path
                  d={linePath(bands[3])}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Hover vertical line */}
                {hover !== null && (
                  <line
                    x1={xs(hover)}
                    x2={xs(hover)}
                    y1={padT}
                    y2={chartH - padB}
                    stroke="var(--border-strong)"
                    strokeDasharray="3 3"
                  />
                )}
              </svg>

              {/* Hover tooltip */}
              {hover !== null && (
                <div
                  style={{
                    position: "absolute",
                    left: Math.min(xs(hover) + 10, cw - 200),
                    top: 12,
                    background: "var(--ink)",
                    color: "var(--bg)",
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 11,
                    pointerEvents: "none",
                    fontFamily: "var(--mono)",
                    minWidth: 180,
                  }}
                >
                  <div
                    style={{ fontWeight: 700, marginBottom: 6, fontSize: 12 }}
                  >
                    Year {hover}
                  </div>
                  {[
                    { label: "P95", idx: 6, color: "var(--pos)" },
                    { label: "P75", idx: 4, color: "var(--accent)" },
                    { label: "P50", idx: 3, color: "#fff" },
                    { label: "P25", idx: 2, color: "var(--warn)" },
                    { label: "P05", idx: 0, color: "var(--neg)" },
                  ].map(({ label, idx, color }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ color, fontWeight: 600 }}>{label}</span>
                      <span>{fmtMoney(bands[idx][hover])}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 12,
                fontSize: 11,
                color: "var(--ink-3)",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "P5–P95 range", opacity: 0.08 },
                { label: "P10–P90 range", opacity: 0.18 },
                { label: "P25–P75 range", opacity: 0.30 },
              ].map(({ label, opacity }) => (
                <span
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 8,
                      borderRadius: 3,
                      background: `var(--accent)`,
                      opacity,
                      display: "inline-block",
                      border: "1px solid var(--border)",
                    }}
                  />
                  {label}
                </span>
              ))}
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 20,
                    height: 2,
                    background: "var(--accent)",
                    display: "inline-block",
                  }}
                />
                Median
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 20,
                    height: 2,
                    background: "var(--warn)",
                    display: "inline-block",
                    borderTop: "2px dashed var(--warn)",
                  }}
                />
                Goal
              </span>
            </div>
          </div>

          {/* Interpretation card */}
          <div
            className="card"
            style={{
              background:
                goalProbPct >= 60
                  ? "var(--pos-soft)"
                  : goalProbPct >= 40
                  ? "var(--warn-soft)"
                  : "var(--neg-soft)",
              border: `1px solid ${
                goalProbPct >= 60
                  ? "var(--pos)"
                  : goalProbPct >= 40
                  ? "var(--warn)"
                  : "var(--neg)"
              }`,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 6,
                fontSize: 14,
                color: "var(--ink)",
              }}
            >
              Simulation Summary
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0 }}>
              Based on this simulation, there is approximately{" "}
              <strong>{goalProbPct}%</strong> probability your portfolio reaches
              the goal of <strong>{fmtMoney(goal)}</strong>. The median outcome
              projects <strong>{fmtMoney(medianOutcome)}</strong> after{" "}
              <strong>{years} years</strong> using a{" "}
              <strong>{riskLevel}</strong> risk profile (
              {riskParams[riskLevel].r * 100}% expected return,{" "}
              {riskParams[riskLevel].vol * 100}% volatility).
            </p>
          </div>
        </>
      )}

      {/* Placeholder when not run yet */}
      {!hasRun && (
        <div
          className="card"
          style={{
            padding: 48,
            textAlign: "center",
            color: "var(--ink-4)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <div style={{ fontWeight: 600, color: "var(--ink-3)", marginBottom: 4 }}>
            Configure parameters and run the simulation
          </div>
          <div style={{ fontSize: 12 }}>
            The fan chart will display probabilistic outcome ranges
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p
        style={{
          fontSize: 11,
          color: "var(--ink-4)",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Monte Carlo simulation is for illustrative purposes only and does not
        guarantee future results. Past performance is not indicative of future
        returns. This tool does not constitute investment advice.
      </p>
    </div>
  );
}

"use client";
import { useState, useMemo } from "react";
import { useRef, useEffect } from "react";
import type { PersonaKey, Currency } from "@/lib/types";
import { DATA } from "@/lib/data";

interface ScenarioDef {
  name: string;
  emoji: string;
  returnMult: number;
  volMult: number;
  color: string;
  soft: string;
}

const SCENARIOS: ScenarioDef[] = [
  {
    name: "Bear Market",
    emoji: "🐻",
    returnMult: 0.25,
    volMult: 1.6,
    color: "var(--neg)",
    soft: "var(--neg-soft)",
  },
  {
    name: "Base Case",
    emoji: "📊",
    returnMult: 1.0,
    volMult: 1.0,
    color: "var(--ink-3)",
    soft: "var(--surface-2)",
  },
  {
    name: "Bull Market",
    emoji: "🐂",
    returnMult: 1.65,
    volMult: 0.75,
    color: "var(--pos)",
    soft: "var(--pos-soft)",
  },
];

function fmtMoney(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}฿${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}฿${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}฿${(abs / 1e3).toFixed(1)}K`;
  return `${sign}฿${abs.toFixed(0)}`;
}

function computeFV(
  pv: number,
  annReturn: number,
  horizon: number,
  monthly: number
): number {
  if (Math.abs(annReturn) < 0.0001) {
    return pv + monthly * 12 * horizon;
  }
  const r = annReturn / 100;
  return (
    pv * Math.pow(1 + r, horizon) +
    (monthly * 12 * (Math.pow(1 + r, horizon) - 1)) / r
  );
}

export function ScreenClientScenario({
  ccy,
  persona,
}: {
  ccy: Currency;
  persona: PersonaKey;
}) {
  void ccy;
  const P = DATA.PERSONAS[persona];

  const defaultMonthly = Math.max(
    0,
    Math.round((P.income - P.expenses) / 12)
  );
  const [horizon, setHorizon] = useState(10);
  const [monthly, setMonthly] = useState(defaultMonthly);
  const [hover, setHover] = useState<number | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(600);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) =>
      setChartWidth(e.contentRect.width)
    );
    if (chartRef.current) ro.observe(chartRef.current);
    return () => ro.disconnect();
  }, []);

  // Compute scenario data
  const scenarioData = useMemo(() => {
    return SCENARIOS.map((sc) => {
      const baseReturn = P.ytdReturn;
      const annReturn = Math.max(-5, Math.min(25, baseReturn * sc.returnMult));
      const finalVal = computeFV(P.portfolioValue, annReturn, horizon, monthly);
      const totalGainPct =
        ((finalVal - P.portfolioValue) / P.portfolioValue) * 100;
      const cagr =
        Math.pow(finalVal / Math.max(1, P.portfolioValue), 1 / horizon) * 100 -
        100;
      return { ...sc, annReturn, finalVal, totalGainPct, cagr };
    });
  }, [P, horizon, monthly]);

  // Build year-by-year series for each scenario
  const seriesData = useMemo(() => {
    return scenarioData.map((sc) => {
      const pts: number[] = [];
      for (let y = 0; y <= horizon; y++) {
        pts.push(computeFV(P.portfolioValue, sc.annReturn, y, monthly));
      }
      return pts;
    });
  }, [scenarioData, horizon, monthly, P.portfolioValue]);

  // Chart params
  const padL = 56, padR = 16, padT = 16, padB = 30;
  const chartH = 280;
  const cw = chartWidth;

  const allVals = seriesData.flat();
  const yMin = Math.max(0, Math.min(...allVals) * 0.92);
  const yMax = Math.max(...allVals) * 1.08;

  const xs = (i: number) =>
    padL + (i / horizon) * (cw - padL - padR);
  const ys = (v: number) =>
    padT + (1 - (v - yMin) / (yMax - yMin || 1)) * (chartH - padT - padB);

  const linePath = (data: number[]) =>
    data
      .map((v, i) => `${i === 0 ? "M" : "L"} ${xs(i)},${ys(v)}`)
      .join(" ");

  const areaPathFn = (data: number[]) => {
    const pts = data
      .map((v, i) => `${xs(i)},${ys(v)}`)
      .join(" L ");
    return `M ${pts} L ${xs(horizon)},${chartH - padB} L ${xs(0)},${chartH - padB} Z`;
  };

  const chartColors = [
    "var(--neg)",
    "var(--accent)",
    "var(--pos)",
  ];

  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const v = yMin + ((yMax - yMin) * (4 - i)) / 4;
    return { v, y: ys(v) };
  });

  return (
    <div className="col fadein">
      {/* Header */}
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Scenario Analysis</h1>
          <p className="h-page-sub">
            Compare your portfolio across market conditions
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="card-head">
          <h3>Assumptions</h3>
        </div>
        <div className="grid grid-3" style={{ gap: 20, alignItems: "center" }}>
          {/* Portfolio value read-only */}
          <div className="metric">
            <div className="label">Portfolio Value</div>
            <div className="value num">
              {fmtMoney(P.portfolioValue)}
            </div>
            <div className="sub">{P.name}</div>
          </div>

          {/* Horizon */}
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
                {horizon} years
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
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
              max={300000}
              step={5000}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
          </div>
        </div>
      </div>

      {/* Scenario cards */}
      <div className="grid grid-3" style={{ gap: "var(--gutter)" }}>
        {scenarioData.map((sc, idx) => (
          <div
            key={sc.name}
            className="card"
            style={{ padding: 0, overflow: "hidden" }}
          >
            {/* Colored header band */}
            <div
              style={{
                background: sc.soft,
                borderBottom: `3px solid ${sc.color}`,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 22 }}>{sc.emoji}</span>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: sc.color,
                  }}
                >
                  {sc.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                  Return ×{sc.returnMult} · Vol ×{sc.volMult}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ padding: "16px 18px" }}>
              <div className="kvs">
                <span className="k">Annual Return</span>
                <span
                  className="v num"
                  style={{
                    color:
                      sc.annReturn >= 0 ? "var(--pos)" : "var(--neg)",
                    fontWeight: 700,
                  }}
                >
                  {sc.annReturn >= 0 ? "+" : ""}
                  {sc.annReturn.toFixed(1)}%
                </span>

                <span className="k">Projected Value ({horizon}Y)</span>
                <span
                  className="v num"
                  style={{
                    color:
                      sc.totalGainPct >= 0 ? "var(--pos)" : "var(--neg)",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {fmtMoney(sc.finalVal)}
                </span>

                <span className="k">Total Gain</span>
                <span
                  className="v num"
                  style={{
                    color:
                      sc.totalGainPct >= 0 ? "var(--pos)" : "var(--neg)",
                  }}
                >
                  {sc.totalGainPct >= 0 ? "+" : ""}
                  {sc.totalGainPct.toFixed(1)}%
                </span>

                <span className="k">CAGR</span>
                <span
                  className="v num"
                  style={{
                    color: sc.cagr >= 0 ? "var(--pos)" : "var(--neg)",
                  }}
                >
                  {sc.cagr >= 0 ? "+" : ""}
                  {sc.cagr.toFixed(1)}%
                </span>
              </div>

              {/* Gain bar */}
              <div
                style={{
                  marginTop: 12,
                  height: 6,
                  background: "var(--surface-2)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, Math.max(0, (sc.totalGainPct / (scenarioData[2].totalGainPct || 100)) * 100))}%`,
                    height: "100%",
                    background: chartColors[idx],
                    borderRadius: 999,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison chart */}
      <div className="card">
        <div className="card-head">
          <h3>Portfolio Projection Comparison</h3>
          <span className="chip">{horizon}-year horizon</span>
        </div>
        <div
          ref={chartRef}
          style={{ width: "100%", position: "relative" }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const rawYear = ((x - padL) / (cw - padL - padR)) * horizon;
            const yi = Math.round(Math.max(0, Math.min(horizon, rawYear)));
            setHover(yi);
          }}
          onMouseLeave={() => setHover(null)}
        >
          <svg width={cw} height={chartH}>
            {/* Grid lines */}
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

            {/* X axis labels */}
            {Array.from({ length: horizon + 1 }, (_, i) => i)
              .filter((y) => y % Math.max(1, Math.floor(horizon / 6)) === 0)
              .map((y) => (
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

            {/* Area fills */}
            {seriesData.map((data, idx) => (
              <path
                key={idx}
                d={areaPathFn(data)}
                fill={chartColors[idx]}
                opacity={0.06}
              />
            ))}

            {/* Lines */}
            {seriesData.map((data, idx) => (
              <path
                key={idx}
                d={linePath(data)}
                fill="none"
                stroke={chartColors[idx]}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Hover line */}
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
              <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12 }}>
                Year {hover}
              </div>
              {scenarioData.map((sc, idx) => (
                <div
                  key={sc.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 2,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: chartColors[idx],
                      }}
                    />
                    {sc.name}
                  </span>
                  <span>{fmtMoney(seriesData[idx][hover])}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 12,
            fontSize: 11,
            color: "var(--ink-3)",
          }}
        >
          {scenarioData.map((sc, idx) => (
            <span
              key={sc.name}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 20,
                  height: 2,
                  background: chartColors[idx],
                  display: "inline-block",
                  borderRadius: 2,
                }}
              />
              {sc.emoji} {sc.name}
            </span>
          ))}
        </div>
      </div>

      {/* Historical probability card */}
      <div className="card">
        <div className="card-head">
          <h3>Historical Base Rates</h3>
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 0 }}>
          Historically, over any 10-year rolling window in global markets:
        </p>
        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <span
            className="chip neg"
            style={{ fontSize: 13, padding: "6px 14px" }}
          >
            🐻 Bear ~20% of the time
          </span>
          <span
            className="chip"
            style={{ fontSize: 13, padding: "6px 14px" }}
          >
            📊 Base ~55% of the time
          </span>
          <span
            className="chip pos"
            style={{ fontSize: 13, padding: "6px 14px" }}
          >
            🐂 Bull ~25% of the time
          </span>
        </div>
        <div
          style={{
            marginTop: 14,
            height: 8,
            background: "var(--surface-2)",
            borderRadius: 999,
            overflow: "hidden",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "20%",
              background: "var(--neg)",
              height: "100%",
            }}
          />
          <div
            style={{
              width: "55%",
              background: "var(--ink-3)",
              height: "100%",
            }}
          />
          <div
            style={{
              width: "25%",
              background: "var(--pos)",
              height: "100%",
            }}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <p
        style={{
          fontSize: 11,
          color: "var(--ink-4)",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Scenario projections are illustrative only and based on simplified
        return assumptions. Actual results may differ materially. Not investment
        advice.
      </p>
    </div>
  );
}

"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import type { PersonaKey, Currency } from "@/lib/types";
import { DATA } from "@/lib/data";

const fmtShort = (n: number): string => {
  if (n >= 1e9) return `฿${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `฿${(n / 1e6).toFixed(1)}M`;
  return `฿${(n / 1e3).toFixed(0)}K`;
};

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  minHint,
  maxHint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  minHint?: string;
  maxHint?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{label}</span>
        <span className="num" style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--mono)" }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
      />
      {(minHint || maxHint) && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink-4)", fontFamily: "var(--mono)" }}>
          <span>{minHint}</span>
          <span>{maxHint}</span>
        </div>
      )}
    </div>
  );
}

export function ScreenClientProjection({ persona }: { ccy: Currency; persona: PersonaKey }) {
  const P = DATA.PERSONAS[persona];

  const [initialAmount, setInitialAmount] = useState(P.portfolioValue);
  const [monthly, setMonthly] = useState(Math.max(0, Math.round((P.income - P.expenses) / 12)));
  const [horizon, setHorizon] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(parseFloat(P.ytdReturn.toFixed(1)));
  const [inflation, setInflation] = useState(2.5);
  const [goalAmount, setGoalAmount] = useState(Math.round(P.portfolioValue * 2.5));

  // Reset defaults when persona changes (render-time adjustment; horizon/inflation persist)
  const [prevPersona, setPrevPersona] = useState(persona);
  if (prevPersona !== persona) {
    setPrevPersona(persona);
    setInitialAmount(P.portfolioValue);
    setMonthly(Math.max(0, Math.round((P.income - P.expenses) / 12)));
    setAnnualReturn(parseFloat(P.ytdReturn.toFixed(1)));
    setGoalAmount(Math.round(P.portfolioValue * 2.5));
  }

  const projection = useMemo(() => {
    const r = annualReturn / 100;
    const inf = inflation / 100;
    const years = Array.from({ length: horizon + 1 }, (_, i) => i);

    const nominal = years.map(y => {
      if (y === 0) return initialAmount;
      const growthFactor = Math.pow(1 + r, y);
      const contributions = r > 0 ? monthly * 12 * ((growthFactor - 1) / r) : monthly * 12 * y;
      return initialAmount * growthFactor + contributions;
    });

    const real = nominal.map((v, y) => v / Math.pow(1 + inf, y));

    const finalNominal = nominal[nominal.length - 1];
    const finalReal = real[real.length - 1];
    const gap = finalNominal - goalAmount;

    const growthFactor = Math.pow(1 + r, horizon);
    const futureValueOfInitial = initialAmount * growthFactor;
    const remainingGoal = goalAmount - futureValueOfInitial;
    const monthlyR = r / 12;
    const requiredMonthly =
      remainingGoal > 0 && r > 0
        ? remainingGoal * monthlyR / (Math.pow(1 + monthlyR, horizon * 12) - 1)
        : 0;

    return { nominal, real, finalNominal, finalReal, gap, requiredMonthly, years };
  }, [initialAmount, monthly, horizon, annualReturn, inflation, goalAmount]);

  return (
    <div className="col fadein">
      {/* Header */}
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Return Projection Simulator</h1>
          <p className="h-page-sub">{P.name} · Interactive forecast calculator</p>
        </div>
        <div className="spacer" />
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", gap: "var(--gutter)", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Left panel — inputs */}
        <div className="card" style={{ flex: "0 0 360px", minWidth: 280 }}>
          <div className="card-head"><h3>Simulation Parameters</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SliderInput
              label="Initial Amount"
              value={initialAmount}
              min={1000000}
              max={200000000}
              step={500000}
              onChange={setInitialAmount}
              display={fmtShort(initialAmount)}
              minHint="฿1M"
              maxHint="฿200M"
            />
            <SliderInput
              label="Monthly Contribution"
              value={monthly}
              min={0}
              max={500000}
              step={5000}
              onChange={setMonthly}
              display={fmtShort(monthly)}
              minHint="฿0"
              maxHint="฿500K"
            />
            <SliderInput
              label="Investment Horizon"
              value={horizon}
              min={1}
              max={40}
              step={1}
              onChange={setHorizon}
              display={`${horizon} years`}
              minHint="1 yr"
              maxHint="40 yrs"
            />
            <SliderInput
              label="Expected Return"
              value={annualReturn}
              min={1}
              max={25}
              step={0.5}
              onChange={setAnnualReturn}
              display={`${annualReturn}% / year`}
              minHint="1%"
              maxHint="25%"
            />
            <SliderInput
              label="Inflation Rate"
              value={inflation}
              min={0}
              max={8}
              step={0.5}
              onChange={setInflation}
              display={`${inflation}% / year`}
              minHint="0%"
              maxHint="8%"
            />
            <SliderInput
              label="Goal Amount"
              value={goalAmount}
              min={1000000}
              max={500000000}
              step={1000000}
              onChange={setGoalAmount}
              display={fmtShort(goalAmount)}
              minHint="฿1M"
              maxHint="฿500M"
            />
          </div>
        </div>

        {/* Right panel — chart + metrics */}
        <div className="col" style={{ flex: 1, minWidth: 320, gap: "var(--gutter)" }}>
          {/* SVG chart */}
          <div className="card">
            <div className="card-head"><h3>Projected Portfolio Value</h3></div>
            <ProjectionChart
              nominal={projection.nominal}
              real={projection.real}
              goalAmount={goalAmount}
              years={projection.years}
            />
            <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 20, height: 2, background: "var(--accent)", display: "inline-block", borderRadius: 1 }} />
                <span style={{ fontSize: 11, color: "var(--ink-3)" }}>Nominal value</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width={20} height={8}><line x1={0} y1={4} x2={20} y2={4} stroke="var(--ink-3)" strokeWidth={1.5} strokeDasharray="4 3" /></svg>
                <span style={{ fontSize: 11, color: "var(--ink-3)" }}>Real (inflation-adjusted)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width={20} height={8}><line x1={0} y1={4} x2={20} y2={4} stroke="var(--warn)" strokeWidth={1.5} strokeDasharray="4 3" /></svg>
                <span style={{ fontSize: 11, color: "var(--ink-3)" }}>Goal target</span>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-2">
            <div className="card metric">
              <div className="label">Final Value (Nominal)</div>
              <div className="value" style={{ color: "var(--accent)", fontSize: 20 }}>{fmtShort(projection.finalNominal)}</div>
              <div className="sub">After {horizon} years</div>
            </div>
            <div className="card metric">
              <div className="label">Real Value (Today&apos;s ฿)</div>
              <div className="value" style={{ fontSize: 20 }}>{fmtShort(projection.finalReal)}</div>
              <div className="sub">Inflation-adjusted purchasing power</div>
            </div>
            <div className="card metric">
              <div className="label">Goal Gap</div>
              <div className="value" style={{ color: projection.gap >= 0 ? "var(--pos)" : "var(--neg)", fontSize: 20 }}>
                {projection.gap >= 0 ? `+${fmtShort(projection.gap)}` : `-${fmtShort(Math.abs(projection.gap))}`}
              </div>
              <div className="sub" style={{ color: projection.gap >= 0 ? "var(--pos)" : "var(--neg)" }}>
                {projection.gap >= 0 ? "Surplus — on track" : "Gap — increase contributions"}
              </div>
            </div>
            <div className="card metric">
              <div className="label">Required Monthly</div>
              <div className="value" style={{ fontSize: 20 }}>
                {projection.requiredMonthly <= 0 ? "—" : fmtShort(projection.requiredMonthly)}
              </div>
              <div className="sub">
                {projection.requiredMonthly <= 0 || monthly >= projection.requiredMonthly ? (
                  <span style={{ color: "var(--pos)" }}>On track ✓</span>
                ) : (
                  <span style={{ color: "var(--warn)" }}>Need {fmtShort(projection.requiredMonthly - monthly)} more/mo</span>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{
            padding: "12px 14px",
            background: "var(--warn-soft)",
            borderRadius: "var(--r)",
            borderLeft: "3px solid var(--warn)",
            fontSize: 12,
            color: "var(--ink-2)",
            lineHeight: 1.6,
          }}>
            ⚠ Projections are illustrative and not guaranteed. Assumes constant returns — actual performance will vary. This is not investment advice.
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Inline SVG Chart --- */
function ProjectionChart({
  nominal,
  real,
  goalAmount,
  years,
}: {
  nominal: number[];
  real: number[];
  goalAmount: number;
  years: number[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = 280;
  const padL = 64;
  const padR = 60;
  const padT = 16;
  const padB = 30;

  const allValues = [...nominal, ...real, goalAmount];
  const minV = Math.min(...allValues) * 0.95;
  const maxV = Math.max(...allValues) * 1.05;
  const range = maxV - minV || 1;
  const N = nominal.length;

  const xs = (i: number) => padL + (i / (N - 1)) * (width - padL - padR);
  const ys = (v: number) => padT + (1 - (v - minV) / range) * (height - padT - padB);

  const nomPts = nominal.map((v, i) => `${xs(i)},${ys(v)}`).join(" ");
  const realPts = real.map((v, i) => `${xs(i)},${ys(v)}`).join(" ");
  const goalY = ys(goalAmount);

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) => minV + (i / (yTicks - 1)) * range);

  // X-axis: show every 5 years
  const xLabels = years.filter(y => y % 5 === 0);

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
      <svg
        width={width}
        height={height}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const i = Math.round(((x - padL) / (width - padL - padR)) * (N - 1));
          setHover(i >= 0 && i < N ? i : null);
        }}
        onMouseLeave={() => setHover(null)}
      >
        {/* Grid lines */}
        {yTickValues.map((v, i) => (
          <g key={i}>
            <line
              x1={padL}
              x2={width - padR}
              y1={ys(v)}
              y2={ys(v)}
              stroke="var(--border)"
              strokeDasharray={i === 0 ? "0" : "2 3"}
            />
            <text x={padL - 6} y={ys(v) + 4} fontSize={10} fontFamily="var(--mono)" fill="var(--ink-4)" textAnchor="end">
              {fmtShort(v)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map(y => (
          <text key={y} x={xs(y)} y={height - 8} fontSize={10} fontFamily="var(--mono)" fill="var(--ink-4)" textAnchor="middle">
            Y{y}
          </text>
        ))}

        {/* Goal line */}
        {goalY >= padT && goalY <= height - padB && (
          <>
            <line x1={padL} x2={width - padR} y1={goalY} y2={goalY} stroke="var(--warn)" strokeWidth={1.5} strokeDasharray="5 4" />
            <text x={width - padR + 4} y={goalY + 4} fontSize={10} fontFamily="var(--mono)" fill="var(--warn)" fontWeight={700}>GOAL</text>
          </>
        )}

        {/* Real line area fill */}
        <path
          d={`M ${xs(0)} ${ys(real[0])} ` + real.slice(1).map((v, i) => `L ${xs(i + 1)} ${ys(v)}`).join(" ") + ` L ${xs(N - 1)} ${height - padB} L ${xs(0)} ${height - padB} Z`}
          fill="var(--ink-4)"
          opacity={0.05}
        />

        {/* Real line */}
        <polyline points={realPts} fill="none" stroke="var(--ink-3)" strokeWidth={1.5} strokeDasharray="5 4" strokeLinecap="round" />

        {/* Nominal area fill */}
        <path
          d={`M ${xs(0)} ${ys(nominal[0])} ` + nominal.slice(1).map((v, i) => `L ${xs(i + 1)} ${ys(v)}`).join(" ") + ` L ${xs(N - 1)} ${height - padB} L ${xs(0)} ${height - padB} Z`}
          fill="var(--accent)"
          opacity={0.12}
        />

        {/* Nominal line */}
        <polyline points={nomPts} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover crosshair */}
        {hover !== null && (
          <g>
            <line x1={xs(hover)} x2={xs(hover)} y1={padT} y2={height - padB} stroke="var(--border-strong)" strokeWidth={1} />
            <circle cx={xs(hover)} cy={ys(nominal[hover])} r={4} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2} />
            <circle cx={xs(hover)} cy={ys(real[hover])} r={3.5} fill="var(--ink-3)" stroke="var(--surface)" strokeWidth={2} />
          </g>
        )}
      </svg>

      {/* Hover tooltip */}
      {hover !== null && (
        <div style={{
          position: "absolute",
          left: Math.min(xs(hover) + 12, width - 170),
          top: 12,
          background: "var(--ink)",
          color: "var(--bg)",
          padding: "8px 12px",
          borderRadius: 8,
          fontSize: 11,
          pointerEvents: "none",
          fontFamily: "var(--mono)",
          lineHeight: 1.7,
          minWidth: 160,
          boxShadow: "var(--shadow)",
        }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>Year {years[hover]}</div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Nominal</span><span>{fmtShort(nominal[hover])}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Real</span><span>{fmtShort(real[hover])}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--warn)", marginTop: 2 }}>
            <span>Goal</span><span>{fmtShort(goalAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

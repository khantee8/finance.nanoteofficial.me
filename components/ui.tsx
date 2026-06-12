"use client";
import React, { useRef, useEffect, useState } from "react";
import type { Currency } from "@/lib/types";
import { DATA } from "@/lib/data";

/* ---- Icons ---- */
type IconName = "dashboard"|"users"|"user"|"chart"|"target"|"shield"|"sparkles"|"doc"|"lock"|"gear"|"bell"|"search"|"plus"|"arrowUp"|"arrowDown"|"arrowRight"|"download"|"filter"|"calendar"|"check"|"warn"|"info"|"bot"|"play"|"flag"|"home"|"graduate"|"coins"|"briefcase"|"send"|"moon"|"sun"|"chevronDown"|"chevronRight"|"pin";

export function Icon({ name, size = 16, stroke = 1.6 }: { name: IconName; size?: number; stroke?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    users: <><circle cx="9" cy="8" r="3.5"/><path d="M3 20c.8-3.6 3.4-5.5 6-5.5s5.2 1.9 6 5.5"/><path d="M16 11a3 3 0 1 0 0-6"/><path d="M20 18c-.4-2-1.6-3.3-3-4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/></>,
    chart: <><path d="M3 3v18h18"/><path d="M7 14l4-5 3 3 5-7"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    shield: <><path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></>,
    sparkles: <><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/></>,
    doc: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrowUp: <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrowDown: <><path d="M12 5v14M5 12l7 7 7-7"/></>,
    arrowRight: <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
    filter: <><path d="M3 5h18l-7 9v6l-4-2v-4z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    check: <><path d="m5 12 5 5L20 7"/></>,
    warn: <><path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18v.5"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8v.5M12 11v6"/></>,
    bot: <><rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M12 8V4M9 4h6"/></>,
    play: <><path d="M6 4l14 8L6 20z"/></>,
    flag: <><path d="M4 21V4h12l-2 4 2 4H4"/></>,
    home: <><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/></>,
    graduate: <><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></>,
    coins: <><ellipse cx="9" cy="7" rx="6" ry="2.5"/><path d="M3 7v5c0 1.4 2.7 2.5 6 2.5"/><path d="M3 12v5c0 1.4 2.7 2.5 6 2.5"/><ellipse cx="15" cy="14" rx="6" ry="2.5"/><path d="M9 14v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></>,
    send: <><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></>,
    moon: <><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></>,
    chevronDown: <><path d="m6 9 6 6 6-6"/></>,
    chevronRight: <><path d="m9 6 6 6-6 6"/></>,
    pin: <><path d="M12 22V14"/><path d="M5 14h14l-2-3V5H7v6z"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

/* ---- Money & Pct formatters ---- */
export function Money({ value, ccy = "THB", full = false }: { value: number; ccy?: Currency; full?: boolean }) {
  const fx = DATA.FX[ccy] ?? 1;
  const v = value * fx;
  return <span className="num tnum">{full ? DATA.fmt.moneyFull(v, ccy) : DATA.fmt.money(v, ccy)}</span>;
}

export function Pct({ value, dec = 2 }: { value: number; dec?: number }) {
  return <span className="num tnum">{DATA.fmt.pct(value, dec)}</span>;
}

export function Delta({ value, dec = 2, suffix = "%" }: { value: number; dec?: number; suffix?: string }) {
  const cls = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const sign = value > 0 ? "▲" : value < 0 ? "▼" : "•";
  return <span className={`delta ${cls}`}>{sign} {Math.abs(value).toFixed(dec)}{suffix}</span>;
}

export function Avatar({ initials, size = 32, color }: { initials: string; size?: number; color?: string }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, background: color || undefined }}>
      {initials}
    </div>
  );
}

export function Badge({ tone = "neutral", swatch, children }: { tone?: string; swatch?: string; children: React.ReactNode }) {
  return (
    <span className={`chip ${tone}`}>
      {swatch && <span className="swatch" style={{ background: swatch }}/>}
      {children}
    </span>
  );
}

/* ---- Charts ---- */
export function Sparkline({ data, width = 120, height = 32, color, area = true, stroke = 1.6, labels }: { data: number[]; width?: number; height?: number; color?: string; area?: boolean; stroke?: number; labels?: string[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  if (!data || data.length === 0) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const pad = 2;
  const xs = (i: number) => pad + (i * (width - pad * 2)) / (data.length - 1);
  const ys = (v: number) => height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);
  const pts = data.map((v, i) => `${xs(i)},${ys(v)}`).join(" ");
  const isUp = data[data.length - 1] >= data[0];
  const c = color || (isUp ? "oklch(0.62 0.16 155)" : "oklch(0.58 0.20 25)");
  const areaPath = `M ${xs(0)} ${height} L ${pts.split(" ").map((p) => `${p}`).join(" L ")} L ${xs(data.length - 1)} ${height} Z`;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const i = Math.round(((x - pad) / (width - pad * 2)) * (data.length - 1));
          setHoverIdx(i >= 0 && i < data.length ? i : null);
        }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {area && <path d={areaPath} fill={c} opacity="0.12"/>}
        <polyline points={pts} fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
        {hoverIdx !== null && (
          <circle cx={xs(hoverIdx)} cy={ys(data[hoverIdx])} r={3} fill={c} stroke="var(--surface)" strokeWidth={1.5}/>
        )}
      </svg>
      {hoverIdx !== null && (
        <div style={{ position: "absolute", left: Math.min(xs(hoverIdx) + 6, width - 80), top: 0, background: "var(--ink)", color: "var(--bg)", padding: "4px 7px", borderRadius: 5, fontSize: 10, pointerEvents: "none", fontFamily: "var(--mono)", zIndex: 10, whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: 600 }}>{labels ? labels[hoverIdx] : `Day ${hoverIdx + 1}`}</div>
          <div>{data[hoverIdx].toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

export function AreaPerf({
  series,
  height = 220,
  periods,
  showPeriodFilter = false,
  showNominalToggle = false,
}: {
  series: { name: string; data: number[]; color: string; style?: string }[];
  height?: number;
  periods?: { label: string; months: number }[];
  showPeriodFilter?: boolean;
  showNominalToggle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [showReal, setShowReal] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  if (!series?.[0]) return null;

  // Apply period slicing
  let activeSeries = series;
  if (showPeriodFilter && periods && periods.length > 0) {
    const p = periods[selectedPeriod];
    activeSeries = series.map(s => ({
      ...s,
      data: p.months > 0 ? s.data.slice(-p.months) : s.data,
    }));
  }

  // Apply inflation adjustment
  const slicedData = showReal
    ? activeSeries.map(s => ({
        ...s,
        data: s.data.map((v, i) => v * Math.pow(0.975, i / 12)),
      }))
    : activeSeries;

  const N = slicedData[0].data.length;
  const all = slicedData.flatMap(s => s.data);
  const min = Math.min(...all), max = Math.max(...all);
  const range = max - min || 1;
  const padL = 40, padR = 14, padT = 12, padB = 26;
  const w = width, h = height;
  const xs = (i: number) => padL + (i * (w - padL - padR)) / (N - 1);
  const ys = (v: number) => padT + (1 - (v - min) / range) * (h - padT - padB);
  const months = ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"];
  const gridLines = 4;

  const showControls = (showPeriodFilter && periods && periods.length > 0) || showNominalToggle;

  return (
    <div ref={ref} style={{ width: "100%", position: "relative" }}>
      {showControls && (
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
          {showNominalToggle && (
            <button
              onClick={() => setShowReal(v => !v)}
              style={{ padding: "3px 8px", borderRadius: 999, border: "1px solid var(--border)", background: showReal ? "var(--accent)" : "var(--surface)", color: showReal ? "white" : "var(--ink-3)", fontSize: 10, fontWeight: 600, cursor: "pointer" }}
            >
              {showReal ? "Inflation-adj." : "Nominal"}
            </button>
          )}
          {showPeriodFilter && periods && periods.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelectedPeriod(i)}
              style={{ padding: "3px 8px", borderRadius: 999, border: "1px solid var(--border)", background: selectedPeriod === i ? "var(--accent)" : "var(--surface)", color: selectedPeriod === i ? "white" : "var(--ink-3)", fontSize: 10, fontWeight: 600, cursor: "pointer" }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <svg width={w} height={h}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const i = Math.round(((x - padL) / (w - padL - padR)) * (N - 1));
          setHover(i >= 0 && i < N ? i : null);
        }}
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: gridLines + 1 }, (_, i) => {
          const y = padT + (i * (h - padT - padB)) / gridLines;
          const v = max - (i * range) / gridLines;
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="var(--border)" strokeDasharray={i === gridLines ? "0" : "2 3"}/>
              <text x={8} y={y + 4} fontSize="10" fontFamily="var(--mono)" fill="var(--ink-4)">{v.toFixed(0)}</text>
            </g>
          );
        })}
        {months.slice(0, N).map((m, i) => (
          <text key={m} x={xs(i)} y={h - 8} fontSize="10" fill="var(--ink-4)" textAnchor="middle" fontFamily="var(--mono)">{m}</text>
        ))}
        {slicedData.map((s, si) => {
          const pts = s.data.map((v, i) => `${xs(i)},${ys(v)}`).join(" ");
          if (s.style === "dashed") return <polyline key={si} points={pts} fill="none" stroke={s.color} strokeWidth="1.5" strokeDasharray="4 4"/>;
          const areaPath = `M ${xs(0)} ${ys(s.data[0])} ` + s.data.slice(1).map((v, i) => `L ${xs(i+1)} ${ys(v)}`).join(" ") + ` L ${xs(N-1)} ${h-padB} L ${xs(0)} ${h-padB} Z`;
          return (
            <g key={si}>
              <path d={areaPath} fill={s.color} opacity="0.10"/>
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"/>
            </g>
          );
        })}
        {hover !== null && (
          <g>
            <line x1={xs(hover)} x2={xs(hover)} y1={padT} y2={h-padB} stroke="var(--border-strong)"/>
            {slicedData.map((s, si) => (
              <circle key={si} cx={xs(hover!)} cy={ys(s.data[hover!])} r="3.5" fill={s.color} stroke="var(--surface)" strokeWidth="2"/>
            ))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div style={{ position: "absolute", left: Math.min(xs(hover) + 8, w - 160), top: 8, background: "var(--ink)", color: "var(--bg)", padding: "8px 10px", borderRadius: 8, fontSize: 11, pointerEvents: "none", fontFamily: "var(--mono)" }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{months[hover % months.length]} 2026</div>
          {slicedData.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: s.color, marginRight: 4 }}/>{s.name}</span>
              <span>{s.data[hover!].toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Donut({
  data,
  size = 200,
  thickness = 28,
  centerLabel,
  centerValue,
  labels,
}: {
  data: { weight: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  labels?: string[];
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const total = data.reduce((s, d) => s + d.weight, 0);
  const r = size / 2 - 2;
  const inner = r - thickness;
  const cx = size / 2, cy = size / 2;
  const angles: { start: number; end: number }[] = [];
  for (let i = 0, acc = -Math.PI / 2; i < data.length; i++) {
    const end = acc + (data[i].weight / total) * Math.PI * 2;
    angles.push({ start: acc, end });
    acc = end;
  }
  const slices = data.map((d, i) => {
    const { start: a, end: a2 } = angles[i];
    const large = a2 - a > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(a), y1 = cy + r * Math.sin(a);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const x3 = cx + inner * Math.cos(a2), y3 = cy + inner * Math.sin(a2);
    const x4 = cx + inner * Math.cos(a), y4 = cy + inner * Math.sin(a);
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`;
    const pct = ((d.weight / total) * 100).toFixed(1);
    const idx = i;
    return (
      <path
        key={i}
        d={path}
        fill={d.color}
        opacity={hoveredIdx === null || hoveredIdx === idx ? 1 : 0.5}
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setHoveredIdx(idx)}
        onMouseLeave={() => setHoveredIdx(null)}
        data-pct={pct}
      />
    );
  });

  return (
    <div
      style={{ position: "relative", width: size, height: size }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      <svg width={size} height={size}>{slices}</svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{centerLabel}</div>
          <div className="num" style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>{centerValue}</div>
        </div>
      </div>
      {hoveredIdx !== null && (
        <div style={{
          position: "absolute",
          left: Math.min(mousePos.x + 10, size - 110),
          top: Math.max(mousePos.y - 36, 4),
          background: "var(--ink)",
          color: "var(--bg)",
          padding: "5px 9px",
          borderRadius: 6,
          fontSize: 11,
          pointerEvents: "none",
          fontFamily: "var(--mono)",
          zIndex: 10,
          whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600 }}>{labels ? labels[hoveredIdx] : `Segment ${hoveredIdx + 1}`}</div>
          <div>{((data[hoveredIdx].weight / total) * 100).toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}

export function ProgressRing({ value, max = 100, size = 80, thickness = 8, color = "var(--accent)", label }: { value: number; max?: number; size?: number; thickness?: number; color?: string; label?: string }) {
  const r = size / 2 - thickness;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={thickness}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={thickness}
          strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round"/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div className="num" style={{ fontSize: size * 0.22, fontWeight: 700, color: "var(--ink)" }}>{Math.round(value)}</div>
          {label && <div style={{ fontSize: 9, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>}
        </div>
      </div>
    </div>
  );
}

export function HBar({ items, max }: { items: { label: string; value: number; color?: string; display?: string }[]; max?: number }) {
  const mx = max || Math.max(...items.map(i => i.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr 60px", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{it.label}</span>
          <div style={{ height: 8, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${(it.value / mx) * 100}%`, height: "100%", background: it.color || "var(--accent)", borderRadius: 999 }}/>
          </div>
          <span className="num" style={{ fontSize: 12, textAlign: "right", color: "var(--ink-2)" }}>{it.display || `${it.value}%`}</span>
        </div>
      ))}
    </div>
  );
}

export function Tabs({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="tabs">
      {items.map(it => (
        <button key={it} className={value === it ? "on" : ""} onClick={() => onChange(it)}>{it}</button>
      ))}
    </div>
  );
}

export function Seg({ items, value, onChange }: { items: ({ value: string; label: string } | string)[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="segctl">
      {items.map(it => {
        const v = typeof it === "string" ? it : it.value;
        const l = typeof it === "string" ? it : it.label;
        return <button key={v} className={value === v ? "on" : ""} onClick={() => onChange(v)}>{l}</button>;
      })}
    </div>
  );
}

export function FilterPill({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return <button className={`filter ${active ? "on" : ""}`} onClick={onClick}>{children}</button>;
}

export function Empty({ icon = "info" as IconName, title, sub }: { icon?: IconName; title: string; sub?: string }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>
      <div style={{ display: "inline-grid", placeItems: "center", width: 48, height: 48, borderRadius: 999, background: "var(--surface-2)", marginBottom: 10 }}>
        <Icon name={icon} size={20}/>
      </div>
      <div style={{ fontWeight: 600, color: "var(--ink-2)", marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 12 }}>{sub}</div>}
    </div>
  );
}

export function ScatterPlot({
  items, width, height = 240, xLabel = "X", yLabel = "Y"
}: {
  items: { label: string; x: number; y: number; size?: number; color?: string }[];
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(width || 500);
  const [tooltip, setTooltip] = useState<{ item: typeof items[0]; px: number; py: number } | null>(null);

  useEffect(() => {
    if (!ref.current || width) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [width]);

  if (!items.length) return null;

  const padL = 48, padR = 20, padT = 20, padB = 40;
  const h = height;
  const xs_all = items.map(i => i.x);
  const ys_all = items.map(i => i.y);
  const xMin = Math.min(...xs_all) * 0.9, xMax = Math.max(...xs_all) * 1.1;
  const yMin = Math.min(...ys_all) * 0.9, yMax = Math.max(...ys_all) * 1.1;
  const px = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (w - padL - padR);
  const py = (y: number) => padT + (1 - (y - yMin) / (yMax - yMin)) * (h - padT - padB);

  // Grid lines: 4 horizontal, 4 vertical
  const hGrid = Array.from({length:5}, (_,i) => yMin + (i/4)*(yMax-yMin));
  const vGrid = Array.from({length:5}, (_,i) => xMin + (i/4)*(xMax-xMin));

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <svg width={w} height={h}
        onMouseLeave={() => setTooltip(null)}>
        {/* Grid */}
        {hGrid.map((v,i) => <g key={i}>
          <line x1={padL} x2={w-padR} y1={py(v)} y2={py(v)} stroke="var(--border)" strokeDasharray="2 3"/>
          <text x={padL-6} y={py(v)+4} fontSize="9" textAnchor="end" fill="var(--ink-4)" fontFamily="var(--mono)">{v.toFixed(1)}</text>
        </g>)}
        {vGrid.map((v,i) => <g key={i}>
          <line x1={px(v)} x2={px(v)} y1={padT} y2={h-padB} stroke="var(--border)" strokeDasharray="2 3"/>
          <text x={px(v)} y={h-padB+14} fontSize="9" textAnchor="middle" fill="var(--ink-4)" fontFamily="var(--mono)">{v.toFixed(1)}</text>
        </g>)}
        {/* Axis labels */}
        <text x={(padL + w - padR)/2} y={h-2} fontSize="10" textAnchor="middle" fill="var(--ink-3)">{xLabel}</text>
        <text x={10} y={(padT + h-padB)/2} fontSize="10" textAnchor="middle" fill="var(--ink-3)" transform={`rotate(-90, 10, ${(padT + h-padB)/2})`}>{yLabel}</text>
        {/* Points */}
        {items.map((item, i) => {
          const isPortfolio = item.label.toLowerCase().includes("portfolio");
          return (
            <g key={i}>
              <circle
                cx={px(item.x)} cy={py(item.y)}
                r={item.size || (isPortfolio ? 10 : 7)}
                fill={item.color || (isPortfolio ? "var(--accent)" : "var(--ink-3)")}
                stroke={isPortfolio ? "var(--accent-deep)" : "var(--surface)"}
                strokeWidth={isPortfolio ? 2 : 1.5}
                opacity={0.85}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => {
                  setTooltip({ item, px: px(item.x), py: py(item.y) });
                }}
              />
              {isPortfolio && (
                <text x={px(item.x)} y={py(item.y)-14} fontSize="9" textAnchor="middle" fill="var(--accent)" fontWeight="600">{item.label}</text>
              )}
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div style={{ position: "absolute", left: Math.min(tooltip.px + 10, w-140), top: Math.max(tooltip.py - 40, 4), background: "var(--ink)", color: "var(--bg)", padding: "6px 10px", borderRadius: 6, fontSize: 11, pointerEvents: "none", fontFamily: "var(--mono)", zIndex: 10, whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: 600 }}>{tooltip.item.label}</div>
          <div>{xLabel}: {tooltip.item.x.toFixed(2)} · {yLabel}: {tooltip.item.y.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

export function GaugeChart({
  value, min = 0, max = 100, label, size = 200,
  zones
}: {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  size?: number;
  zones?: { from: number; to: number; color: string; label?: string }[];
}) {
  const cx = size / 2, cy = size * 0.6;
  const r = size * 0.38;
  const startAngle = -Math.PI; // left
  const endAngle = 0; // right (semicircle)
  const totalAngle = Math.PI;

  const toAngle = (v: number) => startAngle + ((v - min) / (max - min)) * totalAngle;
  const toXY = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  });

  // Default zones if not provided
  const defaultZones = zones || [
    { from: min, to: min + (max-min)*0.33, color: "var(--pos)", label: "Low" },
    { from: min + (max-min)*0.33, to: min + (max-min)*0.66, color: "var(--warn)", label: "Medium" },
    { from: min + (max-min)*0.66, to: max, color: "var(--neg)", label: "High" },
  ];

  // Draw zone arcs
  const arcPath = (from: number, to: number, outerR: number, innerR: number) => {
    const a1 = toAngle(from), a2 = toAngle(to);
    const large = Math.abs(a2 - a1) > Math.PI ? 1 : 0;
    const p1 = toXY(a1, outerR), p2 = toXY(a2, outerR);
    const p3 = toXY(a2, innerR), p4 = toXY(a1, innerR);
    return `M ${p1.x} ${p1.y} A ${outerR} ${outerR} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerR} ${innerR} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
  };

  // Needle
  const needleAngle = toAngle(Math.min(max, Math.max(min, value)));
  const needleTip = toXY(needleAngle, r * 0.85);
  const needleBase1 = toXY(needleAngle + Math.PI/2, r * 0.07);
  const needleBase2 = toXY(needleAngle - Math.PI/2, r * 0.07);

  // suppress unused variable warning
  void endAngle;

  return (
    <div style={{ display: "inline-block", position: "relative", textAlign: "center" }}>
      <svg width={size} height={size * 0.65}>
        {/* Background arc */}
        <path d={arcPath(min, max, r, r*0.65)} fill="var(--surface-2)"/>
        {/* Zone arcs */}
        {defaultZones.map((z, i) => (
          <path key={i} d={arcPath(z.from, z.to, r, r*0.65)} fill={z.color} opacity={0.8}/>
        ))}
        {/* Needle */}
        <path d={`M ${needleBase1.x} ${needleBase1.y} L ${needleTip.x} ${needleTip.y} L ${needleBase2.x} ${needleBase2.y} Z`}
          fill="var(--ink)" opacity={0.9}/>
        <circle cx={cx} cy={cy} r={r*0.08} fill="var(--ink)"/>
        {/* Value */}
        <text x={cx} y={cy + r * 0.35} textAnchor="middle" fontSize={size*0.14} fontWeight="700" fill="var(--ink)" fontFamily="var(--mono)">{value}</text>
        {label && <text x={cx} y={cy + r * 0.55} textAnchor="middle" fontSize={size*0.07} fill="var(--ink-3)">{label}</text>}
        {/* Zone labels */}
        {defaultZones.map((z, i) => {
          const midAngle = toAngle((z.from + z.to) / 2);
          const lPos = toXY(midAngle, r * 1.12);
          return z.label ? <text key={i} x={lPos.x} y={lPos.y} textAnchor="middle" fontSize={size*0.055} fill={z.color} fontWeight="600">{z.label}</text> : null;
        })}
      </svg>
    </div>
  );
}

"use client";
import { useState } from "react";
import type { PersonaKey, Currency } from "@/lib/types";
import { DATA } from "@/lib/data";
import { ProgressRing } from "@/components/ui";

interface SectionToggles {
  portfolio: boolean;
  goals: boolean;
  risk: boolean;
  performance: boolean;
  milestone: boolean;
}

type SnapTheme = "dark" | "light";

const shareButtons = [
  { label: "FB", title: "Facebook", color: "#1877F2", bg: "#E7F0FD" },
  { label: "IG", title: "Instagram", color: "#E1306C", bg: "#FCE4EC" },
  { label: "LINE", title: "LINE", color: "#06C755", bg: "#E8F9EE" },
  { label: "WA", title: "WhatsApp", color: "#25D366", bg: "#E8F9EE" },
  { label: "LI", title: "LinkedIn", color: "#0A66C2", bg: "#E3F0FF" },
  { label: "↓", title: "Download", color: "var(--ink)", bg: "var(--surface-2)" },
];

export function ScreenClientSnapshot({
  ccy,
  persona,
}: {
  ccy: Currency;
  persona: PersonaKey;
}) {
  void ccy;
  const P = DATA.PERSONAS[persona];
  const goals = DATA.GOALS[persona];

  const [sections, setSections] = useState<SectionToggles>({
    portfolio: true,
    goals: true,
    risk: true,
    performance: true,
    milestone: true,
  });

  const [hideNumbers, setHideNumbers] = useState(false);
  const [snapTheme, setSnapTheme] = useState<SnapTheme>("dark");
  const [toast, setToast] = useState<string | null>(null);

  const toggleSection = (key: keyof SectionToggles) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShare = (btn: (typeof shareButtons)[number]) => {
    setToast(`Shared to ${btn.title}`);
    setTimeout(() => setToast(null), 2000);
  };

  // Derived data
  const avgGoalProgress =
    goals.reduce((acc, g) => acc + Math.min(100, (g.current / g.target) * 100), 0) /
    goals.length;

  const milestoneText =
    P.ytdReturn > 10
      ? "🎯 Milestone: Top 10% performer this year"
      : avgGoalProgress > 70
      ? "🏆 Milestone: 70%+ toward all financial goals"
      : "💡 Milestone: Consistent portfolio growth";

  // Theme-derived colours
  const isDark = snapTheme === "dark";
  const cardTextColor = isDark ? "rgba(255,255,255,0.9)" : "#0C1116";
  const cardSubColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(12,17,22,0.5)";
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(12,17,22,0.08)";
  const accentPurple = isDark ? "rgba(120,100,255,0.9)" : "var(--accent)";

  // Tiny inline sparkline (3 upward dots approximation)
  const perfPts = [0, 3, 1, 5, 4, 8, P.ytdReturn].map(
    (v, i) => `${(i / 6) * 80},${20 - (v / Math.max(P.ytdReturn, 1)) * 18}`
  );

  const sectionLabels: { key: keyof SectionToggles; label: string }[] = [
    { key: "portfolio", label: "Portfolio Value" },
    { key: "goals", label: "Financial Goals" },
    { key: "risk", label: "Risk Profile" },
    { key: "performance", label: "Performance" },
    { key: "milestone", label: "Milestone Badge" },
  ];

  return (
    <div className="col fadein">
      {/* Header */}
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Share Your Progress</h1>
          <p className="h-page-sub">Create a shareable portfolio snapshot</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "38% 1fr",
          gap: "var(--gutter)",
          alignItems: "start",
        }}
      >
        {/* Left panel: controls */}
        <div className="col" style={{ gap: "var(--gutter)" }}>
          {/* Section toggles */}
          <div className="card">
            <div className="card-head">
              <h3>Include in snapshot</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sectionLabels.map(({ key, label }) => (
                <div
                  key={key}
                  onClick={() => toggleSection(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
                    {label}
                  </span>
                  {/* Toggle pill */}
                  <div
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 999,
                      background: sections[key]
                        ? "var(--accent)"
                        : "var(--surface-2)",
                      border: `1px solid ${sections[key] ? "var(--accent)" : "var(--border)"}`,
                      position: "relative",
                      transition: "background 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 2,
                        left: sections[key] ? 17 : 2,
                        width: 14,
                        height: 14,
                        borderRadius: 999,
                        background: sections[key] ? "#fff" : "var(--ink-4)",
                        transition: "left 0.2s",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & theme */}
          <div className="card">
            <div className="card-head">
              <h3>Display Options</h3>
            </div>

            {/* Hide numbers toggle */}
            <div
              onClick={() => setHideNumbers((p) => !p)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
                Hide exact numbers
              </span>
              <div
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 999,
                  background: hideNumbers ? "var(--accent)" : "var(--surface-2)",
                  border: `1px solid ${hideNumbers ? "var(--accent)" : "var(--border)"}`,
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: hideNumbers ? 17 : 2,
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: hideNumbers ? "#fff" : "var(--ink-4)",
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </div>

            {/* Theme selector */}
            <div style={{ paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 8 }}>
                Theme
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {(["dark", "light"] as SnapTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSnapTheme(t)}
                    className={`btn${snapTheme === t ? " primary" : ""}`}
                    style={{ flex: 1, justifyContent: "center", textTransform: "capitalize" }}
                  >
                    {t === "dark" ? "🌙 Dark" : "☀️ Light"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="card">
            <div className="card-head">
              <h3>Share to</h3>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {shareButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleShare(btn)}
                  title={btn.title}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    border: "none",
                    background: btn.bg,
                    color: btn.color,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    transition: "transform 0.15s, opacity 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 8 }}>
              Sharing opens your default app with a pre-filled message.
            </div>
          </div>
        </div>

        {/* Right panel: snapshot preview */}
        <div>
          <div
            style={{
              background: "var(--surface-2)",
              borderRadius: 24,
              padding: 24,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Snapshot card */}
            <div
              style={{
                width: 360,
                minHeight: 560,
                borderRadius: 20,
                background: isDark
                  ? "linear-gradient(145deg, #0B0F1A 0%, #1A1060 60%, #0B0F1A 100%)"
                  : "linear-gradient(145deg, #F0F4FF 0%, #E8EEFF 60%, #F0F4FF 100%)",
                padding: 24,
                color: isDark ? "white" : "#0C1116",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Dot pattern */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                  pointerEvents: "none",
                }}
              />

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  position: "relative",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                      color: cardTextColor,
                    }}
                  >
                    NaNote Finance
                  </div>
                  <div
                    style={{ fontSize: 10, color: cardSubColor, marginTop: 2 }}
                  >
                    My Portfolio · May 2026
                  </div>
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.15)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    color: cardTextColor,
                  }}
                >
                  N
                </div>
              </div>

              {/* Portfolio section */}
              {sections.portfolio && (
                <div
                  style={{
                    marginBottom: 16,
                    position: "relative",
                    paddingBottom: 14,
                    borderBottom: `1px solid ${cardBorder}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: cardSubColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 6,
                    }}
                  >
                    Portfolio Value
                  </div>
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      fontFamily: "var(--mono)",
                      color: cardTextColor,
                    }}
                  >
                    {hideNumbers
                      ? "฿ ●●●,●●●"
                      : `฿${(P.portfolioValue / 1e6).toFixed(2)}M`}
                  </div>
                  <div
                    style={{ fontSize: 13, color: cardSubColor, marginTop: 4 }}
                  >
                    YTD:{" "}
                    {hideNumbers ? "●●.●%" : `+${P.ytdReturn.toFixed(1)}%`}
                    {" "}
                    <span style={{ opacity: 0.6, fontSize: 10 }}>
                      vs benchmark{" "}
                      {hideNumbers ? "" : `${P.benchmark.toFixed(1)}%`}
                    </span>
                  </div>
                </div>
              )}

              {/* Goals section */}
              {sections.goals && (
                <div
                  style={{
                    marginBottom: 16,
                    position: "relative",
                    paddingBottom: 14,
                    borderBottom: `1px solid ${cardBorder}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: cardSubColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 10,
                    }}
                  >
                    Financial Goals
                  </div>
                  {goals.slice(0, 2).map((g) => (
                    <div key={g.id} style={{ marginBottom: 8 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                          fontSize: 11,
                          color: cardTextColor,
                          opacity: 0.8,
                        }}
                      >
                        <span>{g.name}</span>
                        <span>
                          {hideNumbers
                            ? "●●%"
                            : `${Math.round((g.current / g.target) * 100)}%`}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: "rgba(255,255,255,0.15)",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: hideNumbers
                              ? "0%"
                              : `${Math.min(100, (g.current / g.target) * 100)}%`,
                            height: "100%",
                            background: accentPurple,
                            borderRadius: 2,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Risk section */}
              {sections.risk && (
                <div
                  style={{
                    marginBottom: 16,
                    position: "relative",
                    paddingBottom: 14,
                    borderBottom: `1px solid ${cardBorder}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <ProgressRing
                    value={P.risk.score}
                    max={100}
                    size={48}
                    thickness={5}
                    color={accentPurple}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: cardSubColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Risk Profile
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: cardTextColor,
                        marginTop: 2,
                      }}
                    >
                      {P.risk.category}
                    </div>
                    <div style={{ fontSize: 11, color: cardSubColor }}>
                      Score:{" "}
                      {hideNumbers ? "●●" : P.risk.score}
                      /100
                    </div>
                  </div>
                </div>
              )}

              {/* Performance section */}
              {sections.performance && (
                <div
                  style={{
                    marginBottom: 16,
                    position: "relative",
                    paddingBottom: 14,
                    borderBottom: `1px solid ${cardBorder}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: cardSubColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                    }}
                  >
                    Performance
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {/* Tiny sparkline */}
                    <svg
                      width={80}
                      height={24}
                      viewBox="0 0 80 24"
                      style={{ overflow: "visible" }}
                    >
                      <polyline
                        points={perfPts.join(" ")}
                        fill="none"
                        stroke={accentPurple}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          fontFamily: "var(--mono)",
                          color: cardTextColor,
                        }}
                      >
                        {hideNumbers
                          ? "+●●.●%"
                          : `+${P.ytdReturn.toFixed(1)}%`}
                      </div>
                      <div style={{ fontSize: 10, color: cardSubColor }}>
                        YTD return
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          fontFamily: "var(--mono)",
                          color: cardTextColor,
                        }}
                      >
                        {hideNumbers
                          ? "+●●.●%"
                          : `+${P.oneYearReturn.toFixed(1)}%`}
                      </div>
                      <div style={{ fontSize: 10, color: cardSubColor }}>
                        1Y return
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Milestone section */}
              {sections.milestone && (
                <div
                  style={{
                    marginBottom: 16,
                    position: "relative",
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 10,
                    padding: "10px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: cardTextColor,
                    }}
                  >
                    {milestoneText}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 12,
                  borderTop: `1px solid ${cardBorder}`,
                  fontSize: 9,
                  color: cardSubColor,
                  textAlign: "center",
                  position: "relative",
                }}
              >
                nanoteofficial.me · Powered by NaNote Finance · Thai SEC
                regulated
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "var(--bg)",
            padding: "12px 24px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 9999,
            pointerEvents: "none",
            boxShadow: "var(--shadow)",
            animation: "fadein 0.2s ease",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import type { View, PersonaKey, Currency, Density } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, Avatar } from "@/components/ui";
import { AIPanel } from "@/components/AIPanel";

type NavItem = { id: string; label: string; icon: "dashboard"|"users"|"user"|"chart"|"target"|"shield"|"sparkles"|"doc"|"lock"|"gear"|"arrowRight"|"play"|"flag"|"send"; badge?: string };

const NAV_ADVISOR: NavItem[] = [
  { id: "Dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "Clients", label: "Clients", icon: "users", badge: "12" },
  { id: "Profile", label: "Client profile", icon: "user" },
  { id: "Portfolio", label: "Portfolio analytics", icon: "chart" },
  { id: "Goals", label: "Financial goals", icon: "target" },
  { id: "Risk", label: "Risk profile", icon: "shield" },
  { id: "Recommendations", label: "Recommendations", icon: "sparkles", badge: "3" },
  { id: "Reports", label: "Reports", icon: "doc" },
  { id: "Compliance", label: "Compliance log", icon: "lock" },
  { id: "Settings", label: "Admin settings", icon: "gear" },
];

const NAV_CLIENT: NavItem[] = [
  { id: "ClientHome", label: "Dashboard", icon: "dashboard" },
  { id: "Portfolio", label: "Portfolio", icon: "chart" },
  { id: "RiskAnalysis", label: "Risk Analysis", icon: "shield" },
  { id: "Projection", label: "Projections", icon: "arrowRight" },
  { id: "MonteCarlo", label: "Monte Carlo", icon: "play" },
  { id: "Scenario", label: "Scenario Analysis", icon: "flag" },
  { id: "Goals", label: "My Goals", icon: "target" },
  { id: "Snapshot", label: "Share Snapshot", icon: "send" },
  { id: "Reports", label: "Documents", icon: "doc" },
];

const NAV_ADMIN: NavItem[] = [
  { id: "AdminHome", label: "Overview", icon: "dashboard" },
  { id: "AdminUsers", label: "Users & Roles", icon: "users" },
  { id: "AdminAudit", label: "Audit Log", icon: "lock" },
  { id: "AdminAnalytics", label: "Analytics", icon: "chart" },
  { id: "AdminSettings", label: "System Settings", icon: "gear" },
];

export type RouteId = typeof NAV_ADVISOR[number]["id"] | typeof NAV_CLIENT[number]["id"] | typeof NAV_ADMIN[number]["id"];

interface ShellProps {
  initialView?: View;
  children: (props: { route: RouteId; view: View; persona: PersonaKey; ccy: Currency; onNav: (r: RouteId) => void }) => React.ReactNode;
}

export function Shell({ children, initialView }: ShellProps) {
  const [view, setView] = useState<View>(initialView ?? "advisor");
  const [route, setRoute] = useState<RouteId>("Dashboard");
  const [ccy, setCcy] = useState<Currency>("THB");
  const [persona, setPersona] = useState<PersonaKey>("balanced");
  const [dark, setDark] = useState(false);
  const [density, setDensity] = useState<Density>("comfortable");
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const validRoutes = (view === "advisor" ? NAV_ADVISOR : view === "admin" ? NAV_ADMIN : NAV_CLIENT).map(x => x.id);
    if (!validRoutes.includes(route)) setRoute(view === "advisor" ? "Dashboard" : view === "admin" ? "AdminHome" : "ClientHome");
  }, [view]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("density-compact", density === "compact");
  }, [dark, density]);

  const P = DATA.PERSONAS[persona];
  const items = view === "advisor" ? NAV_ADVISOR : view === "admin" ? NAV_ADMIN : NAV_CLIENT;
  const labelOf = (r: RouteId) => [...NAV_ADVISOR, ...NAV_CLIENT, ...NAV_ADMIN].find(x => x.id === r)?.label ?? r;

  return (
    <>
      <div className="shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">N</div>
            <div>
              <div className="brand-name">NaNote</div>
              <div className="brand-sub">Wealth · Thailand</div>
            </div>
          </div>
          <div className="nav-section">
            <div className="nav-label">{view === "advisor" ? "Advisor workspace" : view === "admin" ? "Administration" : "Investor portal"}</div>
            {items.map(it => (
              <div key={it.id} className={`nav-item ${route === it.id ? "active" : ""}`} onClick={() => setRoute(it.id as RouteId)}>
                <Icon name={it.icon} size={15}/>
                <span>{it.label}</span>
                {it.badge && <span className="badge">{it.badge}</span>}
              </div>
            ))}
          </div>
          {view === "advisor" && (
            <div className="nav-section">
              <div className="nav-label">Active client</div>
              <div className="nav-item" style={{ background: "var(--surface-2)" }}>
                <Avatar initials={P.initials} size={22}/>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{P.shortName}</span>
                <Icon name="chevronDown" size={12} stroke={2}/>
              </div>
            </div>
          )}
          <div className="sidebar-foot">
            <div className="avatar">{view === "advisor" ? "PV" : view === "admin" ? "SA" : P.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>
                {view === "advisor" ? "Pakorn V." : view === "admin" ? "System Admin" : P.shortName}
              </div>
              <div style={{ fontSize: 10, color: "var(--ink-3)" }}>
                {view === "advisor" ? "Senior Advisor" : view === "admin" ? "Administrator" : "Client portal"}
              </div>
            </div>
            <Icon name="gear" size={14}/>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <div className="crumbs">
              {view === "advisor" ? "Workspace" : view === "admin" ? "Administration" : "Client portal"} <span style={{ opacity: 0.4, margin: "0 6px" }}>/</span> <span className="cur">{labelOf(route)}</span>
            </div>
            <div className="spacer"/>
            <div className="search">
              <Icon name="search" size={14}/>
              <input placeholder={view === "advisor" ? "Search clients, holdings..." : "Search holdings..."}/>
              <kbd style={{ fontFamily: "var(--mono)", fontSize: 10, background: "var(--surface)", padding: "2px 5px", borderRadius: 4, border: "1px solid var(--border)", color: "var(--ink-4)" }}>⌘K</kbd>
            </div>
            <div className="viewtoggle">
              <button className={view === "advisor" ? "on" : ""} onClick={() => setView("advisor")}>Advisor</button>
              <button className={view === "client" ? "on" : ""} onClick={() => setView("client")}>Client</button>
              <button className={view === "admin" ? "on" : ""} onClick={() => setView("admin")}>Admin</button>
            </div>
            {view === "advisor" && (
              <select value={persona} onChange={e => setPersona(e.target.value as PersonaKey)} className="btn sm" style={{ paddingRight: 10, cursor: "pointer" }}>
                <option value="conservative">Persona · Anucha (Conservative)</option>
                <option value="balanced">Persona · Somchai (Balanced)</option>
                <option value="aggressive">Persona · Nattaya (Aggressive)</option>
              </select>
            )}
            <select value={ccy} onChange={e => setCcy(e.target.value as Currency)} className="btn sm" style={{ paddingRight: 10, cursor: "pointer" }}>
              <option value="THB">฿ THB</option>
              <option value="USD">$ USD</option>
              <option value="SGD">S$ SGD</option>
              <option value="EUR">€ EUR</option>
            </select>
            <button className="iconbtn" onClick={() => setDark(d => !d)} title="Toggle theme">
              <Icon name={dark ? "sun" : "moon"} size={15}/>
            </button>
            <button className="iconbtn" title="Notifications">
              <Icon name="bell" size={15}/><span className="dot"/>
            </button>
            <button className="iconbtn" onClick={() => setAiOpen(o => !o)} title="AI assistant" style={{ background: "var(--accent)", borderColor: "var(--accent)", color: "white" }}>
              <Icon name="sparkles" size={15}/>
            </button>
          </div>

          {/* Content */}
          <div className="content" key={`${route}-${view}-${persona}`}>
            {children({ route, view, persona, ccy, onNav: (r) => setRoute(r) })}
          </div>
        </div>
      </div>

      {!aiOpen && (
        <button className="ai-fab" onClick={() => setAiOpen(true)} title="Open AI assistant">
          <span className="pulse"/>
          <Icon name="sparkles" size={20}/>
        </button>
      )}
      <AIPanel open={aiOpen} onClose={() => setAiOpen(false)} persona={persona} route={route}/>
    </>
  );
}

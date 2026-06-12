"use client";
import type { Currency, Client } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, Money, Delta, Avatar, Sparkline, AreaPerf, Seg } from "@/components/ui";

function BarChart({ data, height = 160, color = "var(--accent)" }: { data: { label: string; value: number }[]; height?: number; color?: string }) {
  const max = Math.max(...data.map(d => Math.abs(d.value))) || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, padding: "8px 0" }}>
      {data.map((d, i) => {
        const h = Math.max(2, (Math.abs(d.value) / max) * (height - 30));
        const neg = d.value < 0;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div className="num" style={{ fontSize: 10, color: "var(--ink-3)" }}>{d.value.toFixed(1)}</div>
            <div style={{ width: "100%", height: h, background: neg ? "var(--neg)" : color, borderRadius: 4, opacity: 0.9 }}/>
            <div style={{ fontSize: 10, color: "var(--ink-3)" }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function ScreenAdvisorDashboard({ ccy, onOpenClient }: { ccy: Currency; onOpenClient: (c: Client) => void }) {
  const D = DATA;
  const totalAUM = D.CLIENTS.reduce((s, c) => s + c.aum, 0);
  const totalClients = D.CLIENTS.length;
  const alertsClients = D.CLIENTS.filter(c => c.alerts > 0).length;
  const review = D.CLIENTS.filter(c => c.status === "Review").length;
  const wtdAUM = [98.6, 99.1, 99.5, 100.2, 100.6, 100.4, 101.1, 101.6, 102.0, 102.4, 102.8, 103.4];
  const fees = [
    { label: "Jan", value: 1.8 }, { label: "Feb", value: 2.1 }, { label: "Mar", value: 2.4 },
    { label: "Apr", value: 2.2 }, { label: "May", value: 1.6 },
  ];

  return (
    <div className="col fadein">
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Good afternoon, Pakorn</h1>
          <p className="h-page-sub">Monday, 12 May 2026 · You have <b style={{color: "var(--ink)"}}>2 meetings</b> and <b style={{color: "var(--ink)"}}>{review} reviews</b> today</p>
        </div>
        <div className="spacer"/>
        <button className="btn"><Icon name="calendar" size={14}/> View calendar</button>
        <button className="btn primary"><Icon name="plus" size={14}/> New client</button>
      </div>

      <div className="grid grid-4">
        <div className="card metric">
          <div className="label">Total AUM</div>
          <div className="value"><Money value={totalAUM} ccy={ccy}/></div>
          <div className="sub"><Delta value={2.4}/> vs last month</div>
        </div>
        <div className="card metric">
          <div className="label">Active clients</div>
          <div className="value">{totalClients}</div>
          <div className="sub"><span style={{color: "var(--pos)"}}>+2 new</span> this month · 1 onboarding</div>
        </div>
        <div className="card metric">
          <div className="label">Avg. portfolio YTD</div>
          <div className="value">+9.2%</div>
          <div className="sub"><Delta value={1.8} dec={1}/> vs benchmark (7.4%)</div>
        </div>
        <div className="card metric" style={{ borderColor: "var(--warn-soft)", background: "linear-gradient(180deg, var(--warn-soft), var(--surface))" }}>
          <div className="label">Open risk alerts</div>
          <div className="value">{D.COMPLIANCE.filter(c => c.severity === "warn").length}</div>
          <div className="sub"><span style={{color: "oklch(0.45 0.13 80)"}}>Action needed</span> · {alertsClients} clients</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2.4fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <h3>AUM trend</h3>
            <span className="sub">Last 12 months · indexed 100</span>
            <div className="spacer"/>
            <Seg items={[{value:"12M",label:"12M"},{value:"YTD",label:"YTD"},{value:"ALL",label:"All"}]} value="12M" onChange={()=>{}}/>
          </div>
          <AreaPerf series={[{ name: "AUM", data: wtdAUM, color: "var(--accent)" }]} height={200}/>
        </div>
        <div className="card">
          <div className="card-head">
            <h3>Today &amp; upcoming</h3>
            <div className="spacer"/>
            <button className="btn ghost sm"><Icon name="plus" size={12}/> Schedule</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {D.MEETINGS.map(m => (
              <div key={m.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent-deep)", display: "grid", placeItems: "center" }}>
                  <Icon name={m.mode === "Video" ? "play" : "users"} size={14}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{m.client}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.topic}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2, fontFamily: "var(--mono)" }}>{m.time} · {m.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <h3>Advisory tasks</h3>
            <span className="chip accent">{D.TASKS.length}</span>
            <div className="spacer"/>
            <button className="btn ghost sm">View all <Icon name="arrowRight" size={12}/></button>
          </div>
          <div>
            {D.TASKS.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <input type="checkbox" style={{ accentColor: "var(--accent)", width: 16, height: 16 }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                    <span className="chip" style={{ marginRight: 6 }}>{t.type}</span>
                    <span className="num">{t.due}</span>
                  </div>
                </div>
                <span className={`chip ${t.priority === "High" ? "neg" : t.priority === "Medium" ? "warn" : ""}`}>{t.priority}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <h3>Needs your attention</h3>
            <div className="spacer"/>
            <Icon name="warn" size={14} stroke={1.8}/>
          </div>
          {D.CLIENTS.filter(c => c.alerts > 0 || c.status === "Review").slice(0, 5).map(c => (
            <div key={c.id} onClick={() => onOpenClient(c)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
              <Avatar initials={c.initials} size={32}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{c.category} · <span className="num"><Money value={c.aum} ccy={ccy}/></span></div>
              </div>
              <span className="chip neg">{c.alerts} alert{c.alerts > 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-head">
            <h3>Fee revenue</h3>
            <span className="sub">YTD</span>
            <div className="spacer"/>
            <Delta value={6.4}/>
          </div>
          <div className="num" style={{ fontSize: 24, fontWeight: 700 }}>{DATA.fmt.money(10100000, ccy)}</div>
          <BarChart data={fees} color="var(--accent)"/>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
            <span>Management fee · 78%</span>
            <span>Performance fee · 22%</span>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <h3>Top &amp; bottom performers (YTD)</h3>
            <div className="spacer"/>
            <Seg items={["YTD","1M","1Y"]} value="YTD" onChange={()=>{}}/>
          </div>
          <div className="grid grid-2" style={{ gap: 24 }}>
            <div>
              <div className="h-section" style={{ color: "var(--pos)" }}>Top 3</div>
              {[...D.CLIENTS].sort((a,b) => b.ytd - a.ytd).slice(0, 3).map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                  <Avatar initials={c.initials} size={28}/>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 11, color: "var(--ink-3)" }}>{c.category}</div></div>
                  <Sparkline data={[100,101,102.4,103.1,102.8,104,105.2,106.8,107.6,108.4,109.7,100+c.ytd]} width={80} height={28}/>
                  <Delta value={c.ytd} dec={1}/>
                </div>
              ))}
            </div>
            <div>
              <div className="h-section" style={{ color: "var(--neg)" }}>Bottom 3</div>
              {[...D.CLIENTS].sort((a,b) => a.ytd - b.ytd).slice(0, 3).map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                  <Avatar initials={c.initials} size={28}/>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 11, color: "var(--ink-3)" }}>{c.category}</div></div>
                  <Sparkline data={[100,100.4,100.2,100.8,101.1,100.9,101.6,102.1,102.4,102.9,103.4,100+c.ytd]} width={80} height={28}/>
                  <Delta value={c.ytd} dec={1}/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <h3>Market pulse</h3>
            <span className="chip"><span className="swatch" style={{ background: "var(--pos)" }}/>Live</span>
          </div>
          {D.NEWS.map((n, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: i < D.NEWS.length - 1 ? "1px solid var(--border)" : 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                <span className="chip">{n.tag}</span>
                <span style={{ fontSize: 11, color: "var(--ink-4)", fontFamily: "var(--mono)" }}>{n.ts}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>{n.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

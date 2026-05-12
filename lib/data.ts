import type { AppData, Currency } from "./types";

const fmt = {
  money: (n: number, ccy: Currency = "THB"): string => {
    const sign = n < 0 ? "-" : "";
    const abs = Math.abs(n);
    let v: number, suf = "";
    if (abs >= 1e9) { v = abs / 1e9; suf = "B"; }
    else if (abs >= 1e6) { v = abs / 1e6; suf = "M"; }
    else if (abs >= 1e3) { v = abs / 1e3; suf = "K"; }
    else { v = abs; }
    const dec = abs >= 1e6 ? 2 : abs >= 1e3 ? 1 : 0;
    const symbol: Record<Currency, string> = { THB: "฿", USD: "$", EUR: "€", SGD: "S$" };
    return `${sign}${symbol[ccy] || "฿"}${v.toFixed(dec)}${suf}`;
  },
  moneyFull: (n: number, ccy: Currency = "THB"): string => {
    const symbol: Record<Currency, string> = { THB: "฿", USD: "$", EUR: "€", SGD: "S$" };
    return `${n < 0 ? "-" : ""}${symbol[ccy] || "฿"}${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  },
  pct: (n: number, dec = 2): string => `${n >= 0 ? "+" : ""}${n.toFixed(dec)}%`,
  pctAbs: (n: number, dec = 1): string => `${n.toFixed(dec)}%`,
};

export const DATA: AppData = {
  fmt,
  FX: { THB: 1, USD: 1 / 35.6, SGD: 1 / 26.5, EUR: 1 / 38.3 },
  PERSONAS: {
    conservative: {
      id: "conservative", name: "Khun Anucha Ratchasima", shortName: "Anucha R.", initials: "AR",
      age: 62, occupation: "Retired civil engineer", location: "Chiang Mai", since: "2017", tier: "Mass Affluent",
      risk: { score: 28, category: "Conservative", color: "#5B8C9E" },
      horizon: "Short / 1–3y", objective: "Capital preservation, regular income",
      liquidityNeeds: "High — monthly ฿80,000", experience: "10+ yrs, bonds & funds",
      income: 0, expenses: 80000, assets: 28500000, liabilities: 0,
      portfolioValue: 24820000, cashBalance: 1600000,
      ytdReturn: 4.2, oneYearReturn: 5.8, threeYearReturn: 4.6, benchmark: 3.9,
      volatility: 5.2, sharpe: 0.74, drawdown: -6.1, concentration: "Low", healthScore: 78,
    },
    balanced: {
      id: "balanced", name: "Khun Somchai Tantrakul", shortName: "Somchai T.", initials: "ST",
      age: 47, occupation: "CFO, listed manufacturer", location: "Bangkok", since: "2019", tier: "HNW",
      risk: { score: 56, category: "Balanced", color: "#8A6FB8" },
      horizon: "Medium / 5–10y", objective: "Wealth accumulation, balanced growth",
      liquidityNeeds: "Moderate — periodic", experience: "15+ yrs, multi-asset",
      income: 4800000, expenses: 1800000, assets: 92400000, liabilities: 18000000,
      portfolioValue: 68420000, cashBalance: 4100000,
      ytdReturn: 8.6, oneYearReturn: 11.4, threeYearReturn: 7.9, benchmark: 7.1,
      volatility: 10.4, sharpe: 0.92, drawdown: -12.4, concentration: "Moderate", healthScore: 84,
    },
    aggressive: {
      id: "aggressive", name: "Khun Nattaya Wongthep", shortName: "Nattaya W.", initials: "NW",
      age: 34, occupation: "Tech founder", location: "Bangkok", since: "2022", tier: "HNW (Emerging)",
      risk: { score: 82, category: "Aggressive", color: "#D27A4E" },
      horizon: "Long / 15+y", objective: "Aggressive growth, high upside",
      liquidityNeeds: "Low", experience: "5 yrs, equities & crypto",
      income: 2400000, expenses: 720000, assets: 42100000, liabilities: 6800000,
      portfolioValue: 32140000, cashBalance: 850000,
      ytdReturn: 15.3, oneYearReturn: 22.7, threeYearReturn: 14.1, benchmark: 9.4,
      volatility: 18.7, sharpe: 0.83, drawdown: -24.6, concentration: "High", healthScore: 67,
    },
  },
  ALLOC: {
    conservative: [
      { name: "Thai Government Bonds", class: "Fixed Income", weight: 38, color: "oklch(0.65 0.10 240)" },
      { name: "Corporate Bonds (Investment Grade)", class: "Fixed Income", weight: 18, color: "oklch(0.55 0.10 240)" },
      { name: "Thai Equity (Dividend)", class: "Equity", weight: 12, color: "oklch(0.65 0.13 270)" },
      { name: "Global Equity (Developed)", class: "Equity", weight: 10, color: "oklch(0.55 0.13 270)" },
      { name: "Money Market", class: "Cash", weight: 14, color: "oklch(0.75 0.04 240)" },
      { name: "REIT (Thai)", class: "Alternative", weight: 5, color: "oklch(0.60 0.13 60)" },
      { name: "Gold ETF", class: "Alternative", weight: 3, color: "oklch(0.75 0.13 80)" },
    ],
    balanced: [
      { name: "Thai Equity Index", class: "Equity", weight: 18, color: "oklch(0.65 0.13 270)" },
      { name: "Global Equity (Developed)", class: "Equity", weight: 22, color: "oklch(0.55 0.13 270)" },
      { name: "Emerging Markets Equity", class: "Equity", weight: 8, color: "oklch(0.50 0.13 290)" },
      { name: "Thai Government Bonds", class: "Fixed Income", weight: 14, color: "oklch(0.65 0.10 240)" },
      { name: "Global Bonds", class: "Fixed Income", weight: 12, color: "oklch(0.55 0.10 240)" },
      { name: "REIT (Asia-Pacific)", class: "Alternative", weight: 9, color: "oklch(0.60 0.13 60)" },
      { name: "Gold ETF", class: "Alternative", weight: 5, color: "oklch(0.75 0.13 80)" },
      { name: "Money Market", class: "Cash", weight: 12, color: "oklch(0.75 0.04 240)" },
    ],
    aggressive: [
      { name: "Thai Equity (Growth)", class: "Equity", weight: 14, color: "oklch(0.65 0.13 270)" },
      { name: "US Equity (Large Cap)", class: "Equity", weight: 22, color: "oklch(0.55 0.13 270)" },
      { name: "US Tech Sector ETF", class: "Equity", weight: 18, color: "oklch(0.50 0.13 290)" },
      { name: "Emerging Markets", class: "Equity", weight: 12, color: "oklch(0.45 0.13 310)" },
      { name: "Asia Pacific Equity", class: "Equity", weight: 10, color: "oklch(0.60 0.13 290)" },
      { name: "Crypto (BTC, ETH)", class: "Alternative", weight: 8, color: "oklch(0.55 0.18 50)" },
      { name: "Private Equity Fund", class: "Alternative", weight: 6, color: "oklch(0.60 0.13 60)" },
      { name: "Cash", class: "Cash", weight: 5, color: "oklch(0.75 0.04 240)" },
      { name: "High Yield Bond", class: "Fixed Income", weight: 5, color: "oklch(0.65 0.10 240)" },
    ],
  },
  HOLDINGS: {
    balanced: [
      { ticker: "SETTRI", name: "SET Total Return Index Fund", class: "Equity", region: "Thailand", weight: 14.2, value: 9716640, gain: 8.4, ytd: 6.2 },
      { ticker: "VWRA", name: "Vanguard FTSE All-World UCITS", class: "Equity", region: "Global", weight: 18.6, value: 12726120, gain: 14.8, ytd: 11.2 },
      { ticker: "QQQM", name: "Invesco NASDAQ-100 ETF", class: "Equity", region: "US", weight: 8.4, value: 5747280, gain: 22.1, ytd: 14.7 },
      { ticker: "EEM", name: "iShares MSCI Emerging Mkts", class: "Equity", region: "EM", weight: 7.6, value: 5199920, gain: 5.3, ytd: 3.8 },
      { ticker: "LTGT-D", name: "Thai Govt Bond 10Y Fund", class: "Fixed Income", region: "Thailand", weight: 12.1, value: 8278820, gain: 2.1, ytd: 1.8 },
      { ticker: "AGGG", name: "iShares Global Aggregate Bond", class: "Fixed Income", region: "Global", weight: 9.8, value: 6705160, gain: 1.4, ytd: 1.1 },
      { ticker: "CPALL", name: "CP All PCL", class: "Equity", region: "Thailand", weight: 4.2, value: 2873640, gain: 11.6, ytd: 8.9 },
      { ticker: "AOT", name: "Airports of Thailand", class: "Equity", region: "Thailand", weight: 3.4, value: 2326280, gain: -3.2, ytd: -1.4 },
      { ticker: "LH-REIT", name: "LH Hotel REIT", class: "Alternative", region: "Thailand", weight: 5.8, value: 3968360, gain: 4.7, ytd: 3.1 },
      { ticker: "GLD-TH", name: "Krungsri Gold Fund", class: "Alternative", region: "Global", weight: 4.6, value: 3147320, gain: 9.8, ytd: 7.4 },
      { ticker: "MM-TH", name: "TMB Money Market", class: "Cash", region: "Thailand", weight: 8.1, value: 5542020, gain: 1.6, ytd: 1.2 },
      { ticker: "PE-ASIA1", name: "Krungthai Asia Private Equity", class: "Alternative", region: "Asia", weight: 3.2, value: 2189440, gain: -1.8, ytd: -0.6 },
    ],
    conservative: [
      { ticker: "LTGT-D", name: "Thai Govt Bond 10Y Fund", class: "Fixed Income", region: "Thailand", weight: 38.0, value: 9431600, gain: 2.1, ytd: 1.8 },
      { ticker: "IGCB", name: "Krungsri Corporate Bond", class: "Fixed Income", region: "Thailand", weight: 18.0, value: 4467600, gain: 3.4, ytd: 2.9 },
      { ticker: "DIV-SET", name: "SCBSE Dividend Fund", class: "Equity", region: "Thailand", weight: 12.0, value: 2978400, gain: 6.1, ytd: 4.7 },
      { ticker: "VWRA", name: "Vanguard FTSE All-World", class: "Equity", region: "Global", weight: 10.0, value: 2482000, gain: 14.8, ytd: 11.2 },
      { ticker: "MM-TH", name: "TMB Money Market", class: "Cash", region: "Thailand", weight: 14.0, value: 3474800, gain: 1.6, ytd: 1.2 },
      { ticker: "LH-REIT", name: "LH Hotel REIT", class: "Alternative", region: "Thailand", weight: 5.0, value: 1241000, gain: 4.7, ytd: 3.1 },
      { ticker: "GLD-TH", name: "Krungsri Gold Fund", class: "Alternative", region: "Global", weight: 3.0, value: 744600, gain: 9.8, ytd: 7.4 },
    ],
    aggressive: [
      { ticker: "QQQM", name: "Invesco NASDAQ-100 ETF", class: "Equity", region: "US", weight: 18.0, value: 5785200, gain: 22.1, ytd: 14.7 },
      { ticker: "VOO", name: "Vanguard S&P 500", class: "Equity", region: "US", weight: 14.0, value: 4499600, gain: 18.4, ytd: 12.1 },
      { ticker: "TSLA", name: "Tesla Inc.", class: "Equity", region: "US", weight: 8.0, value: 2571200, gain: 34.7, ytd: 28.6 },
      { ticker: "NVDA", name: "NVIDIA Corp.", class: "Equity", region: "US", weight: 9.6, value: 3085440, gain: 51.4, ytd: 42.8 },
      { ticker: "SET-GROW", name: "KTAM SET Growth Fund", class: "Equity", region: "Thailand", weight: 14.0, value: 4499600, gain: 9.3, ytd: 7.2 },
      { ticker: "EEM", name: "iShares MSCI EM", class: "Equity", region: "EM", weight: 12.0, value: 3856800, gain: 5.3, ytd: 3.8 },
      { ticker: "FXI-AP", name: "Asia Pacific Equity Fund", class: "Equity", region: "Asia", weight: 10.0, value: 3214000, gain: 7.8, ytd: 5.6 },
      { ticker: "BTC", name: "Bitcoin (custody)", class: "Alternative", region: "Global", weight: 5.5, value: 1767700, gain: 64.2, ytd: 48.3 },
      { ticker: "ETH", name: "Ethereum (custody)", class: "Alternative", region: "Global", weight: 2.5, value: 803500, gain: 41.6, ytd: 32.1 },
      { ticker: "PE-ASIA1", name: "Krungthai Asia Private Equity", class: "Alternative", region: "Asia", weight: 6.0, value: 1928400, gain: -1.8, ytd: -0.6 },
    ],
  },
  PERF: {
    balanced: { client: [100,101.2,100.8,102.3,103.7,104.1,103.4,105.6,106.2,107.4,108.9,108.6], bench: [100,100.6,100.4,101.2,102.0,102.5,102.1,103.3,103.8,104.5,105.2,107.1] },
    conservative: { client: [100,100.4,100.5,100.9,101.2,101.5,101.4,102.0,102.5,102.9,103.6,104.2], bench: [100,100.3,100.2,100.6,100.9,101.1,101.0,101.5,101.9,102.4,103.0,103.9] },
    aggressive: { client: [100,102.4,104.1,103.2,106.7,108.4,107.6,110.3,112.8,113.4,115.2,115.3], bench: [100,101.1,102.0,101.4,103.2,104.5,103.8,105.6,106.9,107.4,108.6,109.4] },
  },
  GOALS: {
    conservative: [
      { id: "g1", name: "Steady retirement income", icon: "M", category: "Retirement", target: 28000000, current: 24820000, monthly: 0, targetYear: 2026, priority: "High" },
      { id: "g2", name: "Grandchildren education fund", icon: "G", category: "Education", target: 3500000, current: 1240000, monthly: 18000, targetYear: 2034, priority: "Medium" },
      { id: "g3", name: "Medical reserve", icon: "+", category: "Emergency", target: 2000000, current: 1800000, monthly: 5000, targetYear: 2027, priority: "High" },
    ],
    balanced: [
      { id: "g1", name: "Retirement at 60", icon: "R", category: "Retirement", target: 120000000, current: 68420000, monthly: 240000, targetYear: 2039, priority: "High" },
      { id: "g2", name: "Children's university (overseas)", icon: "E", category: "Education", target: 18000000, current: 6200000, monthly: 75000, targetYear: 2032, priority: "High" },
      { id: "g3", name: "Hua Hin holiday home", icon: "H", category: "Home", target: 14000000, current: 3400000, monthly: 60000, targetYear: 2030, priority: "Medium" },
      { id: "g4", name: "Emergency fund", icon: "S", category: "Emergency", target: 3600000, current: 3400000, monthly: 8000, targetYear: 2026, priority: "Medium" },
    ],
    aggressive: [
      { id: "g1", name: "Financial independence by 45", icon: "F", category: "Wealth", target: 200000000, current: 32140000, monthly: 380000, targetYear: 2037, priority: "High" },
      { id: "g2", name: "Passive income ฿200k/mo", icon: "P", category: "Income", target: 60000000, current: 12400000, monthly: 120000, targetYear: 2033, priority: "High" },
      { id: "g3", name: "Bangkok condo (upgrade)", icon: "H", category: "Home", target: 22000000, current: 4800000, monthly: 95000, targetYear: 2029, priority: "Medium" },
      { id: "g4", name: "Startup investment fund", icon: "V", category: "Wealth", target: 12000000, current: 2100000, monthly: 40000, targetYear: 2030, priority: "Low" },
    ],
  },
  CLIENTS: [
    { id: "c001", initials: "ST", name: "Somchai Tantrakul", segment: "HNW", category: "Balanced", aum: 68420000, ytd: 8.6, alerts: 1, lastReview: "2026-03-12", status: "Healthy", persona: "balanced" },
    { id: "c002", initials: "NW", name: "Nattaya Wongthep", segment: "HNW", category: "Aggressive", aum: 32140000, ytd: 15.3, alerts: 3, lastReview: "2026-04-02", status: "Review", persona: "aggressive" },
    { id: "c003", initials: "AR", name: "Anucha Ratchasima", segment: "Mass Affluent", category: "Conservative", aum: 24820000, ytd: 4.2, alerts: 0, lastReview: "2026-04-22", status: "Healthy", persona: "conservative" },
    { id: "c004", initials: "PC", name: "Pim Chanthavong", segment: "Mass Affluent", category: "Growth", aum: 18650000, ytd: 12.1, alerts: 0, lastReview: "2026-03-30", status: "Healthy" },
    { id: "c005", initials: "KS", name: "Krit Sirikun", segment: "HNW", category: "Balanced", aum: 81200000, ytd: 7.4, alerts: 2, lastReview: "2026-02-14", status: "Review" },
    { id: "c006", initials: "PB", name: "Pailin Boonprakob", segment: "HNW", category: "Moderate", aum: 45300000, ytd: 6.8, alerts: 1, lastReview: "2026-04-10", status: "Healthy" },
    { id: "c007", initials: "TS", name: "Tawat Suwanthep", segment: "Mass Affluent", category: "Aggressive", aum: 12480000, ytd: 14.7, alerts: 2, lastReview: "2026-01-28", status: "Onboarding" },
    { id: "c008", initials: "MV", name: "Malee Vongthep", segment: "HNW", category: "Conservative", aum: 56700000, ytd: 4.6, alerts: 0, lastReview: "2026-04-19", status: "Healthy" },
    { id: "c009", initials: "RT", name: "Ratchanok Thongdee", segment: "Mass Affluent", category: "Growth", aum: 9840000, ytd: 11.4, alerts: 0, lastReview: "2026-03-22", status: "Healthy" },
    { id: "c010", initials: "VK", name: "Vichai Kongsuwan", segment: "HNW", category: "Balanced", aum: 73100000, ytd: 8.9, alerts: 1, lastReview: "2026-02-05", status: "Healthy" },
    { id: "c011", initials: "SS", name: "Suda Saetang", segment: "Mass Affluent", category: "Moderate", aum: 14300000, ytd: 7.1, alerts: 0, lastReview: "2026-04-15", status: "Healthy" },
    { id: "c012", initials: "AC", name: "Apirak Chaiyaporn", segment: "HNW", category: "Aggressive", aum: 92400000, ytd: 16.8, alerts: 2, lastReview: "2026-03-08", status: "Review" },
  ],
  TASKS: [
    { id: "t1", title: "Quarterly review — Apirak Chaiyaporn", due: "Today, 14:00", priority: "High", type: "Meeting" },
    { id: "t2", title: "Risk profile reassessment — Krit Sirikun", due: "Tomorrow", priority: "High", type: "Compliance" },
    { id: "t3", title: "Rebalance proposal — Nattaya Wongthep", due: "May 14", priority: "Medium", type: "Recommendation" },
    { id: "t4", title: "Annual IPS refresh — 3 clients pending", due: "May 18", priority: "Medium", type: "Document" },
    { id: "t5", title: "KYC renewal — Tawat Suwanthep", due: "May 22", priority: "Medium", type: "Compliance" },
    { id: "t6", title: "Send Q1 report to Malee Vongthep", due: "May 23", priority: "Low", type: "Document" },
  ],
  MEETINGS: [
    { id: "m1", time: "Today · 14:00", duration: "60m", client: "Apirak Chaiyaporn", topic: "Quarterly review + rebalance", mode: "In-office" },
    { id: "m2", time: "Tomorrow · 10:30", duration: "45m", client: "Krit Sirikun", topic: "Risk profile reassessment", mode: "Video" },
    { id: "m3", time: "May 14 · 16:00", duration: "30m", client: "Nattaya Wongthep", topic: "Tech allocation discussion", mode: "Video" },
    { id: "m4", time: "May 16 · 11:00", duration: "60m", client: "Vichai Kongsuwan", topic: "Estate planning intro", mode: "In-office" },
  ],
  RISK_QUESTIONS: [
    { q: "If your portfolio dropped 20% in one month, you would:", a: ["Sell all investments to prevent further loss","Sell some and move to safer assets","Hold and wait for recovery","Hold and invest more at lower prices"] },
    { q: "Your primary investment objective is:", a: ["Preserve capital, accept low returns","Modest growth with limited risk","Balanced growth and stability","Maximize growth, accept high volatility"] },
    { q: "How long do you plan to keep funds invested?", a: ["Less than 1 year","1–3 years","3–7 years","More than 7 years"] },
    { q: "How would you describe your investment knowledge?", a: ["Limited — mostly deposits/bonds","Basic — some funds","Good — multi-asset experience","Strong — derivatives/alternatives"] },
    { q: "Your monthly expenses are covered by:", a: ["Investment income — fully dependent","Mostly salary, some investment","Salary entirely","Multiple stable sources"] },
    { q: "Reaction to a 1-year 35% drawdown:", a: ["Panic, severe stress","Concerned, lose sleep","Uncomfortable but tolerable","Opportunity to buy"] },
  ],
  REPORTS: [
    { id: "r1", title: "Q1 2026 Portfolio Review", client: "Somchai Tantrakul", type: "Monthly Portfolio Report", generated: "2026-04-05", size: "2.4 MB", pages: 14, status: "Delivered" },
    { id: "r2", title: "Investment Policy Statement (v3)", client: "Somchai Tantrakul", type: "IPS", generated: "2026-03-28", size: "1.1 MB", pages: 6, status: "Signed" },
    { id: "r3", title: "Risk Profile — Reassessment", client: "Nattaya Wongthep", type: "Risk Profile Report", generated: "2026-04-15", size: "780 KB", pages: 4, status: "Delivered" },
    { id: "r4", title: "Rebalance Recommendation", client: "Nattaya Wongthep", type: "Advisory Recommendation", generated: "2026-04-20", size: "1.6 MB", pages: 9, status: "Pending Signoff" },
    { id: "r5", title: "Retirement Goal Plan", client: "Anucha Ratchasima", type: "Goal Planning Report", generated: "2026-04-18", size: "920 KB", pages: 7, status: "Delivered" },
    { id: "r6", title: "Annual Compliance Audit Trail", client: "Internal", type: "Compliance Audit Trail", generated: "2026-03-31", size: "5.8 MB", pages: 42, status: "Filed" },
    { id: "r7", title: "Suitability Validation", client: "Apirak Chaiyaporn", type: "Compliance Audit Trail", generated: "2026-04-22", size: "640 KB", pages: 3, status: "Delivered" },
  ],
  COMPLIANCE: [
    { id: "l1", ts: "2026-05-10 14:32", actor: "Pakorn V. (Advisor)", action: "Generated rebalance recommendation", target: "Nattaya Wongthep", category: "Recommendation", severity: "info" },
    { id: "l2", ts: "2026-05-10 11:08", actor: "System", action: "Risk threshold breach — equity > 80%", target: "Apirak Chaiyaporn", category: "Suitability", severity: "warn" },
    { id: "l3", ts: "2026-05-09 16:45", actor: "Pakorn V. (Advisor)", action: "Acknowledged risk warning, client co-signed", target: "Apirak Chaiyaporn", category: "Suitability", severity: "info" },
    { id: "l4", ts: "2026-05-09 10:12", actor: "Niran K. (Compliance)", action: "PDPA consent renewed", target: "Pim Chanthavong", category: "PDPA", severity: "info" },
    { id: "l5", ts: "2026-05-08 09:22", actor: "System", action: "KYC re-verification due in 14 days", target: "Tawat Suwanthep", category: "KYC", severity: "warn" },
    { id: "l6", ts: "2026-05-07 17:30", actor: "Pakorn V. (Advisor)", action: "Updated risk profile — Conservative → Moderate", target: "Pailin Boonprakob", category: "Risk Profile", severity: "info" },
    { id: "l7", ts: "2026-05-07 14:11", actor: "System", action: "AML watchlist screen — clear", target: "All active clients", category: "AML", severity: "info" },
    { id: "l8", ts: "2026-05-06 12:05", actor: "Niran K. (Compliance)", action: "Filed monthly suitability report with SEC", target: "Firm", category: "Filing", severity: "info" },
    { id: "l9", ts: "2026-05-05 09:48", actor: "Pakorn V. (Advisor)", action: "Recommendation issued — REIT increase", target: "Krit Sirikun", category: "Recommendation", severity: "info" },
    { id: "l10", ts: "2026-05-04 15:30", actor: "System", action: "Concentration alert — tech > 35%", target: "Nattaya Wongthep", category: "Suitability", severity: "warn" },
  ],
  REBALANCE: {
    balanced: [
      { asset: "Global Equity (Developed)", current: 22, target: 24, rationale: "Underweight vs strategic; valuation supportive" },
      { asset: "Emerging Markets Equity", current: 8, target: 10, rationale: "EM cycle turning, USD weakness tailwind" },
      { asset: "Thai Equity Index", current: 18, target: 16, rationale: "Trim to fund global diversification" },
      { asset: "Global Bonds", current: 12, target: 14, rationale: "Lock in higher yields ahead of cuts" },
      { asset: "Money Market", current: 12, target: 8, rationale: "Reduce cash drag" },
      { asset: "Gold ETF", current: 5, target: 6, rationale: "Geopolitical hedge" },
    ],
    conservative: [
      { asset: "Thai Government Bonds", current: 38, target: 36, rationale: "Take modest profit on long duration" },
      { asset: "Corporate Bonds (IG)", current: 18, target: 20, rationale: "Pick up spread, still investment-grade" },
      { asset: "Money Market", current: 14, target: 12, rationale: "Slight reduction, real yield negative" },
      { asset: "Thai Equity (Dividend)", current: 12, target: 14, rationale: "Increase income via dividend basket" },
    ],
    aggressive: [
      { asset: "US Tech Sector ETF", current: 18, target: 14, rationale: "Reduce concentration > suitability cap" },
      { asset: "Crypto (BTC/ETH)", current: 8, target: 6, rationale: "Trim after rally; rebalance to target" },
      { asset: "Emerging Markets", current: 12, target: 14, rationale: "Add diversification" },
      { asset: "Asia Pacific Equity", current: 10, target: 12, rationale: "Valuation gap vs developed markets" },
      { asset: "High Yield Bond", current: 5, target: 7, rationale: "Income leg, spreads attractive" },
      { asset: "Cash", current: 5, target: 5, rationale: "Maintain liquidity buffer" },
    ],
  },
  NEWS: [
    { ts: "10:14", tag: "Thailand", text: "BoT keeps policy rate at 2.25%, signals data-dependent stance" },
    { ts: "09:42", tag: "Global", text: "Fed minutes: gradual cuts likely by Q3 if inflation cooperates" },
    { ts: "Yesterday", tag: "Asia", text: "MSCI Asia ex-Japan +1.4% on tech rally" },
    { ts: "Yesterday", tag: "FX", text: "THB stable vs USD at 35.6; export competitiveness intact" },
  ],
};

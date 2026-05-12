export type Currency = "THB" | "USD" | "SGD" | "EUR";
export type PersonaKey = "conservative" | "balanced" | "aggressive";
export type View = "advisor" | "client" | "admin";
export type Density = "comfortable" | "compact";

export type RiskInfo = { score: number; category: string; color: string };

export interface Persona {
  id: PersonaKey;
  name: string;
  shortName: string;
  initials: string;
  age: number;
  occupation: string;
  location: string;
  since: string;
  tier: string;
  risk: RiskInfo;
  horizon: string;
  objective: string;
  liquidityNeeds: string;
  experience: string;
  income: number;
  expenses: number;
  assets: number;
  liabilities: number;
  portfolioValue: number;
  cashBalance: number;
  ytdReturn: number;
  oneYearReturn: number;
  threeYearReturn: number;
  benchmark: number;
  volatility: number;
  sharpe: number;
  drawdown: number;
  concentration: string;
  healthScore: number;
}

export interface Holding {
  ticker: string;
  name: string;
  class: string;
  region: string;
  weight: number;
  value: number;
  gain: number;
  ytd: number;
}

export interface Allocation {
  name: string;
  class: string;
  weight: number;
  color: string;
}

export interface PerfSeries {
  client: number[];
  bench: number[];
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  category: string;
  target: number;
  current: number;
  monthly: number;
  targetYear: number;
  priority: "High" | "Medium" | "Low";
}

export interface Client {
  id: string;
  initials: string;
  name: string;
  segment: string;
  category: string;
  aum: number;
  ytd: number;
  alerts: number;
  lastReview: string;
  status: string;
  persona?: PersonaKey;
}

export interface Task {
  id: string;
  title: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  type: string;
}

export interface Meeting {
  id: string;
  time: string;
  duration: string;
  client: string;
  topic: string;
  mode: string;
}

export interface Report {
  id: string;
  title: string;
  client: string;
  type: string;
  generated: string;
  size: string;
  pages: number;
  status: string;
}

export interface ComplianceEntry {
  id: string;
  ts: string;
  actor: string;
  action: string;
  target: string;
  category: string;
  severity: "info" | "warn";
}

export interface RebalanceItem {
  asset: string;
  current: number;
  target: number;
  rationale: string;
}

export interface NewsItem {
  ts: string;
  tag: string;
  text: string;
}

export interface RiskQuestion {
  q: string;
  a: string[];
}

export interface AppData {
  fmt: {
    money: (n: number, ccy?: Currency) => string;
    moneyFull: (n: number, ccy?: Currency) => string;
    pct: (n: number, dec?: number) => string;
    pctAbs: (n: number, dec?: number) => string;
  };
  FX: Record<Currency, number>;
  PERSONAS: Record<PersonaKey, Persona>;
  ALLOC: Record<PersonaKey, Allocation[]>;
  HOLDINGS: Record<PersonaKey, Holding[]>;
  PERF: Record<PersonaKey, PerfSeries>;
  GOALS: Record<PersonaKey, Goal[]>;
  CLIENTS: Client[];
  TASKS: Task[];
  MEETINGS: Meeting[];
  RISK_QUESTIONS: RiskQuestion[];
  REPORTS: Report[];
  COMPLIANCE: ComplianceEntry[];
  REBALANCE: Record<PersonaKey, RebalanceItem[]>;
  NEWS: NewsItem[];
}

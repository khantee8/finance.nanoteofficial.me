"use client";
import { useState } from "react";
import type { Currency, PersonaKey } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon, ProgressRing } from "@/components/ui";

export function ScreenRiskProfile({ ccy, persona }: { ccy: Currency; persona: PersonaKey }) {
  const D = DATA;
  const P = D.PERSONAS[persona];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.values(answers).reduce((s, a) => s + a, 0);
  const maxScore = D.RISK_QUESTIONS.length * 3;
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const category = pct >= 70 ? "Aggressive" : pct >= 40 ? "Balanced" : "Conservative";
  const color = pct >= 70 ? "var(--neg)" : pct >= 40 ? "var(--accent)" : "var(--pos)";

  return (
    <div className="col fadein">
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div>
          <h1 className="h-page">Risk Profile</h1>
          <p className="h-page-sub">{P.name} · Current: <b>{P.risk.category}</b> (score {P.risk.score})</p>
        </div>
        <div className="spacer"/>
        <button className="btn"><Icon name="download" size={14}/> Export report</button>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head"><h3>Current risk profile</h3></div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "12px 0" }}>
            <ProgressRing value={P.risk.score} max={100} size={100} thickness={10} color={P.risk.color} label="Score"/>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{P.risk.category}</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>{P.horizon}</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{P.objective}</div>
            </div>
          </div>
          <div className="kvs">
            <span className="k">Volatility tolerance</span><span className="v num">{P.volatility}% annualised</span>
            <span className="k">Max drawdown accepted</span><span className="v num" style={{ color: "var(--neg)" }}>{P.drawdown}%</span>
            <span className="k">Liquidity needs</span><span className="v">{P.liquidityNeeds}</span>
            <span className="k">Investment experience</span><span className="v">{P.experience}</span>
          </div>
        </div>

        {!submitted ? (
          <div className="card">
            <div className="card-head">
              <h3>Risk questionnaire</h3>
              <span className="chip">{Object.keys(answers).length}/{D.RISK_QUESTIONS.length} answered</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, overflow: "auto", maxHeight: 480 }}>
              {D.RISK_QUESTIONS.map((q, qi) => (
                <div key={qi}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Q{qi+1}. {q.q}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {q.a.map((a, ai) => (
                      <label key={ai} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: "var(--r)", border: "1px solid", borderColor: answers[qi] === ai ? "var(--accent)" : "var(--border)", background: answers[qi] === ai ? "var(--accent-soft)" : "transparent", cursor: "pointer", fontSize: 13 }}>
                        <input type="radio" name={`q${qi}`} value={ai} checked={answers[qi] === ai} onChange={() => setAnswers(prev => ({ ...prev, [qi]: ai }))} style={{ accentColor: "var(--accent)" }}/>
                        {a}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn primary"
              disabled={Object.keys(answers).length < D.RISK_QUESTIONS.length}
              onClick={() => setSubmitted(true)}
              style={{ marginTop: 8, opacity: Object.keys(answers).length < D.RISK_QUESTIONS.length ? 0.5 : 1 }}
            >
              Submit &amp; score
            </button>
          </div>
        ) : (
          <div className="card">
            <div className="card-head"><h3>Questionnaire result</h3></div>
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <ProgressRing value={pct} size={120} thickness={12} color={color} label="Score"/>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 12 }}>{category}</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Raw score: {score}/{maxScore}</div>
              <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn" onClick={() => { setAnswers({}); setSubmitted(false); }}>Retake</button>
                <button className="btn primary"><Icon name="doc" size={14}/> Save to profile</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

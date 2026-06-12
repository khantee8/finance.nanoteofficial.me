"use client";
import { useState, useEffect, useRef } from "react";
import type { PersonaKey, View } from "@/lib/types";
import { DATA } from "@/lib/data";
import { Icon } from "@/components/ui";

interface Message {
  role: "user" | "bot";
  text: string;
  src?: string;
}

interface AIPanelProps {
  open: boolean;
  onClose: () => void;
  persona: PersonaKey;
  route: string;
  view?: View;
}

const SUGGESTIONS: Record<View, string[]> = {
  advisor: [
    "Explain this portfolio's performance",
    "Generate talking points for today's review",
    "What concentration risks should I flag?",
    "Draft client review notes",
    "Suggest 3 questions to ask the client today",
  ],
  client: [
    "Explain my portfolio performance simply",
    "What is my biggest risk right now?",
    "Am I on track for my retirement goal?",
    "What's the difference between volatility and drawdown?",
    "How would a 20% market drop affect me?",
  ],
  admin: [
    "Summarize this week's compliance alerts",
    "Which advisors are overloaded?",
    "Are we ready for the next SEC filing?",
    "Show me firm-wide concentration risk",
  ],
};

export function AIPanel({ open, onClose, persona, route, view = "advisor" }: AIPanelProps) {
  const P = DATA.PERSONAS[persona];

  const initialMsg = (): Message => {
    if (view === "client") return { role: "bot", text: "Hi — I'm your portfolio AI. I can explain what's happening with your investments in plain language.", src: "Trained on your portfolio" };
    if (view === "admin") return { role: "bot", text: "I'm watching firm-wide activity. Ask anything about compliance, advisors, or audit events.", src: "Firm-wide context · live" };
    return { role: "bot", text: `I'm watching ${P.shortName}'s portfolio. Ask anything, or pick a suggestion below.`, src: "Trained on portfolio data · live since 09:00" };
  };

  // Shell remounts this panel (via key) when persona/view changes, resetting the conversation
  const [msgs, setMsgs] = useState<Message[]>([initialMsg()]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, busy]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", text }]);
    setBusy(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, persona }),
      });
      const data = await res.json();
      const src = view === "client"
        ? "AI-generated · not personalised investment advice"
        : view === "admin"
        ? "Generated · firm-admin context"
        : "Generated · review before sharing with client";
      setMsgs(m => [...m, { role: "bot", text: data.reply, src }]);
    } catch {
      setMsgs(m => [...m, { role: "bot", text: "I couldn't reach the model just now. Try again in a moment.", src: "" }]);
    }
    setBusy(false);
  };

  const suggestions = SUGGESTIONS[view];
  const roleLabel = view === "client" ? "Client" : view === "admin" ? "Admin" : "Advisor";
  const watchingLabel = view === "admin" ? "Watching firm-wide" : `Watching ${P.shortName}`;
  const placeholder = view === "client" ? "Ask anything about your portfolio..." : "Ask about this portfolio...";

  if (!open) return null;
  return (
    <div className="ai-panel">
      <div className="ai-head">
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", display: "grid", placeItems: "center" }}>
          <Icon name="sparkles" size={14}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>NaNote AI · {roleLabel}</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="dot"/> {watchingLabel} · {route}
          </div>
        </div>
        <button className="iconbtn" onClick={onClose} style={{ border: 0, width: 28, height: 28 }}>
          <span style={{ display: "inline-block", transform: "rotate(45deg)" }}>
            <Icon name="plus" size={14} stroke={2.2}/>
          </span>
        </button>
      </div>
      <div className="ai-body" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`ai-msg ${m.role}`}>
            {m.text}
            {m.src && <div className="src">{m.src}</div>}
          </div>
        ))}
        {busy && (
          <div className="ai-msg bot">
            Thinking
            <span style={{ display: "inline-flex", gap: 3, marginLeft: 6 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--ink-3)", animation: `dotty 1.2s ${i*0.2}s infinite` }}/>
              ))}
            </span>
          </div>
        )}
      </div>
      <div className="ai-suggest">
        {suggestions.map(s => (
          <span key={s} className="chip" style={{ cursor: "pointer" }} onClick={() => send(s)}>{s}</span>
        ))}
      </div>
      <div className="ai-input">
        <input
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(input); }}
        />
        <button className="btn primary sm" onClick={() => send(input)}>
          <Icon name="send" size={12}/>
        </button>
      </div>
    </div>
  );
}

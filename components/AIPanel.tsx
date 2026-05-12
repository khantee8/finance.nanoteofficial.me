"use client";
import { useState, useEffect, useRef } from "react";
import type { PersonaKey } from "@/lib/types";
import type { RouteId } from "@/components/Shell";
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
}

export function AIPanel({ open, onClose, persona, route }: AIPanelProps) {
  const P = DATA.PERSONAS[persona];
  const [msgs, setMsgs] = useState<Message[]>([
    { role: "bot", text: `I'm watching ${P.shortName}'s portfolio. Ask me anything, or pick a suggestion below.`, src: "Trained on portfolio data · live since 09:00" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs([{ role: "bot", text: `I'm watching ${P.shortName}'s portfolio. Ask me anything, or pick a suggestion below.`, src: "Trained on portfolio data · live since 09:00" }]);
  }, [persona]);

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
      setMsgs(m => [...m, { role: "bot", text: data.reply, src: "Generated · review before sharing with client" }]);
    } catch {
      setMsgs(m => [...m, { role: "bot", text: "I couldn't reach the model just now. Try again in a moment.", src: "" }]);
    }
    setBusy(false);
  };

  const suggestions = [
    "Explain this portfolio's performance",
    "Generate talking points for today's meeting",
    "What concentration risks should I flag?",
    "Draft client review notes",
    "Suggest 3 questions to ask the client",
  ];

  if (!open) return null;
  return (
    <div className="ai-panel">
      <div className="ai-head">
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", display: "grid", placeItems: "center" }}>
          <Icon name="sparkles" size={14}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>NaNote AI · Advisor</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="dot"/> Watching {P.shortName} · {route}
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
          placeholder="Ask about this client's portfolio..."
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

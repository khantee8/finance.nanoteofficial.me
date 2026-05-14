import { NextRequest, NextResponse } from "next/server";

const MAX_MESSAGE_LENGTH = 1000;
const ALLOWED_PERSONAS = new Set(["conservative", "balanced", "aggressive"]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ reply: "Invalid request." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ reply: "Invalid request." }, { status: 400 });
  }

  const { message, persona } = body as Record<string, unknown>;

  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ reply: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ reply: "Message is too long (max 1000 characters)." }, { status: 400 });
  }

  const safePersona =
    typeof persona === "string" && ALLOWED_PERSONAS.has(persona) ? persona : "balanced";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: "AI assistant is not configured. Add ANTHROPIC_API_KEY to your environment variables.",
    });
  }

  const personaContexts: Record<string, string> = {
    conservative: "Client: Khun Anucha Ratchasima, 62, retired, Conservative risk (score 28), portfolio ฿24.8M, YTD +4.2%, volatility 5.2%",
    balanced:     "Client: Khun Somchai Tantrakul, 47, CFO, Balanced risk (score 56), portfolio ฿68.4M, YTD +8.6%, volatility 10.4%",
    aggressive:   "Client: Khun Nattaya Wongthep, 34, tech founder, Aggressive risk (score 82), portfolio ฿32.1M, YTD +15.3%, volatility 18.7%",
  };

  const systemPrompt = `You are NaNote Finance's AI assistant for a Thai financial advisor. Be concise (3-5 sentences max), professional, and include a brief risk disclosure for any forward-looking statement. Thai context: SEC Thailand regulations, PDPA compliance, THB currency. ${personaContexts[safePersona]}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: "user", content: message.trim() }],
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({})) as { error?: { message?: string } };
      const msg = errBody?.error?.message ?? "";
      console.error(`Anthropic API error ${res.status}:`, msg);
      if (msg.toLowerCase().includes("credit balance")) {
        return NextResponse.json({ reply: "AI assistant is temporarily unavailable — API credits exhausted. Please top up the Anthropic account." });
      }
      return NextResponse.json({ reply: "AI model returned an error. Please try again." });
    }

    const data = await res.json() as { content?: { text?: string }[] };
    const reply = data.content?.[0]?.text ?? "No response from model.";
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("AI route fetch failed:", e);
    return NextResponse.json({ reply: "Unable to reach AI model. Please try again." });
  }
}

import { NextRequest, NextResponse } from "next/server";

// AI assistant disabled until v1 — restore full implementation from git history (commit 00083d5)
export async function POST(_req: NextRequest) {
  return NextResponse.json({ reply: "AI assistant is coming in v1. Stay tuned." });
}

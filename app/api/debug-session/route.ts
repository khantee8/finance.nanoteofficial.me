import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ session: null });
  return NextResponse.json({
    sub: session.user.sub,
    email: session.user.email,
    claims: Object.fromEntries(
      Object.entries(session.user).filter(([k]) => k.includes("nanoteofficial") || k === "email" || k === "sub")
    ),
    all_keys: Object.keys(session.user),
  });
}

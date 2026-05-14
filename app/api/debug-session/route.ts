import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth0.getSession();
  if (!session) return NextResponse.json({ session: null });

  // Decode ID token payload without verification to inspect raw claims
  let idTokenClaims: Record<string, unknown> = {};
  const idToken = (session as Record<string, unknown>).tokenSet as Record<string, unknown> | undefined;
  const rawIdToken = idToken?.idToken as string | undefined;
  if (rawIdToken) {
    try {
      const payload = rawIdToken.split(".")[1];
      idTokenClaims = JSON.parse(Buffer.from(payload, "base64url").toString());
    } catch {
      idTokenClaims = { error: "could not decode" };
    }
  }

  return NextResponse.json({
    session_user_keys: Object.keys(session.user),
    session_role_claim: session.user["https://finance.nanoteofficial.me/role"] ?? "NOT FOUND",
    id_token_keys: Object.keys(idTokenClaims),
    id_token_role: idTokenClaims["https://finance.nanoteofficial.me/role"] ?? "NOT FOUND",
    app_metadata: idTokenClaims["https://finance.nanoteofficial.me/app_metadata"] ?? "NOT FOUND",
  });
}

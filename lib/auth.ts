import { auth0 } from "@/lib/auth0";

export type Role = "advisor" | "client" | "admin" | "pending";

const CLAIM = "https://finance.nanoteofficial.me/role";

export async function getRole(): Promise<Role> {
  const session = await auth0.getSession();
  if (!session?.user) return "pending";

  // @auth0/nextjs-auth0 v4 strips custom namespace claims from session.user.
  // Decode the ID token directly to read the role claim.
  const idToken = (session as { tokenSet?: { idToken?: string } }).tokenSet?.idToken;
  if (idToken) {
    try {
      const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString());
      const role = payload[CLAIM];
      if (role === "advisor" || role === "client" || role === "admin") return role;
    } catch {
      // fall through
    }
  }

  return "pending";
}

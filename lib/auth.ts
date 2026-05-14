import { auth0 } from "@/lib/auth0";

export type Role = "advisor" | "client" | "admin" | "pending";

export async function getRole(): Promise<Role> {
  const session = await auth0.getSession();
  if (!session?.user) return "pending";
  const role = session.user["https://finance.nanoteofficial.me/role"];
  if (role === "advisor" || role === "client" || role === "admin") return role;
  return "pending";
}

import { getRole } from "@/lib/auth";
import { ScreenPending } from "@/components/screens/ScreenPending";
import { AppShell } from "@/components/AppShell";
import type { View } from "@/lib/types";

export default async function Page() {
  const role = await getRole();
  if (role === "pending") return <ScreenPending />;
  const initialView: View = role === "client" ? "client" : role === "admin" ? "admin" : "advisor";
  return <AppShell initialView={initialView} />;
}

import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { ScreenLogin } from "@/components/screens/ScreenLogin";

export default async function LoginPage() {
  const session = await auth0.getSession();
  if (session) redirect("/");
  return <ScreenLogin />;
}

import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function proxy(request: Request) {
  const url = new URL(request.url);

  // Auth routes and login page are always public
  if (url.pathname.startsWith("/auth") || url.pathname === "/login") {
    return await auth0.middleware(request);
  }

  // All other routes require a session
  const session = await auth0.getSession(new NextRequest(request));
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

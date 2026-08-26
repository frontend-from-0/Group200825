import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0, isAuthConfigured, isDevAuthBypass } from "@/lib/auth/auth0";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/auth")) return true;
  if (pathname === "/waitlist") return true;
  return false;
}

function isAppPath(pathname: string): boolean {
  return (
    pathname.startsWith("/home") ||
    pathname.startsWith("/budget") ||
    pathname.startsWith("/insight") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/profile")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isDevAuthBypass()) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthConfigured()) {
    // Allow marketing entry without Auth0 during setup
    if (isAppPath(pathname)) {
      return NextResponse.redirect(new URL("/?setup=auth", request.url));
    }
    return NextResponse.next();
  }

  const authRes = await auth0.middleware(request);

  // Let Auth0 handle its own routes
  if (pathname.startsWith("/auth")) {
    return authRes;
  }

  const session = await auth0.getSession(request);

  if (isAppPath(pathname) && !session) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname === "/" && session) {
    // Allowlisted check happens in page; send authed users to home attempt
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Merge auth cookies/headers onto continuing response when present
  if (authRes && isPublicPath(pathname)) {
    return authRes;
  }

  return authRes;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

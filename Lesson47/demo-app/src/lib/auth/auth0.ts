import { Auth0Client } from "@auth0/nextjs-auth0/server";
import type { NextRequest } from "next/server";
import type { SessionData } from "@auth0/nextjs-auth0/types";

let client: Auth0Client | null = null;

export function getAuth0(): Auth0Client {
  if (!client) {
    client = new Auth0Client({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      secret: process.env.AUTH0_SECRET,
      appBaseUrl: process.env.APP_BASE_URL,
      routes: {
        login: "/auth/login",
        logout: "/auth/logout",
        callback: "/auth/callback",
      },
    });
  }
  return client;
}

export const auth0 = {
  middleware(request: Request) {
    return getAuth0().middleware(request);
  },
  getSession(req?: NextRequest): Promise<SessionData | null> {
    if (req) {
      return getAuth0().getSession(req);
    }
    return getAuth0().getSession();
  },
};

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH0_DOMAIN &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET &&
      process.env.AUTH0_SECRET,
  );
}

export function isDevAuthBypass(): boolean {
  return process.env.AUTH_DEV_BYPASS === "true";
}

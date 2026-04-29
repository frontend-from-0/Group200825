// This file was called middleware.ts before (v15 and before). In Nextjs v. 16 the file is called proxy.ts

import { auth0 } from "./lib/auth0";

export async function proxy(request) {
  const authResponse = await auth0.middleware(request);

  return authResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

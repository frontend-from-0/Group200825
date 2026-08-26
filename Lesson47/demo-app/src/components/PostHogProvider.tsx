"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

let initialized = false;

export function PostHogProvider({
  children,
  userId,
  locale,
}: {
  children: React.ReactNode;
  userId?: string;
  locale?: string;
}) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    if (!initialized) {
      posthog.init(key, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
        capture_pageview: true,
        persistence: "localStorage",
      });
      initialized = true;
    }
    if (userId) {
      posthog.identify(userId, { locale });
    }
  }, [userId, locale]);

  return children;
}

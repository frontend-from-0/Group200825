"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ErrorPanel({
  title,
  message,
  retryLabel,
}: {
  title: string;
  message: string;
  retryLabel: string;
}) {
  const router = useRouter();
  useEffect(() => {
    // ensure client boundary for error recovery
  }, []);

  return (
    <div className="app-canvas flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>
      <button
        type="button"
        className="mt-6 rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-white"
        onClick={() => router.refresh()}
      >
        {retryLabel}
      </button>
    </div>
  );
}

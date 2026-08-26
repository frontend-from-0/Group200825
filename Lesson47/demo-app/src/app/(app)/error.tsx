"use client";

import { ErrorPanel } from "@/components/ErrorPanel";

export default function AppError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <ErrorPanel
      title="Something went wrong"
      message={error.message || "Try again in a moment."}
      retryLabel="Retry"
    />
  );
}

"use client";

import { toggleBalanceHiddenAction } from "@/lib/profile/actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function BalanceToggle({
  hidden,
  showLabel,
  hideLabel,
}: {
  hidden: boolean;
  showLabel: string;
  hideLabel: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [isHidden, setHidden] = useState(hidden);

  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]"
      aria-pressed={isHidden}
      onClick={() => {
        start(async () => {
          const res = await toggleBalanceHiddenAction();
          setHidden(res.hidden);
          router.refresh();
        });
      }}
    >
      {isHidden ? showLabel : hideLabel}
    </button>
  );
}

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markNotificationReadAction } from "@/lib/notifications/actions";

type Item = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  readAt: Date | string | null;
  createdAt: Date | string;
};

export function NotificationList({
  items,
  emptyLabel,
}: {
  items: Item[];
  emptyLabel: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  if (!items.length) {
    return <p className="text-sm text-[var(--muted)]">{emptyLabel}</p>;
  }

  return (
    <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl bg-white">
      {items.map((n) => (
        <li key={n.id}>
          <button
            type="button"
            disabled={pending}
            className={`w-full px-4 py-3 text-left ${n.readAt ? "opacity-70" : ""}`}
            onClick={() => {
              start(async () => {
                const res = await markNotificationReadAction(n.id);
                if (res.ok && res.href) {
                  router.push(res.href);
                } else {
                  router.refresh();
                }
              });
            }}
          >
            <span className="block font-medium">{n.title}</span>
            <span className="block text-sm text-[var(--muted)]">{n.body}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

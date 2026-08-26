"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import type { Messages } from "@/lib/i18n/messages";

type Props = {
  messages: Messages;
  unreadCount: number;
  children: React.ReactNode;
};

export function AppShell({ messages, unreadCount, children }: Props) {
  const pathname = usePathname();
  return (
    <div className="app-canvas flex flex-col pb-24">
      <main className="flex-1 px-4 pt-6">{children}</main>
      <BottomNav
        messages={messages}
        unreadCount={unreadCount}
        pathname={pathname}
      />
    </div>
  );
}

import Link from "next/link";
import type { Messages } from "@/lib/i18n/messages";

type Props = {
  messages: Messages;
  unreadCount?: number;
  pathname: string;
};

const items = [
  { href: "/home", key: "home" as const, icon: HomeIcon },
  { href: "/insight", key: "insight" as const, icon: InsightIcon },
  { href: "/transactions/new", key: "add" as const, icon: AddIcon, primary: true },
  { href: "/notifications", key: "notifications" as const, icon: BellIcon },
  { href: "/profile", key: "profile" as const, icon: ProfileIcon },
];

export function BottomNav({ messages, unreadCount = 0, pathname }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[var(--canvas-max)] -translate-x-1/2 border-t border-black/5 bg-white/95 backdrop-blur"
      aria-label="Main"
    >
      <ul className="flex items-end justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const label = messages.nav[item.key];
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`relative mx-auto flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[11px] ${
                  item.primary
                    ? "-mt-5 text-white"
                    : active
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.primary ? (
                  <span className="flex size-12 items-center justify-center rounded-full bg-[var(--accent)] shadow-lg shadow-violet-300/50">
                    <Icon className="size-6" />
                    <span className="sr-only">{label}</span>
                  </span>
                ) : (
                  <>
                    <span className="relative">
                      <Icon className="size-5" />
                      {item.key === "notifications" && unreadCount > 0 ? (
                        <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[9px] font-semibold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      ) : null}
                    </span>
                    <span>{label}</span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InsightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5M4 19h16M8 16V10M12 16V7M16 16v-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AddIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9ZM10 18.5a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

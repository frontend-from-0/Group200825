import Link from "next/link";
import { getMessages } from "@/lib/i18n/messages";
import { auth0, isAuthConfigured, isDevAuthBypass } from "@/lib/auth/auth0";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WaitlistPage() {
  const messages = getMessages("en");

  if (isDevAuthBypass()) {
    redirect("/home");
  }

  if (isAuthConfigured()) {
    const session = await auth0.getSession();
    if (!session) {
      redirect("/");
    }
  }

  return (
    <div className="app-canvas flex min-h-dvh flex-col justify-center px-6 py-10">
      <p className="text-sm font-semibold text-[var(--accent)]">{messages.brand}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {messages.entry.waitlistTitle}
      </h1>
      <p className="mt-3 text-[var(--muted)]">{messages.entry.waitlistBody}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{messages.entry.softCap}</p>
      <div className="mt-8 space-y-3">
        <a
          href="/auth/logout"
          className="flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white font-medium"
        >
          {messages.profile.logout}
        </a>
        <Link href="/" className="block text-center text-sm text-[var(--accent)]">
          {messages.common.back}
        </Link>
      </div>
    </div>
  );
}

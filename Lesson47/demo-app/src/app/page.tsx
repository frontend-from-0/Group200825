import Link from "next/link";
import { auth0, isAuthConfigured, isDevAuthBypass } from "@/lib/auth/auth0";
import { getMessages } from "@/lib/i18n/messages";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EntryPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const params = await searchParams;
  const messages = getMessages("en");

  if (isDevAuthBypass()) {
    redirect("/home");
  }

  if (isAuthConfigured()) {
    const session = await auth0.getSession();
    if (session) {
      redirect("/home");
    }
  }

  return (
    <div className="app-canvas flex min-h-dvh flex-col justify-between px-6 py-10">
      <div>
        <p className="text-sm font-semibold tracking-wide text-[var(--accent)]">
          {messages.brand}
        </p>
        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-[var(--foreground)]">
          {messages.entry.headline}
        </h1>
        <p className="mt-4 max-w-sm text-[var(--muted)]">{messages.entry.sub}</p>
        {params.setup === "auth" ? (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Auth0 is not configured. Set env vars from{" "}
            <code className="text-xs">.env.example</code> or enable{" "}
            <code className="text-xs">AUTH_DEV_BYPASS=true</code>.
          </p>
        ) : null}
      </div>
      <div className="space-y-3 pb-6">
        {isAuthConfigured() ? (
          <a
            href="/auth/login"
            className="flex h-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-base font-semibold text-white"
          >
            {messages.entry.login}
          </a>
        ) : (
          <Link
            href="/home"
            className="flex h-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-base font-semibold text-white opacity-60"
            aria-disabled
          >
            {messages.entry.login}
          </Link>
        )}
        <p className="text-center text-xs text-[var(--muted)]">
          Closed beta · EUR · English & Turkish
        </p>
      </div>
    </div>
  );
}

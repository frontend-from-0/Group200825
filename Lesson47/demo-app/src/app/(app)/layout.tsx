import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { PostHogProvider } from "@/components/PostHogProvider";
import { requireAppUser, upsertAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import { unreadNotificationCount } from "@/lib/notifications/create";
import { isDevAuthBypass, isAuthConfigured, auth0 } from "@/lib/auth/auth0";

export const dynamic = "force-dynamic";

async function loadUser() {
  try {
    return await requireAppUser();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "NOT_ALLOWLISTED") {
      redirect("/waitlist");
    }
    if (msg === "UNAUTHORIZED") {
      redirect("/auth/login");
    }
    throw e;
  }
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Warm allowlist path for Auth0 sessions that hit /home before require
  if (!isDevAuthBypass() && isAuthConfigured()) {
    const session = await auth0.getSession();
    if (session?.user?.email && session.user.sub) {
      const { allowlisted } = await upsertAppUser({
        auth0Id: session.user.sub,
        email: String(session.user.email),
        name:
          typeof session.user.name === "string" ? session.user.name : null,
      });
      if (!allowlisted) {
        redirect("/waitlist");
      }
    }
  }

  const user = await loadUser();
  const locale = resolveLocale(user.locale);
  const messages = getMessages(locale);
  const unread = await unreadNotificationCount(user.id);

  return (
    <PostHogProvider userId={user.id} locale={user.locale}>
      <AppShell messages={messages} unreadCount={unread}>
        {children}
      </AppShell>
    </PostHogProvider>
  );
}

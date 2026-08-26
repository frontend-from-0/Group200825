import type { User } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { isEmailAllowlisted } from "@/lib/auth/allowlist";
import { isDevAuthBypass } from "@/lib/auth/auth0";
import { resolveLocale } from "@/lib/i18n/categories";
import { seedDemoData } from "@/lib/seed/demo";
import { ensureCurrentCycleBudget } from "@/lib/budget/rollover";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";

export type SessionUser = {
  auth0Id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
};

export async function upsertAppUser(
  sessionUser: SessionUser,
  opts?: { timezone?: string; acceptLanguage?: string },
): Promise<{ user: User; isNew: boolean; allowlisted: boolean }> {
  const allowlisted = isEmailAllowlisted(sessionUser.email);
  const existing = await prisma.user.findUnique({
    where: { auth0Id: sessionUser.auth0Id },
  });

  if (existing) {
    const user = await prisma.user.update({
      where: { id: existing.id },
      data: {
        email: sessionUser.email,
        name: sessionUser.name ?? existing.name,
        allowlisted,
      },
    });
    if (allowlisted) {
      const budgetCount = await prisma.budget.count({ where: { userId: user.id } });
      if (budgetCount === 0 && process.env.SEED_DEMO_ON_LOGIN !== "false") {
        await seedDemoData(user);
      }
      await ensureCurrentCycleBudget(user);
    }
    return { user, isNew: false, allowlisted };
  }

  const locale = resolveLocale(opts?.acceptLanguage);
  const user = await prisma.user.create({
    data: {
      auth0Id: sessionUser.auth0Id,
      email: sessionUser.email,
      name: sessionUser.name,
      locale,
      timezone: opts?.timezone || "Europe/Istanbul",
      allowlisted,
    },
  });

  await trackServer(user.id, AnalyticsEvents.auth_login_success, {
    is_new_user: true,
    locale: user.locale,
  });

  if (allowlisted && process.env.SEED_DEMO_ON_LOGIN !== "false") {
    await seedDemoData(user);
  }

  return { user, isNew: true, allowlisted };
}

export async function getDevBypassUser(): Promise<User> {
  const email = process.env.AUTH_DEV_EMAIL || "dev@fintrack.local";
  const name = process.env.AUTH_DEV_NAME || "Dev Tester";
  const auth0Id = "dev|bypass";

  const { user } = await upsertAppUser(
    { auth0Id, email, name },
    { timezone: "Europe/Istanbul", acceptLanguage: "en" },
  );
  return user;
}

export async function requireAppUser(): Promise<User> {
  if (isDevAuthBypass()) {
    return getDevBypassUser();
  }

  const { auth0 } = await import("@/lib/auth/auth0");
  const session = await auth0.getSession();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  const email =
    typeof session.user.email === "string" ? session.user.email : "";
  const { user, allowlisted } = await upsertAppUser({
    auth0Id: session.user.sub,
    email,
    name: typeof session.user.name === "string" ? session.user.name : null,
  });

  if (!allowlisted) {
    throw new Error("NOT_ALLOWLISTED");
  }

  return user;
}

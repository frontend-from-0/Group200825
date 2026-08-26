"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAppUser } from "@/lib/auth/session";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";
import { resetDemoData } from "@/lib/seed/demo";
import type { Locale } from "@/lib/i18n/categories";

export async function setLocaleAction(
  locale: Locale,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAppUser();
  const from = user.locale;
  await prisma.user.update({
    where: { id: user.id },
    data: { locale },
  });
  await trackServer(user.id, AnalyticsEvents.locale_changed, {
    from,
    to: locale,
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function toggleBalanceHiddenAction(): Promise<{
  ok: true;
  hidden: boolean;
}> {
  const user = await requireAppUser();
  const next = !user.balanceHidden;
  await prisma.user.update({
    where: { id: user.id },
    data: { balanceHidden: next },
  });
  await trackServer(user.id, AnalyticsEvents.balance_visibility_toggled, {
    hidden: next,
  });
  revalidatePath("/home");
  return { ok: true, hidden: next };
}

export async function resetDemoAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const user = await requireAppUser();
  await resetDemoData(user);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteAccountAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const user = await requireAppUser();
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.accountBalance.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  return { ok: true };
}

export async function submitFeedbackAction(message: string): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const user = await requireAppUser();
  const trimmed = message.trim();
  if (!trimmed) return { ok: false, error: "EMPTY" };

  await trackServer(user.id, "feedback_submitted", {
    locale: user.locale,
    length: trimmed.length,
    // Intentionally omit free-text body (may contain PII)
  });

  const to = process.env.FEEDBACK_EMAIL;
  if (to) {
    console.info(`[feedback] from=${user.id} to=${to} chars=${trimmed.length}`);
  }

  return { ok: true };
}

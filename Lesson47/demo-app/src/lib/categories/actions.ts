"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAppUser } from "@/lib/auth/session";
import { parseAmount } from "@/lib/money/amount";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";
import { createNotification } from "@/lib/notifications/create";
import { resolveLocale } from "@/lib/i18n/categories";

export async function renameCategoryAction(input: {
  categoryId: string;
  name: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAppUser();
  const cat = await prisma.category.findFirst({
    where: { id: input.categoryId, userId: user.id },
  });
  if (!cat) return { ok: false, error: "NOT_FOUND" };

  await prisma.category.update({
    where: { id: cat.id },
    data: { name: input.name.trim() },
  });
  await trackServer(user.id, AnalyticsEvents.category_renamed, {
    category_id: cat.id,
  });
  revalidatePath(`/categories/${cat.id}`);
  revalidatePath("/insight");
  return { ok: true };
}

export async function adjustCategoryLimitAction(input: {
  categoryId: string;
  newLimitEur: number;
  applyRule: "immediate" | "next_month";
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAppUser();
  const cat = await prisma.category.findFirst({
    where: { id: input.categoryId, userId: user.id },
    include: { budget: true },
  });
  if (!cat) return { ok: false, error: "NOT_FOUND" };

  const newLimit = parseAmount(input.newLimitEur);
  const old = cat.limitEur;

  if (input.applyRule === "immediate") {
    await prisma.category.update({
      where: { id: cat.id },
      data: {
        limitEur: newLimit,
        applyRule: "immediate",
        pendingLimitEur: null,
      },
    });
  } else {
    await prisma.category.update({
      where: { id: cat.id },
      data: {
        applyRule: "next_month",
        pendingLimitEur: newLimit,
      },
    });
  }

  const locale = resolveLocale(user.locale);
  await createNotification({
    userId: user.id,
    type: "limit_adjusted",
    title: locale === "tr" ? "Limit güncellendi" : "Limit updated",
    body:
      locale === "tr"
        ? `${cat.name} limiti güncellendi.`
        : `${cat.name} limit was updated.`,
    href: `/categories/${cat.id}`,
    dedupeKey: `limit_adj:${cat.id}:${newLimit}:${Date.now()}`,
  });

  await trackServer(user.id, AnalyticsEvents.category_limit_adjust_confirmed, {
    category_id: cat.id,
    old_eur: old,
    new_eur: newLimit,
    apply_rule: input.applyRule,
  });

  revalidatePath(`/categories/${cat.id}`);
  revalidatePath("/insight");
  revalidatePath("/home");
  return { ok: true };
}

export async function deleteCategoryAction(
  categoryId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAppUser();
  const cat = await prisma.category.findFirst({
    where: { id: categoryId, userId: user.id },
  });
  if (!cat) return { ok: false, error: "NOT_FOUND" };

  const txnCount = await prisma.transaction.count({
    where: { categoryId },
  });
  if (txnCount > 0) {
    return { ok: false, error: "HAS_TRANSACTIONS" };
  }

  await prisma.category.delete({ where: { id: categoryId } });
  await trackServer(user.id, AnalyticsEvents.category_deleted, {
    category_id: categoryId,
  });
  revalidatePath("/insight");
  return { ok: true };
}

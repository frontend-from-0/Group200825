"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAppUser } from "@/lib/auth/session";
import { parseAmount, roundMoney } from "@/lib/money/amount";
import { getCurrentCycleBounds } from "@/lib/cycle/bounds";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";
import { createNotification } from "@/lib/notifications/create";
import { DEFAULT_CATEGORIES, resolveLocale } from "@/lib/i18n/categories";

export type CategoryInput = {
  key?: string;
  name: string;
  icon: string;
  color: string;
  limitEur: number;
};

export async function createBudgetAction(input: {
  totalAmountEur: number;
  categories: CategoryInput[];
}): Promise<{ ok: true; budgetId: string } | { ok: false; error: string }> {
  try {
    const user = await requireAppUser();
    const total = parseAmount(input.totalAmountEur);
    const cats = input.categories.map((c) => ({
      ...c,
      limitEur: parseAmount(c.limitEur),
    }));
    const allocated = roundMoney(cats.reduce((s, c) => s + c.limitEur, 0));
    const left = roundMoney(total - allocated);

    await trackServer(user.id, AnalyticsEvents.budget_create_submitted, {
      total_eur: total,
      category_count: cats.length,
      amount_left_eur: left,
      is_demo_seed: false,
      locale: user.locale,
    });

    if (left !== 0) {
      return { ok: false, error: "MUST_ALLOCATE" };
    }

    const { cycleStart, cycleEnd } = getCurrentCycleBounds(user.timezone);

    // Archive existing active/demo budgets for this cycle
    await prisma.budget.updateMany({
      where: {
        userId: user.id,
        status: "active",
      },
      data: { status: "archived" },
    });

    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        cycleStart,
        cycleEnd,
        totalAmountEur: total,
        status: "active",
        isDemoSeed: false,
        categories: {
          create: cats.map((c) => ({
            userId: user.id,
            key: c.key,
            name: c.name,
            icon: c.icon,
            color: c.color,
            limitEur: c.limitEur,
          })),
        },
      },
    });

    // Remove demo seed txns/budgets clutter (archive already done; delete demo)
    const demoBudgets = await prisma.budget.findMany({
      where: { userId: user.id, isDemoSeed: true },
      select: { id: true },
    });
    const demoIds = demoBudgets.map((b) => b.id);
    if (demoIds.length) {
      await prisma.transaction.deleteMany({
        where: { budgetId: { in: demoIds } },
      });
      await prisma.category.deleteMany({ where: { budgetId: { in: demoIds } } });
      await prisma.budget.deleteMany({ where: { id: { in: demoIds } } });
    }

    const locale = resolveLocale(user.locale);
    await createNotification({
      userId: user.id,
      type: "budget_created",
      title: locale === "tr" ? "Bütçe oluşturuldu" : "Budget created",
      body:
        locale === "tr"
          ? "Aylık bütçen hazır. Harcamalarını kaydetmeye başla."
          : "Your monthly budget is ready. Start logging spending.",
      href: "/insight",
      dedupeKey: `budget_created:${budget.id}`,
    });

    await trackServer(user.id, AnalyticsEvents.budget_create_succeeded, {
      budget_id: budget.id,
      is_demo_seed: false,
      locale: user.locale,
    });

    revalidatePath("/home");
    revalidatePath("/insight");
    return { ok: true, budgetId: budget.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    try {
      const user = await requireAppUser();
      await trackServer(user.id, AnalyticsEvents.budget_create_failed, {
        error_code: msg,
      });
    } catch {
      /* ignore */
    }
    return { ok: false, error: msg };
  }
}

export async function getDefaultCategoryTemplates() {
  const user = await requireAppUser();
  const locale = resolveLocale(user.locale);
  return DEFAULT_CATEGORIES.map((c) => ({
    key: c.key,
    name: c.name[locale],
    icon: c.icon,
    color: c.color,
    limitEur: 0,
  }));
}

export async function updateBudgetTotalAction(input: {
  budgetId: string;
  totalAmountEur: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAppUser();
  const budget = await prisma.budget.findFirst({
    where: { id: input.budgetId, userId: user.id, status: "active" },
    include: { categories: true },
  });
  if (!budget) return { ok: false, error: "NOT_FOUND" };

  const total = parseAmount(input.totalAmountEur);
  const allocated = roundMoney(
    budget.categories.reduce((s, c) => s + c.limitEur, 0),
  );
  if (total < allocated) {
    // Auto-absorb difference into General if possible
    const general = budget.categories.find((c) => c.key === "general");
    const diff = roundMoney(allocated - total);
    if (!general || general.limitEur < diff) {
      return { ok: false, error: "TOTAL_BELOW_ALLOCATION" };
    }
    await prisma.category.update({
      where: { id: general.id },
      data: { limitEur: roundMoney(general.limitEur - diff) },
    });
  } else if (total > allocated) {
    const general = budget.categories.find((c) => c.key === "general");
    const diff = roundMoney(total - allocated);
    if (general) {
      await prisma.category.update({
        where: { id: general.id },
        data: { limitEur: roundMoney(general.limitEur + diff) },
      });
    }
  }

  await prisma.budget.update({
    where: { id: budget.id },
    data: { totalAmountEur: total },
  });
  revalidatePath("/home");
  revalidatePath("/insight");
  return { ok: true };
}

export async function addCategoryToBudgetAction(input: {
  budgetId: string;
  name: string;
  icon: string;
  color: string;
  limitEur: number;
}): Promise<{ ok: true; categoryId: string } | { ok: false; error: string }> {
  const user = await requireAppUser();
  const budget = await prisma.budget.findFirst({
    where: { id: input.budgetId, userId: user.id, status: "active" },
    include: { categories: true },
  });
  if (!budget) return { ok: false, error: "NOT_FOUND" };

  const limit = parseAmount(input.limitEur);
  const allocated = roundMoney(
    budget.categories.reduce((s, c) => s + c.limitEur, 0),
  );
  const left = roundMoney(budget.totalAmountEur - allocated);
  if (limit > left) {
    const general = budget.categories.find((c) => c.key === "general");
    if (!general || general.limitEur < limit) {
      return { ok: false, error: "NO_ROOM" };
    }
    await prisma.category.update({
      where: { id: general.id },
      data: { limitEur: roundMoney(general.limitEur - limit) },
    });
  }

  const cat = await prisma.category.create({
    data: {
      userId: user.id,
      budgetId: budget.id,
      name: input.name.trim(),
      icon: input.icon,
      color: input.color,
      limitEur: limit,
    },
  });
  revalidatePath("/insight");
  return { ok: true, categoryId: cat.id };
}

export async function deleteBudgetAction(
  budgetId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAppUser();
  const budget = await prisma.budget.findFirst({
    where: { id: budgetId, userId: user.id },
  });
  if (!budget) return { ok: false, error: "NOT_FOUND" };

  await prisma.transaction.deleteMany({ where: { budgetId } });
  await prisma.category.deleteMany({ where: { budgetId } });
  await prisma.budget.delete({ where: { id: budgetId } });
  revalidatePath("/home");
  revalidatePath("/insight");
  return { ok: true };
}

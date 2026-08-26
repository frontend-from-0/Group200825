"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAppUser } from "@/lib/auth/session";
import { parseAmount } from "@/lib/money/amount";
import { findBudgetForTransactionDate, sumExpensesByCategory } from "@/lib/budget/queries";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";
import { maybeNotifyCategoryThresholds } from "@/lib/notifications/create";
import { getCurrentCycleBounds } from "@/lib/cycle/bounds";

export async function createTransactionAction(input: {
  amountEur: number;
  type: "expense" | "income";
  categoryId?: string | null;
  title: string;
  date: string;
  note?: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const user = await requireAppUser();
    const amount = parseAmount(input.amountEur);
    const date = new Date(input.date);
    if (Number.isNaN(date.getTime())) {
      return { ok: false, error: "INVALID_DATE" };
    }

    const current = getCurrentCycleBounds(user.timezone);
    if (date > current.cycleEnd) {
      return { ok: false, error: "FUTURE_OUTSIDE_CYCLE" };
    }

    const budget = await findBudgetForTransactionDate(user, date);
    if (!budget) {
      await trackServer(user.id, AnalyticsEvents.transaction_create_failed, {
        error_code: "NO_BUDGET_FOR_DATE",
      });
      return { ok: false, error: "NO_BUDGET_FOR_DATE" };
    }

    let categoryId: string | null = null;
    if (input.type === "expense") {
      if (!input.categoryId) {
        return { ok: false, error: "CATEGORY_REQUIRED" };
      }
      const cat = await prisma.category.findFirst({
        where: {
          id: input.categoryId,
          userId: user.id,
          budgetId: budget.id,
        },
      });
      if (!cat) return { ok: false, error: "CATEGORY_NOT_FOUND" };
      categoryId = cat.id;
    }

    const txn = await prisma.transaction.create({
      data: {
        userId: user.id,
        budgetId: budget.id,
        categoryId,
        type: input.type,
        amountEur: amount,
        title: input.title.trim(),
        note: input.note?.trim() || null,
        date,
        isDemoSeed: false,
      },
    });

    if (input.type === "expense" && categoryId) {
      const spendMap = await sumExpensesByCategory(budget.id);
      const cat = await prisma.category.findUniqueOrThrow({
        where: { id: categoryId },
      });
      await maybeNotifyCategoryThresholds({
        user,
        budgetId: budget.id,
        categoryId,
        categoryName: cat.name,
        spent: spendMap.get(categoryId) ?? 0,
        limit: cat.limitEur,
      });
    }

    await trackServer(user.id, AnalyticsEvents.transaction_create_succeeded, {
      type: input.type,
      amount_eur: amount,
      category_id: categoryId,
      is_demo_seed: false,
      locale: user.locale,
    });

    revalidatePath("/home");
    revalidatePath("/insight");
    revalidatePath("/transactions");
    return { ok: true, id: txn.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return { ok: false, error: msg };
  }
}

export async function updateTransactionAction(input: {
  id: string;
  amountEur: number;
  type: "expense" | "income";
  categoryId?: string | null;
  title: string;
  date: string;
  note?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAppUser();
  const existing = await prisma.transaction.findFirst({
    where: { id: input.id, userId: user.id },
  });
  if (!existing) return { ok: false, error: "NOT_FOUND" };

  const amount = parseAmount(input.amountEur);
  const date = new Date(input.date);
  const budget = await findBudgetForTransactionDate(user, date);
  if (!budget) return { ok: false, error: "NO_BUDGET_FOR_DATE" };

  let categoryId: string | null = null;
  if (input.type === "expense") {
    if (!input.categoryId) return { ok: false, error: "CATEGORY_REQUIRED" };
    const cat = await prisma.category.findFirst({
      where: { id: input.categoryId, userId: user.id, budgetId: budget.id },
    });
    if (!cat) return { ok: false, error: "CATEGORY_NOT_FOUND" };
    categoryId = cat.id;
  }

  await prisma.transaction.update({
    where: { id: existing.id },
    data: {
      amountEur: amount,
      type: input.type,
      categoryId,
      title: input.title.trim(),
      note: input.note?.trim() || null,
      date,
      budgetId: budget.id,
      isDemoSeed: false,
    },
  });

  await trackServer(user.id, AnalyticsEvents.transaction_edited, {
    transaction_id: existing.id,
  });

  revalidatePath("/home");
  revalidatePath("/insight");
  revalidatePath("/transactions");
  return { ok: true };
}

export async function deleteTransactionAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAppUser();
  const existing = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) return { ok: false, error: "NOT_FOUND" };

  await prisma.transaction.delete({ where: { id } });
  await trackServer(user.id, AnalyticsEvents.transaction_deleted, {
    transaction_id: id,
  });

  revalidatePath("/home");
  revalidatePath("/insight");
  revalidatePath("/transactions");
  return { ok: true };
}

export async function listTransactionsAction(opts?: {
  cursor?: string;
  take?: number;
  categoryId?: string;
}) {
  const user = await requireAppUser();
  const take = opts?.take ?? 20;
  const items = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      ...(opts?.categoryId ? { categoryId: opts.categoryId } : {}),
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: take + 1,
    ...(opts?.cursor
      ? { skip: 1, cursor: { id: opts.cursor } }
      : {}),
    include: { category: true },
  });
  const hasMore = items.length > take;
  const page = hasMore ? items.slice(0, take) : items;
  await trackServer(user.id, AnalyticsEvents.transaction_list_viewed, {
    count: page.length,
  });
  return {
    items: page,
    nextCursor: hasMore ? page[page.length - 1]?.id : null,
  };
}

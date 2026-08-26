import type { Budget, Category, Transaction, User } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { roundMoney } from "@/lib/money/amount";
import { dateInCycle, getCurrentCycleBounds } from "@/lib/cycle/bounds";

export type CategorySpend = Category & { spentEur: number };

export async function getActiveBudgetForUser(
  user: User,
): Promise<(Budget & { categories: Category[] }) | null> {
  const { cycleStart, cycleEnd } = getCurrentCycleBounds(user.timezone);
  return prisma.budget.findFirst({
    where: {
      userId: user.id,
      status: "active",
      cycleStart: { lte: cycleEnd },
      cycleEnd: { gte: cycleStart },
    },
    include: { categories: { orderBy: { name: "asc" } } },
    orderBy: [{ isDemoSeed: "asc" }, { createdAt: "desc" }],
  });
}

export async function getBudgetByIdForUser(
  userId: string,
  budgetId: string,
): Promise<(Budget & { categories: Category[] }) | null> {
  return prisma.budget.findFirst({
    where: { id: budgetId, userId },
    include: { categories: { orderBy: { name: "asc" } } },
  });
}

export async function sumExpensesByCategory(
  budgetId: string,
): Promise<Map<string, number>> {
  const rows = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      budgetId,
      type: "expense",
      categoryId: { not: null },
    },
    _sum: { amountEur: true },
  });
  const map = new Map<string, number>();
  for (const row of rows) {
    if (row.categoryId) {
      map.set(row.categoryId, roundMoney(row._sum.amountEur ?? 0));
    }
  }
  return map;
}

export async function getBudgetSpent(budgetId: string): Promise<number> {
  const agg = await prisma.transaction.aggregate({
    where: { budgetId, type: "expense" },
    _sum: { amountEur: true },
  });
  return roundMoney(agg._sum.amountEur ?? 0);
}

export async function getDisplayBalance(userId: string): Promise<{
  startingEur: number;
  displayEur: number;
  isDemoSeed: boolean;
}> {
  const balance = await prisma.accountBalance.findUnique({
    where: { userId },
  });
  const starting = balance?.amountEur ?? 0;
  const income = await prisma.transaction.aggregate({
    where: { userId, type: "income" },
    _sum: { amountEur: true },
  });
  const expense = await prisma.transaction.aggregate({
    where: { userId, type: "expense" },
    _sum: { amountEur: true },
  });
  const display = roundMoney(
    starting + (income._sum.amountEur ?? 0) - (expense._sum.amountEur ?? 0),
  );
  return {
    startingEur: starting,
    displayEur: display,
    isDemoSeed: balance?.isDemoSeed ?? false,
  };
}

export async function findBudgetForTransactionDate(
  user: User,
  date: Date,
): Promise<Budget | null> {
  const budgets = await prisma.budget.findMany({
    where: { userId: user.id },
    orderBy: { cycleStart: "desc" },
  });
  return (
    budgets.find((b) => dateInCycle(date, b.cycleStart, b.cycleEnd)) ?? null
  );
}

export function withCategorySpend(
  categories: Category[],
  spendMap: Map<string, number>,
): CategorySpend[] {
  return categories.map((c) => ({
    ...c,
    spentEur: spendMap.get(c.id) ?? 0,
  }));
}

export async function listRecentTransactions(
  userId: string,
  take = 5,
): Promise<(Transaction & { category: Category | null })[]> {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take,
    include: { category: true },
  });
}

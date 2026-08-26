import type { Budget, User } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  getCurrentCycleBounds,
  getNextCycleBounds,
} from "@/lib/cycle/bounds";

export async function ensureCurrentCycleBudget(
  user: User,
): Promise<{ budget: Budget | null; rolledOver: boolean }> {
  const { cycleStart, cycleEnd } = getCurrentCycleBounds(user.timezone);

  const current = await prisma.budget.findFirst({
    where: {
      userId: user.id,
      status: "active",
      cycleStart: { lte: cycleEnd },
      cycleEnd: { gte: cycleStart },
    },
    orderBy: { createdAt: "desc" },
  });

  if (current) {
    const sameMonth =
      current.cycleStart.getTime() === cycleStart.getTime() &&
      current.cycleEnd.getTime() === cycleEnd.getTime();
    if (sameMonth || (current.cycleStart <= cycleEnd && current.cycleEnd >= cycleStart)) {
      // Prefer exact current month
      if (
        current.cycleStart.getUTCFullYear() === cycleStart.getUTCFullYear() &&
        current.cycleStart.getUTCMonth() === cycleStart.getUTCMonth()
      ) {
        return { budget: current, rolledOver: false };
      }
    }
  }

  const exact = await prisma.budget.findFirst({
    where: {
      userId: user.id,
      cycleStart,
      cycleEnd,
    },
  });
  if (exact) {
    if (exact.status !== "active") {
      await prisma.budget.update({
        where: { id: exact.id },
        data: { status: "active" },
      });
    }
    return { budget: exact, rolledOver: false };
  }

  // Find most recent prior active/archived budget to copy
  const prior = await prisma.budget.findFirst({
    where: {
      userId: user.id,
      isDemoSeed: false,
      cycleEnd: { lt: cycleStart },
    },
    orderBy: { cycleEnd: "desc" },
    include: { categories: true },
  });

  if (!prior || prior.categories.length === 0) {
    return { budget: null, rolledOver: false };
  }

  const created = await prisma.budget.create({
    data: {
      userId: user.id,
      cycleStart,
      cycleEnd,
      totalAmountEur: prior.totalAmountEur,
      status: "active",
      isDemoSeed: false,
      categories: {
        create: prior.categories.map((c) => ({
          userId: user.id,
          key: c.key,
          name: c.name,
          icon: c.icon,
          color: c.color,
          limitEur: c.pendingLimitEur ?? c.limitEur,
          applyRule: "immediate",
          pendingLimitEur: null,
        })),
      },
    },
  });

  await prisma.budget.updateMany({
    where: {
      userId: user.id,
      id: { not: created.id },
      status: "active",
    },
    data: { status: "archived" },
  });

  return { budget: created, rolledOver: true };
}

export async function applyPendingLimitsForNewCycle(
  budgetId: string,
): Promise<void> {
  const cats = await prisma.category.findMany({ where: { budgetId } });
  for (const c of cats) {
    if (c.pendingLimitEur != null) {
      await prisma.category.update({
        where: { id: c.id },
        data: {
          limitEur: c.pendingLimitEur,
          pendingLimitEur: null,
          applyRule: "immediate",
        },
      });
    }
  }
}

export function previewNextCycle(user: User) {
  const current = getCurrentCycleBounds(user.timezone);
  return getNextCycleBounds(current.cycleStart, user.timezone);
}

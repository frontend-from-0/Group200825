import type { NotificationType, User } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
  dedupeKey: string;
}): Promise<void> {
  await prisma.notification.upsert({
    where: {
      userId_dedupeKey: {
        userId: input.userId,
        dedupeKey: input.dedupeKey,
      },
    },
    create: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      href: input.href,
      dedupeKey: input.dedupeKey,
    },
    update: {},
  });
}

/** Near/over-limit notifications with re-arm when spending drops under then crosses again. */
export async function maybeNotifyCategoryThresholds(opts: {
  user: User;
  budgetId: string;
  categoryId: string;
  categoryName: string;
  spent: number;
  limit: number;
}): Promise<void> {
  const { user, budgetId, categoryId, categoryName, spent, limit } = opts;
  if (limit <= 0) return;

  const ratio = spent / limit;
  const locale = user.locale === "tr" ? "tr" : "en";

  if (ratio >= 1) {
    await createNotification({
      userId: user.id,
      type: "over_limit",
      title:
        locale === "tr"
          ? `${categoryName} limiti aşıldı`
          : `${categoryName} over limit`,
      body:
        locale === "tr"
          ? `Bu kategoride limitini aştın. Limiti ayarlayabilirsin.`
          : `You’ve exceeded this category limit. Consider adjusting it.`,
      href: `/categories/${categoryId}`,
      dedupeKey: `over:${budgetId}:${categoryId}:${Math.floor(spent)}`,
    });
  } else if (ratio >= 0.8) {
    await createNotification({
      userId: user.id,
      type: "near_limit",
      title:
        locale === "tr"
          ? `${categoryName} %80’e yaklaştı`
          : `${categoryName} nearing limit`,
      body:
        locale === "tr"
          ? `Kategori limitinin %80’ine veya üzerine ulaştın.`
          : `You’ve reached 80% of this category’s limit.`,
      href: `/categories/${categoryId}`,
      dedupeKey: `near:${budgetId}:${categoryId}:80`,
    });
  }
}

export async function unreadNotificationCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null },
  });
}

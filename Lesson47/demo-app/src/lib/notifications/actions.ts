"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAppUser } from "@/lib/auth/session";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";

export async function listNotificationsAction() {
  const user = await requireAppUser();
  const items = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unread = items.filter((n) => !n.readAt).length;
  await trackServer(user.id, AnalyticsEvents.notifications_opened, {
    unread_count: unread,
  });
  return items;
}

export async function markNotificationReadAction(id: string) {
  const user = await requireAppUser();
  const n = await prisma.notification.findFirst({
    where: { id, userId: user.id },
  });
  if (!n) return { ok: false as const, error: "NOT_FOUND" };

  if (!n.readAt) {
    await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  await trackServer(user.id, AnalyticsEvents.notification_clicked, {
    notification_type: n.type,
    notification_id: n.id,
  });

  revalidatePath("/notifications");
  revalidatePath("/home");
  return { ok: true as const, href: n.href };
}

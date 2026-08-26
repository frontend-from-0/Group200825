import type { User } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getCurrentCycleBounds } from "@/lib/cycle/bounds";
import { DEFAULT_CATEGORIES } from "@/lib/i18n/categories";
import { resolveLocale } from "@/lib/i18n/categories";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";
import { createNotification } from "@/lib/notifications/create";

const SEED_BALANCE = 10_000;
const TEMPLATE_VERSION = process.env.SEED_TEMPLATE_VERSION || "1";

export async function seedDemoData(user: User): Promise<void> {
  const existing = await prisma.budget.findFirst({
    where: { userId: user.id, isDemoSeed: true },
  });
  if (existing) return;

  const locale = resolveLocale(user.locale);
  const { cycleStart, cycleEnd } = getCurrentCycleBounds(user.timezone);
  const total = 2000;

  const budget = await prisma.budget.create({
    data: {
      userId: user.id,
      cycleStart,
      cycleEnd,
      totalAmountEur: total,
      status: "active",
      isDemoSeed: true,
    },
  });

  const limits: Record<string, number> = {
    general: 200,
    transportation: 250,
    charity: 50,
    education: 150,
    food_drink: 450,
    shopping: 300,
    housing: 500,
    health: 100,
  };

  const categories = await Promise.all(
    DEFAULT_CATEGORIES.map((c) =>
      prisma.category.create({
        data: {
          userId: user.id,
          budgetId: budget.id,
          key: c.key,
          name: c.name[locale],
          icon: c.icon,
          color: c.color,
          limitEur: limits[c.key] ?? 0,
        },
      }),
    ),
  );

  const food = categories.find((c) => c.key === "food_drink");
  const transport = categories.find((c) => c.key === "transportation");
  const shopping = categories.find((c) => c.key === "shopping");

  const sampleTxns = [
    { categoryId: food?.id, title: "Grocery market", amount: 42.5 },
    { categoryId: transport?.id, title: "Metro card", amount: 25 },
    { categoryId: shopping?.id, title: "Household items", amount: 67.9 },
    { categoryId: food?.id, title: "Cafe", amount: 12.4 },
  ];

  const now = new Date();
  for (const txn of sampleTxns) {
    if (!txn.categoryId) continue;
    await prisma.transaction.create({
      data: {
        userId: user.id,
        budgetId: budget.id,
        categoryId: txn.categoryId,
        type: "expense",
        amountEur: txn.amount,
        title: txn.title,
        date: now,
        isDemoSeed: true,
      },
    });
  }

  await prisma.accountBalance.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      amountEur: SEED_BALANCE,
      isDemoSeed: true,
    },
    update: {
      amountEur: SEED_BALANCE,
      isDemoSeed: true,
    },
  });

  await createNotification({
    userId: user.id,
    type: "budget_created",
    title: locale === "tr" ? "Demo bütçe hazır" : "Demo budget ready",
    body:
      locale === "tr"
        ? "Örnek verilerle keşfetmeye başla. Gerçek bütçe oluşturunca demo kalkar."
        : "Explore with sample data. Creating a real budget replaces the demo.",
    href: "/home",
    dedupeKey: `budget_created:${budget.id}`,
  });

  await trackServer(user.id, AnalyticsEvents.seed_data_applied, {
    template_version: TEMPLATE_VERSION,
    is_demo_seed: true,
    locale: user.locale,
  });
}

export async function resetDemoData(user: User): Promise<void> {
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.accountBalance.deleteMany({ where: { userId: user.id } });
  await seedDemoData(user);
}

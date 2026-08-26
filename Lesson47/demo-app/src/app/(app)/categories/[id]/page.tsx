import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import { prisma } from "@/lib/db/prisma";
import { formatEur } from "@/lib/money/amount";
import { TransactionList } from "@/components/TransactionList";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAppUser();
  const locale = resolveLocale(user.locale);
  const m = getMessages(locale);

  const category = await prisma.category.findFirst({
    where: { id, userId: user.id },
  });
  if (!category) notFound();

  const spentAgg = await prisma.transaction.aggregate({
    where: { categoryId: id, type: "expense" },
    _sum: { amountEur: true },
  });
  const spent = spentAgg._sum.amountEur ?? 0;
  const over = spent > category.limitEur;
  const txns = await prisma.transaction.findMany({
    where: { categoryId: id, userId: user.id },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: 50,
    include: { category: true },
  });

  await trackServer(user.id, AnalyticsEvents.category_detail_viewed, {
    category_id: id,
    spent_eur: spent,
    limit_eur: category.limitEur,
    is_over: over,
    locale: user.locale,
  });

  return (
    <div className="space-y-6">
      <Link href="/insight" className="text-sm text-[var(--accent)]">
        ← {m.common.back}
      </Link>
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">{m.category.detail}</p>
          <h1 className="text-2xl font-semibold">{category.name}</h1>
        </div>
        <Link
          href={`/categories/${id}/manage`}
          className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--accent)]"
        >
          {m.category.manage}
        </Link>
      </header>

      <section
        className={`rounded-3xl p-5 ${over ? "bg-red-50" : "bg-[var(--card)]"}`}
      >
        <p className="text-sm text-[var(--muted)]">
          {formatEur(spent, locale)} / {formatEur(category.limitEur, locale)}
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, category.limitEur ? (spent / category.limitEur) * 100 : 0)}%`,
              background: over ? "var(--danger)" : category.color,
            }}
          />
        </div>
        {over ? (
          <p className="mt-2 font-medium text-[var(--danger)]">
            {m.category.overBy} {formatEur(spent - category.limitEur, locale)}
          </p>
        ) : null}
      </section>

      <TransactionList
        items={txns}
        locale={locale}
        emptyLabel={m.txn.empty}
      />
    </div>
  );
}

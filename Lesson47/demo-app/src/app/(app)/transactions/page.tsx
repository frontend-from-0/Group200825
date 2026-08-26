import Link from "next/link";
import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import { prisma } from "@/lib/db/prisma";
import { TransactionList } from "@/components/TransactionList";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";

export default async function TransactionsPage() {
  const user = await requireAppUser();
  const locale = resolveLocale(user.locale);
  const m = getMessages(locale);
  const items = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: 50,
    include: { category: true },
  });

  await trackServer(user.id, AnalyticsEvents.transaction_list_viewed, {
    count: items.length,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{m.txn.listTitle}</h1>
        <Link
          href="/transactions/new"
          className="text-sm font-medium text-[var(--accent)]"
        >
          + {m.nav.add}
        </Link>
      </div>
      <TransactionList items={items} locale={locale} emptyLabel={m.txn.empty} />
    </div>
  );
}

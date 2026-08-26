import Link from "next/link";
import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import { getActiveBudgetForUser } from "@/lib/budget/queries";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";

export default async function NewTransactionPage() {
  const user = await requireAppUser();
  const locale = resolveLocale(user.locale);
  const m = getMessages(locale);
  const budget = await getActiveBudgetForUser(user);

  await trackServer(user.id, AnalyticsEvents.transaction_create_started, {
    source: "nav",
    locale: user.locale,
  });

  const today = new Date().toISOString().slice(0, 10);

  if (!budget) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{m.txn.addTitle}</h1>
        <p className="text-[var(--muted)]">{m.insight.noBudget}</p>
        <Link
          href="/budget/new"
          className="inline-flex h-11 items-center rounded-2xl bg-[var(--accent)] px-4 font-semibold text-white"
        >
          {m.home.setBudget}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/home" className="text-sm text-[var(--accent)]">
        ← {m.common.back}
      </Link>
      <h1 className="text-2xl font-semibold">{m.txn.addTitle}</h1>
      <AddTransactionForm
        categories={budget.categories.map((c) => ({
          id: c.id,
          name: c.name,
          color: c.color,
        }))}
        defaultDate={today}
        labels={{
          addTitle: m.txn.addTitle,
          amount: m.txn.amount,
          type: m.txn.type,
          expense: m.txn.expense,
          income: m.txn.income,
          category: m.txn.category,
          title: m.txn.title,
          date: m.txn.date,
          note: m.txn.note,
          save: m.txn.save,
          incomeHint: m.txn.incomeHint,
          noBudgetForDate: m.txn.noBudgetForDate,
          error: m.common.error,
        }}
      />
    </div>
  );
}

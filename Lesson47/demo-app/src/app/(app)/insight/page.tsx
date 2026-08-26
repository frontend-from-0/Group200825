import Link from "next/link";
import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import {
  getActiveBudgetForUser,
  getBudgetSpent,
  sumExpensesByCategory,
  withCategorySpend,
} from "@/lib/budget/queries";
import { RemainingHero } from "@/components/RemainingHero";
import { CategoryProgressList } from "@/components/CategoryProgressList";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";
import { formatCycleLabel } from "@/lib/cycle/bounds";

export default async function InsightPage() {
  const user = await requireAppUser();
  const locale = resolveLocale(user.locale);
  const m = getMessages(locale);
  const budget = await getActiveBudgetForUser(user);

  if (!budget) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{m.insight.title}</h1>
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

  const spent = await getBudgetSpent(budget.id);
  const remaining = budget.totalAmountEur - spent;
  const spendMap = await sumExpensesByCategory(budget.id);
  const categories = withCategorySpend(budget.categories, spendMap);

  await trackServer(user.id, AnalyticsEvents.insight_viewed, {
    month: formatCycleLabel(budget.cycleStart, locale, user.timezone),
    spent_eur: spent,
    remaining_eur: remaining,
    is_demo_seed: budget.isDemoSeed,
    billing_cycle_id: budget.id,
    locale: user.locale,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{m.insight.title}</h1>
        <p className="text-sm text-[var(--muted)]">
          {formatCycleLabel(budget.cycleStart, locale, user.timezone)}
          {budget.isDemoSeed ? ` · ${m.home.demoBadge}` : ""}
        </p>
      </header>

      <RemainingHero
        remaining={remaining}
        spent={spent}
        total={budget.totalAmountEur}
        locale={locale}
        labels={{
          remaining: m.insight.remaining,
          spent: m.insight.spent,
          total: m.home.total,
        }}
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          {m.insight.categories}
        </h2>
        <CategoryProgressList
          categories={categories}
          locale={locale}
          overLabel={m.category.overBy}
        />
      </section>
    </div>
  );
}

import Link from "next/link";
import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import {
  getActiveBudgetForUser,
  getBudgetSpent,
  getDisplayBalance,
  listRecentTransactions,
  sumExpensesByCategory,
} from "@/lib/budget/queries";
import { RemainingHero } from "@/components/RemainingHero";
import { TransactionList } from "@/components/TransactionList";
import { formatEur } from "@/lib/money/amount";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";
import { unreadNotificationCount } from "@/lib/notifications/create";
import { BalanceToggle } from "@/components/BalanceToggle";
import { ensureCurrentCycleBudget } from "@/lib/budget/rollover";

function greeting(hour: number, m: ReturnType<typeof getMessages>) {
  if (hour < 12) return m.home.goodMorning;
  if (hour < 18) return m.home.goodAfternoon;
  return m.home.goodEvening;
}

export default async function HomePage() {
  const user = await requireAppUser();
  const { rolledOver } = await ensureCurrentCycleBudget(user);
  const locale = resolveLocale(user.locale);
  const m = getMessages(locale);
  const budget = await getActiveBudgetForUser(user);
  const unread = await unreadNotificationCount(user.id);
  const recent = await listRecentTransactions(user.id, 5);
  const balance = await getDisplayBalance(user.id);

  let spent = 0;
  if (budget) {
    spent = await getBudgetSpent(budget.id);
  }
  const remaining = budget ? budget.totalAmountEur - spent : 0;
  const hasRealBudget = Boolean(budget && !budget.isDemoSeed);

  await trackServer(user.id, AnalyticsEvents.home_viewed, {
    has_budget: hasRealBudget,
    unread_notifications: unread,
    is_demo_seed: budget?.isDemoSeed ?? false,
    locale: user.locale,
  });

  // preload spend map unused on home summary - silence
  if (budget) await sumExpensesByCategory(budget.id);

  const hour = new Date().getHours();
  const name = user.name?.split(" ")[0] ?? "";

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">
            {greeting(hour, m)}
            {name ? `, ${name}` : ""}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">{m.brand}</h1>
        </div>
        <Link
          href="/notifications"
          className="relative rounded-full bg-white p-2.5 shadow-sm"
          aria-label={m.nav.notifications}
        >
          <BellMini />
          {unread > 0 ? (
            <span className="absolute right-1 top-1 size-2 rounded-full bg-[var(--danger)]" />
          ) : null}
        </Link>
      </header>

      {rolledOver ? (
        <p className="rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent)]">
          {m.home.newMonth}
        </p>
      ) : null}

      {budget ? (
        <RemainingHero
          remaining={remaining}
          spent={spent}
          total={budget.totalAmountEur}
          locale={locale}
          labels={{
            remaining: m.home.remaining,
            spent: m.home.spent,
            total: m.home.total,
          }}
          demo={budget.isDemoSeed}
          demoLabel={m.home.demoBadge}
        />
      ) : (
        <Link
          href="/budget/new"
          className="block rounded-3xl bg-gradient-to-br from-[var(--balance-from)] to-[var(--balance-to)] p-6 text-white shadow-lg"
        >
          <p className="text-lg font-semibold">{m.home.setBudget}</p>
          <p className="mt-1 text-sm text-white/80">EUR · {locale.toUpperCase()}</p>
        </Link>
      )}

      <section className="rounded-2xl bg-[var(--card)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--muted)]">{m.home.cashOnHand}</p>
            <p className="text-lg font-semibold">
              {user.balanceHidden
                ? "••••••"
                : formatEur(balance.displayEur, locale)}
            </p>
          </div>
          <BalanceToggle
            hidden={user.balanceHidden}
            showLabel={m.home.showBalance}
            hideLabel={m.home.hideBalance}
          />
        </div>
      </section>

      {budget?.isDemoSeed ? (
        <Link
          href="/budget/new"
          className="block rounded-2xl border border-dashed border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3 text-center text-sm font-medium text-[var(--accent)]"
        >
          {m.home.replaceDemo}
        </Link>
      ) : null}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          {m.home.recent}
        </h2>
        <TransactionList
          items={recent}
          locale={locale}
          emptyLabel={m.home.emptyTxns}
          seeAllHref="/transactions"
          seeAllLabel={m.home.seeAll}
        />
      </section>
    </div>
  );
}

function BellMini() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9ZM10 18.5a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

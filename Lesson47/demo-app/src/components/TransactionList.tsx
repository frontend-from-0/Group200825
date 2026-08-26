import Link from "next/link";
import { formatEur } from "@/lib/money/amount";

type Txn = {
  id: string;
  title: string;
  amountEur: number;
  type: "expense" | "income";
  date: Date | string;
  category?: { name: string; color: string } | null;
};

type Props = {
  items: Txn[];
  locale: string;
  emptyLabel: string;
  seeAllHref?: string;
  seeAllLabel?: string;
};

export function TransactionList({
  items,
  locale,
  emptyLabel,
  seeAllHref,
  seeAllLabel,
}: Props) {
  if (!items.length) {
    return <p className="text-sm text-[var(--muted)]">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-2">
      <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl bg-[var(--card)]">
        {items.map((t) => {
          const sign = t.type === "income" ? "+" : "−";
          const amountClass =
            t.type === "income" ? "text-[var(--success)]" : "text-foreground";
          return (
            <li key={t.id}>
              <Link
                href={`/transactions/${t.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02]"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{
                    background: t.category?.color ?? "var(--accent)",
                  }}
                  aria-hidden
                >
                  {(t.category?.name ?? t.title).slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{t.title}</span>
                  <span className="block truncate text-xs text-[var(--muted)]">
                    {t.category?.name ?? (t.type === "income" ? "Income" : "")}
                  </span>
                </span>
                <span className={`shrink-0 font-semibold ${amountClass}`}>
                  {sign}
                  {formatEur(t.amountEur, locale)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {seeAllHref && seeAllLabel ? (
        <Link
          href={seeAllHref}
          className="block text-center text-sm font-medium text-[var(--accent)]"
        >
          {seeAllLabel}
        </Link>
      ) : null}
    </div>
  );
}

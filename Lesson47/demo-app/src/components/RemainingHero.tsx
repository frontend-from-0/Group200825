import { formatEur } from "@/lib/money/amount";

type Props = {
  remaining: number;
  spent: number;
  total: number;
  locale: string;
  labels: { remaining: string; spent: string; total: string };
  demo?: boolean;
  demoLabel?: string;
};

export function RemainingHero({
  remaining,
  spent,
  total,
  locale,
  labels,
  demo,
  demoLabel,
}: Props) {
  const pct = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;
  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--balance-from)] to-[var(--balance-to)] p-5 text-white shadow-lg shadow-violet-400/30"
      aria-label={labels.remaining}
    >
      {demo ? (
        <span className="mb-2 inline-block rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium">
          {demoLabel}
        </span>
      ) : null}
      <p className="text-sm text-white/80">{labels.remaining}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">
        {formatEur(remaining, locale)}
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between text-xs text-white/85">
        <span>
          {labels.spent}: {formatEur(spent, locale)}
        </span>
        <span>
          {labels.total}: {formatEur(total, locale)}
        </span>
      </div>
    </section>
  );
}

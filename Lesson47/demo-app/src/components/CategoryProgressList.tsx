import Link from "next/link";
import { formatEur } from "@/lib/money/amount";

type Cat = {
  id: string;
  name: string;
  color: string;
  limitEur: number;
  spentEur: number;
};

type Props = {
  categories: Cat[];
  locale: string;
  overLabel: string;
};

export function CategoryProgressList({ categories, locale, overLabel }: Props) {
  return (
    <ul className="space-y-3">
      {categories.map((c) => {
        const pct =
          c.limitEur > 0
            ? Math.min(100, Math.round((c.spentEur / c.limitEur) * 100))
            : 0;
        const over = c.spentEur > c.limitEur;
        return (
          <li key={c.id}>
            <Link
              href={`/categories/${c.id}`}
              className="block rounded-2xl bg-[var(--card)] p-4 hover:bg-white"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: c.color }}
                    aria-hidden
                  />
                  {c.name}
                </span>
                <span className="text-sm text-[var(--muted)]">
                  {formatEur(c.spentEur, locale)} / {formatEur(c.limitEur, locale)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, pct)}%`,
                    background: over ? "var(--danger)" : c.color,
                  }}
                />
              </div>
              {over ? (
                <p className="mt-1 text-xs font-medium text-[var(--danger)]">
                  {overLabel} {formatEur(c.spentEur - c.limitEur, locale)}
                </p>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

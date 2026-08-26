"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createBudgetAction,
  type CategoryInput,
} from "@/lib/budget/actions";
import { roundMoney } from "@/lib/money/amount";

type Template = CategoryInput & { key?: string };

type Props = {
  templates: Template[];
  labels: {
    title: string;
    totalLabel: string;
    chipsHint: string;
    allocate: string;
    amountLeft: string;
    addCategory: string;
    submit: string;
    mustAllocate: string;
    name: string;
    limit: string;
  };
};

const CHIPS = [500, 1000, 1500, 2000, 3000, 5000];

export function CreateBudgetForm({ templates, labels }: Props) {
  const router = useRouter();
  const [total, setTotal] = useState(2000);
  const [categories, setCategories] = useState<Template[]>(
    templates.map((t, i) => ({
      ...t,
      limitEur: i === 0 ? 2000 : 0,
    })),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const allocated = useMemo(
    () => roundMoney(categories.reduce((s, c) => s + (Number(c.limitEur) || 0), 0)),
    [categories],
  );
  const left = roundMoney(total - allocated);

  function updateLimit(index: number, value: number) {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, limitEur: value } : c)),
    );
  }

  function addCustom() {
    setCategories((prev) => [
      ...prev,
      {
        name: "Custom",
        icon: "star",
        color: "#a29bfe",
        limitEur: 0,
      },
    ]);
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        if (left !== 0) {
          setError(labels.mustAllocate);
          return;
        }
        start(async () => {
          const res = await createBudgetAction({
            totalAmountEur: total,
            categories: categories.map((c) => ({
              key: c.key,
              name: c.name,
              icon: c.icon,
              color: c.color,
              limitEur: Number(c.limitEur) || 0,
            })),
          });
          if (!res.ok) {
            setError(res.error === "MUST_ALLOCATE" ? labels.mustAllocate : res.error);
            return;
          }
          router.push("/budget/success");
        });
      }}
    >
      <div>
        <label htmlFor="total" className="text-sm font-medium">
          {labels.totalLabel}
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white px-4 py-3">
          <span className="text-[var(--muted)]">€</span>
          <input
            id="total"
            type="number"
            min={0.01}
            step={0.01}
            className="w-full bg-transparent text-2xl font-semibold outline-none"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">{labels.chipsHint}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-medium text-[var(--accent)]"
              onClick={() => setTotal(chip)}
            >
              €{chip}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{labels.allocate}</h2>
          <p
            className={`text-sm font-medium ${left === 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}
          >
            {labels.amountLeft}: €{left.toFixed(2)}
          </p>
        </div>
        <ul className="space-y-2">
          {categories.map((c, index) => (
            <li
              key={`${c.key ?? c.name}-${index}`}
              className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2"
            >
              <span
                className="size-3 rounded-full"
                style={{ background: c.color }}
                aria-hidden
              />
              <input
                aria-label={labels.name}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                value={c.name}
                onChange={(e) =>
                  setCategories((prev) =>
                    prev.map((x, i) =>
                      i === index ? { ...x, name: e.target.value } : x,
                    ),
                  )
                }
              />
              <input
                aria-label={labels.limit}
                type="number"
                min={0}
                step={0.01}
                className="w-24 rounded-lg bg-[var(--background)] px-2 py-1 text-right text-sm outline-none"
                value={c.limitEur}
                onChange={(e) => updateLimit(index, Number(e.target.value))}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={addCustom}
          className="mt-3 text-sm font-medium text-[var(--accent)]"
        >
          + {labels.addCategory}
        </button>
      </div>

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || left !== 0}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--accent)] font-semibold text-white disabled:opacity-50"
      >
        {labels.submit}
      </button>
    </form>
  );
}

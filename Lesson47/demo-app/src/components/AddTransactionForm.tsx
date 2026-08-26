"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTransactionAction } from "@/lib/transactions/actions";

type Cat = { id: string; name: string; color: string };

type Props = {
  categories: Cat[];
  labels: {
    addTitle: string;
    amount: string;
    type: string;
    expense: string;
    income: string;
    category: string;
    title: string;
    date: string;
    note: string;
    save: string;
    incomeHint: string;
    noBudgetForDate: string;
    error: string;
  };
  defaultDate: string;
};

export function AddTransactionForm({ categories, labels, defaultDate }: Props) {
  const router = useRouter();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const res = await createTransactionAction({
            amountEur: Number(amount),
            type,
            categoryId: type === "expense" ? categoryId : null,
            title,
            date,
            note,
          });
          if (!res.ok) {
            setError(
              res.error === "NO_BUDGET_FOR_DATE"
                ? labels.noBudgetForDate
                : labels.error,
            );
            return;
          }
          router.push("/home");
          router.refresh();
        });
      }}
    >
      <div>
        <label className="text-sm font-medium" htmlFor="amount">
          {labels.amount}
        </label>
        <input
          id="amount"
          required
          type="number"
          min={0.01}
          step={0.01}
          className="mt-1 w-full rounded-2xl bg-white px-4 py-3 text-xl font-semibold outline-none"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium">{labels.type}</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`rounded-2xl py-3 text-sm font-semibold ${type === "expense" ? "bg-[var(--accent)] text-white" : "bg-white"}`}
            onClick={() => setType("expense")}
          >
            {labels.expense}
          </button>
          <button
            type="button"
            className={`rounded-2xl py-3 text-sm font-semibold ${type === "income" ? "bg-[var(--success)] text-white" : "bg-white"}`}
            onClick={() => setType("income")}
          >
            {labels.income}
          </button>
        </div>
        {type === "income" ? (
          <p className="mt-2 text-xs text-[var(--muted)]">{labels.incomeHint}</p>
        ) : null}
      </fieldset>

      {type === "expense" ? (
        <div>
          <label className="text-sm font-medium" htmlFor="category">
            {labels.category}
          </label>
          <select
            id="category"
            required
            className="mt-1 w-full rounded-2xl bg-white px-4 py-3 outline-none"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label className="text-sm font-medium" htmlFor="title">
          {labels.title}
        </label>
        <input
          id="title"
          required
          className="mt-1 w-full rounded-2xl bg-white px-4 py-3 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="date">
          {labels.date}
        </label>
        <input
          id="date"
          type="date"
          required
          className="mt-1 w-full rounded-2xl bg-white px-4 py-3 outline-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="note">
          {labels.note}
        </label>
        <textarea
          id="note"
          rows={2}
          className="mt-1 w-full rounded-2xl bg-white px-4 py-3 outline-none"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--accent)] font-semibold text-white disabled:opacity-50"
      >
        {labels.save}
      </button>
    </form>
  );
}

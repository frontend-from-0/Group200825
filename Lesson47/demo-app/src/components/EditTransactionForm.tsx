"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteTransactionAction,
  updateTransactionAction,
} from "@/lib/transactions/actions";

type Cat = { id: string; name: string };

type Props = {
  transaction: {
    id: string;
    amountEur: number;
    type: "expense" | "income";
    categoryId: string | null;
    title: string;
    date: string;
    note: string | null;
  };
  categories: Cat[];
  labels: {
    amount: string;
    type: string;
    expense: string;
    income: string;
    category: string;
    title: string;
    date: string;
    note: string;
    save: string;
    delete: string;
    confirmDelete: string;
    error: string;
    incomeHint: string;
  };
};

export function EditTransactionForm({
  transaction,
  categories,
  labels,
}: Props) {
  const router = useRouter();
  const [type, setType] = useState<"expense" | "income">(transaction.type);
  const [amount, setAmount] = useState(String(transaction.amountEur));
  const [categoryId, setCategoryId] = useState(transaction.categoryId ?? "");
  const [title, setTitle] = useState(transaction.title);
  const [date, setDate] = useState(transaction.date);
  const [note, setNote] = useState(transaction.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-4">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await updateTransactionAction({
              id: transaction.id,
              amountEur: Number(amount),
              type,
              categoryId: type === "expense" ? categoryId : null,
              title,
              date,
              note,
            });
            if (!res.ok) {
              setError(labels.error);
              return;
            }
            router.push("/transactions");
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
            type="number"
            min={0.01}
            step={0.01}
            required
            className="mt-1 w-full rounded-2xl bg-white px-4 py-3 outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
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
          <p className="text-xs text-[var(--muted)]">{labels.incomeHint}</p>
        ) : (
          <div>
            <label className="text-sm font-medium" htmlFor="category">
              {labels.category}
            </label>
            <select
              id="category"
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
        )}
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
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--accent)] font-semibold text-white"
        >
          {labels.save}
        </button>
      </form>
      <button
        type="button"
        className="w-full rounded-2xl border border-[var(--danger)]/30 py-3 text-sm font-medium text-[var(--danger)]"
        onClick={() => {
          if (!confirm(labels.confirmDelete)) return;
          start(async () => {
            await deleteTransactionAction(transaction.id);
            router.push("/transactions");
          });
        }}
      >
        {labels.delete}
      </button>
    </div>
  );
}

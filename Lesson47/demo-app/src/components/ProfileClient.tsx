"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAccountAction,
  resetDemoAction,
  setLocaleAction,
  submitFeedbackAction,
} from "@/lib/profile/actions";
import {
  addCategoryToBudgetAction,
  deleteBudgetAction,
  updateBudgetTotalAction,
} from "@/lib/budget/actions";
import type { Locale } from "@/lib/i18n/categories";

type Props = {
  email: string;
  name: string | null;
  locale: Locale;
  budgetId: string | null;
  budgetTotal: number | null;
  labels: {
    title: string;
    language: string;
    logout: string;
    resetDemo: string;
    deleteAccount: string;
    deleteConfirm: string;
    feedback: string;
    feedbackPlaceholder: string;
    feedbackSend: string;
    feedbackThanks: string;
    save: string;
  };
  midCycle: {
    changeTotal: string;
    addCategory: string;
    deleteBudget: string;
    deleteBudgetConfirm: string;
  };
};

export function ProfileClient({
  email,
  name,
  locale,
  budgetId,
  budgetTotal,
  labels,
  midCycle,
}: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [feedback, setFeedback] = useState("");
  const [thanks, setThanks] = useState(false);
  const [total, setTotal] = useState(budgetTotal ?? 0);
  const [catName, setCatName] = useState("");
  const [catLimit, setCatLimit] = useState(50);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <p className="mt-1 font-medium">{name}</p>
        <p className="text-sm text-[var(--muted)]">{email}</p>
      </header>

      <section className="rounded-2xl bg-white p-4">
        <label className="text-sm font-medium" htmlFor="locale">
          {labels.language}
        </label>
        <select
          id="locale"
          className="mt-2 w-full rounded-xl bg-[var(--background)] px-3 py-2"
          value={locale}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value as Locale;
            start(async () => {
              await setLocaleAction(next);
              router.refresh();
            });
          }}
        >
          <option value="en">English</option>
          <option value="tr">Türkçe</option>
        </select>
      </section>

      {budgetId ? (
        <section className="space-y-3 rounded-2xl bg-white p-4">
          <h2 className="text-sm font-semibold">{midCycle.changeTotal}</h2>
          <input
            type="number"
            min={0.01}
            step={0.01}
            className="w-full rounded-xl bg-[var(--background)] px-3 py-2"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
          />
          <button
            type="button"
            className="text-sm font-medium text-[var(--accent)]"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await updateBudgetTotalAction({
                  budgetId,
                  totalAmountEur: total,
                });
                setMessage(res.ok ? null : res.error);
                router.refresh();
              })
            }
          >
            {labels.save}
          </button>

          <h2 className="pt-2 text-sm font-semibold">{midCycle.addCategory}</h2>
          <input
            className="w-full rounded-xl bg-[var(--background)] px-3 py-2"
            placeholder="Name"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />
          <input
            type="number"
            className="w-full rounded-xl bg-[var(--background)] px-3 py-2"
            value={catLimit}
            onChange={(e) => setCatLimit(Number(e.target.value))}
          />
          <button
            type="button"
            className="text-sm font-medium text-[var(--accent)]"
            disabled={pending || !catName}
            onClick={() =>
              start(async () => {
                const res = await addCategoryToBudgetAction({
                  budgetId,
                  name: catName,
                  icon: "star",
                  color: "#a29bfe",
                  limitEur: catLimit,
                });
                setMessage(res.ok ? null : res.error);
                if (res.ok) {
                  setCatName("");
                  router.refresh();
                }
              })
            }
          >
            {labels.save}
          </button>

          <button
            type="button"
            className="mt-2 w-full rounded-xl border border-[var(--danger)]/30 py-2 text-sm text-[var(--danger)]"
            onClick={() => {
              if (!confirm(midCycle.deleteBudgetConfirm)) return;
              start(async () => {
                await deleteBudgetAction(budgetId);
                router.push("/home");
              });
            }}
          >
            {midCycle.deleteBudget}
          </button>
        </section>
      ) : null}

      <section className="rounded-2xl bg-white p-4">
        <label className="text-sm font-medium" htmlFor="feedback">
          {labels.feedback}
        </label>
        <textarea
          id="feedback"
          rows={3}
          className="mt-2 w-full rounded-xl bg-[var(--background)] px-3 py-2"
          placeholder={labels.feedbackPlaceholder}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          type="button"
          disabled={pending || !feedback.trim()}
          className="mt-2 text-sm font-medium text-[var(--accent)]"
          onClick={() =>
            start(async () => {
              const res = await submitFeedbackAction(feedback);
              if (res.ok) {
                setThanks(true);
                setFeedback("");
              }
            })
          }
        >
          {labels.feedbackSend}
        </button>
        {thanks ? (
          <p className="mt-2 text-sm text-[var(--success)]">
            {labels.feedbackThanks}
          </p>
        ) : null}
      </section>

      <button
        type="button"
        className="w-full rounded-2xl bg-white py-3 text-sm font-medium"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await resetDemoAction();
            router.push("/home");
          })
        }
      >
        {labels.resetDemo}
      </button>

      <a
        href="/auth/logout"
        className="flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white font-medium"
      >
        {labels.logout}
      </a>

      <button
        type="button"
        className="w-full text-sm text-[var(--danger)]"
        onClick={() => {
          if (!confirm(labels.deleteConfirm)) return;
          start(async () => {
            await deleteAccountAction();
            router.push("/auth/logout");
          });
        }}
      >
        {labels.deleteAccount}
      </button>

      {message ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}

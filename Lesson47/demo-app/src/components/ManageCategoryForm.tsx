"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  adjustCategoryLimitAction,
  deleteCategoryAction,
  renameCategoryAction,
} from "@/lib/categories/actions";

type Props = {
  categoryId: string;
  initialName: string;
  initialLimit: number;
  pendingLimit: number | null;
  labels: {
    rename: string;
    adjustLimit: string;
    applyImmediate: string;
    applyNext: string;
    delete: string;
    deleteBlocked: string;
    confirmDelete: string;
    save: string;
    name: string;
    limit: string;
  };
};

export function ManageCategoryForm({
  categoryId,
  initialName,
  initialLimit,
  pendingLimit,
  labels,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [limit, setLimit] = useState(pendingLimit ?? initialLimit);
  const [applyRule, setApplyRule] = useState<"immediate" | "next_month">(
    "immediate",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-6">
      <form
        className="space-y-3 rounded-2xl bg-white p-4"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await renameCategoryAction({ categoryId, name });
            if (!res.ok) setError(res.error);
            else router.refresh();
          });
        }}
      >
        <label className="block text-sm font-medium" htmlFor="name">
          {labels.rename}
        </label>
        <input
          id="name"
          className="w-full rounded-xl bg-[var(--background)] px-3 py-2 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          disabled={pending}
          className="text-sm font-medium text-[var(--accent)]"
        >
          {labels.save}
        </button>
      </form>

      <form
        className="space-y-3 rounded-2xl bg-white p-4"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await adjustCategoryLimitAction({
              categoryId,
              newLimitEur: limit,
              applyRule,
            });
            if (!res.ok) setError(res.error);
            else router.push(`/categories/${categoryId}`);
          });
        }}
      >
        <label className="block text-sm font-medium" htmlFor="limit">
          {labels.adjustLimit}
        </label>
        <input
          id="limit"
          type="number"
          min={0.01}
          step={0.01}
          className="w-full rounded-xl bg-[var(--background)] px-3 py-2 outline-none"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
        <fieldset className="space-y-2">
          <legend className="sr-only">{labels.adjustLimit}</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="apply"
              checked={applyRule === "immediate"}
              onChange={() => setApplyRule("immediate")}
            />
            {labels.applyImmediate}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="apply"
              checked={applyRule === "next_month"}
              onChange={() => setApplyRule("next_month")}
            />
            {labels.applyNext}
          </label>
        </fieldset>
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 w-full items-center justify-center rounded-2xl bg-[var(--accent)] font-semibold text-white"
        >
          {labels.save}
        </button>
      </form>

      <button
        type="button"
        disabled={pending}
        className="w-full rounded-2xl border border-[var(--danger)]/30 px-4 py-3 text-sm font-medium text-[var(--danger)]"
        onClick={() => {
          if (!confirm(labels.confirmDelete)) return;
          start(async () => {
            const res = await deleteCategoryAction(categoryId);
            if (!res.ok) {
              setError(
                res.error === "HAS_TRANSACTIONS"
                  ? labels.deleteBlocked
                  : res.error,
              );
              return;
            }
            router.push("/insight");
          });
        }}
      >
        {labels.delete}
      </button>

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

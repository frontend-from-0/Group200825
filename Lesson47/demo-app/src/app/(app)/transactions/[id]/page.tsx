import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import { prisma } from "@/lib/db/prisma";
import { EditTransactionForm } from "@/components/EditTransactionForm";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAppUser();
  const locale = resolveLocale(user.locale);
  const m = getMessages(locale);
  const txn = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
  });
  if (!txn) notFound();

  const categories = await prisma.category.findMany({
    where: { budgetId: txn.budgetId, userId: user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4">
      <Link href="/transactions" className="text-sm text-[var(--accent)]">
        ← {m.common.back}
      </Link>
      <h1 className="text-2xl font-semibold">{m.txn.edit}</h1>
      <EditTransactionForm
        transaction={{
          id: txn.id,
          amountEur: txn.amountEur,
          type: txn.type,
          categoryId: txn.categoryId,
          title: txn.title,
          date: txn.date.toISOString().slice(0, 10),
          note: txn.note,
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        labels={{
          amount: m.txn.amount,
          type: m.txn.type,
          expense: m.txn.expense,
          income: m.txn.income,
          category: m.txn.category,
          title: m.txn.title,
          date: m.txn.date,
          note: m.txn.note,
          save: m.common.save,
          delete: m.txn.delete,
          confirmDelete: m.txn.confirmDelete,
          error: m.common.error,
          incomeHint: m.txn.incomeHint,
        }}
      />
    </div>
  );
}

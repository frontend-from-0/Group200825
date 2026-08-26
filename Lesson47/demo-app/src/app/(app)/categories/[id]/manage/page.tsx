import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import { prisma } from "@/lib/db/prisma";
import { ManageCategoryForm } from "@/components/ManageCategoryForm";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";

export default async function ManageCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAppUser();
  const locale = resolveLocale(user.locale);
  const m = getMessages(locale);
  const category = await prisma.category.findFirst({
    where: { id, userId: user.id },
  });
  if (!category) notFound();

  await trackServer(user.id, AnalyticsEvents.category_manage_opened, {
    category_id: id,
  });
  await trackServer(user.id, AnalyticsEvents.category_limit_adjust_started, {
    category_id: id,
  });

  return (
    <div className="space-y-4">
      <Link href={`/categories/${id}`} className="text-sm text-[var(--accent)]">
        ← {m.common.back}
      </Link>
      <h1 className="text-2xl font-semibold">
        {m.category.manage}: {category.name}
      </h1>
      <ManageCategoryForm
        categoryId={category.id}
        initialName={category.name}
        initialLimit={category.limitEur}
        pendingLimit={category.pendingLimitEur}
        labels={{
          rename: m.category.rename,
          adjustLimit: m.category.adjustLimit,
          applyImmediate: m.category.applyImmediate,
          applyNext: m.category.applyNext,
          delete: m.category.delete,
          deleteBlocked: m.category.deleteBlocked,
          confirmDelete: m.category.confirmDelete,
          save: m.common.save,
          name: m.budget.name,
          limit: m.budget.limit,
        }}
      />
    </div>
  );
}

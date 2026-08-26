import Link from "next/link";
import { getDefaultCategoryTemplates } from "@/lib/budget/actions";
import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import { CreateBudgetForm } from "@/components/CreateBudgetForm";
import { AnalyticsEvents, trackServer } from "@/lib/analytics/server";

export default async function NewBudgetPage() {
  const user = await requireAppUser();
  const locale = resolveLocale(user.locale);
  const m = getMessages(locale);
  const templates = await getDefaultCategoryTemplates();

  await trackServer(user.id, AnalyticsEvents.budget_create_started, {
    source: "cta",
    locale: user.locale,
  });

  return (
    <div className="space-y-4">
      <Link href="/home" className="text-sm text-[var(--accent)]">
        ← {m.common.back}
      </Link>
      <h1 className="text-2xl font-semibold">{m.budget.title}</h1>
      <CreateBudgetForm
        templates={templates}
        labels={{
          title: m.budget.title,
          totalLabel: m.budget.totalLabel,
          chipsHint: m.budget.chipsHint,
          allocate: m.budget.allocate,
          amountLeft: m.budget.amountLeft,
          addCategory: m.budget.addCategory,
          submit: m.budget.submit,
          mustAllocate: m.budget.mustAllocate,
          name: m.budget.name,
          limit: m.budget.limit,
        }}
      />
    </div>
  );
}

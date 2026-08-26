import Link from "next/link";
import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";

export default async function BudgetSuccessPage() {
  const user = await requireAppUser();
  const m = getMessages(resolveLocale(user.locale));

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--success)]/15 text-3xl text-[var(--success)]">
        ✓
      </div>
      <h1 className="text-2xl font-semibold">{m.budget.successTitle}</h1>
      <p className="mt-2 text-[var(--muted)]">{m.budget.successBody}</p>
      <Link
        href="/home"
        className="mt-8 flex h-12 w-full max-w-xs items-center justify-center rounded-2xl bg-[var(--accent)] font-semibold text-white"
      >
        {m.budget.goHome}
      </Link>
    </div>
  );
}

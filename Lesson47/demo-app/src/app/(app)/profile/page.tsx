import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import { getActiveBudgetForUser } from "@/lib/budget/queries";
import { ProfileClient } from "@/components/ProfileClient";

export default async function ProfilePage() {
  const user = await requireAppUser();
  const locale = resolveLocale(user.locale);
  const m = getMessages(locale);
  const budget = await getActiveBudgetForUser(user);

  return (
    <ProfileClient
      email={user.email}
      name={user.name}
      locale={locale}
      budgetId={budget?.id ?? null}
      budgetTotal={budget?.totalAmountEur ?? null}
      labels={{
        title: m.profile.title,
        language: m.profile.language,
        logout: m.profile.logout,
        resetDemo: m.profile.resetDemo,
        deleteAccount: m.profile.deleteAccount,
        deleteConfirm: m.profile.deleteConfirm,
        feedback: m.profile.feedback,
        feedbackPlaceholder: m.profile.feedbackPlaceholder,
        feedbackSend: m.profile.feedbackSend,
        feedbackThanks: m.profile.feedbackThanks,
        save: m.common.save,
      }}
      midCycle={{
        changeTotal: locale === "tr" ? "Bütçe toplamını değiştir" : "Change budget total",
        addCategory: m.budget.addCategory,
        deleteBudget: locale === "tr" ? "Bütçeyi sil" : "Delete budget",
        deleteBudgetConfirm:
          locale === "tr"
            ? "Aktif bütçe ve işlemleri silinsin mi?"
            : "Delete the active budget and its transactions?",
      }}
    />
  );
}

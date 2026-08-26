import { requireAppUser } from "@/lib/auth/session";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale } from "@/lib/i18n/categories";
import { listNotificationsAction } from "@/lib/notifications/actions";
import { NotificationList } from "@/components/NotificationList";

export default async function NotificationsPage() {
  const user = await requireAppUser();
  const m = getMessages(resolveLocale(user.locale));
  const items = await listNotificationsAction();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{m.notifications.title}</h1>
      <NotificationList items={items} emptyLabel={m.notifications.empty} />
    </div>
  );
}

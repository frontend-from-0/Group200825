import { PostHog } from "posthog-node";

export type AnalyticsProps = Record<
  string,
  string | number | boolean | null | undefined
>;

let serverClient: PostHog | null = null;

function getServerClient(): PostHog | null {
  const key = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!serverClient) {
    serverClient = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return serverClient;
}

export async function trackServer(
  userId: string,
  event: string,
  props: AnalyticsProps = {},
): Promise<void> {
  const client = getServerClient();
  if (!client) return;
  client.capture({
    distinctId: userId,
    event,
    properties: {
      app_version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
      timestamp: new Date().toISOString(),
      ...props,
    },
  });
  await client.flush();
}

export const AnalyticsEvents = {
  auth_login_success: "auth_login_success",
  auth_logout: "auth_logout",
  home_viewed: "home_viewed",
  balance_visibility_toggled: "balance_visibility_toggled",
  budget_create_started: "budget_create_started",
  budget_amount_set: "budget_amount_set",
  budget_category_added: "budget_category_added",
  budget_category_allocated: "budget_category_allocated",
  budget_create_submitted: "budget_create_submitted",
  budget_create_succeeded: "budget_create_succeeded",
  budget_create_failed: "budget_create_failed",
  insight_viewed: "insight_viewed",
  insight_month_changed: "insight_month_changed",
  insight_chart_toggled: "insight_chart_toggled",
  category_detail_viewed: "category_detail_viewed",
  category_manage_opened: "category_manage_opened",
  category_renamed: "category_renamed",
  category_deleted: "category_deleted",
  category_limit_adjust_started: "category_limit_adjust_started",
  category_limit_adjust_confirmed: "category_limit_adjust_confirmed",
  transaction_list_viewed: "transaction_list_viewed",
  transaction_create_started: "transaction_create_started",
  transaction_create_succeeded: "transaction_create_succeeded",
  transaction_create_failed: "transaction_create_failed",
  transaction_edited: "transaction_edited",
  transaction_deleted: "transaction_deleted",
  notifications_opened: "notifications_opened",
  notification_clicked: "notification_clicked",
  locale_changed: "locale_changed",
  seed_data_applied: "seed_data_applied",
} as const;

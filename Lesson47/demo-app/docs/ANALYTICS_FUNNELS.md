# PostHog funnel setup (Phase D)

Create insights filtered so **demo seed never counts toward activation**.

## Common property filters

- Activation / habit events: `is_demo_seed = false` (or not set / false)
- Identify users by internal `user_id` (PostHog distinct id)

## Funnels

1. **Activation**  
   `auth_login_success` (`is_new_user = true`) → `budget_create_started` → `budget_create_succeeded` (`is_demo_seed = false`)

2. **Habit**  
   `budget_create_succeeded` (`is_demo_seed = false`) → `transaction_create_succeeded` (`is_demo_seed = false`) ×3 within 7 days

3. **Insight loop**  
   `home_viewed` → `insight_viewed` → `category_detail_viewed`

4. **Correction**  
   `category_detail_viewed` (`is_over = true`) → `category_limit_adjust_confirmed`

5. **Notification efficacy**  
   `notification_clicked` → pageview of `href` destination within session

## Alerts

- Client exception rate &gt; 2% of sessions
- Drop in `budget_create_succeeded` week-over-week during beta

# Fintrack MVP acceptance checklist

Track against [PRD §17](./PRD.md) and [DOMAIN_AND_BETA.md](./DOMAIN_AND_BETA.md).

- [ ] Auth0 login/logout works; user persisted in MongoDB via Prisma
- [ ] Allowlist gate sends non-listed users to `/waitlist`
- [ ] New user receives seed demo budget (`isDemoSeed`); can create real budget in EUR
- [ ] Home shows **remaining-first** summary; cash-on-hand labeled demo
- [ ] Manual expenses update insight + category; income updates balance only
- [ ] Transaction date outside existing cycle is blocked
- [ ] Over-limit state and adjust-limit + billing cycle (immediate / next month) work
- [ ] Category delete blocked when transactions exist
- [ ] Notifications generate (server-side) and deep-link
- [ ] Txn edit/delete works
- [ ] Mid-cycle: change total, add category, delete budget
- [ ] App usable in English and Turkish
- [ ] Feedback + delete-my-data + reset demo on Profile
- [ ] §10.2 events verified in PostHog (demo excluded from activation)
- [ ] Cards / Rewards / Deposit / Transfer not present
- [ ] Ready to onboard first ≤100 allowlisted testers

## Analytics funnels (PostHog)

1. Activation: `auth_login_success (new)` → `budget_create_started` → `budget_create_succeeded` where `is_demo_seed = false`
2. Engagement: real budget → ≥3 `transaction_create_succeeded` (`is_demo_seed = false`) in 7 days
3. Insight loop: `home_viewed` → `insight_viewed` → `category_detail_viewed`
4. Correction: over category → `category_limit_adjust_confirmed`
5. Notification: `notification_clicked` → destination viewed

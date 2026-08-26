# Fintrack — Domain & Beta Addendum

Status: Locked for MVP build  
Supersedes ambiguous PRD wording until PRD §13 is amended.  
Source: Phased project plan gap closures (GAP-01…20).

## Metric definitions (GAP-12)

| Metric | Definition |
| --- | --- |
| Signed-up | User row created after Auth0 login **and** allowlist pass |
| Budget creators | Users with ≥1 budget where `isDemoSeed = false` |
| Activation ≥60% | `budget_create_succeeded` where `is_demo_seed = false` / signed-up |
| Habit ≥40% | Budget creators with ≥3 non-seed `transaction_create_succeeded` within 7 days of first real budget |
| Insight ≥50% | Budget creators with ≥1 `insight_viewed` |
| Client errors | PostHog / monitoring &lt; 2% of sessions |

Seeded demo budgets/transactions **never** count toward activation or habit.

## Product contracts

| ID | Contract |
| --- | --- |
| **GAP-01 Cycle** | Billing cycle = calendar month in the user’s IANA timezone. `cycleStart` = 1st 00:00 local; `cycleEnd` = last day 23:59:59.999 local. Prior cycles are frozen (read-only). On rollover: auto-create next active budget by copying category names/icons/colors/limits with zero spent. |
| **GAP-02 Hierarchy** | Home hero = budget remaining (and spent/total) when a budget exists. Wallet `AccountBalance` is secondary, labeled “Cash on hand (demo)” while seed balance is in play. |
| **GAP-03 Seed** | On first login (`SEED_DEMO_ON_LOGIN=true`): seed one labeled demo budget + categories + expenses + €10,000 starting balance. `Budget.isDemoSeed` / `Transaction.isDemoSeed`. Creating a real budget archives the demo. |
| **GAP-04 Income** | Income updates balance only; never category or budget spent. Spent = sum of expenses in cycle only. |
| **GAP-05 Beta gate** | Auth0 allowlist (`BETA_ALLOWLIST_EMAILS`). Soft cap 100. Non-allowlisted → waitlist/entry. |
| **GAP-06 Mid-cycle** | Change total, add category, delete/reset budget on active cycle. |
| **GAP-07 Attribution** | Transaction `date` maps to budget whose cycle contains that local date. No budget for cycle → block save. Future dates only within current cycle. |
| **GAP-08 Delete category** | Block delete if category has transactions; empty categories may delete. |
| **GAP-09 Notify rules** | Server-side on write. Dedupe: near-limit once at 80% cross; over-limit once at 100% cross; re-arm if under then cross again. |
| **GAP-10 Feedback** | In-app feedback from Profile. |
| **GAP-11 Delete data** | Profile “Delete my account/data” hard-deletes user graph. |
| **GAP-13 Defaults** | General, Transportation, Charity, Education, Food & Drink, Shopping, Housing, Health. General is allocation escape hatch. |
| **GAP-14 Amounts** | Min 0.01 EUR; max 1_000_000 EUR; 2 decimal places. |
| **GAP-15 Entry** | `/` entry/waitlist for logged-out and non-allowlisted. |
| **GAP-16 Txn edit** | Edit/delete transactions required in Phase C. |
| **GAP-17 Errors** | Auth, API/network, validation error UX. |
| **GAP-18 Hosting** | Vercel (preview + prod). |
| **GAP-19 A11y** | WCAG 2.2 AA on auth, Home, budget create, add txn, insight. |
| **GAP-20 Seed flag** | `SEED_DEMO_ON_LOGIN` env controls seed pipeline. |

## Default categories (GAP-13)

| Key | en | tr | Icon | Color |
| --- | --- | --- | --- | --- |
| general | General | Genel | wallet | #6C5CE7 |
| transportation | Transportation | Ulaşım | car | #0984E3 |
| charity | Charity | Bağış | heart | #E84393 |
| education | Education | Eğitim | book | #00B894 |
| food_drink | Food & Drink | Yiyecek & İçecek | utensils | #FDCB6E |
| shopping | Shopping | Alışveriş | bag | #E17055 |
| housing | Housing | Konut | home | #636E72 |
| health | Health | Sağlık | activity | #00CEC9 |

## Accessibility bar (GAP-19)

- Focus-visible rings on all interactive controls
- Contrast on dark balance/remaining card ≥ 4.5:1 for body text
- Icon-only buttons have accessible names
- Form fields have visible labels
- Error messages associated with inputs

## Operator checklist

1. Provision Auth0 tenant, MongoDB Atlas, PostHog, Vercel
2. Set env from `.env.example`
3. Populate `BETA_ALLOWLIST_EMAILS` (≤100 for soft cap messaging)
4. Deploy to Vercel; configure Auth0 callback URLs

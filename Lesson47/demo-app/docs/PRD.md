# Fintrack MVP — Product Requirements Document

| Field | Value |
| --- | --- |
| Product | Fintrack |
| Document type | PRD (MVP) |
| Status | Draft for build |
| Last updated | 2026-08-26 |
| Design source | [Fintrack Figma (Community)](https://www.figma.com/design/p0LhPv5Pjadk6DljfJ3Wjv/Fintrack-app---budgetting-app--Community-?node-id=0-1) |
| Platform | Responsive web, mobile-first (Next.js) |
| Primary currency | EUR |
| Locales | English (`en`), Turkish (`tr`) |

---

## 1. Purpose

Fintrack helps people set a monthly budget, allocate it across categories, log spending manually, and see whether they are on track.

This MVP is a **closed learning product** for the first ~100 test users. The goal is not feature completeness — it is to ship a credible budgeting loop, instrument every flow, and learn which behaviors and features deserve V2.

---

## 2. Problem & opportunity

People want a simple place to answer:

1. How much can I still spend this month?
2. Which categories are eating the budget?
3. What did I spend recently?

Existing finance apps often start with bank linking, cards, and rewards. For early learning, that adds friction and noise. Fintrack MVP focuses on **manual budgeting + transaction logging + insight**, with analytics to reveal drop-offs and demand signals.

---

## 3. Goals & non-goals

### 3.1 Goals (MVP success)

| Goal | Measure |
| --- | --- |
| Activate budgeting | ≥ 60% of signed-up users create a monthly budget |
| Establish habit signal | ≥ 40% of budget creators log ≥ 3 transactions within 7 days |
| Insight engagement | ≥ 50% of budget creators open Spending insight at least once |
| Learning coverage | Analytics events fire for every primary flow (see §10) with &lt; 2% client error rate |
| Localization readiness | Critical paths usable in `en` and `tr` |
| Closed beta capacity | Support first 100 test users on Auth0 + MongoDB |

### 3.2 Non-goals (explicitly out of MVP)

- Bank / account aggregation (Plaid or similar)
- Deposit, Transfer, Cards, Rewards (shown in design chrome; not built)
- Multi-currency wallets or FX conversion
- Shared / household budgets
- Push notifications (in-app notifications only)
- Native iOS/Android apps
- Tax, investment, or credit-score features

---

## 4. Users & use cases

### 4.1 Primary audience

Early test users (friends, community, waitlist) who:

- Want a lightweight monthly budget
- Are willing to enter transactions manually
- Prefer EUR
- Use English or Turkish

### 4.2 Primary jobs-to-be-done

| Priority | Job | Outcome |
| --- | --- | --- |
| P0 | Set a monthly budget with category limits | Clear monthly plan |
| P0 | Log an expense/income under a category | Accurate spent vs remaining |
| P0 | See remaining budget and category health | Decide whether to spend |
| P1 | Adjust a category limit mid-cycle | Correct plan without restarting |
| P1 | Review notifications about budget health | Return to action when overspending |
| P2 | Hide balance for privacy | Feel safe using the app in public |

---

## 5. Product principles

1. **One loop first** — Create budget → Log transactions → Review insight → Adjust.
2. **Mobile-first fidelity** — Match Figma layouts on small screens; scale cleanly to tablet/desktop without inventing a second product.
3. **Honest MVP** — Hide or remove nav items that are not shipped (Cards, Rewards, Deposit, Transfer).
4. **Instrument before polish** — Every flow emits analytics; learning &gt; decorative completeness.
5. **Locale-native** — EUR formatting and `en`/`tr` strings from day one; no hard-coded USD/`$`.

---

## 6. Scope

### 6.1 In scope (MVP)

| Area | Capability |
| --- | --- |
| Auth | Sign up / login / logout via Auth0 |
| Home | Greeting, total balance (hide/show), budget CTA or spending summary, recent transactions, entry to notifications |
| Budget create | Set total amount, allocate to categories, add custom category (name / icon / color), success state |
| Spending insight | Month selector, spent/remaining visualization, category list with progress |
| Category detail | Category spent vs limit, over-limit state, filtered transactions, adjust/manage |
| Category manage | Rename, delete, adjust limit, billing-cycle apply rule |
| Transactions | List all, filter by category (via detail), manual add (expense/income) |
| Notifications | In-app notification center for budget events |
| Seed data | Demo seed for new users so empty states are rare during testing |
| i18n | English + Turkish; EUR number/currency formatting |
| Analytics | Event tracking across all flows (§10) |
| Profile (minimal) | Account identity, language preference, logout |

### 6.2 Design adaptation notes

Figma is mobile-native and uses USD copy. For MVP:

- Implement as **responsive web** (mobile-first), preserving Figma hierarchy and components.
- Replace `$` / USD with **EUR** (`€`) and locale-aware formatting.
- Bottom nav for MVP: **Home · Insight · Add · Notifications · Profile** (or equivalent labels). Do **not** ship non-functional Cards/Rewards tabs.
- Deposit / Transfer / More on the balance card: omit or replace with MVP actions (e.g. Add transaction, View insight) — do not leave dead ends.

### 6.3 Out of scope (V2 candidates — track demand via analytics)

- Cards, Rewards, Deposit, Transfer
- Bank sync
- Recurring transactions / bill reminders
- Budgets shared with partners
- Multi-currency
- Native push / email digests
- Advanced charts and export/CSV

---

## 7. User flows

### 7.1 Auth

1. User lands on marketing/app entry → Auth0 Universal Login.
2. On first successful login, create User + seed demo data (optional toggle in admin later; default **on** for beta).
3. Redirect to Home.

### 7.2 Create budget (happy path)

1. Home shows “Set a financial budget” CTA when no active budget for current cycle.
2. User sets total monthly amount (manual entry + quick chips).
3. User allocates amounts across default + custom categories.
4. UI shows **Amount left** = total − sum(category limits); block submit if amount left ≠ 0 (or warn and allow under-allocation — see open decision in §13).
5. Confirm → success screen → Home shows spending insight summary.

### 7.3 Add transaction

1. User opens Add transaction (FAB/nav).
2. Enters amount, type (expense/income), category, merchant/title, date.
3. Save → transaction appears in Home recent list, category totals, and insight charts.
4. Balance updates from seeded starting balance ± transactions (see data model).

### 7.4 Spending insight

1. From Home summary or Insight tab.
2. View monthly budget, spent, remaining; toggle chart style if present in UI.
3. Tap category → Category detail.

### 7.5 Adjust category limit

1. From Category detail → Adjust / Manage.
2. Enter new limit; choose billing cycle: **Apply immediately** or **Apply next month**.
3. Confirm → success toast/screen → refreshed totals.

### 7.6 Notifications

1. System creates in-app notifications for: budget created, category over limit, approaching limit (e.g. ≥ 80%), successful limit adjustment.
2. Bell on Home shows unread badge.
3. Notification center lists items; tap deep-links to relevant screen; mark read.

---

## 8. Functional requirements

### 8.1 Authentication & account

| ID | Requirement | Priority |
| --- | --- | --- |
| AUTH-1 | Users authenticate with Auth0 (email and/or social as configured) | P0 |
| AUTH-2 | Unauthenticated users cannot access app routes; redirect to login | P0 |
| AUTH-3 | User record synced to MongoDB via Prisma on first login (`auth0Id`, email, name, locale) | P0 |
| AUTH-4 | Logout clears session and returns to entry | P0 |
| AUTH-5 | Profile shows identity + language switcher (`en`/`tr`) | P0 |

### 8.2 Home

| ID | Requirement | Priority |
| --- | --- | --- |
| HOME-1 | Show time-based greeting + display name | P0 |
| HOME-2 | Show total balance with hide/show toggle (persisted per user) | P0 |
| HOME-3 | If no budget for current cycle → budget setup CTA | P0 |
| HOME-4 | If budget exists → spending insight summary (left / spent / total) | P0 |
| HOME-5 | Show recent transactions (default last 5) + link to full list | P0 |
| HOME-6 | Notification bell with unread count | P0 |

### 8.3 Budget

| ID | Requirement | Priority |
| --- | --- | --- |
| BUD-1 | Create one active monthly budget per billing cycle | P0 |
| BUD-2 | Set total budget amount in EUR | P0 |
| BUD-3 | Provide quick-add amount chips | P1 |
| BUD-4 | Default categories available (General, Transportation, Charity, Education, …) | P0 |
| BUD-5 | Add custom category: name, icon, color | P0 |
| BUD-6 | Assign limit per category; show amount left to allocate | P0 |
| BUD-7 | Success confirmation after create | P0 |
| BUD-8 | Edit allocations after create via Adjust flows | P0 |
| BUD-9 | Billing cycle rules: apply limit change immediately or next month | P1 |

### 8.4 Transactions

| ID | Requirement | Priority |
| --- | --- | --- |
| TXN-1 | Manual create expense or income | P0 |
| TXN-2 | Fields: amount (EUR), type, category, title/merchant, date, optional note | P0 |
| TXN-3 | List transactions newest-first with infinite scroll or pagination | P0 |
| TXN-4 | Edit and delete own transactions | P1 |
| TXN-5 | Category detail shows only that category’s transactions | P0 |
| TXN-6 | Seed demo transactions for new beta users | P0 |

### 8.5 Spending insight & category detail

| ID | Requirement | Priority |
| --- | --- | --- |
| INS-1 | Monthly overview: budget total, spent, remaining | P0 |
| INS-2 | Visual spent vs remaining (donut and/or bar per design) | P0 |
| INS-3 | Category rows with spent/limit and progress | P0 |
| INS-4 | Month switcher for current and prior cycles with data | P1 |
| INS-5 | Over-limit state on category detail (“X over”, limit exceeded) | P0 |
| INS-6 | Manage category: rename, delete (with confirm), adjust limit | P0 |

### 8.6 Notifications

| ID | Requirement | Priority |
| --- | --- | --- |
| NOT-1 | Persist in-app notifications per user | P0 |
| NOT-2 | Unread badge on Home | P0 |
| NOT-3 | Notification list with read/unread; mark read on open | P0 |
| NOT-4 | Generate events for over-limit, near-limit, budget created, limit adjusted | P0 |
| NOT-5 | Deep-link to relevant insight/category screen | P1 |

### 8.7 Localization & currency

| ID | Requirement | Priority |
| --- | --- | --- |
| I18N-1 | All user-facing strings via i18n (`en`, `tr`) | P0 |
| I18N-2 | Locale preference stored on user; detectable default from browser with override | P0 |
| I18N-3 | Format money as EUR using locale conventions | P0 |
| I18N-4 | Dates/relative time localized | P1 |

### 8.8 Seed / demo data

| ID | Requirement | Priority |
| --- | --- | --- |
| SEED-1 | On first login, seed starting balance + sample categories/transactions (flaggable) | P0 |
| SEED-2 | Seed content labeled so users understand it is demo-friendly | P1 |
| SEED-3 | Provide “Reset demo data” in Profile for testers | P2 |

---

## 9. Information architecture (MVP routes)

Suggested App Router shape (final names may vary):

| Route | Purpose |
| --- | --- |
| `/` | Entry / redirect |
| `/home` | Dashboard |
| `/budget/new` | Create budget |
| `/budget/success` | Budget created |
| `/insight` | Spending insight |
| `/categories/[id]` | Category detail |
| `/categories/[id]/manage` | Manage / adjust |
| `/transactions` | Full list |
| `/transactions/new` | Add transaction |
| `/notifications` | Notification center |
| `/profile` | Account, language, logout |

Protected by Auth0 session middleware.

---

## 10. Analytics requirements

Analytics is a **first-class MVP feature**. Every primary flow must emit structured events so we can decide V2 scope from real usage by the first 100 users.

### 10.1 Platform

- Client + server events (recommend PostHog, Mixpanel, or Amplitude — final vendor TBD in implementation, but schema below is mandatory).
- Identify user with stable internal user id (not email as primary key in event props when avoidable).
- Include common properties on every event: `user_id`, `locale`, `path`, `app_version`, `billing_cycle_id` (when applicable), `timestamp`.

### 10.2 Required events

| Event name | When | Key properties |
| --- | --- | --- |
| `auth_login_success` | Auth0 login completes | `is_new_user` |
| `auth_logout` | User logs out | — |
| `home_viewed` | Home loads | `has_budget`, `unread_notifications` |
| `balance_visibility_toggled` | Hide/show balance | `hidden` |
| `budget_create_started` | Open create budget | `source` (cta/home/nav) |
| `budget_amount_set` | Total amount changed | `amount_eur`, `via_chip` |
| `budget_category_added` | Custom category added | `icon`, `color` |
| `budget_category_allocated` | Category limit set/changed in create | `category_id`, `amount_eur` |
| `budget_create_submitted` | Submit create | `total_eur`, `category_count`, `amount_left_eur` |
| `budget_create_succeeded` | Persist success | `budget_id` |
| `budget_create_failed` | Persist error | `error_code` |
| `insight_viewed` | Insight opens | `month`, `spent_eur`, `remaining_eur` |
| `insight_month_changed` | Month selector | `from`, `to` |
| `insight_chart_toggled` | Chart mode toggle | `mode` |
| `category_detail_viewed` | Category detail | `category_id`, `spent_eur`, `limit_eur`, `is_over` |
| `category_manage_opened` | Manage sheet/screen | `category_id` |
| `category_renamed` | Rename saved | `category_id` |
| `category_deleted` | Delete confirmed | `category_id` |
| `category_limit_adjust_started` | Open adjust limit | `category_id` |
| `category_limit_adjust_confirmed` | Confirm adjust | `old_eur`, `new_eur`, `apply_rule` |
| `transaction_list_viewed` | Transactions page | `count` |
| `transaction_create_started` | Open add form | `source` |
| `transaction_create_succeeded` | Saved | `type`, `amount_eur`, `category_id` |
| `transaction_create_failed` | Error | `error_code` |
| `transaction_edited` | Edit saved | `transaction_id` |
| `transaction_deleted` | Deleted | `transaction_id` |
| `notifications_opened` | Open center | `unread_count` |
| `notification_clicked` | Tap item | `notification_type`, `notification_id` |
| `locale_changed` | Language switch | `from`, `to` |
| `seed_data_applied` | Demo seed created | `template_version` |

### 10.3 Funnels to monitor (dashboard)

1. **Activation:** `auth_login_success (new)` → `budget_create_started` → `budget_create_succeeded`
2. **Engagement:** `budget_create_succeeded` → `transaction_create_succeeded` (≥3)
3. **Insight loop:** `home_viewed` → `insight_viewed` → `category_detail_viewed`
4. **Correction:** `category_detail_viewed (is_over)` → `category_limit_adjust_confirmed`
5. **Notification efficacy:** `notification_clicked` → destination viewed within session

### 10.4 Privacy

- Do not send free-text notes or raw merchant strings to analytics if they may contain PII; hash or omit.
- Respect Auth0/user deletion: define retention for beta (recommend ≤ 12 months).

---

## 11. Technical requirements

| Area | Decision |
| --- | --- |
| Framework | Next.js (App Router), React, TypeScript, Tailwind (existing project baseline) |
| Auth | Auth0 |
| Database | MongoDB |
| ORM | Prisma |
| i18n | App-level localization (`en`, `tr`) with EUR formatting |
| Hosting | TBD (Vercel recommended given Next.js) |
| Design fidelity | Figma mobile layouts as source of truth for small screens |

### 11.1 Domain model (logical)

- **User** — auth0Id, email, name, locale, balanceHidden, createdAt
- **AccountBalance** — userId, amountEur (derived or stored starting balance + txn sum; pick one approach and keep consistent)
- **Budget** — userId, cycleStart, cycleEnd, totalAmountEur, status
- **Category** — userId, budgetId, name, icon, color, limitEur, applyRule metadata
- **Transaction** — userId, categoryId, type (`expense`\|`income`), amountEur, title, date, note?
- **Notification** — userId, type, title, body, href?, readAt?, createdAt

Exact Prisma schema is an implementation deliverable; fields above are the product contract.

### 11.2 Security & compliance (MVP bar)

- All money data scoped to authenticated user (no cross-user reads).
- Validate amounts server-side (&gt; 0, reasonable max).
- CSRF/session hardening per Auth0 + Next.js guidance.
- Env secrets never client-exposed.
- Soft-delete or hard-delete strategy documented for user data request.

---

## 12. UX & content requirements

- Match Figma visual language (purple accent, dark balance card, rounded cards) on mobile.
- Empty states with clear CTAs (no budget / no transactions / no notifications).
- Over-limit styling as in Category detail (warning + progress overflow).
- Success moments for budget create and limit adjust (as designed).
- Accessible controls: focus states, sufficient contrast, labeled icon buttons.
- Desktop: constrain main column (e.g. max-width phone/tablet canvas) rather than stretching mobile cards edge-to-edge across ultra-wide screens — unless a dedicated desktop layout is later designed.

---

## 13. Open decisions (defaults for build)

These were not fully specified by stakeholders; MVP will proceed with the defaults below unless overridden:

| Topic | Default for MVP |
| --- | --- |
| Budget submit when amount left &gt; 0 | **Block** submit until fully allocated (or amount left = 0); allow unused “General” catch-all as escape hatch |
| Income handling vs budget | Income increases balance; does **not** auto-increase category limits |
| Starting balance | Seeded constant (e.g. €10,000) editable later in V2 |
| Near-limit threshold | **80%** of category limit |
| Analytics vendor | Implement event schema now; choose vendor during setup (PostHog preferred for product analytics speed) |
| Notification delivery | In-app only |
| Profile beyond locale/logout | Minimal only |

---

## 14. Release plan

### Phase A — Foundation

Auth0, Prisma/MongoDB, i18n shell, analytics bootstrap, seed pipeline.

### Phase B — Core loop

Home, create budget, transactions CRUD (create/list), insight, category detail.

### Phase C — Management & notifications

Adjust limit + billing cycle, manage category, notification center + generators.

### Phase D — Beta harden

Empty/error states, localization pass, analytics funnel dashboards, invite first 100 users.

**Exit criteria for “MVP done”:** Phases A–C complete; funnels in §10.3 visible in analytics; `en`/`tr` critical paths verified; 100-user invite ready.

---

## 15. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Design includes non-MVP banking chrome → user confusion | Remove/replace dead nav and Deposit/Transfer; keep IA honest |
| Manual entry fatigue → low transaction volume | Seed data + very fast add-transaction UX; measure drop-off |
| Auth0 + Mongo friction slows shipping | Spike auth+schema in Phase A before UI polish |
| Analytics gaps → weak V2 learning | Treat missing events as release blockers for the owning flow |
| Locale bugs in EUR/TR | Screenshot QA checklist for both locales before beta |

---

## 16. V2 learning agenda (driven by analytics)

Use the first 100 users to answer:

1. Where do users abandon budget creation?
2. Do over-limit notifications drive adjust or ignore?
3. Is demand visible for bank sync / cards / transfer (proxy: repeated “add transaction” friction, support asks)?
4. Which categories are most used — should defaults change?
5. Does Turkish usage differ in activation or retention?

---

## 17. Acceptance checklist (PO sign-off)

- [ ] Auth0 login/logout works; user persisted in MongoDB via Prisma
- [ ] New user receives seed data; can create budget in EUR
- [ ] Manual transactions update balance, insight, and category detail
- [ ] Over-limit state and adjust-limit + billing cycle work
- [ ] Notifications generate and deep-link correctly
- [ ] App usable in English and Turkish
- [ ] All §10.2 events verified in analytics debugger
- [ ] Cards / Rewards / Deposit / Transfer not present as broken destinations
- [ ] Mobile-first UI aligns with Figma for in-scope screens
- [ ] Ready to onboard first 100 test users

---

## 18. References

- Design: [Fintrack Figma](https://www.figma.com/design/p0LhPv5Pjadk6DljfJ3Wjv/Fintrack-app---budgetting-app--Community-?node-id=0-1)
- Repo baseline: Next.js App Router (`personal-finance-app`)
- Related follow-ups (not in this doc): engineering tech spec, Prisma schema, analytics dashboard setup, Auth0 tenant config

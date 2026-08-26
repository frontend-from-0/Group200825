# Fintrack MVP — UX Screen Inventory

Design source: [Fintrack Figma](https://www.figma.com/design/p0LhPv5Pjadk6DljfJ3Wjv/Fintrack-app---budgetting-app--Community-?node-id=0-1)

## Strip from design chrome (do not ship)

- Cards tab
- Rewards tab
- Deposit / Transfer actions on balance card
- Any bank-linking entry points

## Honest MVP bottom nav

| Slot | Route | Label en | Label tr |
| --- | --- | --- | --- |
| 1 | `/home` | Home | Ana Sayfa |
| 2 | `/insight` | Insight | Analiz |
| 3 | `/transactions/new` | Add | Ekle |
| 4 | `/notifications` | Alerts | Bildirimler |
| 5 | `/profile` | Profile | Profil |

## In-scope screens

| Screen | Route | Notes |
| --- | --- | --- |
| Entry / waitlist | `/` | Logged-out CTA + non-allowlisted message |
| Home | `/home` | Remaining-first hero; cash-on-hand secondary |
| Create budget | `/budget/new` | Total + allocate; block until amount left = 0 |
| Budget success | `/budget/success` | Confirm → Home |
| Insight | `/insight` | Spent/remaining + category rows |
| Category detail | `/categories/[id]` | Over-limit state; filtered txns |
| Category manage | `/categories/[id]/manage` | Rename, limit, delete |
| Transactions | `/transactions` | Newest first |
| Add transaction | `/transactions/new` | Expense requires category; income skips envelope |
| Notifications | `/notifications` | Read/unread + deep links |
| Profile | `/profile` | Locale, feedback, reset demo, delete data, logout |

## Layout rules

- Mobile-first Figma hierarchy
- Desktop: max-width ~430px centered canvas
- EUR only; locale-aware formatting (`en` / `tr`)
- WCAG 2.2 AA on critical paths (see DOMAIN_AND_BETA.md)

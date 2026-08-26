# Fintrack — Operator setup (Phase 0 / D)

## Services to provision

1. **Auth0** — Single Page / Regular Web Application for Next.js
   - Allowed Callback URLs: `{APP_BASE_URL}/auth/callback`
   - Allowed Logout URLs: `{APP_BASE_URL}`
   - Allowed Web Origins: `{APP_BASE_URL}`
   - Copy Domain, Client ID, Client Secret into env
   - Generate `AUTH0_SECRET` with `openssl rand -hex 32`

2. **MongoDB Atlas** — Free/shared cluster; database name `fintrack`
   - Network access for Vercel + local IP
   - Connection string → `DATABASE_URL`

3. **PostHog** — Project (EU or US)
   - Project API key → `NEXT_PUBLIC_POSTHOG_KEY` / `POSTHOG_API_KEY`
   - Host → `NEXT_PUBLIC_POSTHOG_HOST`

4. **Vercel** — Import repo; set all env vars for Preview + Production
   - Update Auth0 callbacks for production URL

## Allowlist

Set `BETA_ALLOWLIST_EMAILS=a@x.com,b@y.com` (≤100 for soft-cap messaging).
Non-listed authenticated users land on waitlist at `/`.

## Database

```bash
npx prisma db push
npx prisma generate
```

## Local without Auth0

`AUTH_DEV_BYPASS=true` with a MongoDB URL enables a fixed local user for UI work.
Never set in production.

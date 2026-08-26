# Fintrack

Closed-beta personal budgeting app (EUR, `en`/`tr`) built with Next.js App Router, Auth0, Prisma/MongoDB, and PostHog.

## Docs

- [Product requirements](docs/PRD.md)
- [Domain & beta contracts](docs/DOMAIN_AND_BETA.md)
- [UX screen inventory](docs/UX_SCREEN_INVENTORY.md)
- [Operator setup](docs/OPERATOR_SETUP.md)
- [Acceptance checklist](docs/ACCEPTANCE_CHECKLIST.md)

## Quick start (local)

1. Copy `.env.example` → `.env`
2. Set `DATABASE_URL` (MongoDB Atlas)
3. Either configure Auth0 **or** set `AUTH_DEV_BYPASS=true` and add your email to `BETA_ALLOWLIST_EMAILS`
4. Install and push schema:

```bash
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Prisma generate + production build |
| `npm test` | Unit tests (cycle + money) |
| `npm run db:push` | Push Prisma schema to MongoDB |

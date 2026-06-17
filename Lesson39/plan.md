# Lesson 39 — Create a Product (Prisma + MongoDB + Vercel Blob)

**Project:** `Lesson39/ecom-200825`  
**Duration:** ~2–2.5 hours (demo + guided coding)  
**Goal:** Admin can create a product — product data lives in MongoDB (via Prisma), images live in Vercel Blob.

---

## What students will learn

By the end of this lesson, students should be able to:

1. Explain **what Prisma is** and **why** we use it instead of writing raw MongoDB queries.
2. Set up **Prisma with MongoDB** (schema, client, `db push`).
3. Use the **most common Prisma Client methods** for CRUD on a `Product` model.
4. Set up **Vercel Blob** and upload/list/delete files from a **Server Action**.
5. Wire everything together in the **admin “Create product”** flow (form → upload images → save record).

---

## Prerequisites (already in the repo)

Students should have completed the Auth0 admin setup from previous lessons:

- `src/lib/auth0.ts` — `requireAdmin()`, roles
- `src/app/admin/layout.tsx` — admin routes protected
- MongoDB Atlas account (same as Lesson 36) or a new cluster
- Vercel account (for Blob storage; local dev works with a token)

**Bridge from Lesson 36:** In Lesson 36 we used the native `mongodb` driver (`getDb()`, `collection.insertOne()`). Today we replace that with **Prisma** — same database, safer and more ergonomic API.

---

## Big picture — where data goes

```mermaid
flowchart LR
  Admin["Admin form\n/admin/products/new"]
  SA["Server Action\ncreateProduct()"]
  Blob["Vercel Blob\nimages"]
  Prisma["Prisma Client"]
  Mongo["MongoDB Atlas\nproducts collection"]

  Admin --> SA
  SA -->|"put(file)"| Blob
  Blob -->|"returns url"| SA
  SA -->|"create({ imageUrls })"| Prisma
  Prisma --> Mongo
```

| Data | Where | Why |
|------|--------|-----|
| Name, price, stock, description, currency | MongoDB via Prisma | Structured, queryable product records |
| Image files (binary) | Vercel Blob | Files don’t belong inside MongoDB documents |
| Image URLs | MongoDB (on `Product`) | Store references, not the files themselves |

This matches the admin flow from `Lesson38/user-flow.md` (steps 1.2 and 1.3). Stripe IDs come in a later lesson.

---

## Part 0 — Concept talk (10 min): What is Prisma?

### Plain-language explanation

**Prisma** is an **ORM** (Object–Relational Mapper). For us it means:

- You describe your data in a **`schema.prisma`** file (models, fields, types).
- Prisma generates a **type-safe client** (`prisma.product.create(...)`) so TypeScript knows the shape of your data.
- You avoid hand-writing `insertOne`, `find`, and manual mapping in every file.

### Why not stick with the raw MongoDB driver?

| Raw driver (Lesson 36) | Prisma (Lesson 39) |
|------------------------|-------------------|
| `db.collection('products').insertOne({...})` | `prisma.product.create({ data: {...} })` |
| No compile-time types | Autocomplete + errors in the editor |
| Schema lives only in your head / docs | Schema is the single source of truth |
| Easy to typo field names | Typos caught by TypeScript |

### Important limitation (say this out loud)

- **MongoDB + Prisma:** use **Prisma ORM v6.19** — v7 does not fully support MongoDB yet.
- **No `prisma migrate` for MongoDB** — use **`prisma db push`** to sync schema instead.

---

## Part 1 — MongoDB Atlas setup (15 min)

### 1.1 Create / reuse a cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free cluster (or reuse the one from Lesson 36).
3. **Database Access** → create a DB user (username + password).
4. **Network Access** → allow your IP (or `0.0.0.0/0` for class demos only).
5. **Connect** → “Drivers” → copy the connection string.

### 1.2 Connection string

Format:

```txt
mongodb+srv://<USER>:<PASSWORD>@<cluster>.mongodb.net/<DB_NAME>?retryWrites=true&w=majority
```

Replace `<PASSWORD>` with the real password (URL-encode special characters).

### 1.3 Environment variable

In `Lesson39/ecom-200825/.env.local` (never commit this file):

```env
DATABASE_URL="mongodb+srv://..."
```

Add to `.gitignore` if not already there. Provide `.env.example` for students:

```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/ecom-dev"
BLOB_READ_WRITE_TOKEN=""
```

---

## Part 2 — Prisma setup (30 min)

All commands run from `Lesson39/ecom-200825/`.

### 2.1 Install dependencies

```bash
npm install @prisma/client@6.19 dotenv
npm install -D prisma@6.19
```

> **Coach note:** Pin `6.19` so students don’t accidentally install Prisma 7.

### 2.2 Initialize Prisma for MongoDB

```bash
npx prisma init --datasource-provider mongodb
```

This creates:

- `prisma/schema.prisma` — models + DB connection
- `.env` — Prisma may create/update `DATABASE_URL` (merge with `.env.local` or use one file consistently)

### 2.3 Define allowed currencies (TypeScript enum)

Create `src/types/currency.ts` — **single source of truth** for the currencies your shop supports:

```ts
/** ISO 4217 codes — the 3 most used currencies in EU-region e-commerce */
export enum Currency {
  EUR = "EUR", 
  GBP = "GBP", 
  TRY = "TRY",
}

export const EU_CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: Currency.EUR, label: "Euro (€)" },
  { value: Currency.GBP, label: "British pound (£)" },
  { value: Currency.TRY, label: "Turkish lira (tl)" },
];

export function isCurrency(value: string): value is Currency {
  return Object.values(Currency).includes(value as Currency);
}

export function formatPrice(priceCents: number, currency: Currency): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}
```

**Teaching points:**

- **String enum** (`EUR = "EUR"`) — value stored in MongoDB matches the enum member; easy to use in forms and Prisma.
- **`isCurrency()`** — type guard for validating `formData` on the server.
- **`formatPrice()`** — use on the product list page so homework shows `€89.99`

> Keep the Prisma enum (below) **in sync** with this TS enum — same three values, same spelling.

### 2.4 Define the `Product` model

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String
  priceCents  Int      // smallest currency unit: 1999 = 19.99 in the given currency
  currency    Currency @default(EUR)
  stock       Int      @default(0)
  imageUrls   String[] // URLs returned by Vercel Blob
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}

enum Currency {
  EUR
  GBP
  TRY
}
```

**Teaching points:**

- `@id @default(auto()) @map("_id") @db.ObjectId` — MongoDB’s `_id` field.
- `priceCents` — never store floats for money; always the **smallest unit** of the chosen currency (cents, pence, grosze — EUR/GBP/TRY all use 2 decimal places).
- `currency` — must be one of `Currency` enum values. **Required alongside `priceCents`:** `1999` means €19.99, £19.99, or 19.99 tl depending on currency. Stripe and the storefront both need this when you display or charge a price.
- `imageUrls` — strings only; files live in Blob.

> **Design note:** If your whole shop sells in one currency only, default to `Currency.EUR` in the form and hide the `<select>`. You still **store** `currency` on each product so the data model stays correct when Stripe is added later.

### 2.5 Push schema to the database

```bash
npx prisma db push
```

What it does: creates/updates the `Product` collection to match the schema.  
**Not** the same as SQL migrations — for MongoDB this is the normal workflow.

### 2.6 Generate the client (after every schema change)

```bash
npx prisma generate
```

`db push` often runs generate automatically; if imports fail, run this manually.

### 2.7 Prisma Client singleton

Create `src/lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

**Why singleton?** In Next.js dev mode, hot reload can create many `PrismaClient` instances and exhaust DB connections.

---

## Part 2b — Prisma CLI cheat sheet (keep on screen)

| Command | When to use |
|---------|-------------|
| `npx prisma init` | First-time setup |
| `npx prisma db push` | After changing `schema.prisma` (MongoDB) |
| `npx prisma generate` | Regenerate client after schema changes |
| `npx prisma studio` | Visual browser UI to inspect/edit data (great for demos) |
| `npx prisma db pull` | Existing DB → generate models (introspection) |
| `npx prisma validate` | Check schema syntax without connecting |
| `npx prisma format` | Format `schema.prisma` |

**MongoDB:** do **not** use `prisma migrate dev` — migrations are for SQL databases.

---

## Part 2c — Prisma Client methods you will use today

Import: `import { prisma } from "@/lib/prisma"`

### Create

```ts
const product = await prisma.product.create({
  data: {
    name: "Running Shoes",
    description: "Lightweight trainers",
    priceCents: 8999,
    currency: "EUR", // or Currency.EUR from @/types/currency
    stock: 42,
    imageUrls: ["https://....public.blob.vercel-storage.com/shoe.jpg"],
  },
});
```

### Read many (with sorting)

```ts
const products = await prisma.product.findMany({
  where: { isActive: true },
  orderBy: { createdAt: "desc" },
});
```

### Read one

```ts
const product = await prisma.product.findUnique({
  where: { id: productId },
});
```

### Update

```ts
const updated = await prisma.product.update({
  where: { id: productId },
  data: { stock: 40, priceCents: 7999, currency: "EUR" },
});
```

### Delete

```ts
await prisma.product.delete({
  where: { id: productId },
});
```

### Useful options (mention, optional in homework)

```ts
// Return only some fields
await prisma.product.findMany({ select: { id: true, name: true, priceCents: true, currency: true } });

// Pagination
await prisma.product.findMany({ take: 10, skip: 0 });

// Count
await prisma.product.count({ where: { isActive: true } });
```

---

## Part 3 — Vercel Blob setup (25 min)

### 3.1 Create a Blob store

1. Vercel dashboard → your project → **Storage** → **Create Database** → **Blob**.
2. Connect it to the project.
3. Copy **`BLOB_READ_WRITE_TOKEN`** into `.env.local`:

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

For local dev you can also run `vercel env pull` if the project is linked.

### 3.2 Install SDK

```bash
npm install @vercel/blob
```

### 3.3 Core methods (Server Actions / Route Handlers only)

```ts
import { put, list, del, head } from "@vercel/blob";
```

| Function | Purpose | Typical use |
|----------|---------|-------------|
| `put(pathname, body, options)` | Upload a file | Product images on create |
| `list(options?)` | List blobs in the store | Admin gallery / debug |
| `del(url \| url[])` | Delete one or more blobs | Product delete (later lesson) |
| `head(url)` | Metadata without downloading | Check file exists |

### 3.4 Upload example (single image)

```ts
"use server";

import { put } from "@vercel/blob";

export async function uploadProductImage(file: File) {
  const blob = await put(`products/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true, // avoids overwriting files with the same name
  });

  return blob.url; // save this string in MongoDB
}
```

**`put` options to explain:**

- `access: "public"` — image reachable via HTTPS URL (needed for storefront).
- `addRandomSuffix: true` — unique filenames when admins upload `photo.jpg` twice.
- `contentType` — optional; usually inferred from `File`.

### 3.5 List & delete (for debugging / future delete flow)

```ts
const { blobs } = await list({ prefix: "products/" });

await del("https://<store>.public.blob.vercel-storage.com/products/abc.jpg");
// or
await del([url1, url2]);
```

### 3.6 Next.js image config

If you display images with `next/image`, add the Blob host to `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
```

### 3.7 Server upload limit (mention once)

Vercel Server Actions / Functions have a **~4.5 MB** request body limit. Fine for product thumbnails; larger files need [client uploads](https://vercel.com/docs/vercel-blob/client-upload) (out of scope today).

---

## Part 4 — Build “Create product” (45–60 min)

Suggested file structure:

```txt
src/
  types/
    currency.ts      # Currency enum, isCurrency, formatPrice
  lib/
    prisma.ts
    blob.ts          # optional: thin wrappers around put/del
  app/
    admin/
      products/
        new/
          page.tsx   # form UI
          action.ts  # createProduct server action
        page.tsx     # list products (stretch)
```

### 4.1 Server Action — full realistic flow

`src/app/admin/products/new/action.ts`:

```ts
"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { Currency, isCurrency } from "@/types/currency";
import type { Currency as DbCurrency } from "@prisma/client";

export type CreateProductState =
  | { success: true; productId: string }
  | { success: false; message: string };

export async function createProduct(
  _prev: CreateProductState | null,
  formData: FormData,
): Promise<CreateProductState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = Number(formData.get("priceCents"));
  const currencyRaw = String(formData.get("currency") ?? Currency.EUR);
  const stock = Number(formData.get("stock"));
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File);

  if (!isCurrency(currencyRaw)) {
    return { success: false, message: "Invalid currency." };
  }

  if (!name || !description || Number.isNaN(priceCents) || Number.isNaN(stock)) {
    return { success: false, message: "Please fill in all required fields." };
  }

  if (imageFiles.length === 0) {
    return { success: false, message: "Add at least one product image." };
  }

  const imageUrls: string[] = [];

  for (const file of imageFiles) {
    if (file.size === 0) continue;

    const blob = await put(`products/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    imageUrls.push(blob.url);
  }

  if (imageUrls.length === 0) {
    return { success: false, message: "Could not upload images." };
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      priceCents,
      currency: currencyRaw as DbCurrency,
      stock,
      imageUrls,
    },
  });

  revalidatePath("/admin/products");

  return { success: true, productId: product.id };
}
```

**Order of operations (important teaching moment):**

1. Validate input on the server (never trust the client).
2. Upload images → collect URLs.
3. Save product document with URLs in MongoDB.

If step 3 fails after uploads succeed, you can have orphan blobs — mention that production apps often use transactions or cleanup jobs (briefly; don’t over-engineer in class).

### 4.2 Admin form page (minimal)

`src/app/admin/products/new/page.tsx` — use `useActionState` (React 19) with the action above:

- Fields: `name`, `description`, `priceCents`, `currency`, `stock`
- Currency `<select>` — map over `EU_CURRENCY_OPTIONS` from `@/types/currency` (never hardcode options in JSX):

```tsx
import { Currency, EU_CURRENCY_OPTIONS } from "@/types/currency";

<select name="currency" defaultValue={Currency.EUR} required>
  {EU_CURRENCY_OPTIONS.map(({ value, label }) => (
    <option key={value} value={value}>
      {label}
    </option>
  ))}
</select>
```

- `<input type="file" name="images" accept="image/*" multiple required />`
- `enctype="multipart/form-data"` on the form
- Show success / error message from action state

### 4.3 Verify with Prisma Studio

```bash
npx prisma studio
```

Open the browser UI → `Product` collection → confirm `imageUrls` contain Blob URLs.

---

## Part 5 — Live demo script (for the instructor)

| Step | What to show | Talking point |
|------|----------------|---------------|
| 1 | Empty MongoDB / no `Product` collection | Schema-first development |
| 2 | `npx prisma db push` | Creates collection from schema |
| 3 | `npx prisma studio` | “Your DB GUI without writing code” |
| 4 | Vercel Storage → Blob store + token | Files vs metadata separation |
| 5 | Upload one image via `put` in isolation (temporary route or script) | Blob URL in dashboard |
| 6 | Full create form as admin | Auth0 admin gate still applies |
| 7 | Refresh Studio + Blob browser | Same product, URLs resolve in browser |

---

## Common errors & fixes

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| `@prisma/client did not initialize` | Client not generated | `npx prisma generate` |
| Prisma 7 + MongoDB errors | Wrong version | `npm install prisma@6.19 @prisma/client@6.19` |
| `Environment variable not found: DATABASE_URL` | Missing `.env` | Set `DATABASE_URL` in `.env.local` |
| Atlas connection timeout | IP not whitelisted | Network Access in Atlas |
| `put` fails locally | Missing `BLOB_READ_WRITE_TOKEN` | Copy token from Vercel |
| Images don’t render in `<Image>` | Remote pattern missing | Update `next.config.ts` |
| Form submits but no files | Missing `multiple` / wrong `name` | `formData.getAll("images")` |

---

## Assignment (homework)

**Required**

1. Working `/admin/products/new` — admin-only, creates a product in MongoDB with at least one Blob image URL.
2. `/admin/products` — list all products (name, `formatPrice(priceCents, currency)`, thumbnail using first `imageUrl`).
3. `.env.example` updated with `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`.

**Optional (bonus)**

- Edit product (update text fields; add new images without removing old ones).
- Soft-delete: `isActive: false` instead of hard delete.
- Basic Zod validation in the server action (pattern from Lesson 36 quotes).

**Out of scope for this lesson**

- Stripe product/price IDs
- Product delete + Blob cleanup
- Client-side uploads for large files

---

## Reference links

- [Prisma + MongoDB quickstart (v6)](https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/mongodb)
- [Prisma Client CRUD](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
- [MongoDB connector notes](https://www.prisma.io/docs/orm/core-concepts/supported-databases/mongodb)
- [Vercel Blob — server uploads](https://vercel.com/docs/vercel-blob/server-upload)
- [@vercel/blob SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

## Quick command reference (copy-paste block for students)

```bash
# Prisma
npm install @prisma/client@6.19 dotenv
npm install -D prisma@6.19
npx prisma init --datasource-provider mongodb
npx prisma db push
npx prisma generate
npx prisma studio

# Vercel Blob
npm install @vercel/blob
```

```ts
// Prisma
prisma.product.create({ data })
prisma.product.findMany({ where, orderBy })
prisma.product.findUnique({ where: { id } })
prisma.product.update({ where, data })
prisma.product.delete({ where })

// Vercel Blob
await put(pathname, file, { access: "public", addRandomSuffix: true })
await list({ prefix: "products/" })
await del(url)
```

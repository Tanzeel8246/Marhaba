# مرحبا سویٹس اینڈ بیکرز — Workspace

## Overview

pnpm workspace monorepo for "مرحبا سویٹس اینڈ بیکرز", a production-grade bakery e-commerce app.
Customers browse and add custom items to cart, then checkout via WhatsApp. Admins manage everything through a protected dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (direct import, not `zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec → React Query hooks + Zod schemas)
- **Build**: esbuild (ESM bundle for API server)
- **Frontend**: React 19 + Vite, Wouter routing, TanStack Query, shadcn/ui, Zustand, Tailwind v4

## Artifacts

| Artifact | Path | Description |
|---|---|---|
| `artifacts/api-server` | `/api` | Express 5 REST API server |
| `artifacts/bake-delight-pro` | `/` | React + Vite storefront + admin SPA |

## Shared Libraries

| Library | Description |
|---|---|
| `lib/api-spec` | OpenAPI 3.1 spec (`openapi.yaml`) + Orval codegen |
| `lib/api-zod` | Generated Zod schemas from OpenAPI spec |
| `lib/api-client-react` | Generated TanStack Query hooks from OpenAPI spec |
| `lib/db` | Drizzle ORM schema + `db` instance |

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `DATABASE_URL=$DATABASE_URL /home/runner/workspace/node_modules/.pnpm/node_modules/.bin/tsx artifacts/api-server/src/seed.ts` — run seed

## DB Schema (6 tables)

- `categories` — product categories (sortable)
- `products` — bakery products with `imageUrls`, `variants`, `addons` (JSONB), `allowCustomMessage`, `isVisible`, `isAvailable`, `orderCount`
- `orders` — customer orders with items (JSONB), `status` workflow, coupon, WhatsApp checkout flow
- `banners` — homepage hero carousel banners
- `blackout_dates` — dates unavailable for delivery
- `coupons` — discount codes (percentage or fixed, min order, max uses, expiry)

## Admin Auth

- Cookie-based session (`bake_admin_session`)
- Default password: `admin123` (set via `ADMIN_PASSWORD` env var)
- Protected routes: all `/api/admin/*` and frontend `/admin/*`

## Storefront Routes

| Route | Page |
|---|---|
| `/` | Homepage (banner carousel, categories, popular products) |
| `/shop` | Product catalog (search, category filter) |
| `/products/:id` | Product detail (variants, add-ons, custom message, add to cart) |
| `/cart` | Cart + WhatsApp checkout (coupon, delivery date, customer details) |

## Admin Routes

| Route | Page |
|---|---|
| `/admin/login` | Password login |
| `/admin` | Dashboard (order stats, charts) |
| `/admin/products` | CRUD products with variants/add-ons |
| `/admin/categories` | CRUD categories |
| `/admin/orders` | View and update order status workflow |
| `/admin/calendar` | Monthly calendar view of deliveries |
| `/admin/banners` | CRUD homepage banners |
| `/admin/blackout-dates` | Block delivery dates |
| `/admin/coupons` | CRUD discount codes |

## Business Rules

- 24-hour lead time for orders (min delivery date = tomorrow)
- Daily order limit: 20 (configurable via `DAILY_ORDER_LIMIT` env var)
- Checkout flow: form → validate coupon/date → open WhatsApp with pre-filled message → save order to DB
- WhatsApp number: `1234567890` (update in `artifacts/bake-delight-pro/src/pages/CartPage.tsx`)

## Important Notes

- `zod/v4` cannot be used in api-server routes — use `zod` directly
- `lib/api-zod/src/index.ts` must only have `export * from "./generated/api"` — the codegen script overwrites it after Orval runs to prevent duplicate exports
- All JSONB fields (`imageUrls`, `variants`, `addons`, `items`) require `JSON.stringify()` when inserting via seed/raw queries
- Zustand cart store persists to localStorage as `bake-delight-cart`
- Theme (light/dark) persists to localStorage as `bake-theme`

## Seed Data

Run the seed script to populate the database with 4 categories, 8 products, and 2 banners.
The seed is idempotent — it skips if categories already exist.

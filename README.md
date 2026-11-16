# CARRYFORM — Editorial Luxury & Architectural Bag Storefront

> A production-grade, commercially packaged Next.js 16 e-commerce template featuring editorial storytelling, architectural bag showcases, a zero-config JSON demonstration mode, an embedded administration dashboard, and a complete Supabase integration architecture.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Commercial_Single_End_Product-amber?style=flat-square)](LICENSE.txt)

---

## Overview

**CARRYFORM** is a bespoke e-commerce digital flagship built for luxury leather goods, architectural carry items, and modern academic accessories. Designed with an editorial aesthetic inspired by print monographs and minimalist industrial design, it delivers an immersive brand experience while maintaining strict technical performance, accessibility, and architectural clean code standards.

The product catalogue is curated with an intentional **65% Women's Luxury / 35% Academic & Student** balance across 20 distinct products, each accompanied by realistic photography, structured material specifications, and dedicated collection placements.

### Live Demonstration
- **Live Showcase URL:** [https://csrryform.vercel.app/](https://csrryform.vercel.app/)
- **Administrative Portal:** Access `/admin` directly or double-click the waving hand (`👋`) in the footer creator credit.

---

## Key Features

### 1. Editorial Storefront & Luxury Motion
- **Full-Screen Responsive Hero:** Precision viewport framing (`100svh`), fluid typography, and immediate call-to-action visibility without initial scroll requirements.
- **Scroll-Aware Header:** Gracefully hides when scrolling downward and slides into view when scrolling upward, maximizing screen estate.
- **Micro-Interactions & Animation:** Powered by **GSAP** (ScrollTrigger), **Motion** (Framer Motion), and **Swiper** for tactile carousel interactions and staggered typography reveals.
- **Audience Navigation:** Instant filtering between Women's Luxury Edits, Academic & School Carry, Minimalist Travel, and All Products.

### 2. Dual Data Architecture (Zero-Config Default)
- **Zero-Config Demonstration Mode (Default):** Runs immediately upon `npm install` and `npm run dev`. No database, API keys, or external accounts required.
- **Supabase Production Readiness:** Includes a complete PostgreSQL DDL migration (`supabase/migrations/0001_initial_schema.sql`) and an idempotent seed script (`supabase/seed.sql`).
- **Resilient Fallback:** Automatically connects to Supabase if valid credentials and tables are detected, gracefully reverting to local demonstration data if the connection fails or credentials are unset.

### 3. Integrated Administration Workspace (`/admin`)
- **Interactive Product Listing:** Complete catalog table with thumbnail previews, live status badges, categories, collections, prices, and inline toggles.
- **Composable Filtering & Search:** Real-time text search across titles, slugs, and descriptions combined with filters for Category, Collection, Target Audience, Status, and Editorial Flags.
- **Bulk Action Toolbar:** Select multiple products to activate, hide, feature, tag as new arrivals, or delete in a single batch operation.
- **Tabbed Product Modal Editor:**
  - *Essentials:* Name, auto-slug generator, category assignment, collection memberships, target audience.
  - *Pricing & Status:* Price, compare-at price, inventory availability, sort order, active/hidden toggle.
  - *Photography:* Multi-image manager with live URL validation, image roles (`primary`, `gallery`, `detail`, `lifestyle`), alt text, and reordering.
  - *Specifications:* Structured material attributes (Dimensions, Weight, Volume, Laptop Compatibility, Materials, Hardware, Water Resistance).
  - *Placement & Flags:* Editorial badges (Featured, New Arrival, Limited Edition, Best Seller).
- **Accessible Notification System:** Stacked toast notifications with automatic dismissals and ARIA live announcements.
- **Hidden Admin Gateway:** In addition to `/admin`, double-clicking the waving hand emoji (`👋`) in the footer credit seamlessly opens the administration login.

---

## Project Structure

```
carryform/
├── docs/                               # Comprehensive buyer documentation
│   ├── INSTALLATION.md                 # Setup, prerequisites, local run instructions
│   ├── SUPABASE_SETUP.md               # Supabase project creation, migration, seeding
│   ├── ADMIN_GUIDE.md                  # Complete administration workspace manual
│   ├── DEPLOYMENT.md                   # Vercel deployment guide & environment config
│   └── TROUBLESHOOTING.md              # Common issues, port conflicts, solutions
├── public/                             # Static assets, branding, and imagery
│   ├── images/products/                # Curated product photography (20 unique items)
│   └── favicon.ico                     # Site icons
├── src/
│   ├── app/                            # Next.js 16 App Router
│   │   ├── admin/                      # Admin login & dashboard routes
│   │   ├── collections/                # Collection-specific showcase pages
│   │   ├── products/                   # Dynamic product detail pages ([slug])
│   │   ├── globals.css                 # Tailwind CSS v4 styling & typography
│   │   ├── layout.tsx                  # Root layout with fonts & providers
│   │   └── page.tsx                    # Homepage flagship experience
│   ├── components/                     # Reusable React components
│   │   ├── admin/                      # Administration suite (Table, Filters, Modals, Toasts)
│   │   ├── layout/                     # Header, Footer, Mobile Navigation
│   │   ├── product/                    # ProductCard, Gallery, SpecsTable, QuickView
│   │   └── ui/                         # Accordions, Drawers, Badges, Modals
│   ├── hooks/                          # Custom React hooks (useCart, useScrollDirection)
│   ├── lib/                            # Business logic and utilities
│   │   ├── data/                       # Data access layer (JSON provider, Supabase provider)
│   │   ├── supabase/                   # Supabase client helpers (client, server, ssr)
│   │   ├── types/                      # TypeScript definitions (Product, Collection, Category)
│   │   └── validations/                # Zod schemas for runtime data validation
│   └── data/
│       └── catalog.json                # Bundled offline demonstration catalog
├── supabase/
│   ├── migrations/
│   │   └── 0001_initial_schema.sql     # Executable PostgreSQL schema with RLS policies
│   └── seed.sql                        # Complete idempotent seed dataset
├── .env.example                        # Documented environment variable template
├── CHANGELOG.md                        # Version history and release notes
├── LICENSE.txt                         # Commercial Single End Product License
├── package.json                        # Dependencies and build scripts
└── README.md                           # This documentation
```

---

## Quick Start (Zero-Config Mode)

No database or external services required. Follow these steps to run the complete template locally:

### 1. Prerequisites
- **Node.js**: Version `20.x` or `22.x` (LTS recommended)
- **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`

### 2. Installation
```bash
# Unpack the repository archive and enter directory
cd carryform

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

> **Port Conflict Tip:** If port 3000 is occupied by another process, execute `npm run dev:clean` to automatically terminate lingering Next.js processes and release port 3000.

---

## Connecting Supabase (Optional)

Connecting Supabase unlocks live cloud database persistence across server restarts and distributed deployments.

1. Create a free project at [database.new](https://database.new).
2. Execute `supabase/migrations/0001_initial_schema.sql` in the Supabase **SQL Editor**.
3. Execute `supabase/seed.sql` in the Supabase **SQL Editor** to populate all 20 products, categories, collections, and image relationships.
4. Copy your project URL and `anon` key from **Project Settings > API**.
5. Create `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key...
   ```
6. Restart your development server (`npm run dev`). The application will automatically detect your Supabase instance and transition from JSON mode to live cloud database mode.

For step-by-step instructions, troubleshooting, and Row Level Security policies, refer to [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md).

---

## Administration Portal

- **URL:** `http://localhost:3000/admin`
- **Secret Access:** Double-click the waving hand (`👋`) in the footer creator credit.
- **Default Development Credentials:**
  - **Username:** `admin`
  - **Password:** `admin`

In development mode, changes made in the admin portal are persisted directly to your browser's `localStorage` (`carryform-admin-content-v1`). You can reset to the original default catalog at any time using the "Reset to Default Demo Data" button.

Refer to [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md) for full operational guidance.

---

## Comprehensive Buyer Documentation

| Document | Description |
| :--- | :--- |
| [**`docs/INSTALLATION.md`**](docs/INSTALLATION.md) | Step-by-step setup, Node requirements, npm scripts, and verification checklist. |
| [**`docs/SUPABASE_SETUP.md`**](docs/SUPABASE_SETUP.md) | Database creation, SQL migration guide, seeding data, and RLS security policies. |
| [**`docs/ADMIN_GUIDE.md`**](docs/ADMIN_GUIDE.md) | Administration user manual: product management, bulk tools, photography, and content editing. |
| [**`docs/DEPLOYMENT.md`**](docs/DEPLOYMENT.md) | Production deployment to Vercel, custom domain configuration, and environment setup. |
| [**`docs/TROUBLESHOOTING.md`**](docs/TROUBLESHOOTING.md) | Port 3000 conflict resolution, Supabase connectivity diagnosis, image loading tips. |

---

## Environment Variables Reference

Copy `.env.example` to `.env.local` when configuring custom credentials:

```bash
cp .env.example .env.local
```

| Variable | Scope | Status | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Optional | Supabase Project URL (`https://<project-ref>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Optional | Supabase Public / Anon API key for client-safe queries. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Optional | Elevated database key for secure server-side mutations. Never expose to client! |
| `NEXT_PUBLIC_CARRYFORM_ADMIN_USERNAME` | Client & Server | Optional | Username for development admin access (Default: `admin`). |
| `NEXT_PUBLIC_CARRYFORM_ADMIN_PASSWORD` | Client & Server | Optional | Password for development admin access (Default: `admin`). |

---

## Verification & Build

Verify code quality and production build readiness:

```bash
# Run TypeScript compilation and ESLint verification
npm run lint

# Compile production build
npm run build

# Preview production build locally
npm run start
```

---

## Commercial Licensing & Support

This product is distributed under the **Commercial Single End Product License**.

- **Permitted:** You may customize, adapt, extend, and deploy this template to create **one (1) commercial or personal end product** for yourself or for a single client.
- **Prohibited:** You may **not** resell, redistribute, sub-license, bundle, share, or publish the source code as a competing template, digital download, or theme.
- For complete terms and third-party attribution disclosures, please review [`LICENSE.txt`](LICENSE.txt).

### Creator Credit
Crafted with precision by **chrysa** ([https://chrysaaa.vercel.app/](https://chrysaaa.vercel.app/)).

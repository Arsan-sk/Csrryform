# CARRYFORM admin workspace

## Routes

- `/admin` — development login.
- `/admin/dashboard` — protected catalogue and content workspace.

The footer creator credit remains the public link. Double-clicking the credit (or its waving hand) opens `/admin`; a normal click still opens the creator link.

## Local development access

The temporary development account is enabled only when `NODE_ENV` is not `production`.

| Setting | Default | Environment override |
| --- | --- | --- |
| Username | `admin` | `NEXT_PUBLIC_CARRYFORM_ADMIN_USERNAME` |
| Password | `admin` | `NEXT_PUBLIC_CARRYFORM_ADMIN_PASSWORD` |

These values are intentionally a demo convenience, not authentication. The browser session uses `sessionStorage` and must not be used to protect a production deployment. Before launch, replace `src/lib/admin-auth.ts` with a server-backed Supabase Auth flow and protect write operations with authenticated server routes and row-level security.

## Content architecture

The dashboard communicates with `src/lib/data/local-repository.ts`, rather than calling `localStorage` from individual controls. The repository:

- seeds from the existing JSON catalogue;
- validates stored product, collection, and category records with the existing Zod schemas;
- safely falls back to the seed data when storage is missing or malformed;
- stores metadata in `localStorage` under `carryform-admin-content-v1`;
- emits `carryform-content-updated` so a future public client-side content bridge can refresh in place.

Images are currently edited as URL references and are not converted to Base64. A production media adapter should store binaries in Supabase Storage (or IndexedDB for a fully local prototype) and keep only metadata/references in the content record.

The existing public data provider remains the source of truth for server-rendered public pages. The next production integration step is to implement repository write methods against the existing Supabase schema and select that provider through the current provider resolver; no service-role key belongs in client code.

## Dashboard capabilities

- Overview counts are derived from the catalogue.
- Products can be searched, filtered by audience, created, edited, activated/deactivated, and marked featured/new.
- Product edits preserve the existing schema, collection relationships, and image alt text.
- Collections expose the current product association count and featured toggle.
- Brand, SEO, contact address/email, and footer credit text can be saved.
- Resetting local content restores the demo JSON without editing source files.

## Recommended next steps

1. Add Supabase Auth and server-side admin mutations.
2. Add a Supabase Storage media adapter with MIME, size, dimension, and alt-text validation.
3. Add a server-side content overlay/read provider so saved CMS records are reflected by every public server-rendered route.
4. Add integration tests for login, CRUD validation, malformed storage, and featured-product limits.

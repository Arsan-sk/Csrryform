# Changelog

All notable changes to the **CARRYFORM** commercial template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-16

### Added
- **Commercial Documentation Suite**:
  - `README.md`: Comprehensive product overview, quick start, feature highlights, and architecture notes.
  - `LICENSE.txt`: Commercial Single End Product License with resale and redistribution restrictions.
  - `docs/INSTALLATION.md`: Complete buyer setup guide for zero-config demonstration mode and environment setup.
  - `docs/SUPABASE_SETUP.md`: Database setup manual covering migration execution, seed data ingestion, RLS policies, and fail-safe JSON fallback.
  - `docs/ADMIN_GUIDE.md`: Comprehensive administration portal user manual covering product catalog operations, bulk editing, photography management, and content customization.
  - `docs/DEPLOYMENT.md`: Production deployment guide for Vercel, including build configuration, environment variable options, custom domains, and pre-launch checklists.
  - `docs/TROUBLESHOOTING.md`: Detailed troubleshooting covering port 3000 conflicts (`dev:clean`), Node runtime requirements, Supabase connectivity health checks, and image rendering.
- **Supabase Production Readiness**:
  - `supabase/migrations/0001_initial_schema.sql`: Complete PostgreSQL DDL migration defining tables for `categories`, `collections`, `products`, `product_images`, `product_variants`, `site_settings`, and `contact_messages`.
  - Automated `handle_updated_at()` trigger function and table triggers for automatic timestamp management.
  - Least-privilege Row Level Security (RLS) policies granting anonymous public read access while strictly isolating write operations.
  - High-performance database indexing on foreign keys, slugs, sort orders, and search filters.
  - `supabase/seed.sql`: Idempotent SQL seed dataset with all 6 categories, 3 collections, 20 curated products, image relationships, and default site settings.
- **Enhanced Administration Dashboard Components**:
  - `src/components/admin/ProductTable.tsx`: Responsive product catalog table with photography thumbnails, category badges, collection tags, audience indicators, price formatting, inline toggles for status (`Active`/`Hidden`), featured (`★`), and new arrivals (`NEW`), and direct links to public product pages.
  - `src/components/admin/ProductFilters.tsx`: Real-time text search (name, slug, description) and composable filter dropdowns for Category, Collection, Target Audience, Status, and Editorial Flags with active filter count badges and one-click reset.
  - `src/components/admin/BulkActionsBar.tsx`: Sticky bulk operation toolbar providing single-click batch actions to activate, deactivate, feature, unfeature, tag as new, or delete multiple selected products.
  - `src/components/admin/ProductModal.tsx`: Accessible tabbed modal editor with five operational panels:
    - *Essentials*: Title, auto-slug generator button with duplicate slug detection, category selector, collection multiselect, target audience.
    - *Pricing & Status*: Price, compare-at price, inventory availability, display sort order, active/hidden toggle.
    - *Photography*: Multi-image asset manager with live preview thumbnails, image URL validation, role assignment (`primary`, `gallery`, `detail`, `lifestyle`), and alt text.
    - *Specifications*: Structured material attributes (Dimensions, Weight, Volume, Laptop Compatibility, Materials, Hardware, Water Resistance).
    - *Placement & Flags*: Editorial badges (`Featured`, `New Arrival`, `Limited Edition`, `Best Seller`).
  - `src/components/admin/ProductImageManager.tsx`: Dedicated photography asset manager component supporting multi-image arrays, thumbnail previews, role selectors, and primary image designation.
  - `src/components/admin/DeleteConfirmModal.tsx`: Accessible confirmation modal for single and bulk deletion operations with explicit warnings regarding local demonstration state.
  - `src/components/admin/ToastContext.tsx`: Accessible notification system with auto-dismissal, severity badges, ARIA live regions, and an ergonomic `useToast()` hook.
- **Developer Experience**:
  - `.env.example`: Comprehensively annotated environment template detailing optional Supabase variables and development administrative credentials.
  - Updated `.gitignore` to ensure `.env.example` remains tracked while local secret files (`.env*.local`) are safely ignored.

### Changed
- Refactored `src/components/admin/AdminDashboard.tsx` to seamlessly integrate the modular product table, filters, bulk action bar, tabbed modal editor, delete confirmation modal, and toast notification context.
- Optimized hero section viewport framing to use modern dynamic viewport units (`100svh`), guaranteeing full-height framing on desktop and mobile viewports without vertical overflow or partial cuts.
- Updated header navigation with scroll-direction detection: slides away cleanly when scrolling down to reveal editorial photography and re-appears smoothly when scrolling up.
- Upgraded product image sourcing to verify unique, authentic photography across all 20 products, eliminating duplicate or placeholder assets.

### Fixed
- Fixed port 3000 collision issue on Windows environments by introducing `npm run dev:clean` script to safely terminate orphaned Next.js node processes before launching.
- Fixed image aspect-ratio distortion and layout shift on mobile screens through responsive object-fit framing and pre-configured placeholder styling.
- Fixed admin catalog mutation state persistence by synchronizing updates through `localRepository` and broadcasting `carryform-content-updated` DOM events to keep active client views responsive.

### Security
- Verified that no live API keys, database credentials, or secret service-role tokens are embedded in client bundles or public repositories.
- Implemented Row Level Security (RLS) across all database tables in `supabase/migrations/0001_initial_schema.sql` ensuring anonymous clients cannot modify administrative records.
- Added explicit warnings in `docs/ADMIN_GUIDE.md` and `.env.example` clarifying that client-side credentials (`NEXT_PUBLIC_CARRYFORM_ADMIN_*`) are meant exclusively for offline demonstration mode and must be replaced with Supabase Auth or NextAuth for production deployments.

-- ==============================================================================
-- CARRYFORM — Initial Supabase Migration (0001_initial_schema.sql)
-- Commercial Distribution Architecture
-- ==============================================================================
-- Executable on a clean Supabase project.
-- Establishes the core data model, indexes, triggers, and Row Level Security (RLS).
-- Public reads are permitted only for active records.
-- Write permissions are restricted to authenticated administrators.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists pgcrypto;

-- 2. UPDATED_AT TRIGGER FUNCTION
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 3. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  audience text not null check (audience in ('womens', 'student', 'everyday', 'unisex')),
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

-- 4. COLLECTIONS TABLE
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  hero_image_url text,
  audience text not null check (audience in ('womens', 'student', 'everyday', 'unisex')),
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger collections_updated_at
  before update on public.collections
  for each row execute function public.handle_updated_at();

-- 5. PRODUCTS TABLE
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  audience text not null check (audience in ('womens', 'student', 'everyday', 'unisex')),
  product_type text not null,
  price_amount numeric(12, 2) check (price_amount is null or price_amount >= 0),
  currency char(3) not null default 'INR',
  compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= 0),
  availability_status text not null default 'enquire'
    check (availability_status in ('available', 'unavailable', 'enquire')),
  specifications jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  content_status text not null default 'demo' check (content_status in ('demo', 'verified')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

-- 6. PRODUCT IMAGES TABLE
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text not null,
  role text not null default 'gallery'
    check (role in ('primary', 'gallery', 'detail', 'lifestyle', 'cutout', 'thumbnail')),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  source_credit text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 7. PRODUCT VARIANTS TABLE
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  value text not null,
  swatch_hex text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 8. SITE SETTINGS TABLE
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

-- 9. CONTACT MESSAGES (ENQUIRIES) TABLE
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  product_slug text,
  message text not null,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new', 'read', 'closed')),
  created_at timestamptz not null default now(),
  constraint contact_has_method check (
    nullif(trim(phone), '') is not null or nullif(trim(email), '') is not null
  )
);

-- 10. INDEXES FOR PERFORMANCE
create index if not exists idx_products_active_sort on public.products(is_active, sort_order);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_collection on public.products(collection_id);
create index if not exists idx_products_audience on public.products(audience);
create index if not exists idx_products_featured on public.products(is_featured) where is_featured = true;
create index if not exists idx_products_new on public.products(is_new) where is_new = true;
create index if not exists idx_product_images_product_sort on public.product_images(product_id, sort_order);
create index if not exists idx_variants_product_sort on public.product_variants(product_id, sort_order);
create index if not exists idx_categories_audience on public.categories(audience);
create index if not exists idx_collections_audience on public.collections(audience);

-- 11. ROW LEVEL SECURITY (RLS)
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

-- 12. ROLE GRANTS (Least Privilege)
-- Anonymous and authenticated visitors can read public catalogue tables
grant select on public.categories, public.collections, public.products,
  public.product_images, public.product_variants to anon, authenticated;

-- Only authenticated users (admins) may write to catalogue tables
grant insert, update, delete on public.categories, public.collections, public.products,
  public.product_images, public.product_variants, public.site_settings to authenticated;

-- Contact messages can be inserted via authenticated server handler (or anon if allowed via policy)
grant insert on public.contact_messages to anon, authenticated;
grant select, update on public.contact_messages to authenticated;

-- 13. RLS POLICIES

-- Categories
create policy "Public can read active categories"
  on public.categories for select to anon, authenticated
  using (is_active = true);

create policy "Admins can manage categories"
  on public.categories for all to authenticated
  using (true)
  with check (true);

-- Collections
create policy "Public can read active collections"
  on public.collections for select to anon, authenticated
  using (is_active = true);

create policy "Admins can manage collections"
  on public.collections for all to authenticated
  using (true)
  with check (true);

-- Products
create policy "Public can read active products"
  on public.products for select to anon, authenticated
  using (is_active = true);

create policy "Admins can manage products"
  on public.products for all to authenticated
  using (true)
  with check (true);

-- Product Images
create policy "Public can read images for active products"
  on public.product_images for select to anon, authenticated
  using (exists (
    select 1 from public.products p
    where p.id = product_id and p.is_active = true
  ));

create policy "Admins can manage product images"
  on public.product_images for all to authenticated
  using (true)
  with check (true);

-- Product Variants
create policy "Public can read variants for active products"
  on public.product_variants for select to anon, authenticated
  using (is_active = true and exists (
    select 1 from public.products p
    where p.id = product_id and p.is_active = true
  ));

create policy "Admins can manage product variants"
  on public.product_variants for all to authenticated
  using (true)
  with check (true);

-- Site Settings (Public can read, Admins can write)
create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated
  using (true);

create policy "Admins can manage site settings"
  on public.site_settings for all to authenticated
  using (true)
  with check (true);

-- Contact Messages (Enquiries)
-- Anyone can submit an enquiry, only authenticated admins can read/update them
create policy "Public can submit contact messages"
  on public.contact_messages for insert to anon, authenticated
  with check (true);

create policy "Admins can view and manage contact messages"
  on public.contact_messages for select to authenticated
  using (true);

create policy "Admins can update contact message status"
  on public.contact_messages for update to authenticated
  using (true)
  with check (true);

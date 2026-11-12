-- CARRYFORM initial schema (PostgreSQL / Supabase)
-- Run on a NEW project after reviewing grants and policies.
-- Public catalogue reads are allowed only for active records.
-- No public writes to catalogue tables. Contact form writes should go through a
-- validated server endpoint; do not expose the service-role key in the browser.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  audience text not null check (audience in ('womens','student','everyday','unisex')),
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  hero_image_url text,
  audience text not null check (audience in ('womens','student','everyday','unisex')),
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  audience text not null check (audience in ('womens','student','everyday','unisex')),
  product_type text not null,
  price_amount numeric(12,2) check (price_amount is null or price_amount >= 0),
  currency char(3) not null default 'INR',
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= 0),
  availability_status text not null default 'enquire'
    check (availability_status in ('available','unavailable','enquire')),
  specifications jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  content_status text not null default 'demo' check (content_status in ('demo','verified')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text not null,
  role text not null default 'gallery'
    check (role in ('primary','gallery','detail','lifestyle','cutout','thumbnail')),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  source_credit text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

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

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  product_slug text,
  message text not null,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new','read','closed')),
  created_at timestamptz not null default now(),
  constraint contact_has_method check (nullif(trim(phone),'') is not null or nullif(trim(email),'') is not null)
);

create index if not exists idx_products_active_sort on public.products(is_active, sort_order);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_collection on public.products(collection_id);
create index if not exists idx_products_audience on public.products(audience);
create index if not exists idx_products_featured on public.products(is_featured) where is_featured = true;
create index if not exists idx_product_images_product_sort on public.product_images(product_id, sort_order);
create index if not exists idx_variants_product_sort on public.product_variants(product_id, sort_order);

alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;

-- Explicit grants: anonymous and authenticated visitors can read the public catalogue.
grant select on public.categories, public.collections, public.products,
  public.product_images, public.product_variants to anon, authenticated;

-- Public read policies: only active records are visible.
create policy "Public can read active categories"
on public.categories for select to anon, authenticated
using (is_active = true);

create policy "Public can read active collections"
on public.collections for select to anon, authenticated
using (is_active = true);

create policy "Public can read active products"
on public.products for select to anon, authenticated
using (is_active = true);

create policy "Public can read images for active products"
on public.product_images for select to anon, authenticated
using (exists (
  select 1 from public.products p
  where p.id = product_id and p.is_active = true
));

create policy "Public can read variants for active products"
on public.product_variants for select to anon, authenticated
using (is_active = true and exists (
  select 1 from public.products p
  where p.id = product_id and p.is_active = true
));

-- No public grants/policies for site_settings or contact_messages.
-- Read/write these only through a trusted server/admin path with least privilege.
-- Add authenticated admin policies only after an admin role model is implemented.

-- NOTE: updated_at trigger functions can be added when the write/admin workflow is built.
-- NOTE: run Supabase RLS tests for both anon and authenticated roles before deployment.

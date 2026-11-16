-- ==============================================================================
-- CARRYFORM — Demonstration Seed Data (supabase/seed.sql)
-- Commercial Distribution Seed Data
-- ==============================================================================
-- Run this seed file in the Supabase SQL Editor after 0001_initial_schema.sql.
-- Populates default categories, collections, 20 curated demo products, and site settings.
-- All data is safe, idempotent, and non-destructive.
-- ==============================================================================

-- 1. CATEGORIES
insert into public.categories (slug, name, audience, description, image_url, sort_order, is_active)
values ('handbags', 'Handbags', 'womens', null, null, 0, true)
on conflict (slug) do nothing;

insert into public.categories (slug, name, audience, description, image_url, sort_order, is_active)
values ('shoulder-bags', 'Shoulder Bags', 'womens', null, null, 0, true)
on conflict (slug) do nothing;

insert into public.categories (slug, name, audience, description, image_url, sort_order, is_active)
values ('totes', 'Tote Bags', 'womens', null, null, 0, true)
on conflict (slug) do nothing;

insert into public.categories (slug, name, audience, description, image_url, sort_order, is_active)
values ('sling-bags', 'Sling & Crossbody Bags', 'womens', null, null, 0, true)
on conflict (slug) do nothing;

insert into public.categories (slug, name, audience, description, image_url, sort_order, is_active)
values ('school-backpacks', 'School Backpacks', 'student', null, null, 0, true)
on conflict (slug) do nothing;

insert into public.categories (slug, name, audience, description, image_url, sort_order, is_active)
values ('college-backpacks', 'College Backpacks', 'student', null, null, 0, true)
on conflict (slug) do nothing;

-- 2. COLLECTIONS
insert into public.collections (slug, title, description, hero_image_url, audience, sort_order, is_featured, is_active)
values ('womens-edit', 'The Women''s Edit', 'A curated selection of handbags and everyday styles.', '/images/collections/womens-edit-hero.jpg', 'womens', 1, true, true)
on conflict (slug) do nothing;

insert into public.collections (slug, title, description, hero_image_url, audience, sort_order, is_featured, is_active)
values ('school-student', 'School & Student', 'Bags for school days, study days, and everyday routines.', '/images/collections/school-student-hero.jpg', 'student', 2, true, true)
on conflict (slug) do nothing;

insert into public.collections (slug, title, description, hero_image_url, audience, sort_order, is_featured, is_active)
values ('everyday-carry', 'Everyday Carry', 'Versatile options for the rhythm of the day.', '/images/collections/everyday-carry-hero.jpg', 'everyday', 3, true, true)
on conflict (slug) do nothing;

-- 3. PRODUCTS & PRODUCT IMAGES
do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'handbags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'forma-structured-handbag', 'Forma Structured Handbag', 'A clean-lined silhouette for everyday styling.', null, v_cat_id, v_col_id,
    'womens', 'handbag', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    true, false, 'demo', 1
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-01.jpg', 'Demo structured handbag on a neutral studio background', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'shoulder-bags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'arc-shoulder-bag', 'Arc Shoulder Bag', 'A versatile shoulder-bag for the city and beyond.', null, v_cat_id, v_col_id,
    'womens', 'shoulder_bag', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    true, true, 'demo', 2
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-02.jpg', 'Demo shoulder bag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'totes';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'daylight-tote', 'Daylight Tote', 'A roomy tote for city outings and everyday errands.', null, v_cat_id, v_col_id,
    'womens', 'tote', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    true, false, 'demo', 3
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-03.jpg', 'Demo tote bag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'sling-bags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'linea-crossbody', 'Linea Crossbody', 'A compact crossbody for hands-free days.', null, v_cat_id, v_col_id,
    'womens', 'sling', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, true, 'demo', 4
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-04.jpg', 'Demo crossbody bag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'handbags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'muse-mini-bag', 'Muse Mini Bag', 'A compact mini bag with an editorial character.', null, v_cat_id, v_col_id,
    'womens', 'handbag', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 5
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-05.jpg', 'Demo mini handbag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'shoulder-bags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'everyday-hobo', 'Everyday Hobo', 'A relaxed shoulder bag for unhurried days.', null, v_cat_id, v_col_id,
    'womens', 'shoulder_bag', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 6
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-06.jpg', 'Demo hobo bag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'totes';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'atelier-tote', 'Atelier Tote', 'A structured tote with clean, considered proportions.', null, v_cat_id, v_col_id,
    'womens', 'tote', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 7
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-07.jpg', 'Demo structured tote product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'sling-bags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'curve-sling', 'Curve Sling', 'A compact sling with a softly curved silhouette.', null, v_cat_id, v_col_id,
    'womens', 'sling', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 8
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-08.jpg', 'Demo sling bag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'handbags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'daily-carry-purse', 'Daily Carry Purse', 'A small accessories piece for the everyday essentials.', null, v_cat_id, v_col_id,
    'womens', 'purse', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 9
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-09.jpg', 'Demo purse product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'shoulder-bags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'soft-form-shoulder', 'Soft Form Shoulder Bag', 'A soft-structured shoulder bag for effortless carry.', null, v_cat_id, v_col_id,
    'womens', 'shoulder_bag', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 10
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-10.jpg', 'Demo shoulder bag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'totes';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'city-frame-tote', 'City Frame Tote', 'A city tote with a clean architectural frame.', null, v_cat_id, v_col_id,
    'womens', 'tote', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 11
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-11.jpg', 'Demo city tote product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'sling-bags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'mini-arc-crossbody', 'Mini Arc Crossbody', 'A small crossbody with an arc silhouette.', null, v_cat_id, v_col_id,
    'womens', 'sling', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 12
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-12.jpg', 'Demo crossbody bag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'handbags';
  select id into v_col_id from public.collections where slug = 'womens-edit';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'classic-day-handbag', 'Classic Day Handbag', 'A classic structured handbag for all-day carry.', null, v_cat_id, v_col_id,
    'womens', 'handbag', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 13
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-womens-13.jpg', 'Demo classic handbag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'school-backpacks';
  select id into v_col_id from public.collections where slug = 'school-student';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'orbit-school-backpack', 'Orbit School Backpack', 'A school backpack made for the everyday rhythm of study and routine.', null, v_cat_id, v_col_id,
    'student', 'school_backpack', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    true, false, 'demo', 14
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-student-01.jpg', 'Demo school backpack product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'college-backpacks';
  select id into v_col_id from public.collections where slug = 'school-student';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'campus-daypack', 'Campus Daypack', 'A college backpack ready for every new beginning.', null, v_cat_id, v_col_id,
    'student', 'college_backpack', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    true, true, 'demo', 15
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-student-02.jpg', 'Demo college backpack product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'school-backpacks';
  select id into v_col_id from public.collections where slug = 'school-student';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'stride-school-bag', 'Stride School Bag', 'A practical school bag for organised routines.', null, v_cat_id, v_col_id,
    'student', 'school_backpack', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    true, false, 'demo', 16
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-student-03.jpg', 'Demo school bag product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'college-backpacks';
  select id into v_col_id from public.collections where slug = 'school-student';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'study-route-backpack', 'Study Route Backpack', 'A college backpack for study days and daily commutes.', null, v_cat_id, v_col_id,
    'student', 'college_backpack', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 17
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-student-04.jpg', 'Demo student backpack product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'school-backpacks';
  select id into v_col_id from public.collections where slug = 'school-student';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'everyday-classic-pack', 'Everyday Classic Pack', 'A school backpack with a timeless, dependable shape.', null, v_cat_id, v_col_id,
    'student', 'school_backpack', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 18
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-student-05.jpg', 'Demo school backpack product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'college-backpacks';
  select id into v_col_id from public.collections where slug = 'school-student';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'campus-utility-pack', 'Campus Utility Pack', 'A college backpack with organised carry for study and campus life.', null, v_cat_id, v_col_id,
    'student', 'college_backpack', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 19
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-student-06.jpg', 'Demo college backpack product image', 'primary', 0);
end $$;

do $$
declare
  v_cat_id uuid;
  v_col_id uuid;
  v_prod_id uuid;
begin
  select id into v_cat_id from public.categories where slug = 'school-backpacks';
  select id into v_col_id from public.collections where slug = 'school-student';
  insert into public.products (
    slug, name, short_description, description, category_id, collection_id,
    audience, product_type, price_amount, currency, compare_at_price,
    availability_status, specifications, is_active, is_featured, is_new,
    content_status, sort_order
  ) values (
    'daily-study-backpack', 'Daily Study Backpack', 'A school and student backpack for every day of the term.', null, v_cat_id, v_col_id,
    'student', 'school_backpack', null, 'INR', null,
    'enquire', '{}'::jsonb, true,
    false, false, 'demo', 20
  )
  on conflict (slug) do update set name = excluded.name
  returning id into v_prod_id;

  delete from public.product_images where product_id = v_prod_id;
  insert into public.product_images (product_id, image_url, alt_text, role, sort_order)
  values (v_prod_id, '/images/products/demo-student-07.jpg', 'Demo student backpack product image', 'primary', 0);
end $$;

-- 4. SITE SETTINGS
insert into public.site_settings (key, value)
values ('site_config', '{"brand":"CARRYFORM","descriptor":"Bags · Accessories · Everyday Style","tagline":"Every day has a way to carry.","defaultCurrency":"INR","seo":{"defaultTitle":"CARRYFORM — Bags & Accessories","titleTemplate":"%s | CARRYFORM","defaultDescription":"Thoughtfully chosen bags for school days, city days, and everything in between. Explore handbags, totes, shoulder bags, and school backpacks.","ogImage":"/images/brand/og-default.jpg"},"landingPage":{"showroomSlugs":["forma-structured-handbag","orbit-school-backpack","arc-shoulder-bag","campus-daypack"],"selectedPiecesSlugs":["daylight-tote","linea-crossbody","muse-mini-bag","campus-utility-pack","everyday-hobo","daily-study-backpack"],"artGallerySlugs":["stride-school-bag","study-route-backpack","everyday-classic-pack"]}}'::jsonb)
on conflict (key) do update set value = excluded.value;

insert into public.site_settings (key, value)
values ('contact_info', '{"phone":null,"whatsapp":"919284086903","email":null,"address":"SAMPLE ADDRESS — replace with verified shop address before launch","openingHours":null,"socials":{"instagram":"https://www.instagram.com/","facebook":"https://www.facebook.com/","pinterest":"https://www.pinterest.com/"},"footerCredit":{"text":"Created by chrysa","url":"https://chrysaaa.vercel.app/"}}'::jsonb)
on conflict (key) do update set value = excluded.value;

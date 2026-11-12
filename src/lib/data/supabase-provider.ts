// CARRYFORM — Supabase data provider
// Used when NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
// and the initial health check query succeeds.

import type { NormalisedProduct, Product } from '@/types/product';
import type { Collection, Category } from '@/types/collection';
import type { DataProvider, ProductFilters, ProductSortKey } from './provider';
import { normaliseProduct } from './provider';

// We import the server client lazily to avoid bundling Supabase into every page
async function getClient() {
  const { createServerClient } = await import('@/lib/supabase/server');
  return createServerClient();
}

function mapProductRow(row: Record<string, unknown>, images: Record<string, unknown>[]): NormalisedProduct {
  const product: Product = {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    audience: row.audience as Product['audience'],
    type: row.product_type as Product['type'],
    categorySlug: (row.category_slug as string) ?? '',
    collectionSlugs: row.collection_slug ? [row.collection_slug as string] : [],
    shortDescription: (row.short_description as string) ?? '',
    description: row.description as string | undefined,
    price: row.price_amount as number | null,
    compareAtPrice: row.compare_at_price as number | null,
    currency: (row.currency as string) ?? 'INR',
    availability: (row.availability_status as Product['availability']) ?? 'enquire',
    images: images.map((img) => ({
      url: img.image_url as string,
      alt: (img.alt_text as string) ?? '',
      role: (img.role as Product['images'][0]['role']) ?? 'primary',
      width: img.width as number | undefined,
      height: img.height as number | undefined,
      sortOrder: img.sort_order as number | undefined,
    })).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    specifications: (row.specifications as Product['specifications']) ?? {},
    variants: [],
    flags: {
      featured: (row.is_featured as boolean) ?? false,
      new: (row.is_new as boolean) ?? false,
      active: (row.is_active as boolean) ?? true,
    },
    sortOrder: row.sort_order as number | undefined,
    contentStatus: (row.content_status as Product['contentStatus']) ?? 'demo',
  };
  return normaliseProduct(product);
}

export const supabaseProvider: DataProvider = {
  async getActiveProducts() {
    const supabase = await getClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_images(*), categories(slug), collections(slug)')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return (products ?? []).map((p: Record<string, unknown>) =>
      mapProductRow(
        { ...p, category_slug: (p.categories as Record<string, unknown>)?.slug, collection_slug: (p.collections as Record<string, unknown>)?.slug },
        (p.product_images as Record<string, unknown>[]) ?? []
      )
    );
  },

  async getFeaturedProducts(limit = 6) {
    const supabase = await getClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_images(*), categories(slug), collections(slug)')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order')
      .limit(limit);
    if (error) throw error;
    return (products ?? []).map((p: Record<string, unknown>) =>
      mapProductRow(
        { ...p, category_slug: (p.categories as Record<string, unknown>)?.slug, collection_slug: (p.collections as Record<string, unknown>)?.slug },
        (p.product_images as Record<string, unknown>[]) ?? []
      )
    );
  },

  async getNewProducts(limit = 4) {
    const supabase = await getClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_images(*), categories(slug), collections(slug)')
      .eq('is_active', true)
      .eq('is_new', true)
      .order('sort_order')
      .limit(limit);
    if (error) throw error;
    return (products ?? []).map((p: Record<string, unknown>) =>
      mapProductRow(
        { ...p, category_slug: (p.categories as Record<string, unknown>)?.slug, collection_slug: (p.collections as Record<string, unknown>)?.slug },
        (p.product_images as Record<string, unknown>[]) ?? []
      )
    );
  },

  async getProductBySlug(slug) {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*), categories(slug), collections(slug)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    if (error || !data) return null;
    const p = data as Record<string, unknown>;
    return mapProductRow(
      { ...p, category_slug: (p.categories as Record<string, unknown>)?.slug, collection_slug: (p.collections as Record<string, unknown>)?.slug },
      (p.product_images as Record<string, unknown>[]) ?? []
    );
  },

  async getProductsByCollection(collectionSlug, filters, sort) {
    const supabase = await getClient();
    let query = supabase
      .from('products')
      .select('*, product_images(*), categories(slug), collections!inner(slug)')
      .eq('is_active', true)
      .eq('collections.slug', collectionSlug);

    if (sort === 'price_asc') query = query.order('price_amount', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price_amount', { ascending: false });
    else query = query.order('sort_order');

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((p: Record<string, unknown>) =>
      mapProductRow(
        { ...p, category_slug: (p.categories as Record<string, unknown>)?.slug, collection_slug: collectionSlug },
        (p.product_images as Record<string, unknown>[]) ?? []
      )
    );
  },

  async getRelatedProducts(product, limit = 4) {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*), categories(slug), collections(slug)')
      .eq('is_active', true)
      .neq('slug', product.slug)
      .eq('audience', product.audience)
      .order('sort_order')
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((p: Record<string, unknown>) =>
      mapProductRow(
        { ...p, category_slug: (p.categories as Record<string, unknown>)?.slug, collection_slug: (p.collections as Record<string, unknown>)?.slug },
        (p.product_images as Record<string, unknown>[]) ?? []
      )
    );
  },

  async getCollections() {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return (data ?? []).map((c: Record<string, unknown>) => ({
      slug: c.slug as string,
      title: c.title as string,
      audience: c.audience as Collection['audience'],
      description: (c.description as string) ?? '',
      heroImageUrl: c.hero_image_url as string | undefined,
      isFeatured: (c.is_featured as boolean) ?? false,
      sortOrder: c.sort_order as number | undefined,
      isActive: (c.is_active as boolean) ?? true,
      contentStatus: 'verified' as const,
    }));
  },

  async getFeaturedCollections() {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order');
    if (error) throw error;
    return (data ?? []).map((c: Record<string, unknown>) => ({
      slug: c.slug as string,
      title: c.title as string,
      audience: c.audience as Collection['audience'],
      description: (c.description as string) ?? '',
      heroImageUrl: c.hero_image_url as string | undefined,
      isFeatured: (c.is_featured as boolean) ?? false,
      sortOrder: c.sort_order as number | undefined,
      isActive: (c.is_active as boolean) ?? true,
      contentStatus: 'verified' as const,
    }));
  },

  async getCollectionBySlug(slug) {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    if (error || !data) return null;
    const c = data as Record<string, unknown>;
    return {
      slug: c.slug as string,
      title: c.title as string,
      audience: c.audience as Collection['audience'],
      description: (c.description as string) ?? '',
      heroImageUrl: c.hero_image_url as string | undefined,
      isFeatured: (c.is_featured as boolean) ?? false,
      sortOrder: c.sort_order as number | undefined,
      isActive: (c.is_active as boolean) ?? true,
      contentStatus: 'verified' as const,
    };
  },

  async getCategories() {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return (data ?? []).map((c: Record<string, unknown>) => ({
      slug: c.slug as string,
      name: c.name as string,
      audience: c.audience as Category['audience'],
      description: c.description as string | undefined,
      imageUrl: c.image_url as string | undefined,
      sortOrder: c.sort_order as number | undefined,
      isActive: (c.is_active as boolean) ?? true,
    }));
  },
};


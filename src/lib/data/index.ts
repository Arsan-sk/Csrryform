// CARRYFORM — Provider index (auto-selects JSON or Supabase)
// PRD §9.1–9.2: provider selection must NOT depend on auth session.
// Selection logic: check env vars → try Supabase health query → fallback to JSON.

import type { DataProvider } from './provider';
import { jsonProvider } from './json-provider';

let _resolvedProvider: DataProvider | null = null;

async function resolveProvider(): Promise<DataProvider> {
  // Already resolved for this server instance
  if (_resolvedProvider) return _resolvedProvider;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[CARRYFORM] Supabase not configured — using JSON provider.');
    }
    _resolvedProvider = jsonProvider;
    return _resolvedProvider;
  }

  try {
    // Dynamically import to avoid bundling Supabase when not needed
    const { supabaseProvider } = await import('./supabase-provider');
    // Health check: read a small active catalogue sample
    const collections = await supabaseProvider.getFeaturedCollections();
    if (collections.length >= 0) {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[CARRYFORM] Supabase health check passed — using Supabase provider.');
      }
      _resolvedProvider = supabaseProvider;
      return _resolvedProvider;
    }
  } catch (err) {
    console.warn(
      '[CARRYFORM] Supabase health check failed — falling back to JSON provider.',
      process.env.NODE_ENV !== 'production' ? err : ''
    );
  }

  _resolvedProvider = jsonProvider;
  return _resolvedProvider;
}

// Convenience re-exports for use in Server Components / Route Handlers
export async function getProvider(): Promise<DataProvider> {
  return resolveProvider();
}

// Per-request helpers (call these from Server Components)
export async function getActiveProducts() {
  return (await getProvider()).getActiveProducts();
}
export async function getFeaturedProducts(limit?: number) {
  return (await getProvider()).getFeaturedProducts(limit);
}
export async function getNewProducts(limit?: number) {
  return (await getProvider()).getNewProducts(limit);
}
export async function getProductBySlug(slug: string) {
  return (await getProvider()).getProductBySlug(slug);
}
export async function getProductsByCollection(
  collectionSlug: string,
  filters?: Parameters<DataProvider['getProductsByCollection']>[1],
  sort?: Parameters<DataProvider['getProductsByCollection']>[2]
) {
  return (await getProvider()).getProductsByCollection(collectionSlug, filters, sort);
}
export async function getRelatedProducts(
  product: Parameters<DataProvider['getRelatedProducts']>[0],
  limit?: number
) {
  return (await getProvider()).getRelatedProducts(product, limit);
}
export async function getCollections() {
  return (await getProvider()).getCollections();
}
export async function getFeaturedCollections() {
  return (await getProvider()).getFeaturedCollections();
}
export async function getCollectionBySlug(slug: string) {
  return (await getProvider()).getCollectionBySlug(slug);
}
export async function getCategories() {
  return (await getProvider()).getCategories();
}


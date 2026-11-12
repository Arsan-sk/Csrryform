// CARRYFORM — Data Provider interface
// Both JSON and Supabase providers implement this interface.
// Components never know which provider is active.

import type { Product, NormalisedProduct } from '@/types/product';
import type { Collection, Category } from '@/types/collection';

export interface ProductFilters {
  categorySlug?: string;
  audience?: string;
  availability?: string;
}

export type ProductSortKey = 'featured' | 'newest' | 'price_asc' | 'price_desc';

export interface DataProvider {
  getActiveProducts(): Promise<NormalisedProduct[]>;
  getFeaturedProducts(limit?: number): Promise<NormalisedProduct[]>;
  getNewProducts(limit?: number): Promise<NormalisedProduct[]>;
  getProductBySlug(slug: string): Promise<NormalisedProduct | null>;
  getProductsByCollection(
    collectionSlug: string,
    filters?: ProductFilters,
    sort?: ProductSortKey
  ): Promise<NormalisedProduct[]>;
  getRelatedProducts(product: Product, limit?: number): Promise<NormalisedProduct[]>;
  getCollections(): Promise<Collection[]>;
  getFeaturedCollections(): Promise<Collection[]>;
  getCollectionBySlug(slug: string): Promise<Collection | null>;
  getCategories(): Promise<Category[]>;
}

// Normalise a raw product to ensure primaryImage is always set
export function normaliseProduct(product: Product): NormalisedProduct {
  const primaryImage =
    product.images.find((img) => img.role === 'primary') ??
    product.images[0] ??
    null;
  return { ...product, primaryImage };
}


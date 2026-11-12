// CARRYFORM — JSON data provider
// Reads from src/data/*.json files. Used by default and as fallback.

import type { NormalisedProduct, Product } from '@/types/product';
import type { Collection, Category } from '@/types/collection';
import type {
  DataProvider,
  ProductFilters,
  ProductSortKey,
} from './provider';
import { normaliseProduct } from './provider';
import { ProductSchema } from '@/lib/validation/product';
import { CollectionSchema, CategorySchema } from '@/lib/validation/collection';

import rawProducts from '@/data/products.json';
import rawCollections from '@/data/collections.json';
import rawCategories from '@/data/categories.json';

function parseProducts(): NormalisedProduct[] {
  return (rawProducts as unknown[])
    .map((p) => {
      const result = ProductSchema.safeParse(p);
      if (!result.success) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[CARRYFORM] Invalid product record:', result.error.flatten());
        }
        return null;
      }
      return normaliseProduct(result.data as Product);
    })
    .filter((p): p is NormalisedProduct => p !== null);
}

function parseCollections(): Collection[] {
  return (rawCollections as unknown[])
    .map((c) => {
      const result = CollectionSchema.safeParse(c);
      return result.success ? (result.data as Collection) : null;
    })
    .filter((c): c is Collection => c !== null);
}

function parseCategories(): Category[] {
  return (rawCategories as unknown[])
    .map((c) => {
      const result = CategorySchema.safeParse(c);
      return result.success ? (result.data as Category) : null;
    })
    .filter((c): c is Category => c !== null);
}

// Cache parsed data for the lifetime of the module
let _products: NormalisedProduct[] | null = null;
let _collections: Collection[] | null = null;
let _categories: Category[] | null = null;

function getProducts(): NormalisedProduct[] {
  if (!_products) _products = parseProducts();
  return _products;
}
function getCollections(): Collection[] {
  if (!_collections) _collections = parseCollections();
  return _collections;
}
function getCategories(): Category[] {
  if (!_categories) _categories = parseCategories();
  return _categories;
}

function sortProducts(
  products: NormalisedProduct[],
  sort?: ProductSortKey
): NormalisedProduct[] {
  const sorted = [...products];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => (a.flags.new === b.flags.new ? 0 : a.flags.new ? -1 : 1));
    case 'price_asc':
      return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case 'price_desc':
      return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'featured':
    default:
      return sorted.sort(
        (a, b) =>
          (a.flags.featured === b.flags.featured ? 0 : a.flags.featured ? -1 : 1) ||
          (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
      );
  }
}

export const jsonProvider: DataProvider = {
  async getActiveProducts() {
    return getProducts().filter((p) => p.flags.active);
  },

  async getFeaturedProducts(limit = 6) {
    return getProducts()
      .filter((p) => p.flags.active && p.flags.featured)
      .slice(0, limit);
  },

  async getNewProducts(limit = 4) {
    return getProducts()
      .filter((p) => p.flags.active && p.flags.new)
      .slice(0, limit);
  },

  async getProductBySlug(slug) {
    return getProducts().find((p) => p.slug === slug && p.flags.active) ?? null;
  },

  async getProductsByCollection(collectionSlug, filters, sort) {
    let results = getProducts().filter(
      (p) => p.flags.active && p.collectionSlugs.includes(collectionSlug)
    );
    if (filters?.categorySlug) {
      results = results.filter((p) => p.categorySlug === filters.categorySlug);
    }
    if (filters?.audience) {
      results = results.filter((p) => p.audience === filters.audience);
    }
    if (filters?.availability) {
      results = results.filter((p) => p.availability === filters.availability);
    }
    return sortProducts(results, sort);
  },

  async getRelatedProducts(product, limit = 4) {
    return getProducts()
      .filter(
        (p) =>
          p.flags.active &&
          p.slug !== product.slug &&
          (p.categorySlug === product.categorySlug ||
            p.collectionSlugs.some((s) => product.collectionSlugs.includes(s)))
      )
      .slice(0, limit);
  },

  async getCollections() {
    return getCollections().filter((c) => c.isActive !== false);
  },

  async getFeaturedCollections() {
    return getCollections().filter((c) => c.isActive !== false && c.isFeatured);
  },

  async getCollectionBySlug(slug) {
    return getCollections().find((c) => c.slug === slug && c.isActive !== false) ?? null;
  },

  async getCategories() {
    return getCategories().filter((c) => c.isActive !== false);
  },
};


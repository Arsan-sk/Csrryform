'use client';

import type { AdminContent, AdminRepository } from '@/types/admin';
import type { Product } from '@/types/product';
import type { Collection } from '@/types/collection';
import productsData from '@/data/products.json';
import collectionsData from '@/data/collections.json';
import categoriesData from '@/data/categories.json';
import siteData from '@/data/site.json';
import contactData from '@/data/contact.json';
import { ProductSchema } from '@/lib/validation/product';
import { CollectionSchema, CategorySchema } from '@/lib/validation/collection';

const STORAGE_KEY = 'carryform-admin-content-v1';

function seedContent(): AdminContent {
  return {
    products: productsData as unknown as Product[],
    collections: collectionsData as unknown as Collection[],
    categories: categoriesData as unknown as AdminContent['categories'],
    site: siteData as AdminContent['site'],
    contact: contactData as AdminContent['contact'],
    updatedAt: new Date().toISOString(),
  };
}

function parseContent(value: string | null): AdminContent | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<AdminContent>;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.collections)) return null;
    const products = parsed.products
      .map((item) => { const result = ProductSchema.safeParse(item); return result.success ? result.data as unknown as Product : null; })
      .filter((item): item is Product => item !== null);
    const collections = parsed.collections
      .map((item) => { const result = CollectionSchema.safeParse(item); return result.success ? result.data as unknown as Collection : null; })
      .filter((item): item is Collection => item !== null);
    const categories = (parsed.categories ?? [])
      .map((item) => CategorySchema.safeParse(item))
      .map((item) => { const result = CategorySchema.safeParse(item); return result.success ? result.data as unknown as AdminContent['categories'][number] : null; })
      .filter((item): item is AdminContent['categories'][number] => item !== null);
    if (!parsed.site || !parsed.contact || !products.length || !collections.length) return null;
    return {
      products,
      collections,
      categories,
      site: parsed.site,
      contact: parsed.contact,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export const localRepository: AdminRepository = {
  getContent() {
    return parseContent(window.localStorage.getItem(STORAGE_KEY)) ?? seedContent();
  },
  saveContent(content) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...content, updatedAt: new Date().toISOString() })
    );
    window.dispatchEvent(new CustomEvent('carryform-content-updated'));
  },
  resetContent() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('carryform-content-updated'));
  },
};

export { STORAGE_KEY };

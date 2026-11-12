// CARRYFORM — Zod validation schemas for products

import { z } from 'zod';

export const ProductImageSchema = z.object({
  url: z.string(),
  alt: z.string(),
  role: z.enum(['primary', 'gallery', 'detail', 'lifestyle', 'cutout', 'thumbnail']),
  width: z.number().optional(),
  height: z.number().optional(),
  sourceCredit: z.string().optional(),
  sortOrder: z.number().optional(),
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
  swatchHex: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().optional(),
});

export const ProductFlagsSchema = z.object({
  featured: z.boolean(),
  new: z.boolean(),
  active: z.boolean(),
});

export const ProductSpecificationsSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()])
).default({});

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  audience: z.enum(['womens', 'student', 'everyday', 'unisex']),
  type: z.enum([
    'handbag', 'shoulder_bag', 'tote', 'sling', 'purse',
    'school_backpack', 'college_backpack', 'everyday_backpack', 'travel_bag', 'other',
  ]),
  categorySlug: z.string(),
  collectionSlugs: z.array(z.string()),
  shortDescription: z.string(),
  description: z.string().nullable().optional(),
  price: z.number().nullable(),
  compareAtPrice: z.number().nullable().optional(),
  currency: z.string().default('INR'),
  availability: z.enum(['available', 'unavailable', 'enquire']),
  images: z.array(ProductImageSchema),
  specifications: ProductSpecificationsSchema,
  variants: z.array(ProductVariantSchema),
  flags: ProductFlagsSchema,
  sortOrder: z.number().optional(),
  contentStatus: z.enum(['demo', 'verified']),
});

export type ValidatedProduct = z.infer<typeof ProductSchema>;


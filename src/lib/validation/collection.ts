// CARRYFORM — Zod validation schemas for collections and categories

import { z } from 'zod';

export const CategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  audience: z.enum(['womens', 'student', 'everyday', 'unisex']),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional().default(true),
});

export const CollectionSchema = z.object({
  slug: z.string(),
  title: z.string(),
  audience: z.enum(['womens', 'student', 'everyday', 'unisex']),
  description: z.string(),
  heroImageUrl: z.string().optional(),
  isFeatured: z.boolean(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional().default(true),
  contentStatus: z.enum(['demo', 'verified']),
});

export type ValidatedCategory = z.infer<typeof CategorySchema>;
export type ValidatedCollection = z.infer<typeof CollectionSchema>;


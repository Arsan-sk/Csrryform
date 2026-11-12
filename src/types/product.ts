// CARRYFORM — Product TypeScript types
// Source of truth: CARRYFORM_PRD.md §9.4

export type Audience = 'womens' | 'student' | 'everyday' | 'unisex';

export type ProductType =
  | 'handbag'
  | 'shoulder_bag'
  | 'tote'
  | 'sling'
  | 'purse'
  | 'school_backpack'
  | 'college_backpack'
  | 'everyday_backpack'
  | 'travel_bag'
  | 'other';

export type AvailabilityStatus = 'available' | 'unavailable' | 'enquire';

export type ImageRole =
  | 'primary'
  | 'gallery'
  | 'detail'
  | 'lifestyle'
  | 'cutout'
  | 'thumbnail';

export type ContentStatus = 'demo' | 'verified';

export interface ProductImage {
  url: string;
  alt: string;
  role: ImageRole;
  width?: number;
  height?: number;
  sourceCredit?: string;
  sortOrder?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  swatchHex?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder?: number;
}

export interface ProductSpecifications {
  // Women's bag fields
  bagType?: string;
  dimensions?: string;
  strapType?: string;
  strapDrop?: string;
  closure?: string;
  material?: string;
  pockets?: string;
  color?: string;
  // Student bag fields
  intendedUse?: string;
  capacityLitres?: number;
  compartments?: string;
  laptopSleeveSize?: string;
  bottlePocket?: boolean;
  strapPadding?: boolean;
  backPadding?: boolean;
  careInstructions?: string;
  // Allow other known fields
  [key: string]: string | number | boolean | undefined;
}

export interface ProductFlags {
  featured: boolean;
  new: boolean;
  active: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  audience: Audience;
  type: ProductType;
  categorySlug: string;
  collectionSlugs: string[];
  shortDescription: string;
  description?: string;
  price: number | null;
  compareAtPrice?: number | null;
  currency: string;
  availability: AvailabilityStatus;
  images: ProductImage[];
  specifications: ProductSpecifications;
  variants: ProductVariant[];
  flags: ProductFlags;
  sortOrder?: number;
  contentStatus: ContentStatus;
}

export interface NormalisedProduct extends Product {
  primaryImage: ProductImage | null;
}


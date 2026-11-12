// CARRYFORM — Collection & Category TypeScript types

import type { Audience, ContentStatus } from './product';

export interface Category {
  slug: string;
  name: string;
  audience: Audience;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Collection {
  slug: string;
  title: string;
  audience: Audience;
  description: string;
  heroImageUrl?: string;
  isFeatured: boolean;
  sortOrder?: number;
  isActive?: boolean;
  contentStatus: ContentStatus;
}


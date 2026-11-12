import type { Collection, Category } from './collection';
import type { Product } from './product';
import type { ContactInfo, SiteSettings } from './site';

export interface AdminContent {
  products: Product[];
  collections: Collection[];
  categories: Category[];
  site: SiteSettings;
  contact: ContactInfo;
  updatedAt: string;
}

export interface AdminRepository {
  getContent(): AdminContent;
  saveContent(content: AdminContent): void;
  resetContent(): void;
}

export type Panel = 'overview' | 'products' | 'collections' | 'content';

export const panelMeta: Record<Panel, { label: string; icon: string }> = {
  overview: { label: 'Overview', icon: 'Homepage' },
  products: { label: 'All Products', icon: 'Inventory' },
  collections: { label: 'Collections', icon: 'Category' },
  content: { label: 'Content', icon: 'Edit' },
};
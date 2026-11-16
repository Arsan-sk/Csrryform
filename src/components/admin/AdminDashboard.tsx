'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AdminContent } from '@/types/admin';
import type { Product } from '@/types/product';
import { clearAdminSession, hasAdminSession } from '@/lib/admin-auth';
import { localRepository } from '@/lib/data/local-repository';
import { ToastProvider, useToast } from './ToastContext';
import { ProductTable } from './ProductTable';
import { ProductFilters, type ProductFilterState } from './ProductFilters';
import { BulkActionsBar } from './BulkActionsBar';
import { ProductModal } from './ProductModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

type Panel = 'overview' | 'products' | 'collections' | 'content';

const panelMeta: Record<Panel, { label: string; icon: string }> = {
  overview: { label: 'Overview', icon: '⌂' },
  products: { label: 'Products', icon: '▦' },
  collections: { label: 'Collections', icon: '◇' },
  content: { label: 'Content', icon: '✦' },
};

const defaultFilterState: ProductFilterState = {
  search: '',
  category: 'all',
  collection: 'all',
  audience: 'all',
  status: 'all',
  featured: 'all',
  isNew: 'all',
};

const emptyProduct: Product = {
  id: '',
  slug: '',
  name: '',
  audience: 'womens',
  type: 'handbag',
  categorySlug: '',
  collectionSlugs: [],
  shortDescription: '',
  description: '',
  price: null,
  currency: 'INR',
  availability: 'enquire',
  images: [],
  specifications: {},
  variants: [],
  flags: { featured: false, new: false, active: true },
  contentStatus: 'demo',
};

export function AdminDashboard() {
  return (
    <ToastProvider>
      <AdminDashboardInner />
    </ToastProvider>
  );
}

function AdminDashboardInner() {
  const router = useRouter();
  const toast = useToast();

  const [panel, setPanel] = useState<Panel>('overview');
  const [content, setContent] = useState<AdminContent | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilterState>(defaultFilterState);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; items: Product[] }>({
    isOpen: false,
    items: [],
  });

  // Verify Development Admin Session
  useEffect(() => {
    if (!hasAdminSession()) {
      router.replace('/admin');
      return;
    }
    const timer = window.setTimeout(() => {
      try {
        const loaded = localRepository.getContent();
        setContent(loaded);
      } catch (err) {
        console.error('Failed to load local repository content:', err);
        toast.error('Could not load catalogue from storage; restored demo seeds.');
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router, toast]);

  // Save content helper
  function persistChanges(next: AdminContent, successMessage: string) {
    try {
      localRepository.saveContent(next);
      setContent({ ...next, updatedAt: new Date().toISOString() });
      toast.success(successMessage);
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Unable to save changes to browser local storage.');
    }
  }

  function handleSignOut() {
    clearAdminSession();
    toast.info('Signed out of admin workspace');
    router.replace('/admin');
  }

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    if (!content) return [];
    return content.products.filter((product) => {
      // Search by name or slug
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const match =
          product.name.toLowerCase().includes(q) ||
          product.slug.toLowerCase().includes(q) ||
          product.shortDescription.toLowerCase().includes(q);
        if (!match) return false;
      }
      // Audience
      if (filters.audience !== 'all' && product.audience !== filters.audience) {
        return false;
      }
      // Category
      if (filters.category !== 'all' && product.categorySlug !== filters.category) {
        return false;
      }
      // Collection
      if (filters.collection !== 'all' && !product.collectionSlugs.includes(filters.collection)) {
        return false;
      }
      // Status
      if (filters.status === 'active' && !product.flags.active) return false;
      if (filters.status === 'hidden' && product.flags.active) return false;
      // Featured
      if (filters.featured === 'featured' && !product.flags.featured) return false;
      if (filters.featured === 'standard' && product.flags.featured) return false;
      // New
      if (filters.isNew === 'new' && !product.flags.new) return false;
      if (filters.isNew === 'standard' && product.flags.new) return false;

      return true;
    });
  }, [content, filters]);

  // Product Selection Handlers
  function toggleSelectProduct(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function selectAllVisible() {
    setSelectedIds(filteredProducts.map((p) => p.id));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  // Save product from modal
  function handleSaveProduct(savedProduct: Product) {
    if (!content) return;
    const exists = content.products.some((p) => p.id === savedProduct.id);
    let updatedProducts: Product[];

    if (exists) {
      updatedProducts = content.products.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      persistChanges({ ...content, products: updatedProducts }, `"${savedProduct.name}" updated successfully.`);
    } else {
      const newProductWithId = {
        ...savedProduct,
        id: savedProduct.id || `prod-${Date.now()}`,
      };
      updatedProducts = [newProductWithId, ...content.products];
      persistChanges({ ...content, products: updatedProducts }, `"${savedProduct.name}" created successfully.`);
    }

    setEditingProduct(null);
  }

  // Confirm delete handler
  function handleConfirmDelete() {
    if (!content || deleteDialog.items.length === 0) return;
    const idsToDelete = new Set(deleteDialog.items.map((i) => i.id));
    const nextProducts = content.products.filter((p) => !idsToDelete.has(p.id));

    // Clear deleted items from selection
    setSelectedIds((prev) => prev.filter((id) => !idsToDelete.has(id)));

    const count = deleteDialog.items.length;
    const msg = count === 1 ? `Deleted "${deleteDialog.items[0].name}" successfully.` : `Deleted ${count} products successfully.`;

    persistChanges({ ...content, products: nextProducts }, msg);
    setDeleteDialog({ isOpen: false, items: [] });
  }

  // Single item flag toggles
  function toggleProductActive(product: Product) {
    if (!content) return;
    const nextActive = !product.flags.active;
    const updated = content.products.map((p) =>
      p.id === product.id ? { ...p, flags: { ...p.flags, active: nextActive } } : p
    );
    persistChanges(
      { ...content, products: updated },
      `"${product.name}" is now ${nextActive ? 'Active in showroom' : 'Hidden from catalogue'}.`
    );
  }

  function toggleProductFeatured(product: Product) {
    if (!content) return;
    const nextFeatured = !product.flags.featured;
    const updated = content.products.map((p) =>
      p.id === product.id ? { ...p, flags: { ...p.flags, featured: nextFeatured } } : p
    );
    persistChanges(
      { ...content, products: updated },
      `"${product.name}" ${nextFeatured ? 'marked as Featured' : 'removed from Featured'}.`
    );
  }

  function toggleProductNew(product: Product) {
    if (!content) return;
    const nextNew = !product.flags.new;
    const updated = content.products.map((p) =>
      p.id === product.id ? { ...p, flags: { ...p.flags, new: nextNew } } : p
    );
    persistChanges(
      { ...content, products: updated },
      `"${product.name}" ${nextNew ? 'marked with NEW badge' : 'NEW badge removed'}.`
    );
  }

  // Bulk operations
  function bulkSetActive(active: boolean) {
    if (!content || selectedIds.length === 0) {
      toast.warning('No products selected for bulk action.');
      return;
    }
    const idSet = new Set(selectedIds);
    const updated = content.products.map((p) =>
      idSet.has(p.id) ? { ...p, flags: { ...p.flags, active } } : p
    );
    persistChanges({ ...content, products: updated }, `${selectedIds.length} products ${active ? 'activated' : 'hidden'}.`);
  }

  function bulkSetFeatured(featured: boolean) {
    if (!content || selectedIds.length === 0) {
      toast.warning('No products selected for bulk action.');
      return;
    }
    const idSet = new Set(selectedIds);
    const updated = content.products.map((p) =>
      idSet.has(p.id) ? { ...p, flags: { ...p.flags, featured } } : p
    );
    persistChanges({ ...content, products: updated }, `${selectedIds.length} products ${featured ? 'marked featured' : 'unfeatured'}.`);
  }

  function bulkSetNew(isNew: boolean) {
    if (!content || selectedIds.length === 0) {
      toast.warning('No products selected for bulk action.');
      return;
    }
    const idSet = new Set(selectedIds);
    const updated = content.products.map((p) =>
      idSet.has(p.id) ? { ...p, flags: { ...p.flags, new: isNew } } : p
    );
    persistChanges({ ...content, products: updated }, `${selectedIds.length} products ${isNew ? 'badged as NEW' : 'NEW badge removed'}.`);
  }

  function triggerBulkDelete() {
    if (!content || selectedIds.length === 0) {
      toast.warning('No products selected for deletion.');
      return;
    }
    const idSet = new Set(selectedIds);
    const itemsToDelete = content.products.filter((p) => idSet.has(p.id));
    setDeleteDialog({ isOpen: true, items: itemsToDelete });
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center p-8">
          <p className="font-serif text-2xl text-espresso mb-2">Loading CARRYFORM studio…</p>
          <p className="text-xs font-mono text-espresso/40 uppercase tracking-widest">
            Connecting to local demonstration repository
          </p>
        </div>
      </div>
    );
  }

  const featuredCount = content.products.filter((p) => p.flags.featured && p.flags.active).length;

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <Link href="/" className="font-serif text-2xl tracking-tight text-espresso hover:text-wine transition-colors">
          CARRYFORM
        </Link>
        <p className="font-mono text-[10px] tracking-[0.24em] text-espresso/40 uppercase mt-2">
          Content studio
        </p>

        <nav className="admin-nav" aria-label="Admin navigation">
          {(['overview', 'products', 'collections', 'content'] as Panel[]).map((item) => (
            <button
              key={item}
              onClick={() => setPanel(item)}
              className={`admin-nav-item ${panel === item ? 'is-active' : ''}`}
            >
              <span className="admin-nav-icon" aria-hidden="true">
                {panelMeta[item].icon}
              </span>
              <span>{panelMeta[item].label}</span>
            </button>
          ))}
          <button onClick={handleSignOut} className="admin-nav-item admin-nav-logout">
            <span className="admin-nav-icon" aria-hidden="true">
              ↪
            </span>
            <span>Logout</span>
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t border-espresso/10">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-espresso/55 hover:text-wine flex items-center gap-1 mb-3 transition-colors"
          >
            <span>View live site</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <button onClick={handleSignOut} className="text-xs text-wine hover:underline block text-left">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-wine mb-1.5 font-medium">
              The art of carrying
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso tracking-tight">
              {panel === 'overview'
                ? 'Showroom Studio.'
                : panel === 'products'
                ? 'Product Catalogue'
                : panel === 'collections'
                ? 'Collections'
                : 'Website Content & SEO'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {panel === 'products' && (
              <button
                type="button"
                onClick={() =>
                  setEditingProduct({
                    ...emptyProduct,
                    id: `local-${Date.now()}`,
                    slug: `new-piece-${Date.now().toString().slice(-4)}`,
                    categorySlug: content.categories[0]?.slug || '',
                  })
                }
                className="admin-primary text-xs font-medium py-2.5 px-4 rounded-sm shadow-xs active:scale-98"
              >
                + Add New Product
              </button>
            )}
          </div>
        </header>

        {/* PANEL 1: OVERVIEW */}
        {panel === 'overview' && (
          <OverviewPanel content={content} featuredCount={featuredCount} onNavigate={setPanel} />
        )}

        {/* PANEL 2: PRODUCTS */}
        {panel === 'products' && (
          <section aria-labelledby="products-panel-heading">
            <h2 id="products-panel-heading" className="sr-only">
              Product Catalogue
            </h2>

            {/* Composable Filters */}
            <ProductFilters
              filters={filters}
              categories={content.categories}
              collections={content.collections}
              onChange={setFilters}
              onClear={() => setFilters(defaultFilterState)}
              totalFiltered={filteredProducts.length}
              totalProducts={content.products.length}
            />

            {/* Bulk Actions Sticky Toolbar */}
            <BulkActionsBar
              selectedCount={selectedIds.length}
              totalFiltered={filteredProducts.length}
              onActivate={() => bulkSetActive(true)}
              onDeactivate={() => bulkSetActive(false)}
              onMarkFeatured={() => bulkSetFeatured(true)}
              onRemoveFeatured={() => bulkSetFeatured(false)}
              onMarkNew={() => bulkSetNew(true)}
              onRemoveNew={() => bulkSetNew(false)}
              onDelete={triggerBulkDelete}
              onClear={clearSelection}
            />

            {/* Product Table */}
            <ProductTable
              products={filteredProducts}
              categories={content.categories}
              collections={content.collections}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelectProduct}
              onSelectAllVisible={selectAllVisible}
              onClearSelection={clearSelection}
              onEdit={setEditingProduct}
              onDelete={(p) => setDeleteDialog({ isOpen: true, items: [p] })}
              onToggleActive={toggleProductActive}
              onToggleFeatured={toggleProductFeatured}
              onToggleNew={toggleProductNew}
            />
          </section>
        )}

        {/* PANEL 3: COLLECTIONS */}
        {panel === 'collections' && <CollectionsPanel content={content} onSave={persistChanges} />}

        {/* PANEL 4: CONTENT & SEO */}
        {panel === 'content' && <ContentPanel content={content} onSave={persistChanges} />}
      </main>

      {/* Product Modal Editor */}
      {editingProduct && (
        <ProductModal
          isOpen={true}
          product={editingProduct}
          collections={content.collections}
          categories={content.categories}
          existingSlugs={content.products.map((p) => p.slug)}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.items.length > 1 ? 'Delete Selected Products' : 'Delete Product'}
        itemCount={deleteDialog.items.length}
        itemName={deleteDialog.items[0]?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, items: [] })}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-panel components
// -----------------------------------------------------------------------------

function OverviewPanel({
  content,
  featuredCount,
  onNavigate,
}: {
  content: AdminContent;
  featuredCount: number;
  onNavigate: (panel: Panel) => void;
}) {
  const womensCount = content.products.filter((p) => p.audience === 'womens').length;
  const studentCount = content.products.filter((p) => p.audience === 'student').length;
  const activeCount = content.products.filter((p) => p.flags.active).length;

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active in Showroom', value: activeCount, sub: `of ${content.products.length} total` },
          { label: "Women's Collection", value: womensCount, sub: 'Handbags & totes' },
          { label: 'School & Student', value: studentCount, sub: 'Campus packs' },
          { label: 'Featured Pieces', value: featuredCount, sub: 'Prioritized spotlight' },
        ].map((item) => (
          <div className="admin-stat rounded-sm shadow-xs" key={item.label}>
            <span className="font-mono uppercase tracking-wider">{item.label}</span>
            <strong className="text-espresso">{item.value}</strong>
            <p className="text-[11px] text-espresso/45 mt-1 font-mono">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Cards Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="admin-card rounded-sm space-y-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-wine font-medium">Quick Workflows</p>
          <div className="divide-y divide-espresso/10">
            <button
              onClick={() => onNavigate('products')}
              className="admin-action py-3 hover:text-wine flex items-center justify-between w-full text-left"
            >
              <span>Manage &amp; filter catalogue</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              onClick={() => onNavigate('collections')}
              className="admin-action py-3 hover:text-wine flex items-center justify-between w-full text-left"
            >
              <span>Configure collections &amp; featured banners</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              onClick={() => onNavigate('content')}
              className="admin-action py-3 hover:text-wine flex items-center justify-between w-full text-left"
            >
              <span>Update brand story &amp; SEO metadata</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="admin-card rounded-sm space-y-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-wine font-medium">Repository Architecture</p>
          <p className="text-xs sm:text-sm leading-relaxed text-espresso/70">
            <strong>Demonstration Mode Active:</strong> Product updates and catalogue changes are safely isolated in your browser&apos;s localStorage repository.
          </p>
          <div className="bg-espresso/5 p-3 rounded-sm border border-espresso/10 text-xs font-mono space-y-1">
            <p className="text-espresso/70">• Data Provider: Local JSON Seed + Browser Repository</p>
            <p className="text-espresso/70">• Supabase Migration: <code>supabase/migrations/0001_initial_schema.sql</code> ready</p>
            <p className="text-espresso/70">• Last saved: {new Date(content.updatedAt).toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionsPanel({
  content,
  onSave,
}: {
  content: AdminContent;
  onSave: (content: AdminContent, message: string) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {content.collections.map((collection) => {
        const associatedCount = content.products.filter((p) => p.collectionSlugs.includes(collection.slug)).length;
        return (
          <div className="admin-card rounded-sm space-y-4" key={collection.slug}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-wine font-medium">
                  {collection.audience} Edit
                </span>
                <h3 className="font-serif text-2xl text-espresso mt-1">{collection.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = content.collections.map((col) =>
                    col.slug === collection.slug ? { ...col, isFeatured: !col.isFeatured } : col
                  );
                  onSave(
                    { ...content, collections: updated },
                    `"${collection.title}" is now ${!collection.isFeatured ? 'Featured' : 'Standard'}.`
                  );
                }}
                className={`status-pill ${collection.isFeatured ? 'is-on' : ''}`}
                title="Toggle featured status"
              >
                {collection.isFeatured ? 'Featured Door' : 'Standard'}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">{collection.description}</p>

            <div className="pt-3 border-t border-espresso/10 flex items-center justify-between text-xs font-mono text-espresso/50">
              <span>{associatedCount} Products assigned</span>
              <span className="text-wine">Slug: /{collection.slug}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ContentPanel({
  content,
  onSave,
}: {
  content: AdminContent;
  onSave: (content: AdminContent, message: string) => void;
}) {
  const [site, setSite] = useState(content.site);
  const [contact, setContact] = useState(content.contact);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Form */}
      <form
        className="admin-card rounded-sm space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...content, site, contact }, 'Website content & metadata saved successfully.');
        }}
      >
        <h3 className="font-serif text-xl text-espresso pb-2 border-b border-espresso/10">Brand Identity &amp; SEO</h3>

        <div>
          <label className="text-xs font-medium text-espresso block mb-1">Brand Name</label>
          <input
            type="text"
            className="admin-input text-xs"
            value={site.brand}
            onChange={(e) => setSite({ ...site, brand: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-espresso block mb-1">Descriptor / Subtitle</label>
          <input
            type="text"
            className="admin-input text-xs"
            value={site.descriptor}
            onChange={(e) => setSite({ ...site, descriptor: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-espresso block mb-1">Tagline</label>
          <input
            type="text"
            className="admin-input text-xs"
            value={site.tagline}
            onChange={(e) => setSite({ ...site, tagline: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-espresso block mb-1">SEO Description</label>
          <textarea
            rows={3}
            className="admin-input text-xs"
            value={site.seo.defaultDescription}
            onChange={(e) =>
              setSite({ ...site, seo: { ...site.seo, defaultDescription: e.target.value } })
            }
          />
        </div>

        <h3 className="font-serif text-xl text-espresso pt-4 pb-2 border-b border-espresso/10">
          Contact Details &amp; Creator Credit
        </h3>

        <div>
          <label className="text-xs font-medium text-espresso block mb-1">Showroom Address</label>
          <input
            type="text"
            className="admin-input text-xs"
            value={contact.address}
            onChange={(e) => setContact({ ...contact, address: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-espresso block mb-1">Contact Email</label>
          <input
            type="email"
            className="admin-input text-xs"
            value={contact.email || ''}
            onChange={(e) => setContact({ ...contact, email: e.target.value || null })}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-espresso block mb-1">Footer Creator Credit Text</label>
          <input
            type="text"
            className="admin-input text-xs"
            value={contact.footerCredit.text}
            onChange={(e) =>
              setContact({
                ...contact,
                footerCredit: { ...contact.footerCredit, text: e.target.value },
              })
            }
          />
        </div>

        <div className="pt-4">
          <button type="submit" className="admin-primary text-xs font-medium py-2.5 px-6 rounded-sm shadow-xs">
            Save All Content Changes
          </button>
        </div>
      </form>

      {/* Guide & Reset */}
      <div className="space-y-6">
        <div className="admin-card rounded-sm space-y-3">
          <h3 className="font-serif text-xl text-espresso">Media &amp; Asset Guidance</h3>
          <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
            The demonstration catalogue references local assets located under <code>/public/images/</code>. In commercial deployments with Supabase, image binaries are uploaded to the <code>product-media</code> Supabase Storage bucket and protected via Row Level Security.
          </p>
        </div>

        <div className="admin-card rounded-sm border border-wine/20 bg-wine/5 p-5 space-y-3">
          <h3 className="font-serif text-lg text-wine">Reset Local Demonstration Content</h3>
          <p className="text-xs text-espresso/70 leading-relaxed">
            Restores the initial sample catalogue and brand settings directly from the verified JSON seed files, discarding all browser-local modifications.
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all local content to the original verified demo catalogue? This will clear browser changes.')) {
                localRepository.resetContent();
                window.location.reload();
              }
            }}
            className="text-xs font-medium bg-wine text-white px-4 py-2 rounded-sm hover:bg-wine/90 transition-colors"
          >
            Reset Demo Content
          </button>
        </div>
      </div>
    </div>
  );
}

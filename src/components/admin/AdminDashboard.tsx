'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AdminContent } from '@/types/admin';
import type { Product } from '@/types/product';
import type { LandingPageConfig } from '@/types/site';
import { clearAdminSession, hasAdminSession } from '@/lib/admin-auth';
import { localRepository } from '@/lib/data/local-repository';
import { ToastProvider, useToast } from './ToastContext';
import { ProductTable, validateProductSectionEligibility } from './ProductTable';
import { ProductFilters, type ProductFilterState } from './ProductFilters';
import { BulkActionsBar } from './BulkActionsBar';
import { ProductModal } from './ProductModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

type Panel = 'overview' | 'products' | 'collections' | 'content';

const panelMeta: Record<Panel, { label: string; icon: string }> = {
  overview: { label: 'Overview', icon: '⌂' },
  products: { label: 'All Products', icon: '▦' },
  collections: { label: 'Collections', icon: '◇' },
  content: { label: 'Content', icon: '✦' },
};

const defaultFilterState: ProductFilterState = {
  search: '',
  category: 'all',
  collection: 'all',
  audience: 'all',
  section: 'all',
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

  // Persist changes helper
  function persistChanges(next: AdminContent, successMessage: string) {
    try {
      localRepository.saveContent(next);
      setContent({ ...next, updatedAt: new Date().toISOString() });
      toast.success(successMessage);

      // If landingPage config is present, also sync with Supabase database if configured
      if (next.site?.landingPage) {
        fetch('/api/admin/landing-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ landingPage: next.site.landingPage }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.mode === 'supabase') {
              console.info('[CARRYFORM Admin] Synced section assignments to Supabase DB.');
            }
          })
          .catch((err) => {
            console.warn('[CARRYFORM Admin] Could not sync with API endpoint:', err);
          });
      }
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

  // Active landing page config with safe defaults
  const currentLandingPage: LandingPageConfig = useMemo(() => {
    if (!content?.site?.landingPage) {
      return {
        showroomSlugs: [
          'forma-structured-handbag',
          'orbit-school-backpack',
          'arc-shoulder-bag',
          'campus-daypack',
        ],
        selectedPiecesSlugs: [
          'daylight-tote',
          'linea-crossbody',
          'muse-mini-bag',
          'campus-utility-pack',
          'everyday-hobo',
          'daily-study-backpack',
        ],
        artGallerySlugs: [
          'stride-school-bag',
          'study-route-backpack',
          'everyday-classic-pack',
        ],
      };
    }
    return {
      showroomSlugs: content.site.landingPage.showroomSlugs || [],
      selectedPiecesSlugs: content.site.landingPage.selectedPiecesSlugs || [],
      artGallerySlugs: content.site.landingPage.artGallerySlugs || [],
    };
  }, [content?.site?.landingPage]);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    if (!content) return [];
    return content.products.filter((product) => {
      // Search by name, slug, or shortDescription
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
      // Section Assignment Filter
      if (filters.section !== 'all') {
        const inShowroom = currentLandingPage.showroomSlugs.includes(product.slug);
        const inSelected = currentLandingPage.selectedPiecesSlugs.includes(product.slug);
        const inGallery = currentLandingPage.artGallerySlugs.includes(product.slug);

        if (filters.section === 'showroom' && !inShowroom) return false;
        if (filters.section === 'selectedPieces' && !inSelected) return false;
        if (filters.section === 'artGallery' && !inGallery) return false;
        if (filters.section === 'unassigned' && (inShowroom || inSelected || inGallery)) return false;
      }

      return true;
    });
  }, [content, filters, currentLandingPage]);

  // Product Selection Handlers
  function toggleSelectProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function selectAllVisible() {
    setSelectedIds(filteredProducts.map((p) => p.id));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  // Save product from modal
  function handleSaveProduct(
    savedProduct: Product,
    sectionAssignments?: { showroom: boolean; selectedPieces: boolean; artGallery: boolean }
  ) {
    if (!content) return;
    const exists = content.products.some((p) => p.id === savedProduct.id);
    let updatedProducts: Product[];

    if (exists) {
      updatedProducts = content.products.map((p) =>
        p.id === savedProduct.id ? savedProduct : p
      );
    } else {
      const newProductWithId = {
        ...savedProduct,
        id: savedProduct.id || `prod-${Date.now()}`,
      };
      updatedProducts = [newProductWithId, ...content.products];
    }

    // Also update landing page section assignments if provided
    let updatedLandingPage = { ...currentLandingPage };
    if (sectionAssignments) {
      const slug = savedProduct.slug;

      // Showroom
      if (sectionAssignments.showroom) {
        if (!updatedLandingPage.showroomSlugs.includes(slug)) {
          updatedLandingPage.showroomSlugs = [...updatedLandingPage.showroomSlugs, slug];
        }
      } else {
        updatedLandingPage.showroomSlugs = updatedLandingPage.showroomSlugs.filter(
          (s) => s !== slug
        );
      }

      // Selected Pieces (Max 6)
      if (sectionAssignments.selectedPieces) {
        if (!updatedLandingPage.selectedPiecesSlugs.includes(slug)) {
          updatedLandingPage.selectedPiecesSlugs = [
            ...updatedLandingPage.selectedPiecesSlugs.slice(0, 5),
            slug,
          ];
        }
      } else {
        updatedLandingPage.selectedPiecesSlugs = updatedLandingPage.selectedPiecesSlugs.filter(
          (s) => s !== slug
        );
      }

      // Art Gallery / Ready for a New Beginning (Max 3)
      if (sectionAssignments.artGallery) {
        if (!updatedLandingPage.artGallerySlugs.includes(slug)) {
          updatedLandingPage.artGallerySlugs = [
            ...updatedLandingPage.artGallerySlugs.slice(0, 2),
            slug,
          ];
        }
      } else {
        updatedLandingPage.artGallerySlugs = updatedLandingPage.artGallerySlugs.filter(
          (s) => s !== slug
        );
      }
    }

    const updatedSite = {
      ...content.site,
      landingPage: updatedLandingPage,
    };

    persistChanges(
      { ...content, products: updatedProducts, site: updatedSite },
      `"${savedProduct.name}" saved successfully.`
    );
    setEditingProduct(null);
  }

  // Toggle single product section assignment directly from table
  function handleToggleSection(
    product: Product,
    section: 'showroom' | 'selectedPieces' | 'artGallery'
  ) {
    if (!content) return;
    const slug = product.slug;
    let nextLp = { ...currentLandingPage };

    if (section === 'showroom') {
      const isAssigned = nextLp.showroomSlugs.includes(slug);
      if (isAssigned) {
        nextLp.showroomSlugs = nextLp.showroomSlugs.filter((s) => s !== slug);
        persistChanges(
          { ...content, site: { ...content.site, landingPage: nextLp } },
          `"${product.name}" removed from Showroom.`
        );
      } else {
        const check = validateProductSectionEligibility(product, 'showroom');
        if (!check.eligible) {
          toast.error(`Cannot assign to Showroom: ${check.reason}`);
          return;
        }
        nextLp.showroomSlugs = [...nextLp.showroomSlugs, slug];
        persistChanges(
          { ...content, site: { ...content.site, landingPage: nextLp } },
          `"${product.name}" assigned to Chapter 4 Showroom.`
        );
      }
    } else if (section === 'selectedPieces') {
      const isAssigned = nextLp.selectedPiecesSlugs.includes(slug);
      if (isAssigned) {
        nextLp.selectedPiecesSlugs = nextLp.selectedPiecesSlugs.filter((s) => s !== slug);
        persistChanges(
          { ...content, site: { ...content.site, landingPage: nextLp } },
          `"${product.name}" removed from Selected Pieces.`
        );
      } else {
        const check = validateProductSectionEligibility(product, 'selectedPieces');
        if (!check.eligible) {
          toast.error(`Cannot assign to Selected Pieces: ${check.reason}`);
          return;
        }
        if (nextLp.selectedPiecesSlugs.length >= 6) {
          toast.warning('Selected Pieces has reached its maximum limit of 6 products.');
          return;
        }
        nextLp.selectedPiecesSlugs = [...nextLp.selectedPiecesSlugs, slug];
        persistChanges(
          { ...content, site: { ...content.site, landingPage: nextLp } },
          `"${product.name}" assigned to Selected Pieces (${nextLp.selectedPiecesSlugs.length}/6).`
        );
      }
    } else if (section === 'artGallery') {
      const isAssigned = nextLp.artGallerySlugs.includes(slug);
      if (isAssigned) {
        nextLp.artGallerySlugs = nextLp.artGallerySlugs.filter((s) => s !== slug);
        persistChanges(
          { ...content, site: { ...content.site, landingPage: nextLp } },
          `"${product.name}" removed from Art Gallery.`
        );
      } else {
        const check = validateProductSectionEligibility(product, 'artGallery');
        if (!check.eligible) {
          toast.error(`Cannot assign to Art Gallery: ${check.reason}`);
          return;
        }
        if (nextLp.artGallerySlugs.length >= 3) {
          toast.warning('Chapter 5 Art Gallery has reached its maximum limit of 3 products.');
          return;
        }
        nextLp.artGallerySlugs = [...nextLp.artGallerySlugs, slug];
        persistChanges(
          { ...content, site: { ...content.site, landingPage: nextLp } },
          `"${product.name}" assigned to Chapter 5 Art Gallery (${nextLp.artGallerySlugs.length}/3).`
        );
      }
    }
  }

  // Bulk assign to section
  function handleBulkAssignSection(section: 'showroom' | 'selectedPieces' | 'artGallery') {
    if (!content || selectedIds.length === 0) return;
    const selectedProducts = content.products.filter((p) => selectedIds.includes(p.id));
    let nextLp = { ...currentLandingPage };
    let addedCount = 0;
    let skippedReasons: string[] = [];

    for (const p of selectedProducts) {
      if (section === 'showroom') {
        if (!nextLp.showroomSlugs.includes(p.slug)) {
          const check = validateProductSectionEligibility(p, 'showroom');
          if (check.eligible) {
            nextLp.showroomSlugs.push(p.slug);
            addedCount++;
          } else {
            skippedReasons.push(`${p.name}: ${check.reason}`);
          }
        }
      } else if (section === 'selectedPieces') {
        if (!nextLp.selectedPiecesSlugs.includes(p.slug)) {
          if (nextLp.selectedPiecesSlugs.length >= 6) {
            skippedReasons.push('Reached maximum limit of 6 products for Selected Pieces');
            break;
          }
          const check = validateProductSectionEligibility(p, 'selectedPieces');
          if (check.eligible) {
            nextLp.selectedPiecesSlugs.push(p.slug);
            addedCount++;
          } else {
            skippedReasons.push(`${p.name}: ${check.reason}`);
          }
        }
      } else if (section === 'artGallery') {
        if (!nextLp.artGallerySlugs.includes(p.slug)) {
          if (nextLp.artGallerySlugs.length >= 3) {
            skippedReasons.push('Reached maximum limit of 3 products for Art Gallery');
            break;
          }
          const check = validateProductSectionEligibility(p, 'artGallery');
          if (check.eligible) {
            nextLp.artGallerySlugs.push(p.slug);
            addedCount++;
          } else {
            skippedReasons.push(`${p.name}: ${check.reason}`);
          }
        }
      }
    }

    if (addedCount > 0) {
      persistChanges(
        { ...content, site: { ...content.site, landingPage: nextLp } },
        `Assigned ${addedCount} product(s) to ${
          section === 'showroom'
            ? 'Showroom'
            : section === 'selectedPieces'
            ? 'Selected Pieces'
            : 'Art Gallery'
        }.`
      );
    }
    if (skippedReasons.length > 0) {
      toast.warning(`Some items skipped: ${skippedReasons.slice(0, 2).join('; ')}`);
    }
  }

  // Bulk remove from sections
  function handleBulkRemoveFromSections() {
    if (!content || selectedIds.length === 0) return;
    const selectedSlugs = new Set(
      content.products.filter((p) => selectedIds.includes(p.id)).map((p) => p.slug)
    );
    let nextLp = {
      showroomSlugs: currentLandingPage.showroomSlugs.filter((s) => !selectedSlugs.has(s)),
      selectedPiecesSlugs: currentLandingPage.selectedPiecesSlugs.filter((s) => !selectedSlugs.has(s)),
      artGallerySlugs: currentLandingPage.artGallerySlugs.filter((s) => !selectedSlugs.has(s)),
    };
    persistChanges(
      { ...content, site: { ...content.site, landingPage: nextLp } },
      `Cleared section assignments for ${selectedIds.length} selected product(s).`
    );
  }

  // Confirm delete handler
  function handleConfirmDelete() {
    if (!content || deleteDialog.items.length === 0) return;
    const idsToDelete = new Set(deleteDialog.items.map((i) => i.id));
    const slugsToDelete = new Set(deleteDialog.items.map((i) => i.slug));

    const nextProducts = content.products.filter((p) => !idsToDelete.has(p.id));

    // Also remove deleted products from all landing page sections
    const nextLandingPage = {
      showroomSlugs: currentLandingPage.showroomSlugs.filter((s) => !slugsToDelete.has(s)),
      selectedPiecesSlugs: currentLandingPage.selectedPiecesSlugs.filter((s) => !slugsToDelete.has(s)),
      artGallerySlugs: currentLandingPage.artGallerySlugs.filter((s) => !slugsToDelete.has(s)),
    };

    // Clear deleted items from selection
    setSelectedIds((prev) => prev.filter((id) => !idsToDelete.has(id)));

    const count = deleteDialog.items.length;
    const msg =
      count === 1
        ? `Deleted "${deleteDialog.items[0].name}" successfully.`
        : `Deleted ${count} products successfully.`;

    persistChanges(
      {
        ...content,
        products: nextProducts,
        site: { ...content.site, landingPage: nextLandingPage },
      },
      msg
    );
    setDeleteDialog({ isOpen: false, items: [] });
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

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation — Sticky on desktop */}
      <aside className="admin-sidebar">
        <Link
          href="/"
          className="font-serif text-2xl tracking-tight text-espresso hover:text-wine transition-colors"
        >
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
              className={`admin-nav-item cursor-pointer ${panel === item ? 'is-active' : ''}`}
            >
              <span className="admin-nav-icon" aria-hidden="true">
                {panelMeta[item].icon}
              </span>
              <span>{panelMeta[item].label}</span>
            </button>
          ))}
          <button onClick={handleSignOut} className="admin-nav-item admin-nav-logout cursor-pointer">
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
          <button
            onClick={handleSignOut}
            className="text-xs text-wine hover:underline block text-left cursor-pointer"
          >
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
                ? 'All Products'
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
                className="admin-primary text-xs font-medium py-2.5 px-4 rounded-sm shadow-xs active:scale-98 cursor-pointer"
              >
                + Add New Product
              </button>
            )}
          </div>
        </header>

        {/* PANEL 1: OVERVIEW */}
        {panel === 'overview' && (
          <OverviewPanel
            content={content}
            landingPage={currentLandingPage}
            onNavigate={setPanel}
          />
        )}

        {/* PANEL 2: PRODUCTS */}
        {panel === 'products' && (
          <section aria-labelledby="products-panel-heading" className="space-y-8">
            <h2 id="products-panel-heading" className="sr-only">
              All Products
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
              onAssignSection={handleBulkAssignSection}
              onRemoveFromSections={handleBulkRemoveFromSections}
              onDelete={() => {
                const idSet = new Set(selectedIds);
                const itemsToDelete = content.products.filter((p) => idSet.has(p.id));
                setDeleteDialog({ isOpen: true, items: itemsToDelete });
              }}
              onClear={clearSelection}
            />

            {/* Product Table */}
            <ProductTable
              products={filteredProducts}
              categories={content.categories}
              collections={content.collections}
              selectedIds={selectedIds}
              landingPage={currentLandingPage}
              onToggleSelect={toggleSelectProduct}
              onSelectAllVisible={selectAllVisible}
              onClearSelection={clearSelection}
              onEdit={setEditingProduct}
              onDelete={(p) => setDeleteDialog({ isOpen: true, items: [p] })}
              onToggleSection={handleToggleSection}
            />

            {/* Landing-Page Section Assignments Manager */}
            <LandingPageSectionManager
              content={content}
              landingPage={currentLandingPage}
              onUpdateLandingPage={(updatedLp, msg) => {
                persistChanges(
                  { ...content, site: { ...content.site, landingPage: updatedLp } },
                  msg
                );
              }}
            />
          </section>
        )}

        {/* PANEL 3: COLLECTIONS */}
        {panel === 'collections' && (
          <CollectionsPanel content={content} onSave={persistChanges} />
        )}

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
          landingPage={currentLandingPage}
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
// Sub-components: Landing Page Section Manager
// -----------------------------------------------------------------------------

function LandingPageSectionManager({
  content,
  landingPage,
  onUpdateLandingPage,
}: {
  content: AdminContent;
  landingPage: LandingPageConfig;
  onUpdateLandingPage: (lp: LandingPageConfig, message: string) => void;
}) {
  const [selectedToAdd, setSelectedToAdd] = useState<{
    showroom: string;
    selectedPieces: string;
    artGallery: string;
  }>({
    showroom: '',
    selectedPieces: '',
    artGallery: '',
  });

  const productMap = useMemo(
    () => new Map(content.products.map((p) => [p.slug, p])),
    [content.products]
  );

  function handleAdd(section: 'showroom' | 'selectedPieces' | 'artGallery') {
    const slug = selectedToAdd[section];
    if (!slug) return;
    const product = productMap.get(slug);
    if (!product) return;

    const check = validateProductSectionEligibility(product, section);
    if (!check.eligible) {
      alert(`Cannot assign "${product.name}" to ${section}: ${check.reason}`);
      return;
    }

    if (section === 'showroom') {
      const next = [...landingPage.showroomSlugs, slug];
      onUpdateLandingPage({ ...landingPage, showroomSlugs: next }, `Added "${product.name}" to Showroom.`);
    } else if (section === 'selectedPieces') {
      if (landingPage.selectedPiecesSlugs.length >= 6) {
        alert('Selected Pieces allows a maximum of 6 products.');
        return;
      }
      const next = [...landingPage.selectedPiecesSlugs, slug];
      onUpdateLandingPage(
        { ...landingPage, selectedPiecesSlugs: next },
        `Added "${product.name}" to Selected Pieces (${next.length}/6).`
      );
    } else if (section === 'artGallery') {
      if (landingPage.artGallerySlugs.length >= 3) {
        alert('Chapter 5 Art Gallery allows a maximum of 3 products.');
        return;
      }
      const next = [...landingPage.artGallerySlugs, slug];
      onUpdateLandingPage(
        { ...landingPage, artGallerySlugs: next },
        `Added "${product.name}" to Art Gallery (${next.length}/3).`
      );
    }

    setSelectedToAdd((prev) => ({ ...prev, [section]: '' }));
  }

  function handleRemove(section: 'showroom' | 'selectedPieces' | 'artGallery', slug: string) {
    const product = productMap.get(slug);
    const name = product?.name || slug;

    if (section === 'showroom') {
      const next = landingPage.showroomSlugs.filter((s) => s !== slug);
      onUpdateLandingPage({ ...landingPage, showroomSlugs: next }, `Removed "${name}" from Showroom.`);
    } else if (section === 'selectedPieces') {
      const next = landingPage.selectedPiecesSlugs.filter((s) => s !== slug);
      onUpdateLandingPage(
        { ...landingPage, selectedPiecesSlugs: next },
        `Removed "${name}" from Selected Pieces (${next.length}/6).`
      );
    } else if (section === 'artGallery') {
      const next = landingPage.artGallerySlugs.filter((s) => s !== slug);
      onUpdateLandingPage(
        { ...landingPage, artGallerySlugs: next },
        `Removed "${name}" from Art Gallery (${next.length}/3).`
      );
    }
  }

  return (
    <div className="admin-card rounded-sm border border-espresso/15 bg-white/40 p-6 space-y-6">
      <div>
        <p className="font-mono text-[10px] tracking-widest uppercase text-wine font-medium">
          Landing Page Direct Control
        </p>
        <h3 className="font-serif text-2xl text-espresso">Landing-Page Section Assignments</h3>
        <p className="text-xs sm:text-sm text-espresso/65 mt-1 leading-relaxed">
          Manage dynamic product placements across the homepage chapters. Content validation is enforced before any product is eligible for assignment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Showroom (Chapter 4) */}
        <div className="p-4 bg-white/70 border border-wine/25 rounded-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-serif text-lg text-espresso">Chapter 4 — Showroom</h4>
              <span className="font-mono text-[10px] uppercase bg-wine text-white px-2 py-0.5 rounded-sm font-semibold">
                {landingPage.showroomSlugs.length} Items
              </span>
            </div>
            <p className="text-[11px] text-espresso/65 leading-relaxed">
              Curated interactive showroom carousel stage (4+ products recommended).
            </p>

            {/* List of current slugs */}
            <div className="space-y-1.5 mt-3 max-h-48 overflow-y-auto">
              {landingPage.showroomSlugs.map((slug) => {
                const prod = productMap.get(slug);
                return (
                  <div
                    key={slug}
                    className="flex items-center justify-between gap-2 p-1.5 bg-espresso/5 rounded-sm text-xs"
                  >
                    <span className="truncate font-medium text-espresso">{prod?.name || slug}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove('showroom', slug)}
                      className="text-wine hover:text-wine/80 px-1 font-mono cursor-pointer"
                      title="Remove from Showroom"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              {landingPage.showroomSlugs.length === 0 && (
                <p className="text-xs text-espresso/40 italic py-2">No products assigned.</p>
              )}
            </div>
          </div>

          {/* Add product dropdown */}
          <div className="pt-3 border-t border-espresso/10 flex gap-2">
            <select
              value={selectedToAdd.showroom}
              onChange={(e) => setSelectedToAdd((prev) => ({ ...prev, showroom: e.target.value }))}
              className="admin-input py-1.5 px-2 text-xs flex-1 bg-white"
            >
              <option value="">Select product to add…</option>
              {content.products
                .filter((p) => !landingPage.showroomSlugs.includes(p.slug))
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={() => handleAdd('showroom')}
              disabled={!selectedToAdd.showroom}
              className="admin-primary text-xs px-3 py-1.5 rounded-sm disabled:opacity-40 cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* 2. Selected Pieces (Max 6) */}
        <div className="p-4 bg-white/70 border border-brass/35 rounded-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-serif text-lg text-espresso">Selected Pieces Grid</h4>
              <span className="font-mono text-[10px] uppercase bg-brass text-white px-2 py-0.5 rounded-sm font-semibold">
                {landingPage.selectedPiecesSlugs.length}/6 Max
              </span>
            </div>
            <p className="text-[11px] text-espresso/65 leading-relaxed">
              Signature 6-piece homepage grid replacing the old New arrivals flag.
            </p>

            {/* List of current slugs */}
            <div className="space-y-1.5 mt-3 max-h-48 overflow-y-auto">
              {landingPage.selectedPiecesSlugs.map((slug) => {
                const prod = productMap.get(slug);
                return (
                  <div
                    key={slug}
                    className="flex items-center justify-between gap-2 p-1.5 bg-espresso/5 rounded-sm text-xs"
                  >
                    <span className="truncate font-medium text-espresso">{prod?.name || slug}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove('selectedPieces', slug)}
                      className="text-wine hover:text-wine/80 px-1 font-mono cursor-pointer"
                      title="Remove from Selected Pieces"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              {landingPage.selectedPiecesSlugs.length === 0 && (
                <p className="text-xs text-espresso/40 italic py-2">No products assigned.</p>
              )}
            </div>
          </div>

          {/* Add product dropdown */}
          <div className="pt-3 border-t border-espresso/10 flex gap-2">
            <select
              value={selectedToAdd.selectedPieces}
              onChange={(e) =>
                setSelectedToAdd((prev) => ({ ...prev, selectedPieces: e.target.value }))
              }
              disabled={landingPage.selectedPiecesSlugs.length >= 6}
              className="admin-input py-1.5 px-2 text-xs flex-1 bg-white disabled:opacity-40"
            >
              <option value="">
                {landingPage.selectedPiecesSlugs.length >= 6 ? 'Limit reached (6/6)' : 'Select product to add…'}
              </option>
              {content.products
                .filter((p) => !landingPage.selectedPiecesSlugs.includes(p.slug))
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={() => handleAdd('selectedPieces')}
              disabled={!selectedToAdd.selectedPieces || landingPage.selectedPiecesSlugs.length >= 6}
              className="admin-primary text-xs px-3 py-1.5 rounded-sm disabled:opacity-40 cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* 3. Art Gallery / Ready for a New Beginning (Chapter 5, Max 3) */}
        <div className="p-4 bg-white/70 border border-sage/40 rounded-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-serif text-lg text-espresso">Chapter 5 — Art Gallery</h4>
              <span className="font-mono text-[10px] uppercase bg-sage text-espresso px-2 py-0.5 rounded-sm font-semibold">
                {landingPage.artGallerySlugs.length}/3 Max
              </span>
            </div>
            <p className="text-[11px] text-espresso/65 leading-relaxed">
              Ready for a New Beginning 3-card spotlight chapter (School/Student/Architectural).
            </p>

            {/* List of current slugs */}
            <div className="space-y-1.5 mt-3 max-h-48 overflow-y-auto">
              {landingPage.artGallerySlugs.map((slug) => {
                const prod = productMap.get(slug);
                return (
                  <div
                    key={slug}
                    className="flex items-center justify-between gap-2 p-1.5 bg-espresso/5 rounded-sm text-xs"
                  >
                    <span className="truncate font-medium text-espresso">{prod?.name || slug}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove('artGallery', slug)}
                      className="text-wine hover:text-wine/80 px-1 font-mono cursor-pointer"
                      title="Remove from Art Gallery"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              {landingPage.artGallerySlugs.length === 0 && (
                <p className="text-xs text-espresso/40 italic py-2">No products assigned.</p>
              )}
            </div>
          </div>

          {/* Add product dropdown */}
          <div className="pt-3 border-t border-espresso/10 flex gap-2">
            <select
              value={selectedToAdd.artGallery}
              onChange={(e) =>
                setSelectedToAdd((prev) => ({ ...prev, artGallery: e.target.value }))
              }
              disabled={landingPage.artGallerySlugs.length >= 3}
              className="admin-input py-1.5 px-2 text-xs flex-1 bg-white disabled:opacity-40"
            >
              <option value="">
                {landingPage.artGallerySlugs.length >= 3 ? 'Limit reached (3/3)' : 'Select product to add…'}
              </option>
              {content.products
                .filter((p) => !landingPage.artGallerySlugs.includes(p.slug))
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={() => handleAdd('artGallery')}
              disabled={!selectedToAdd.artGallery || landingPage.artGallerySlugs.length >= 3}
              className="admin-primary text-xs px-3 py-1.5 rounded-sm disabled:opacity-40 cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sub-panel components
// -----------------------------------------------------------------------------

function OverviewPanel({
  content,
  landingPage,
  onNavigate,
}: {
  content: AdminContent;
  landingPage: LandingPageConfig;
  onNavigate: (panel: Panel) => void;
}) {
  const womensCount = content.products.filter((p) => p.audience === 'womens').length;
  const studentCount = content.products.filter((p) => p.audience === 'student').length;

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'All Products',
            value: content.products.length,
            sub: 'Total pieces in catalogue',
          },
          {
            label: 'Showroom (Ch. 4)',
            value: landingPage.showroomSlugs.length,
            sub: 'Curated carousel stage',
          },
          {
            label: 'Selected Pieces',
            value: `${landingPage.selectedPiecesSlugs.length}/6`,
            sub: 'Featured grid showcase',
          },
          {
            label: 'Art Gallery (Ch. 5)',
            value: `${landingPage.artGallerySlugs.length}/3`,
            sub: 'New beginnings chapter',
          },
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
          <p className="font-mono text-[10px] tracking-widest uppercase text-wine font-medium">
            Quick Workflows
          </p>
          <div className="divide-y divide-espresso/10">
            <button
              onClick={() => onNavigate('products')}
              className="admin-action py-3 hover:text-wine flex items-center justify-between w-full text-left cursor-pointer"
            >
              <span>Manage all products &amp; landing-page sections</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              onClick={() => onNavigate('collections')}
              className="admin-action py-3 hover:text-wine flex items-center justify-between w-full text-left cursor-pointer"
            >
              <span>Configure collections &amp; featured doors</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              onClick={() => onNavigate('content')}
              className="admin-action py-3 hover:text-wine flex items-center justify-between w-full text-left cursor-pointer"
            >
              <span>Update brand story &amp; SEO metadata</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="admin-card rounded-sm space-y-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-wine font-medium">
            Catalogue Balance &amp; Architecture
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-espresso/70">
            <strong>Audience Share:</strong> {womensCount} Women&apos;s luxury pieces (~65%) and{' '}
            {studentCount} School &amp; Student pieces (~35%).
          </p>
          <div className="bg-espresso/5 p-3 rounded-sm border border-espresso/10 text-xs font-mono space-y-1">
            <p className="text-espresso/70">• Data Provider: Local JSON Seed + Browser Repository</p>
            <p className="text-espresso/70">
              • Supabase Migration: <code>supabase/migrations/0001_initial_schema.sql</code> ready
            </p>
            <p className="text-espresso/70">
              • Last saved: {new Date(content.updatedAt).toLocaleTimeString()}
            </p>
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
        const associatedCount = content.products.filter((p) =>
          p.collectionSlugs.includes(collection.slug)
        ).length;
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
                className={`status-pill cursor-pointer ${collection.isFeatured ? 'is-on' : ''}`}
                title="Toggle featured status"
              >
                {collection.isFeatured ? 'Featured Door' : 'Standard'}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
              {collection.description}
            </p>

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
        <h3 className="font-serif text-xl text-espresso pb-2 border-b border-espresso/10">
          Brand Identity &amp; SEO
        </h3>

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
          <label className="text-xs font-medium text-espresso block mb-1">
            Footer Creator Credit Text
          </label>
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
          <button
            type="submit"
            className="admin-primary text-xs font-medium py-2.5 px-6 rounded-sm shadow-xs cursor-pointer"
          >
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
              if (
                window.confirm(
                  'Reset all local content to the original verified demo catalogue? This will clear browser changes.'
                )
              ) {
                localRepository.resetContent();
                window.location.reload();
              }
            }}
            className="text-xs font-medium bg-wine text-white px-4 py-2 rounded-sm hover:bg-wine/90 transition-colors cursor-pointer"
          >
            Reset Demo Content
          </button>
        </div>
      </div>
    </div>
  );
}

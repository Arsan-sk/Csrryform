'use client';

import React, { useState } from 'react';
import type { Product, Audience, ProductType, AvailabilityStatus } from '@/types/product';
import type { Collection, Category } from '@/types/collection';
import type { LandingPageConfig } from '@/types/site';
import { ProductImageManager } from './ProductImageManager';
import { validateProductSectionEligibility } from './ProductTable';
import { slugify } from '@/lib/utils';

interface ProductModalProps {
  product: Product;
  collections: Collection[];
  categories: Category[];
  existingSlugs: string[];
  landingPage?: LandingPageConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    product: Product,
    sections?: { showroom: boolean; selectedPieces: boolean; artGallery: boolean }
  ) => void;
}

export function ProductModal({
  product,
  collections,
  categories,
  existingSlugs,
  landingPage = { showroomSlugs: [], selectedPiecesSlugs: [], artGallerySlugs: [] },
  isOpen,
  onClose,
  onSave,
}: ProductModalProps) {
  const [draft, setDraft] = useState<Product>({
    ...product,
    specifications: product.specifications || {},
    images: product.images || [],
    flags: product.flags || { active: true, featured: false, new: false },
    currency: product.currency || 'INR',
    availability: product.availability || 'enquire',
    collectionSlugs: product.collectionSlugs || [],
  });

  const [activeTab, setActiveTab] = useState<'basics' | 'pricing' | 'images' | 'specs' | 'sections'>('basics');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Landing page section assignments state for this product
  const [sections, setSections] = useState({
    showroom: landingPage.showroomSlugs.includes(product.slug),
    selectedPieces: landingPage.selectedPiecesSlugs.includes(product.slug),
    artGallery: landingPage.artGallerySlugs.includes(product.slug),
  });

  if (!isOpen) return null;

  const isNew = !product.id || product.id.startsWith('local-');

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  }

  function updateSpec(key: string, value: string | number | boolean | undefined) {
    setDraft((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  }

  function handleAutoSlug() {
    if (!draft.name) return;
    const generated = slugify(draft.name);
    update('slug', generated);
  }

  function toggleCollection(colSlug: string) {
    const current = draft.collectionSlugs || [];
    const next = current.includes(colSlug)
      ? current.filter((s) => s !== colSlug)
      : [...current, colSlug];
    update('collectionSlugs', next);
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!draft.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!draft.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else {
      const isDuplicate = existingSlugs.some(
        (slug) => slug.toLowerCase() === draft.slug.trim().toLowerCase() && slug !== product.slug
      );
      if (isDuplicate) {
        newErrors.slug = 'This slug is already used by another product';
      }
    }

    if (!draft.shortDescription.trim()) {
      newErrors.shortDescription = 'A brief description is required';
    }

    if (!draft.categorySlug) {
      newErrors.categorySlug = 'Please select a category';
    }

    // Section assignment validations
    if (sections.showroom) {
      const check = validateProductSectionEligibility(draft, 'showroom');
      if (!check.eligible) {
        newErrors.showroom = `Showroom requirements not met: ${check.reason}`;
      }
    }

    if (sections.selectedPieces) {
      const check = validateProductSectionEligibility(draft, 'selectedPieces');
      if (!check.eligible) {
        newErrors.selectedPieces = `Selected Pieces requirements not met: ${check.reason}`;
      } else {
        const currentCount = landingPage.selectedPiecesSlugs.filter((s) => s !== product.slug).length;
        if (currentCount >= 6) {
          newErrors.selectedPieces = 'Selected Pieces has reached its maximum limit of 6 products.';
        }
      }
    }

    if (sections.artGallery) {
      const check = validateProductSectionEligibility(draft, 'artGallery');
      if (!check.eligible) {
        newErrors.artGallery = `Art Gallery requirements not met: ${check.reason}`;
      } else {
        const currentCount = landingPage.artGallerySlugs.filter((s) => s !== product.slug).length;
        if (currentCount >= 3) {
          newErrors.artGallery = 'Chapter 5 Art Gallery has reached its maximum limit of 3 products.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSave(draft, sections);
    }
  }

  // Count checks for UI
  const selectedPiecesCount = landingPage.selectedPiecesSlugs.filter((s) => s !== product.slug).length;
  const artGalleryCount = landingPage.artGallerySlugs.filter((s) => s !== product.slug).length;

  const showroomCheck = validateProductSectionEligibility(draft, 'showroom');
  const selectedCheck = validateProductSectionEligibility(draft, 'selectedPieces');
  const galleryCheck = validateProductSectionEligibility(draft, 'artGallery');

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className="admin-modal max-w-3xl w-full border border-espresso/20 shadow-2xl rounded-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-espresso/12">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-wine">
              {isNew ? 'Create New Entry' : 'Catalogue Editor'}
            </p>
            <h2 id="product-modal-title" className="font-serif text-2xl text-espresso">
              {draft.name || (isNew ? 'Untitled Product' : 'Edit Product')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-espresso/50 hover:text-espresso text-xl font-mono p-1 leading-none cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-espresso/10 mt-4 -mb-px text-xs font-mono">
          {[
            { id: 'basics', label: '1. Essentials' },
            { id: 'pricing', label: '2. Pricing & Availability' },
            { id: 'images', label: `3. Photography (${draft.images.length})` },
            { id: 'specs', label: '4. Specifications' },
            { id: 'sections', label: '5. Landing-Page Sections' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-wine text-wine'
                  : 'border-transparent text-espresso/60 hover:text-espresso'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* TAB 1: ESSENTIALS */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-espresso block mb-1">
                  Product Name <span className="text-wine">*</span>
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Forma Structured Handbag"
                  className={`admin-input text-sm ${errors.name ? 'border-wine ring-1 ring-wine' : ''}`}
                />
                {errors.name && <p className="text-xs text-wine mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-espresso block mb-1">
                    URL Slug <span className="text-wine">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={draft.slug}
                      onChange={(e) => update('slug', slugify(e.target.value))}
                      placeholder="e.g. forma-structured-handbag"
                      className={`admin-input text-xs font-mono flex-1 ${
                        errors.slug ? 'border-wine ring-1 ring-wine' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="px-2.5 py-1 text-xs border border-espresso/20 rounded-sm hover:bg-espresso/5 font-mono cursor-pointer"
                      title="Auto-generate slug from name"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.slug && <p className="text-xs text-wine mt-1">{errors.slug}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Audience</label>
                  <select
                    value={draft.audience}
                    onChange={(e) => update('audience', e.target.value as Audience)}
                    className="admin-input text-xs"
                  >
                    <option value="womens">Women&apos;s Collection</option>
                    <option value="student">School &amp; Student</option>
                    <option value="everyday">Everyday</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">
                    Primary Category <span className="text-wine">*</span>
                  </label>
                  <select
                    value={draft.categorySlug}
                    onChange={(e) => update('categorySlug', e.target.value)}
                    className={`admin-input text-xs ${
                      errors.categorySlug ? 'border-wine ring-1 ring-wine' : ''
                    }`}
                  >
                    <option value="">Select a Category</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.audience})
                      </option>
                    ))}
                  </select>
                  {errors.categorySlug && (
                    <p className="text-xs text-wine mt-1">{errors.categorySlug}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Product Type</label>
                  <select
                    value={draft.type}
                    onChange={(e) => update('type', e.target.value as ProductType)}
                    className="admin-input text-xs"
                  >
                    <option value="handbag">Handbag</option>
                    <option value="shoulder_bag">Shoulder Bag</option>
                    <option value="tote">Tote</option>
                    <option value="sling">Sling</option>
                    <option value="purse">Purse</option>
                    <option value="school_backpack">School Backpack</option>
                    <option value="college_backpack">College Backpack</option>
                    <option value="everyday_backpack">Everyday Backpack</option>
                    <option value="travel_bag">Travel Bag</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-espresso block mb-1">
                  Collection Membership
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {collections.map((col) => {
                    const active = draft.collectionSlugs.includes(col.slug);
                    return (
                      <button
                        key={col.slug}
                        type="button"
                        onClick={() => toggleCollection(col.slug)}
                        className={`text-xs px-2.5 py-1 rounded-sm border font-mono transition-colors cursor-pointer ${
                          active
                            ? 'bg-wine text-white border-wine'
                            : 'bg-white/60 text-espresso/70 border-espresso/20 hover:border-wine'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {col.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-espresso block mb-1">
                  Short Description <span className="text-wine">*</span>
                </label>
                <textarea
                  value={draft.shortDescription}
                  onChange={(e) => update('shortDescription', e.target.value)}
                  placeholder="One or two evocative lines describing silhouette, character, and intended use."
                  rows={2}
                  className={`admin-input text-xs ${
                    errors.shortDescription ? 'border-wine ring-1 ring-wine' : ''
                  }`}
                />
                {errors.shortDescription && (
                  <p className="text-xs text-wine mt-1">{errors.shortDescription}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-espresso block mb-1">
                  Extended Narrative Description (Optional)
                </label>
                <textarea
                  value={draft.description || ''}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Full editorial paragraph detailing craftsmanship, leather or fabric provenance, and routine pairings."
                  rows={3}
                  className="admin-input text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & AVAILABILITY */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    value={draft.price ?? ''}
                    onChange={(e) =>
                      update('price', e.target.value === '' ? null : Number(e.target.value))
                    }
                    placeholder="Leave blank for Enquiry Only"
                    className="admin-input text-xs font-mono"
                  />
                  <p className="text-[11px] text-espresso/50 mt-1">Leave blank to display &quot;Price on enquiry&quot;</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Compare-at Price (₹)</label>
                  <input
                    type="number"
                    value={draft.compareAtPrice ?? ''}
                    onChange={(e) =>
                      update('compareAtPrice', e.target.value === '' ? null : Number(e.target.value))
                    }
                    placeholder="e.g. 5200"
                    className="admin-input text-xs font-mono"
                  />
                  <p className="text-[11px] text-espresso/50 mt-1">Strikethrough reference value</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Inventory Status</label>
                  <select
                    value={draft.availability}
                    onChange={(e) => update('availability', e.target.value as AvailabilityStatus)}
                    className="admin-input text-xs"
                  >
                    <option value="available">Available in Stock</option>
                    <option value="enquire">Available upon Enquiry</option>
                    <option value="unavailable">Temporarily Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-espresso/10">
                <label className="text-xs font-medium text-espresso block mb-1">Display Sort Order</label>
                <input
                  type="number"
                  value={draft.sortOrder ?? ''}
                  onChange={(e) =>
                    update('sortOrder', e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="e.g. 1, 2, 3…"
                  className="admin-input text-xs font-mono max-w-xs"
                />
                <p className="text-[11px] text-espresso/50 mt-1">Lower numbers appear first within categories.</p>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOGRAPHY */}
          {activeTab === 'images' && (
            <ProductImageManager
              images={draft.images}
              productName={draft.name || 'Product'}
              onChange={(nextImages) => update('images', nextImages)}
            />
          )}

          {/* TAB 4: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <p className="text-xs text-espresso/60 mb-2">
                Structured specification details rendered in the product accordion tables.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Material</label>
                  <input
                    type="text"
                    value={String(draft.specifications?.material ?? '')}
                    onChange={(e) => updateSpec('material', e.target.value)}
                    placeholder="e.g. Italian Full-grain Calfskin"
                    className="admin-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={String(draft.specifications?.dimensions ?? '')}
                    onChange={(e) => updateSpec('dimensions', e.target.value)}
                    placeholder="e.g. 28cm × 22cm × 11cm"
                    className="admin-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Closure</label>
                  <input
                    type="text"
                    value={String(draft.specifications?.closure ?? '')}
                    onChange={(e) => updateSpec('closure', e.target.value)}
                    placeholder="e.g. Magnetic snap with zip partition"
                    className="admin-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Strap Details</label>
                  <input
                    type="text"
                    value={String(draft.specifications?.strapType ?? '')}
                    onChange={(e) => updateSpec('strapType', e.target.value)}
                    placeholder="e.g. Detachable crossbody + shoulder handles"
                    className="admin-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Capacity (Litres)</label>
                  <input
                    type="number"
                    value={
                      draft.specifications?.capacityLitres
                        ? Number(draft.specifications.capacityLitres)
                        : ''
                    }
                    onChange={(e) =>
                      updateSpec('capacityLitres', e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="e.g. 24"
                    className="admin-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Laptop Sleeve Size</label>
                  <input
                    type="text"
                    value={String(draft.specifications?.laptopSleeveSize ?? '')}
                    onChange={(e) => updateSpec('laptopSleeveSize', e.target.value)}
                    placeholder="e.g. Up to 15.6 inch"
                    className="admin-input text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LANDING-PAGE SECTION ASSIGNMENTS */}
          {activeTab === 'sections' && (
            <div className="space-y-4">
              <div className="p-3 bg-wine/5 border border-wine/15 rounded-sm">
                <p className="text-xs font-serif text-espresso font-semibold">
                  Landing-Page Section Assignments
                </p>
                <p className="text-[11px] text-espresso/70 mt-0.5 leading-relaxed">
                  Assign this piece to key homepage editorial chapters. A product can appear in multiple sections if all content requirements are met.
                </p>
              </div>

              {/* SECTION 1: CHAPTER 4 — SHOWROOM */}
              <div className="border border-espresso/15 bg-white/50 p-4 rounded-sm space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.showroom}
                    onChange={(e) => setSections((prev) => ({ ...prev, showroom: e.target.checked }))}
                    disabled={!sections.showroom && !showroomCheck.eligible}
                    className="accent-wine mt-1 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-espresso">
                        Chapter 4 — Curated Showroom Stage
                      </p>
                      {sections.showroom && (
                        <span className="text-[10px] font-mono uppercase bg-wine text-white px-1.5 py-0.2 rounded-sm font-bold">
                          Assigned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-espresso/70 mt-0.5">
                      Main carousel showroom edit with interactive specifications and smooth switching animation.
                    </p>
                  </div>
                </label>

                {!showroomCheck.eligible && (
                  <p className="text-[11px] text-wine/80 font-mono bg-wine/5 p-2 rounded-sm border border-wine/10 mt-1">
                    ⚠ Ineligible: {showroomCheck.reason}
                  </p>
                )}
                {errors.showroom && <p className="text-xs text-wine">{errors.showroom}</p>}
              </div>

              {/* SECTION 2: SELECTED PIECES (MAX 6) */}
              <div className="border border-espresso/15 bg-white/50 p-4 rounded-sm space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.selectedPieces}
                    onChange={(e) =>
                      setSections((prev) => ({ ...prev, selectedPieces: e.target.checked }))
                    }
                    disabled={
                      (!sections.selectedPieces && !selectedCheck.eligible) ||
                      (!sections.selectedPieces && selectedPiecesCount >= 6)
                    }
                    className="accent-wine mt-1 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-espresso">
                        Selected Pieces Grid (Replaces New)
                      </p>
                      <span className="text-[10px] font-mono text-espresso/60 bg-espresso/5 px-1.5 py-0.2 rounded-sm">
                        {sections.selectedPieces ? selectedPiecesCount + 1 : selectedPiecesCount}/6 Allocated
                      </span>
                    </div>
                    <p className="text-[11px] text-espresso/70 mt-0.5">
                      Prominent 6-card grid showcase on the landing page highlighting top signature pieces.
                    </p>
                  </div>
                </label>

                {!selectedCheck.eligible && (
                  <p className="text-[11px] text-wine/80 font-mono bg-wine/5 p-2 rounded-sm border border-wine/10 mt-1">
                    ⚠ Ineligible: {selectedCheck.reason}
                  </p>
                )}
                {!sections.selectedPieces && selectedPiecesCount >= 6 && (
                  <p className="text-[11px] text-brass font-mono bg-brass/10 p-2 rounded-sm border border-brass/20 mt-1">
                    Maximum limit reached (6 products already allocated). Unassign another piece to add this one.
                  </p>
                )}
                {errors.selectedPieces && (
                  <p className="text-xs text-wine">{errors.selectedPieces}</p>
                )}
              </div>

              {/* SECTION 3: CHAPTER 5 — ART GALLERY / NEW BEGINNINGS (MAX 3) */}
              <div className="border border-espresso/15 bg-white/50 p-4 rounded-sm space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.artGallery}
                    onChange={(e) => setSections((prev) => ({ ...prev, artGallery: e.target.checked }))}
                    disabled={
                      (!sections.artGallery && !galleryCheck.eligible) ||
                      (!sections.artGallery && artGalleryCount >= 3)
                    }
                    className="accent-wine mt-1 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-espresso">
                        Chapter 5 — Art Gallery / Ready for a New Beginning
                      </p>
                      <span className="text-[10px] font-mono text-espresso/60 bg-espresso/5 px-1.5 py-0.2 rounded-sm">
                        {sections.artGallery ? artGalleryCount + 1 : artGalleryCount}/3 Allocated
                      </span>
                    </div>
                    <p className="text-[11px] text-espresso/70 mt-0.5">
                      Dedicated 3-product spotlight chapter highlighting architectural silhouettes and school/campus editions.
                    </p>
                  </div>
                </label>

                {!galleryCheck.eligible && (
                  <p className="text-[11px] text-wine/80 font-mono bg-wine/5 p-2 rounded-sm border border-wine/10 mt-1">
                    ⚠ Ineligible: {galleryCheck.reason}
                  </p>
                )}
                {!sections.artGallery && artGalleryCount >= 3 && (
                  <p className="text-[11px] text-brass font-mono bg-brass/10 p-2 rounded-sm border border-brass/20 mt-1">
                    Maximum limit reached (3 products already allocated). Unassign another piece to add this one.
                  </p>
                )}
                {errors.artGallery && <p className="text-xs text-wine">{errors.artGallery}</p>}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-espresso/12">
            <button
              type="button"
              onClick={onClose}
              className="admin-secondary px-4 py-2 text-xs text-espresso hover:bg-espresso/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary px-5 py-2 text-xs font-medium rounded-sm shadow-sm hover:bg-wine/90 active:scale-98 transition-all cursor-pointer"
            >
              {isNew ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

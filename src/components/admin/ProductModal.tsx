'use client';

import React, { useState } from 'react';
import type { Product, Audience, ProductType, AvailabilityStatus } from '@/types/product';
import type { Collection, Category } from '@/types/collection';
import { ProductImageManager } from './ProductImageManager';
import { slugify } from '@/lib/utils';

interface ProductModalProps {
  product: Product;
  collections: Collection[];
  categories: Category[];
  existingSlugs: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductModal({
  product,
  collections,
  categories,
  existingSlugs,
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

  const [activeTab, setActiveTab] = useState<'basics' | 'pricing' | 'images' | 'specs' | 'visibility'>('basics');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      // Switch to basics if there are errors there
      if (errors.name || errors.slug || errors.shortDescription || errors.categorySlug) {
        setActiveTab('basics');
      }
      return;
    }
    onSave(draft);
  }

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className="admin-modal max-w-4xl w-full border border-espresso/20 bg-ivory shadow-2xl rounded-sm p-6 sm:p-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-espresso/10 flex-shrink-0">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-wine font-medium">
              Catalogue Management
            </p>
            <h2 id="product-modal-title" className="font-serif text-2xl sm:text-3xl text-espresso mt-1">
              {isNew ? 'Create New Product' : `Edit: ${product.name}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-2xl text-espresso/40 hover:text-espresso leading-none p-1 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-espresso/10 mt-4 pb-1 overflow-x-auto flex-shrink-0">
          {[
            { id: 'basics', label: '1. Essentials' },
            { id: 'pricing', label: '2. Pricing & Status' },
            { id: 'images', label: `3. Photography (${draft.images.length})` },
            { id: 'specs', label: '4. Specifications' },
            { id: 'visibility', label: '5. Placement & Flags' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-2 text-xs font-medium rounded-t-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-wine text-wine font-bold bg-wine/5'
                  : 'border-transparent text-espresso/60 hover:text-espresso hover:bg-espresso/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* TAB 1: ESSENTIALS */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">
                    Product Name <span className="text-wine">*</span>
                  </label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="e.g. Forma Structured Handbag"
                    className="admin-input"
                  />
                  {errors.name && <p className="text-[11px] text-wine mt-1">{errors.name}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-espresso">
                      Slug <span className="text-wine">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[10px] text-wine uppercase font-mono tracking-wider hover:underline"
                    >
                      Auto-generate from name
                    </button>
                  </div>
                  <input
                    type="text"
                    value={draft.slug}
                    onChange={(e) => update('slug', e.target.value)}
                    placeholder="forma-structured-handbag"
                    className="admin-input font-mono text-xs"
                  />
                  {errors.slug && <p className="text-[11px] text-wine mt-1">{errors.slug}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Audience</label>
                  <select
                    value={draft.audience}
                    onChange={(e) => update('audience', e.target.value as Audience)}
                    className="admin-input"
                  >
                    <option value="womens">Women&apos;s Bags</option>
                    <option value="student">School &amp; Student</option>
                    <option value="everyday">Everyday Carry</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Product Type</label>
                  <select
                    value={draft.type}
                    onChange={(e) => update('type', e.target.value as ProductType)}
                    className="admin-input"
                  >
                    <option value="handbag">Handbag</option>
                    <option value="shoulder_bag">Shoulder Bag</option>
                    <option value="tote">Tote Bag</option>
                    <option value="sling">Sling &amp; Crossbody</option>
                    <option value="purse">Purse</option>
                    <option value="school_backpack">School Backpack</option>
                    <option value="college_backpack">College Backpack</option>
                    <option value="everyday_backpack">Everyday Backpack</option>
                    <option value="travel_bag">Travel Bag</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">
                    Category <span className="text-wine">*</span>
                  </label>
                  <select
                    value={draft.categorySlug}
                    onChange={(e) => update('categorySlug', e.target.value)}
                    className="admin-input"
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.audience})
                      </option>
                    ))}
                  </select>
                  {errors.categorySlug && <p className="text-[11px] text-wine mt-1">{errors.categorySlug}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-espresso block mb-1">
                  Short Description (Listing Subtitle) <span className="text-wine">*</span>
                </label>
                <input
                  type="text"
                  value={draft.shortDescription}
                  onChange={(e) => update('shortDescription', e.target.value)}
                  placeholder="Clean architectural lines with dual interior compartments."
                  className="admin-input"
                />
                {errors.shortDescription && <p className="text-[11px] text-wine mt-1">{errors.shortDescription}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-espresso block mb-1">
                  Editorial Story / Full Description
                </label>
                <textarea
                  rows={4}
                  value={draft.description || ''}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="The story, tactile qualities, and craftsmanship narrative for this bag..."
                  className="admin-input text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-espresso block mb-2">
                  Collection Associations
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-espresso/15 p-3 rounded-sm bg-white/40">
                  {collections.map((col) => {
                    const isChecked = draft.collectionSlugs.includes(col.slug);
                    return (
                      <label
                        key={col.slug}
                        className="flex items-center gap-2 p-2 border border-espresso/10 rounded-sm text-xs cursor-pointer hover:bg-espresso/5 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              update('collectionSlugs', [...draft.collectionSlugs, col.slug]);
                            } else {
                              update('collectionSlugs', draft.collectionSlugs.filter((s) => s !== col.slug));
                            }
                          }}
                          className="accent-wine"
                        />
                        <span className="font-medium text-espresso">{col.title}</span>
                        <span className="font-mono text-[10px] text-espresso/40 ml-auto uppercase">{col.audience}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & STATUS */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Price (Amount)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={draft.price === null || draft.price === undefined ? '' : draft.price}
                    onChange={(e) => update('price', e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="e.g. 4200"
                    className="admin-input"
                  />
                  <p className="text-[10px] text-espresso/50 mt-1">Leave empty for enquiry-only / unpriced.</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Compare-at Price (MSRP)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={draft.compareAtPrice === null || draft.compareAtPrice === undefined ? '' : draft.compareAtPrice}
                    onChange={(e) => update('compareAtPrice', e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="e.g. 5200"
                    className="admin-input"
                  />
                  <p className="text-[10px] text-espresso/50 mt-1">Optional strikethrough original price.</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Currency Code</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={draft.currency}
                    onChange={(e) => update('currency', e.target.value.toUpperCase())}
                    placeholder="INR"
                    className="admin-input font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Availability</label>
                  <select
                    value={draft.availability}
                    onChange={(e) => update('availability', e.target.value as AvailabilityStatus)}
                    className="admin-input"
                  >
                    <option value="available">In Stock &amp; Available</option>
                    <option value="enquire">Enquire for Availability</option>
                    <option value="unavailable">Unavailable / Archive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={draft.sortOrder ?? 0}
                    onChange={(e) => update('sortOrder', Number(e.target.value))}
                    className="admin-input"
                  />
                  <p className="text-[10px] text-espresso/50 mt-1">Lower numbers appear first in catalogue listings.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOGRAPHY & IMAGES */}
          {activeTab === 'images' && (
            <ProductImageManager
              images={draft.images}
              productName={draft.name}
              onChange={(updatedImages) => update('images', updatedImages)}
            />
          )}

          {/* TAB 4: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <p className="text-xs text-espresso/60">
                Detailed craftsmanship, dimensions, and utility specifications matching the CARRYFORM schema.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Material &amp; Exterior</label>
                  <input
                    type="text"
                    value={String(draft.specifications?.material ?? '')}
                    onChange={(e) => updateSpec('material', e.target.value)}
                    placeholder="e.g. Full-grain vegan leather, antique brass hardware"
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
                    value={draft.specifications?.capacityLitres ? Number(draft.specifications.capacityLitres) : ''}
                    onChange={(e) => updateSpec('capacityLitres', e.target.value ? Number(e.target.value) : undefined)}
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

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Pockets &amp; Interior</label>
                  <input
                    type="text"
                    value={String(draft.specifications?.pockets ?? '')}
                    onChange={(e) => updateSpec('pockets', e.target.value)}
                    placeholder="e.g. 2 slip pockets, 1 zippered security pocket"
                    className="admin-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-espresso block mb-1">Care Instructions</label>
                  <input
                    type="text"
                    value={String(draft.specifications?.careInstructions ?? '')}
                    onChange={(e) => updateSpec('careInstructions', e.target.value)}
                    placeholder="e.g. Wipe clean with soft damp cloth"
                    className="admin-input text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PLACEMENT & FLAGS */}
          {activeTab === 'visibility' && (
            <div className="space-y-4">
              <div className="border border-espresso/15 bg-white/40 p-4 rounded-sm space-y-3">
                <p className="text-xs font-serif font-bold text-espresso">Product Visibility &amp; Highlighting</p>
                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.flags.active}
                      onChange={(e) => update('flags', { ...draft.flags, active: e.target.checked })}
                      className="accent-wine mt-1"
                    />
                    <div>
                      <p className="text-xs font-medium text-espresso">Active in Showroom</p>
                      <p className="text-[11px] text-espresso/60">Visible to visitors on public catalogue and collection routes.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.flags.featured}
                      onChange={(e) => update('flags', { ...draft.flags, featured: e.target.checked })}
                      className="accent-wine mt-1"
                    />
                    <div>
                      <p className="text-xs font-medium text-espresso">Featured Piece</p>
                      <p className="text-[11px] text-espresso/60">Prioritized on the homepage Curated Stage or Selected Pieces grid.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.flags.new}
                      onChange={(e) => update('flags', { ...draft.flags, new: e.target.checked })}
                      className="accent-wine mt-1"
                    />
                    <div>
                      <p className="text-xs font-medium text-espresso">New Arrival Badge</p>
                      <p className="text-[11px] text-espresso/60">Displays the distinctive &ldquo;NEW&rdquo; badge on product cards.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border border-espresso/15 bg-espresso/5 p-4 rounded-sm">
                <p className="text-xs font-mono uppercase tracking-wider text-espresso/60 mb-1">Content Record Status</p>
                <div className="flex gap-4 text-xs mt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contentStatus"
                      value="demo"
                      checked={draft.contentStatus === 'demo'}
                      onChange={() => update('contentStatus', 'demo')}
                      className="accent-wine"
                    />
                    <span>Demonstration Data</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contentStatus"
                      value="verified"
                      checked={draft.contentStatus === 'verified'}
                      onChange={() => update('contentStatus', 'verified')}
                      className="accent-wine"
                    />
                    <span>Verified Production Data</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between pt-5 border-t border-espresso/10 mt-6 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="admin-secondary px-5 py-2.5 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-primary px-6 py-2.5 text-xs font-medium tracking-wide shadow-sm hover:shadow"
            >
              {isNew ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

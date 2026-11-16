'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import type { Category, Collection } from '@/types/collection';
import type { LandingPageConfig } from '@/types/site';
import { formatPrice } from '@/lib/utils';

export function validateProductSectionEligibility(
  product: Product,
  section: 'showroom' | 'selectedPieces' | 'artGallery'
): { eligible: boolean; reason?: string } {
  if (!product.name || !product.name.trim()) {
    return { eligible: false, reason: 'Product name is required.' };
  }
  const hasImage = Boolean(
    product.images && product.images.length > 0 && product.images[0]?.url?.trim()
  );
  if (!hasImage) {
    return { eligible: false, reason: 'At least one photo with a valid URL is required.' };
  }
  if (!product.shortDescription || !product.shortDescription.trim()) {
    return { eligible: false, reason: 'Short description is required for landing-page sections.' };
  }
  if (section === 'showroom' && !product.categorySlug) {
    return { eligible: false, reason: 'Category assignment is required for the Showroom stage.' };
  }
  return { eligible: true };
}

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  selectedIds: string[];
  landingPage?: LandingPageConfig;
  onToggleSelect: (id: string) => void;
  onSelectAllVisible: () => void;
  onClearSelection: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleSection?: (
    product: Product,
    section: 'showroom' | 'selectedPieces' | 'artGallery'
  ) => void;
}

export function ProductTable({
  products,
  categories,
  collections,
  selectedIds,
  landingPage = { showroomSlugs: [], selectedPiecesSlugs: [], artGallerySlugs: [] },
  onToggleSelect,
  onSelectAllVisible,
  onClearSelection,
  onEdit,
  onDelete,
  onToggleSection,
}: ProductTableProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));
  const collectionMap = new Map(collections.map((c) => [c.slug, c.title]));

  const allVisibleSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id));
  const someVisibleSelected =
    products.some((p) => selectedIds.includes(p.id)) && !allVisibleSelected;

  if (products.length === 0) {
    return (
      <div className="admin-table-wrap p-12 text-center bg-white/40 border border-espresso/15 rounded-sm">
        <p className="font-serif text-2xl text-espresso mb-2">No products found</p>
        <p className="text-sm text-espresso/60 max-w-md mx-auto">
          No items match your active search or filters. Try adjusting your search query or reset the filter settings.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap rounded-sm shadow-xs border border-espresso/15 bg-white/45">
      <table className="admin-table w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-espresso/12 bg-espresso/4 text-espresso/60">
            <th className="w-10 px-4 py-3.5">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someVisibleSelected;
                }}
                onChange={() => {
                  if (allVisibleSelected) {
                    onClearSelection();
                  } else {
                    onSelectAllVisible();
                  }
                }}
                className="accent-wine cursor-pointer rounded-sm"
                aria-label="Select all visible products"
              />
            </th>
            <th className="px-4 py-3.5 text-xs font-mono uppercase tracking-wider">Product</th>
            <th className="px-3 py-3.5 text-xs font-mono uppercase tracking-wider">Category &amp; Audience</th>
            <th className="px-3 py-3.5 text-xs font-mono uppercase tracking-wider">Price</th>
            <th className="px-3 py-3.5 text-xs font-mono uppercase tracking-wider text-center">
              Landing-Page Sections
            </th>
            <th className="px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-espresso/8">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            const primaryImage =
              product.images?.find((img) => img.role === 'primary') || product.images?.[0];
            const hasImgError = imageErrors[product.id];
            const categoryName = categoryMap.get(product.categorySlug) || product.categorySlug;

            const inShowroom = landingPage.showroomSlugs.includes(product.slug);
            const inSelected = landingPage.selectedPiecesSlugs.includes(product.slug);
            const inGallery = landingPage.artGallerySlugs.includes(product.slug);

            const showroomCheck = validateProductSectionEligibility(product, 'showroom');
            const selectedCheck = validateProductSectionEligibility(product, 'selectedPieces');
            const galleryCheck = validateProductSectionEligibility(product, 'artGallery');

            return (
              <tr
                key={product.id}
                className={`transition-colors hover:bg-espresso/2 ${
                  isSelected ? 'bg-wine/4' : ''
                }`}
              >
                {/* Select Checkbox */}
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(product.id)}
                    className="accent-wine cursor-pointer rounded-sm"
                    aria-label={`Select ${product.name}`}
                  />
                </td>

                {/* Product Thumbnail & Details */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-espresso/5 rounded-sm overflow-hidden flex-shrink-0 border border-espresso/10">
                      {primaryImage && !hasImgError ? (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt || product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [product.id]: true }))
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-espresso/40">
                          No Pic
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-medium text-espresso text-sm truncate max-w-[220px]">
                          {product.name}
                        </span>
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          title="Preview public product page"
                          className="text-xs text-espresso/40 hover:text-wine transition-colors"
                        >
                          ↗
                        </Link>
                      </div>
                      <p className="font-mono text-[11px] text-espresso/45 truncate max-w-[200px]">
                        /{product.slug}
                      </p>
                      {product.collectionSlugs.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.collectionSlugs.map((slug) => (
                            <span
                              key={slug}
                              className="text-[9px] font-mono uppercase bg-espresso/5 text-espresso/60 px-1.5 py-0.2 rounded-sm"
                            >
                              {collectionMap.get(slug) || slug}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category & Audience */}
                <td className="px-3 py-3 text-xs">
                  <span className="inline-block px-2 py-0.5 rounded-sm bg-espresso/6 text-espresso/75 font-medium text-[11px] mb-1">
                    {categoryName}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-espresso/50 uppercase tracking-wider">
                      {product.audience === 'womens'
                        ? "Women's"
                        : product.audience === 'student'
                        ? 'Student'
                        : product.audience}
                    </span>
                  </div>
                </td>

                {/* Price */}
                <td className="px-3 py-3 font-mono text-xs text-espresso">
                  {formatPrice(product.price, product.currency)}
                </td>

                {/* Landing-Page Sections Assignment Badges & Quick Toggles */}
                <td className="px-3 py-3 text-center">
                  <div className="inline-flex flex-col gap-1.5 items-center">
                    {/* Chapter 4: Showroom */}
                    <button
                      type="button"
                      onClick={() => onToggleSection && onToggleSection(product, 'showroom')}
                      disabled={!inShowroom && !showroomCheck.eligible}
                      title={
                        inShowroom
                          ? 'Assigned to Chapter 4 Showroom (Click to remove)'
                          : showroomCheck.eligible
                          ? 'Click to assign to Chapter 4 Showroom'
                          : `Cannot assign to Showroom: ${showroomCheck.reason}`
                      }
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm transition-all border flex items-center gap-1 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                        inShowroom
                          ? 'bg-wine text-white border-wine font-semibold shadow-xs'
                          : 'bg-white text-espresso/60 border-espresso/15 hover:border-wine hover:text-wine'
                      }`}
                    >
                      <span>Showroom (Ch. 4)</span>
                      {inShowroom ? <span>✓</span> : <span className="opacity-40">+</span>}
                    </button>

                    {/* Selected Pieces (Max 6) */}
                    <button
                      type="button"
                      onClick={() => onToggleSection && onToggleSection(product, 'selectedPieces')}
                      disabled={!inSelected && !selectedCheck.eligible}
                      title={
                        inSelected
                          ? 'Assigned to Selected Pieces (Click to remove)'
                          : selectedCheck.eligible
                          ? 'Click to assign to Selected Pieces'
                          : `Cannot assign to Selected Pieces: ${selectedCheck.reason}`
                      }
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm transition-all border flex items-center gap-1 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                        inSelected
                          ? 'bg-brass text-white border-brass font-semibold shadow-xs'
                          : 'bg-white text-espresso/60 border-espresso/15 hover:border-brass hover:text-brass'
                      }`}
                    >
                      <span>Selected Pieces</span>
                      {inSelected ? <span>✓</span> : <span className="opacity-40">+</span>}
                    </button>

                    {/* Chapter 5: Art Gallery / Ready for a New Beginning (Max 3) */}
                    <button
                      type="button"
                      onClick={() => onToggleSection && onToggleSection(product, 'artGallery')}
                      disabled={!inGallery && !galleryCheck.eligible}
                      title={
                        inGallery
                          ? 'Assigned to Chapter 5 Art Gallery (Click to remove)'
                          : galleryCheck.eligible
                          ? 'Click to assign to Chapter 5 Art Gallery'
                          : `Cannot assign to Art Gallery: ${galleryCheck.reason}`
                      }
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm transition-all border flex items-center gap-1 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                        inGallery
                          ? 'bg-sage text-espresso border-sage font-semibold shadow-xs'
                          : 'bg-white text-espresso/60 border-espresso/15 hover:border-sage hover:text-espresso'
                      }`}
                    >
                      <span>Art Gallery (Ch. 5)</span>
                      {inGallery ? <span>✓</span> : <span className="opacity-40">+</span>}
                    </button>
                  </div>
                </td>

                {/* Actions: Edit & Prominent Trash Delete */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-espresso/60 hover:text-espresso hover:bg-espresso/5 rounded-sm transition-colors cursor-pointer"
                      title={`Edit ${product.name}`}
                    >
                      {/* Pencil Edit Icon */}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    {/* Clear Trash/Delete Icon */}
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="p-1.5 text-wine/75 hover:text-wine hover:bg-wine/10 rounded-sm transition-colors cursor-pointer"
                      title={`Delete ${product.name}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

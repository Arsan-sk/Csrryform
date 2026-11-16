'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import type { Collection, Category } from '@/types/collection';
import type { LandingPageConfig } from '@/types/site';
import { validateProductSectionEligibility } from './ProductTable';

interface MobileProductCardProps {
  product: Product;
  categories: Category[];
  collections: Collection[];
  isSelected: boolean;
  landingPage: LandingPageConfig;
  onToggleSelect: (id: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleSection: (product: Product, section: 'showroom' | 'selectedPieces' | 'artGallery') => void;
}

export function MobileProductCard({
  product,
  categories,
  collections,
  isSelected,
  landingPage,
  onToggleSelect,
  onEdit,
  onDelete,
  onToggleSection,
}: MobileProductCardProps) {
  const primaryImage =
    product.images?.find((img) => img.role === 'primary') || product.images?.[0];
  const categoryName = categories.find((c) => c.slug === product.categorySlug)?.name || product.categorySlug;

  const inShowroom = landingPage.showroomSlugs.includes(product.slug);
  const inSelected = landingPage.selectedPiecesSlugs.includes(product.slug);
  const inGallery = landingPage.artGallerySlugs.includes(product.slug);

  const showroomCheck = validateProductSectionEligibility(product, 'showroom');
  const selectedCheck = validateProductSectionEligibility(product, 'selectedPieces');
  const galleryCheck = validateProductSectionEligibility(product, 'artGallery');

  const assignedSections: string[] = [];
  if (inShowroom) assignedSections.push('Showroom');
  if (inSelected) assignedSections.push('Selected');
  if (inGallery) assignedSections.push('Gallery');

  return (
    <article
      className={`bg-white/60 border border-espresso/10 rounded-sm p-4 shadow-sm transition-colors hover:bg-espresso/5 ${
        isSelected ? 'ring-2 ring-wine bg-wine/3' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(product.id)}
          className="accent-wine cursor-pointer rounded-sm mt-0.5"
          aria-label={`Select ${product.name}`}
        />
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="text-[10px] text-espresso/40 hover:text-wine underline transition-colors"
        >
          Edit
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-16 h-20 bg-espresso/5 rounded-sm overflow-hidden flex-shrink-0 border border-espresso/10">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-espresso/40">
              No Pic
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-medium text-espresso text-sm truncate">
              {product.name}
            </span>
            {product.flags?.featured && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-brass/10 text-brass text-[9px] rounded-sm border border-brass/20">
                ⭐ Featured
              </span>
            )}
          </div>
          <p className="font-mono text-[9px] text-espresso/50 truncate mb-1">
            {product.slug}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-espresso font-medium">${product.price ?? '—'}</span>
            <span className="text-[9px] text-espresso/40">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => onToggleSection(product, 'showroom')}
          disabled={!showroomCheck.eligible}
          className={`flex-1 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-sm border transition-colors ${
            inShowroom
              ? 'bg-wine text-white border-wine'
              : showroomCheck.eligible
                ? 'text-espresso hover:bg-espresso/5 border-espresso/20'
                : 'text-espresso/30 border-espresso/10 cursor-not-allowed'
          }`}
          title={showroomCheck.eligible ? undefined : showroomCheck.reason}
        >
          {inShowroom ? '✓ Showroom' : 'Showroom'}
        </button>
        <button
          type="button"
          onClick={() => onToggleSection(product, 'selectedPieces')}
          disabled={!selectedCheck.eligible || inSelected}
          className={`flex-1 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-sm border transition-colors ${
            inSelected
              ? 'bg-wine text-white border-wine'
              : selectedCheck.eligible && !inSelected
                ? 'text-espresso hover:bg-espresso/5 border-espresso/20'
                : 'text-espresso/30 border-espresso/10 cursor-not-allowed'
          }`}
          title={!selectedCheck.eligible ? selectedCheck.reason : undefined}
        >
          {inSelected ? '✓ Selected' : 'Selected'}
        </button>
        <button
          type="button"
          onClick={() => onToggleSection(product, 'artGallery')}
          disabled={!galleryCheck.eligible || inGallery}
          className={`flex-1 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-sm border transition-colors ${
            inGallery
              ? 'bg-wine text-white border-wine'
              : galleryCheck.eligible && !inGallery
                ? 'text-espresso hover:bg-espresso/5 border-espresso/20'
                : 'text-espresso/30 border-espresso/10 cursor-not-allowed'
          }`}
          title={!galleryCheck.eligible ? galleryCheck.reason : undefined}
        >
          {inGallery ? '✓ Gallery' : 'Gallery'}
        </button>
      </div>

      {assignedSections.length > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono text-espresso/50 uppercase tracking-wider">
            Sections:
          </span>
          <span className="text-[10px] font-mono text-wine font-medium">
            {assignedSections.join(', ')}
          </span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-espresso/5">
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="text-[10px] text-wine hover:text-wine/90 flex items-center gap-1 font-medium cursor-pointer"
        >
          <span aria-hidden="true">🗑️</span> Delete
        </button>
      </div>
    </article>
  );
}
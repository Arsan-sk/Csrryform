'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import type { Category, Collection } from '@/types/collection';
import { formatPrice } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAllVisible: () => void;
  onClearSelection: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleActive: (product: Product) => void;
  onToggleFeatured: (product: Product) => void;
  onToggleNew: (product: Product) => void;
}

export function ProductTable({
  products,
  categories,
  collections,
  selectedIds,
  onToggleSelect,
  onSelectAllVisible,
  onClearSelection,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onToggleNew,
}: ProductTableProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));
  const collectionMap = new Map(collections.map((c) => [c.slug, c.title]));

  const allVisibleSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));
  const someVisibleSelected = products.some((p) => selectedIds.includes(p.id)) && !allVisibleSelected;

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
      {/* Desktop & Tablet Table View */}
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
            <th className="px-3 py-3.5 text-xs font-mono uppercase tracking-wider">Category</th>
            <th className="px-3 py-3.5 text-xs font-mono uppercase tracking-wider">Audience</th>
            <th className="px-3 py-3.5 text-xs font-mono uppercase tracking-wider">Price</th>
            <th className="px-3 py-3.5 text-xs font-mono uppercase tracking-wider text-center">Status</th>
            <th className="px-3 py-3.5 text-xs font-mono uppercase tracking-wider text-center">Featured</th>
            <th className="px-3 py-3.5 text-xs font-mono uppercase tracking-wider text-center">New</th>
            <th className="px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-espresso/8">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            const primaryImage = product.images?.find((img) => img.role === 'primary') || product.images?.[0];
            const hasImgError = imageErrors[product.id];
            const categoryName = categoryMap.get(product.categorySlug) || product.categorySlug;

            return (
              <tr
                key={product.id}
                className={`transition-colors hover:bg-espresso/5 ${isSelected ? 'bg-wine/5' : ''}`}
              >
                {/* Selection Checkbox */}
                <td className="px-4 py-3 align-middle">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(product.id)}
                    className="accent-wine cursor-pointer rounded-sm"
                    aria-label={`Select ${product.name}`}
                  />
                </td>

                {/* Product Name, Thumbnail & Slug */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3.5">
                    {/* Thumbnail */}
                    <div className="relative w-12 h-14 bg-espresso/5 rounded-xs border border-espresso/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {!hasImgError && primaryImage?.url ? (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt || product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                          onError={() => setImageErrors((prev) => ({ ...prev, [product.id]: true }))}
                        />
                      ) : (
                        <span className="text-[9px] font-mono text-espresso/40 text-center leading-none px-0.5">
                          {hasImgError ? 'No img' : 'Empty'}
                        </span>
                      )}
                    </div>

                    {/* Titles & Collections */}
                    <div className="min-w-0">
                      <strong className="block text-sm font-serif text-espresso leading-snug line-clamp-1">
                        {product.name}
                      </strong>
                      <span className="block text-xs font-mono text-espresso/50 truncate max-w-[200px]">
                        /{product.slug}
                      </span>
                      {product.collectionSlugs && product.collectionSlugs.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.collectionSlugs.map((slug) => (
                            <span
                              key={slug}
                              className="text-[10px] font-mono text-espresso/60 bg-espresso/5 px-1.5 py-0.5 rounded-xs"
                            >
                              {collectionMap.get(slug) || slug}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-3 py-3 align-middle text-xs text-espresso/80">
                  <span className="bg-espresso/5 px-2 py-1 rounded-sm font-mono text-[11px]">
                    {categoryName}
                  </span>
                </td>

                {/* Audience */}
                <td className="px-3 py-3 align-middle text-xs">
                  <span
                    className={`font-mono text-[11px] uppercase tracking-wider ${
                      product.audience === 'student' ? 'text-sage font-medium' : 'text-wine font-medium'
                    }`}
                  >
                    {product.audience === 'student' ? 'Student' : "Women's"}
                  </span>
                </td>

                {/* Price */}
                <td className="px-3 py-3 align-middle text-xs font-mono text-espresso/80">
                  {product.price !== null && product.price !== undefined ? (
                    formatPrice(product.price, product.currency)
                  ) : (
                    <span className="italic text-espresso/40">Enquiry</span>
                  )}
                </td>

                {/* Status Toggle */}
                <td className="px-3 py-3 align-middle text-center">
                  <button
                    type="button"
                    onClick={() => onToggleActive(product)}
                    className={`status-pill cursor-pointer transition-all ${
                      product.flags.active ? 'is-on' : 'opacity-70'
                    }`}
                    title="Click to toggle visibility"
                  >
                    {product.flags.active ? 'Active' : 'Hidden'}
                  </button>
                </td>

                {/* Featured Toggle */}
                <td className="px-3 py-3 align-middle text-center">
                  <button
                    type="button"
                    onClick={() => onToggleFeatured(product)}
                    className={`text-xs px-2 py-0.5 rounded-sm font-mono transition-colors ${
                      product.flags.featured
                        ? 'bg-brass/25 text-[#63481f] font-bold border border-brass/40'
                        : 'text-espresso/35 hover:text-espresso/70'
                    }`}
                    title="Click to toggle featured spotlight"
                  >
                    {product.flags.featured ? '★ Yes' : '—'}
                  </button>
                </td>

                {/* New Arrival Toggle */}
                <td className="px-3 py-3 align-middle text-center">
                  <button
                    type="button"
                    onClick={() => onToggleNew(product)}
                    className={`text-xs px-2 py-0.5 rounded-sm font-mono transition-colors ${
                      product.flags.new
                        ? 'bg-wine/15 text-wine font-bold border border-wine/30'
                        : 'text-espresso/35 hover:text-espresso/70'
                    }`}
                    title="Click to toggle new arrival badge"
                  >
                    {product.flags.new ? 'NEW' : '—'}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 align-middle text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="text-xs text-espresso/40 hover:text-espresso p-1"
                      title="Preview live public page"
                    >
                      ↗
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="text-xs font-medium text-wine hover:underline p-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="text-xs text-espresso/40 hover:text-wine p-1"
                      title="Delete product"
                    >
                      ✕
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

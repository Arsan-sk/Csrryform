'use client';

import React from 'react';
import type { Category, Collection } from '@/types/collection';

export interface ProductFilterState {
  search: string;
  category: string;
  collection: string;
  audience: string;
  section: 'all' | 'showroom' | 'selectedPieces' | 'artGallery' | 'unassigned';
}

interface ProductFiltersProps {
  filters: ProductFilterState;
  categories: Category[];
  collections: Collection[];
  onChange: (filters: ProductFilterState) => void;
  onClear: () => void;
  totalFiltered: number;
  totalProducts: number;
}

export function ProductFilters({
  filters,
  categories,
  collections,
  onChange,
  onClear,
  totalFiltered,
  totalProducts,
}: ProductFiltersProps) {
  function update<K extends keyof ProductFilterState>(key: K, value: ProductFilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  const activeFiltersCount = [
    filters.search ? 1 : 0,
    filters.category !== 'all' ? 1 : 0,
    filters.collection !== 'all' ? 1 : 0,
    filters.audience !== 'all' ? 1 : 0,
    filters.section !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-3 mb-6 bg-white/40 border border-espresso/12 p-4 rounded-sm shadow-xs">
      {/* Top Search Bar & Summary */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Search all products by name, slug, or description…"
            className="admin-input py-2 pl-9 pr-8 text-xs w-full rounded-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40 text-xs" aria-hidden="true">
            🔍
          </span>
          {filters.search && (
            <button
              onClick={() => update('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso text-xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-espresso/60 font-mono">
            Showing <strong>{totalFiltered}</strong> of {totalProducts} products
          </span>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-wine hover:underline font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>Reset Filters</span>
              <span className="w-4 h-4 rounded-full bg-wine/15 text-wine text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Composable Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-espresso/8">
        {/* Landing Page Section Filter */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/60 block mb-1 font-medium">
            Section Assignment
          </label>
          <select
            value={filters.section}
            onChange={(e) => update('section', e.target.value as ProductFilterState['section'])}
            className="admin-input py-1.5 px-2 text-xs w-full rounded-sm bg-white"
          >
            <option value="all">All Sections</option>
            <option value="showroom">Showroom (Ch. 4)</option>
            <option value="selectedPieces">Selected Pieces (Max 6)</option>
            <option value="artGallery">Art Gallery / New Beginnings (Ch. 5)</option>
            <option value="unassigned">Unassigned Products</option>
          </select>
        </div>

        {/* Audience */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/60 block mb-1 font-medium">
            Audience
          </label>
          <select
            value={filters.audience}
            onChange={(e) => update('audience', e.target.value)}
            className="admin-input py-1.5 px-2 text-xs w-full rounded-sm bg-white"
          >
            <option value="all">All Audiences</option>
            <option value="womens">Women&apos;s Edit</option>
            <option value="student">School &amp; Student</option>
            <option value="everyday">Everyday</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/60 block mb-1 font-medium">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            className="admin-input py-1.5 px-2 text-xs w-full rounded-sm bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Collection */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/60 block mb-1 font-medium">
            Collection
          </label>
          <select
            value={filters.collection}
            onChange={(e) => update('collection', e.target.value)}
            className="admin-input py-1.5 px-2 text-xs w-full rounded-sm bg-white"
          >
            <option value="all">All Collections</option>
            {collections.map((col) => (
              <option key={col.slug} value={col.slug}>
                {col.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

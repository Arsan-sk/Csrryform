'use client';

import React from 'react';
import type { Category, Collection } from '@/types/collection';

export interface ProductFilterState {
  search: string;
  category: string;
  collection: string;
  audience: string;
  status: 'all' | 'active' | 'hidden';
  featured: 'all' | 'featured' | 'standard';
  isNew: 'all' | 'new' | 'standard';
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
    filters.status !== 'all' ? 1 : 0,
    filters.featured !== 'all' ? 1 : 0,
    filters.isNew !== 'all' ? 1 : 0,
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
            placeholder="Search by product name or slug…"
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
            Showing <strong>{totalFiltered}</strong> of {totalProducts}
          </span>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-wine hover:underline font-mono uppercase tracking-wider flex items-center gap-1"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-espresso/8">
        {/* Audience */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/50 block mb-1">Audience</label>
          <select
            value={filters.audience}
            onChange={(e) => update('audience', e.target.value)}
            className="admin-input py-1.5 px-2 text-xs w-full"
          >
            <option value="all">All Audiences</option>
            <option value="womens">Women&apos;s</option>
            <option value="student">Student</option>
            <option value="everyday">Everyday</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/50 block mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            className="admin-input py-1.5 px-2 text-xs w-full"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Collection */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/50 block mb-1">Collection</label>
          <select
            value={filters.collection}
            onChange={(e) => update('collection', e.target.value)}
            className="admin-input py-1.5 px-2 text-xs w-full"
          >
            <option value="all">All Collections</option>
            {collections.map((col) => (
              <option key={col.slug} value={col.slug}>
                {col.title}
              </option>
            ))}
          </select>
        </div>

        {/* Active / Hidden */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/50 block mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => update('status', e.target.value as ProductFilterState['status'])}
            className="admin-input py-1.5 px-2 text-xs w-full"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="hidden">Hidden Only</option>
          </select>
        </div>

        {/* Featured */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/50 block mb-1">Featured</label>
          <select
            value={filters.featured}
            onChange={(e) => update('featured', e.target.value as ProductFilterState['featured'])}
            className="admin-input py-1.5 px-2 text-xs w-full"
          >
            <option value="all">All Pieces</option>
            <option value="featured">Featured Only</option>
            <option value="standard">Non-Featured</option>
          </select>
        </div>

        {/* New Arrival */}
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/50 block mb-1">New Badge</label>
          <select
            value={filters.isNew}
            onChange={(e) => update('isNew', e.target.value as ProductFilterState['isNew'])}
            className="admin-input py-1.5 px-2 text-xs w-full"
          >
            <option value="all">All Items</option>
            <option value="new">New Arrivals Only</option>
            <option value="standard">Standard Items</option>
          </select>
        </div>
      </div>
    </div>
  );
}

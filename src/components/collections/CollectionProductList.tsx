'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { NormalisedProduct } from '@/types/product';
import type { Category } from '@/types/collection';
import { getProductBadge } from '@/lib/utils';

interface CollectionProductListProps {
  initialProducts: NormalisedProduct[];
  categories: Category[];
  collectionSlug?: string;
  activeCategory?: string;
  activeSort?: string;
}

export function CollectionProductList({
  initialProducts,
  categories,
  collectionSlug,
  activeCategory,
  activeSort = 'featured',
}: CollectionProductListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleCategoryChange = (categorySlug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div>
      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-espresso/10">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCategoryChange(undefined)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !activeCategory
                ? 'bg-espresso text-ivory'
                : 'bg-ivory border border-espresso/20 text-espresso hover:border-espresso'
            }`}
          >
            All Items ({initialProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-espresso text-ivory'
                  : 'bg-ivory border border-espresso/20 text-espresso hover:border-espresso'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-xs uppercase tracking-wider text-espresso/60 font-mono">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={activeSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-transparent border border-espresso/20 text-espresso text-xs rounded-sm px-3 py-1.5 focus:outline-none focus:border-wine"
          >
            <option value="featured">Featured</option>
            <option value="newest">New Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {initialProducts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl text-espresso mb-3">No products found</p>
          <p className="text-sm text-espresso/60 mb-6">
            There are no products matching your selected category.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 bg-espresso text-ivory text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-wine transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${isPending ? 'opacity-50' : ''}`}>
          {initialProducts.map((product) => {
            const badge = getProductBadge(product.flags);
            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] bg-espresso/5 rounded-sm overflow-hidden mb-4">
                  {product.primaryImage ? (
                    <Image
                      src={product.primaryImage.url}
                      alt={product.primaryImage.alt}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 img-fallback">
                      <span className="font-mono text-xs text-espresso/30">
                        {product.name}
                      </span>
                    </div>
                  )}

                  {badge && (
                    <div className="absolute top-3 left-3 bg-espresso text-ivory text-xs font-mono uppercase px-2 py-0.5 rounded-sm">
                      {badge}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="font-mono text-xs text-espresso/40 uppercase tracking-wider">
                    {product.type.replace(/_/g, ' ')}
                  </p>
                  <h3 className="font-serif text-lg text-espresso group-hover:text-wine transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-espresso/60 line-clamp-1">
                    {product.shortDescription}
                  </p>
                  <p className="text-xs text-espresso/40 pt-1 italic">
                    Contact for availability
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections, getActiveProducts } from '@/lib/data';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'All Collections & Full Catalogue',
  description: "Browse CARRYFORM's curated collections and complete showroom catalogue: Women's bags, School & Student carry, and everyday pieces.",
};

export default async function CollectionsPage() {
  const [collections, allProducts] = await Promise.all([
    getCollections(),
    getActiveProducts(),
  ]);

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Collections' }]} />

      <div className="max-w-2xl mt-8 mb-12">
        <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-3 font-medium">
          EXPLORE
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-espresso mb-4">
          Our Collections
        </h1>
        <p className="text-base md:text-lg text-espresso/60 leading-relaxed">
          Curated paths for every kind of carry. Explore women&apos;s everyday styles or discover our school and student range.
        </p>
      </div>

      {/* Collection Portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {collections.map((col) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className="group block border border-espresso/15 rounded-sm p-8 bg-ivory hover:border-wine/60 hover:shadow-sm transition-all duration-300"
          >
            <div className="font-mono text-xs text-wine uppercase tracking-widest mb-4">
              {col.audience === 'womens'
                ? "Women's"
                : col.audience === 'student'
                ? 'School & Student'
                : 'Everyday'}
            </div>
            <h2 className="font-serif text-2xl text-espresso group-hover:text-wine transition-colors mb-3">
              {col.title}
            </h2>
            <p className="text-sm text-espresso/60 leading-relaxed mb-6">
              {col.description}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-espresso group-hover:gap-3 group-hover:text-wine transition-all duration-200">
              Browse collection
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>

      {/* All Products in Explore Catalogue — Requirement 4 */}
      <div className="border-t border-espresso/12 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-2 font-medium">
              CATALOGUE ARCHIVE
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-espresso tracking-tight">
              All Products
            </h2>
            <p className="text-sm text-espresso/60 mt-1">
              Every piece currently in the showroom ({allProducts.length} items total).
            </p>
          </div>
          <p className="font-mono text-xs text-espresso/45">
            Showing all items regardless of landing-page assignments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {allProducts.map((product) => {
            const primaryImage = product.primaryImage || product.images?.[0];
            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group block border border-espresso/10 rounded-sm p-3 bg-white/40 hover:border-wine/40 hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-[4/5] bg-espresso/5 rounded-sm overflow-hidden mb-3.5">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || product.name}
                      fill
                      className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-espresso/30">
                      {product.name}
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 bg-espresso/80 backdrop-blur-xs text-ivory text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm">
                    {product.audience === 'student' ? 'Student' : "Women's"}
                  </div>
                </div>

                <div className="space-y-1 px-1 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[10px] text-espresso/50 uppercase tracking-wider truncate">
                      {product.type.replace(/_/g, ' ')}
                    </p>
                    <span className="font-mono text-xs font-semibold text-espresso">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  </div>
                  <h3 className="font-serif text-base text-espresso group-hover:text-wine transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-espresso/60 line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

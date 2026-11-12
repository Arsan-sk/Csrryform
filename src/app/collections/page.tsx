import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollections } from '@/lib/data';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'All Collections',
  description: "Browse CARRYFORM's curated collections: Women's bags and School & Student bags.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Collections' }]} />

      <div className="max-w-2xl mt-8 mb-16">
        <p className="font-mono text-xs tracking-[0.3em] text-espresso/40 uppercase mb-4">
          EXPLORE
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-espresso mb-4">
          Our Collections
        </h1>
        <p className="text-base md:text-lg text-espresso/60 leading-relaxed">
          Curated paths for every kind of carry. Explore women's everyday styles or discover our school and student range.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    </div>
  );
}


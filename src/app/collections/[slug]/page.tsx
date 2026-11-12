import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCollectionBySlug, getProductsByCollection, getCategories } from '@/lib/data';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CollectionProductList } from '@/components/collections/CollectionProductList';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: 'Collection Not Found' };
  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const { category, sort } = await searchParams;

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const [products, allCategories] = await Promise.all([
    getProductsByCollection(slug, { categorySlug: category }, sort as any),
    getCategories(),
  ]);

  // Categories relevant to this collection's audience
  const relevantCategories = allCategories.filter(
    (c) => c.audience === collection.audience || collection.audience === 'everyday'
  );

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Collections', href: '/collections' },
          { label: collection.title },
        ]}
      />

      {/* Collection Hero */}
      <div className="mt-8 mb-12 border-b border-espresso/10 pb-12">
        <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-4">
          {collection.audience === 'womens'
            ? "Women's Collection"
            : collection.audience === 'student'
            ? 'School & Student Range'
            : 'Everyday Collection'}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-espresso mb-4">
          {collection.title}
        </h1>
        <p className="text-base md:text-lg text-espresso/60 max-w-2xl leading-relaxed">
          {collection.description}
        </p>
      </div>

      {/* Client-side product listing with filters and sorting */}
      <CollectionProductList
        initialProducts={products}
        categories={relevantCategories}
        collectionSlug={slug}
        activeCategory={category}
        activeSort={sort}
      />
    </div>
  );
}


import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getRelatedProducts } from '@/lib/data';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductSpecifications } from '@/components/products/ProductSpecifications';
import { ProductEnquiry } from '@/components/products/ProductEnquiry';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import contactData from '@/data/contact.json';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | CARRYFORM`,
      description: product.shortDescription,
      images: product.primaryImage ? [{ url: product.primaryImage.url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product, 3);

  const audienceLabel =
    product.audience === 'student' ? 'School & Student' : "Women's Bags";
  const primaryCollectionSlug = product.collectionSlugs[0] ?? 'womens-edit';

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: audienceLabel, href: `/collections/${primaryCollectionSlug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-8">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-start">
          <div className="border-b border-espresso/10 pb-6 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-wine block mb-3">
              {product.audience === 'student' ? 'Student Edition' : "Women's Collection"}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-espresso mb-4">
              {product.name}
            </h1>
            <p className="text-base text-espresso/70 leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            {/* Availability info */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-espresso/5 rounded text-xs font-mono text-espresso/70">
              <span className="w-2 h-2 rounded-full bg-brass"></span>
              <span>Available upon enquiry</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mb-10">
            <ProductEnquiry product={product} whatsappNumber={contactData.whatsapp} />
          </div>

          {/* Specifications */}
          <div className="border-t border-espresso/10 pt-8">
            <h2 className="font-serif text-xl text-espresso mb-4">Product Details</h2>
            <ProductSpecifications product={product} />
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 pt-16 border-t border-espresso/10">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  );
}


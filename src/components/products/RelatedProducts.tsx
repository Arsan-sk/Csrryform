import Link from 'next/link';
import Image from 'next/image';
import type { NormalisedProduct } from '@/types/product';

interface RelatedProductsProps {
  products: NormalisedProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-espresso">You May Also Like</h2>
        <Link
          href="/collections"
          className="text-xs uppercase font-mono tracking-widest text-wine hover:text-wine/80"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
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
            </div>

            <div className="space-y-1">
              <p className="font-mono text-xs text-espresso/40 uppercase tracking-wider">
                {product.type.replace(/_/g, ' ')}
              </p>
              <h3 className="font-serif text-base text-espresso group-hover:text-wine transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-espresso/40 italic">
                Contact to confirm availability
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


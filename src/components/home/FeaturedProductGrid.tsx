'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { NormalisedProduct } from '@/types/product';
import { getProductBadge } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProductGridProps {
  products: NormalisedProduct[];
}

export function FeaturedProductGrid({ products }: FeaturedProductGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Show a balanced mix: up to 6 products
  const displayProducts = products.slice(0, 6);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    if (headerRef.current) {
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }

    if (gridRef.current) {
      tl.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-ivory overflow-hidden"
      aria-labelledby="featured-grid-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 md:mb-16 gap-4"
        >
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-espresso/40 uppercase mb-3">
              THE ART OF CARRYING / 08
            </p>
            <h2
              id="featured-grid-heading"
              className="font-serif text-3xl sm:text-4xl text-espresso tracking-tight"
            >
              Selected pieces.
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-wine hover:text-wine/80 font-medium transition-colors group/link"
          >
            <span>View all collections</span>
            <span className="transition-transform group-hover/link:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {displayProducts.map((product) => {
            const badge = getProductBadge(product.flags);
            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] bg-espresso/5 rounded-sm overflow-hidden mb-4 border border-espresso/10 group-hover:border-wine/30 transition-colors shadow-xs group-hover:shadow-md">
                  {product.primaryImage ? (
                    <Image
                      src={product.primaryImage.url}
                      alt={product.primaryImage.alt || product.name}
                      fill
                      className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 img-fallback">
                      <span className="font-mono text-xs text-espresso/30">
                        {product.name}
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  {badge && (
                    <div className="absolute top-3 left-3 bg-espresso/90 backdrop-blur-xs text-ivory text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm shadow-xs">
                      {badge}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="font-mono text-[10px] text-espresso/40 uppercase tracking-widest">
                    {product.audience === 'student' ? 'School & Student' : "Women's Bags"}
                  </p>
                  <h3 className="font-serif text-lg text-espresso group-hover:text-wine transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-espresso/60 line-clamp-1 leading-relaxed">
                    {product.shortDescription}
                  </p>
                  <p className="text-[11px] text-wine/80 pt-1 font-mono uppercase tracking-wider">
                    Enquire for availability →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}


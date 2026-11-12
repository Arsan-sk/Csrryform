'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { NormalisedProduct } from '@/types/product';

gsap.registerPlugin(ScrollTrigger);

interface StudentSpotlightProps {
  products: NormalisedProduct[];
}

export function StudentSpotlight({ products }: StudentSpotlightProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const studentProducts = products.filter((p) => p.audience === 'student').length > 0
    ? products.filter((p) => p.audience === 'student').slice(0, 3)
    : products.slice(0, 3);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.fromTo(
      cardsRef.current?.children || [],
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-espresso text-ivory overflow-hidden"
      aria-labelledby="student-spotlight-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-sage uppercase mb-3">
              THE ART OF CARRYING / 05
            </p>
            <h2
              id="student-spotlight-heading"
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-ivory max-w-xl tracking-tight"
            >
              Ready for every new beginning.
            </h2>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-ivory/70 max-w-sm mb-3 leading-relaxed">
              Made for the everyday rhythm of school, study, and everything in between.
            </p>
            <Link
              href="/collections/school-student"
              className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-sage hover:text-ivory font-medium transition-colors"
            >
              <span>Explore school &amp; student bags</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Product cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {studentProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group block bg-espresso/80 border border-ivory/15 rounded-sm overflow-hidden hover:border-sage/60 transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] bg-ivory/5 overflow-hidden">
                {product.primaryImage && (
                  <Image
                    src={product.primaryImage.url}
                    alt={product.primaryImage.alt || product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute top-3 left-3 bg-espresso/80 backdrop-blur-sm text-sage text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border border-ivory/10">
                  {product.type === 'school_backpack' ? 'School Edition' : 'Campus Edition'}
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-serif text-lg text-ivory group-hover:text-brass transition-colors mb-1.5">
                  {product.name}
                </h3>
                <p className="text-xs text-ivory/60 line-clamp-2 leading-relaxed mb-3">
                  {product.shortDescription}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-ivory/40 pt-2 border-t border-ivory/10">
                  <span>Enquire Availability</span>
                  <span className="text-sage group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import type { NormalisedProduct } from '@/types/product';

interface CuratedProductStageProps {
  products: NormalisedProduct[];
}

export function CuratedProductStage({ products }: CuratedProductStageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const announceRef = useRef<HTMLParagraphElement>(null);

  const active = products[activeIndex];

  const goTo = useCallback((index: number) => {
    setDirection(index > activeIndex ? 'right' : 'left');
    setActiveIndex(index);
  }, [activeIndex]);

  const goPrev = useCallback(() => {
    setDirection('left');
    setActiveIndex((i) => (i - 1 + products.length) % products.length);
  }, [products.length]);

  const goNext = useCallback(() => {
    setDirection('right');
    setActiveIndex((i) => (i + 1) % products.length);
  }, [products.length]);

  // Touch swipe support (PRD §6.4.E)
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    if (diff < -50) goPrev();
    touchStartX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  // Screen reader notification
  useEffect(() => {
    if (announceRef.current && active) {
      announceRef.current.textContent = `Product ${activeIndex + 1} of ${products.length}: ${active.name}`;
    }
  }, [activeIndex, active, products.length]);

  if (!products.length || !active) return null;

  return (
    <section
      className="py-16 md:py-24 bg-ivory overflow-hidden"
      aria-labelledby="curated-stage-heading"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <p
        ref={announceRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-14">
          <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-3">
            THE ART OF CARRYING / 04
          </p>
          <h2
            id="curated-stage-heading"
            className="font-serif text-3xl sm:text-4xl text-espresso tracking-tight"
          >
            A curated showroom edit.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center">
          {/* Main Product Showcase Stage — 7 columns */}
          <div className="md:col-span-7 relative">
            <div className="relative aspect-[4/5] sm:aspect-[1/1] bg-espresso/5 rounded-sm overflow-hidden shadow-md border border-espresso/10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.slug}
                  initial={{
                    opacity: 0,
                    x: direction === 'right' ? 30 : -30,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x: direction === 'right' ? -30 : 30,
                    scale: 0.98,
                  }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0"
                >
                  {active.primaryImage && (
                    <Image
                      src={active.primaryImage.url}
                      alt={active.primaryImage.alt || active.name}
                      fill
                      priority
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Index counter badge */}
              <div className="absolute bottom-4 left-4 font-mono text-xs text-espresso/70 bg-ivory/95 backdrop-blur-sm px-3 py-1.5 rounded-sm shadow-sm border border-espresso/10 z-10">
                {String(activeIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
              </div>
            </div>
            <div className="curated-controls curated-controls-mobile">
              <CarouselControls
                products={products}
                activeIndex={activeIndex}
                goPrev={goPrev}
                goNext={goNext}
                goTo={goTo}
              />
            </div>
          </div>

          {/* Interactive Specification & Switching Details — 5 columns */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug + '-details'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs text-wine uppercase tracking-wider">
                    {active.audience === 'student' ? 'School & Student' : "Women's Collection"}
                  </span>
                  <span className="text-espresso/30">•</span>
                  <span className="font-mono text-xs text-espresso/50 uppercase">
                    {active.type.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-espresso mb-4 leading-tight">
                  {active.name}
                </h3>
                <p className="text-sm sm:text-base text-espresso/70 leading-relaxed mb-6">
                  {active.shortDescription}
                </p>

                <div className="p-4 bg-espresso/5 rounded-sm mb-6 border-l-2 border-wine">
                  <p className="text-xs font-mono text-espresso/60 uppercase tracking-wider mb-1">
                    Showroom Status
                  </p>
                  <p className="text-xs text-espresso font-medium">
                    Available upon enquiry · Verified dimensions available on request
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/products/${active.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-wine text-white text-xs font-medium uppercase tracking-wider rounded-sm hover:bg-wine/90 transition-all shadow-sm"
                  >
                    <span>View Specifications</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Previous / Next Controls */}
            <div className="curated-controls curated-controls-desktop">
              <CarouselControls
                products={products}
                activeIndex={activeIndex}
                goPrev={goPrev}
                goNext={goNext}
                goTo={goTo}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CarouselControls({
  products,
  activeIndex,
  goPrev,
  goNext,
  goTo,
}: {
  products: NormalisedProduct[];
  activeIndex: number;
  goPrev: () => void;
  goNext: () => void;
  goTo: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={goPrev}
          aria-label="Previous product"
          className="w-10 h-10 rounded-full border border-espresso/20 flex items-center justify-center text-espresso hover:border-wine hover:bg-wine hover:text-white active:scale-95 transition-[transform,background-color,border-color,color] duration-160 shadow-xs"
        >
          <span aria-hidden="true" className="text-xs">←</span>
        </button>
        <button
          onClick={goNext}
          aria-label="Next product"
          className="w-10 h-10 rounded-full border border-espresso/20 flex items-center justify-center text-espresso hover:border-wine hover:bg-wine hover:text-white active:scale-95 transition-[transform,background-color,border-color,color] duration-160 shadow-xs"
        >
          <span aria-hidden="true" className="text-xs">→</span>
        </button>
      </div>
      <div className="flex gap-1.5" aria-label="Product position">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to product ${i + 1}`}
            aria-current={i === activeIndex ? 'true' : undefined}
            className={`h-1.5 transition-[width,background-color] duration-200 rounded-full ${
              i === activeIndex ? 'w-6 bg-wine' : 'w-1.5 bg-espresso/20 hover:bg-espresso/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

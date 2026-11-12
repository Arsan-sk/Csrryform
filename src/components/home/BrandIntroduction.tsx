'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function BrandIntroduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Coordinated GSAP timeline triggered on scroll (PRD §6.4.C)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }
    )
    .fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 0.8, ease: 'power3.inOut' },
      '-=0.5'
    )
    .fromTo(
      imageWrapperRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power3.out' },
      '-=0.7'
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-ivory overflow-hidden"
      aria-labelledby="brand-intro-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text side */}
          <div ref={textRef}>
            <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-4">
              THE ART OF CARRYING / 02
            </p>
            <div ref={lineRef} className="h-0.5 w-16 bg-wine/30 mb-6" />
            <h2
              id="brand-intro-heading"
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-espresso leading-tight mb-6"
            >
              A bag is more than what you carry in it.
            </h2>
            <p className="text-base sm:text-lg text-espresso/70 leading-relaxed mb-4">
              Every bag in our collection is chosen because it works — for a school morning, a city errand, a day&apos;s work, or simply because it feels like you.
            </p>
            <p className="text-sm sm:text-base text-espresso/60 leading-relaxed">
              We believe the right bag changes the way a day begins. CARRYFORM is a carefully curated accessories showroom for thoughtful daily routines.
            </p>
          </div>

          {/* Real editorial photograph */}
          <div
            ref={imageWrapperRef}
            className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-lg border border-espresso/10"
          >
            <Image
              src="/images/brand/craftsmanship.jpg"
              alt="CARRYFORM atelier craftsmanship and structured bag construction"
              fill
              className="object-cover hover:scale-103 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-ivory/80 uppercase tracking-widest bg-espresso/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
              Editorial Studio · Atelier
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

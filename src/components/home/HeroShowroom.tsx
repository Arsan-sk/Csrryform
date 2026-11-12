'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function HeroShowroom() {
  const heroRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const zipperPullRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    // Zipper reveal signature moment (PRD §6.4.A)
    const tl = gsap.timeline({
      onComplete: () => setRevealed(true),
      delay: 0.15,
    });

    if (maskRef.current) {
      gsap.set(maskRef.current, {
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
      });
    }
    if (zipperPullRef.current) {
      gsap.set(zipperPullRef.current, { top: '0%', opacity: 1 });
    }
    if (contentRef.current) {
      gsap.set(contentRef.current, { opacity: 0, y: 15 });
    }

    // Zipper pull glides down while mask smoothly unfolds
    tl.to(zipperPullRef.current, {
      top: '100%',
      duration: 1.1,
      ease: 'power3.inOut',
    })
    .to(
      maskRef.current,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.1,
        ease: 'power3.inOut',
      },
      '<0.05'
    )
    .to(zipperPullRef.current, {
      opacity: 0,
      duration: 0.3,
    })
    .to(
      contentRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      className="relative w-full min-w-full h-screen h-dvh flex items-center justify-center overflow-hidden bg-espresso text-ivory pt-14 pb-6 sm:pb-8"
      aria-label="Hero — CARRYFORM showroom"
    >
      {/* Background imagery with editorial tint */}
      <div
        ref={maskRef}
        className="absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="/images/home/hero-showroom.jpg"
          alt="CARRYFORM showroom editorial background"
          fill
          priority
          className="object-cover object-center opacity-30 scale-105 filter contrast-110"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/80 to-transparent" />
      </div>

      {/* Signature Zipper Pull indicator */}
      <div
        ref={zipperPullRef}
        className="absolute left-1/2 -translate-x-1/2 w-6 h-10 pointer-events-none z-30 flex flex-col items-center"
        aria-hidden="true"
      >
        <div className="w-1.5 h-6 bg-brass rounded-sm shadow-md" />
        <div className="w-3 h-4 bg-brass/80 rounded-b-sm border border-brass" />
      </div>

      {/* Content wrapper: streamlined spacing so buttons are visible at first glance on all desktop screens */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center my-auto"
      >
        {/* Chapter marker */}
        <p className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-ivory/50 uppercase mb-2 sm:mb-3">
          THE ART OF CARRYING / 01
        </p>

        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-ivory leading-[1.1] tracking-tight mb-3 sm:mb-4">
            Carry a little more of who you are.
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-ivory/70 mb-5 sm:mb-6 max-w-xl leading-relaxed">
            Thoughtfully chosen bags for school days, city days, and everything in between.
          </p>

          {/* Primary & Secondary Action CTAs — visible above the fold on all standard 1080p, laptop, and mobile screens */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 bg-wine text-white font-medium text-xs sm:text-sm tracking-wide rounded-sm hover:bg-wine/90 transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              Explore the collection
            </Link>
            <Link
              href="/collections/school-student"
              className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 border border-ivory/40 text-ivory font-medium text-xs sm:text-sm tracking-wide rounded-sm hover:border-ivory hover:bg-ivory/10 transition-colors active:scale-98"
            >
              Find a school or student bag
            </Link>
          </div>
        </div>

        {/* Dual-world indicators */}
        <div className="grid grid-cols-2 max-w-md gap-4 sm:gap-6 border-t border-ivory/15 pt-3 sm:pt-4">
          <div>
            <p className="font-mono text-[10px] sm:text-xs text-ivory/50 uppercase tracking-widest mb-0.5">
              Women&apos;s Bags
            </p>
            <p className="text-xs sm:text-sm text-ivory/70">Handbags, totes &amp; shoulder bags</p>
          </div>
          <div>
            <p className="font-mono text-[10px] sm:text-xs text-sage uppercase tracking-widest mb-0.5">
              School &amp; Student
            </p>
            <p className="text-xs sm:text-sm text-ivory/70">Backpacks, daypacks &amp; campus carry</p>
          </div>
        </div>
      </div>
    </section>
  );
}

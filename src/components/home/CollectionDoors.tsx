'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Collection } from '@/types/collection';

gsap.registerPlugin(ScrollTrigger);

interface CollectionDoorsProps {
  collections: Collection[];
}

export function CollectionDoors({ collections }: CollectionDoorsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const womensRef = useRef<HTMLDivElement>(null);
  const studentRef = useRef<HTMLDivElement>(null);

  const womens = collections.find((c) => c.audience === 'womens');
  const student = collections.find((c) => c.audience === 'student');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Staggered perspective reveal (PRD §6.4.D)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      womensRef.current,
      { opacity: 0, y: 50, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' }
    ).fromTo(
      studentRef.current,
      { opacity: 0, y: 50, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' },
      '-=0.7'
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-espresso/5 overflow-hidden"
      aria-labelledby="collection-doors-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10 md:mb-14">
          <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-3">
            THE ART OF CARRYING / 03
          </p>
          <h2
            id="collection-doors-heading"
            className="font-serif text-3xl sm:text-4xl text-espresso tracking-tight"
          >
            Two worlds. One place to carry.
          </h2>
        </div>

        {/* 62% / 38% Golden-Ratio Grid Split */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
          {/* Women's Bags Door — 3 of 5 cols */}
          <div ref={womensRef} className="md:col-span-3">
            <Link
              href={womens ? `/collections/${womens.slug}` : '/collections/womens-edit'}
              className="group relative flex flex-col justify-end h-[460px] md:h-[540px] rounded-sm overflow-hidden border border-espresso/15 shadow-md hover:shadow-xl transition-all duration-500"
              aria-label="Explore Women's Bags Collection"
            >
              <Image
                src="/images/collections/womens-edit-hero.jpg"
                alt="Women's curated bags and accessories"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-transparent opacity-85 group-hover:opacity-80 transition-opacity" />

              <div className="relative z-10 p-6 md:p-8">
                <span className="inline-block bg-wine text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-sm mb-3">
                  Women&apos;s Collection
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory mb-2 group-hover:text-brass transition-colors">
                  {womens?.title || "The Women's Edit"}
                </h3>
                <p className="text-xs sm:text-sm text-ivory/70 max-w-sm mb-4 leading-relaxed line-clamp-2">
                  {womens?.description || 'A curated selection of handbags, shoulder bags, and everyday styles.'}
                </p>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-ivory group-hover:text-brass transition-all">
                  <span>Enter Collection</span>
                  <span className="transition-transform group-hover:translate-x-1.5" aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </div>

          {/* School & Student Door — 2 of 5 cols */}
          <div ref={studentRef} className="md:col-span-2">
            <Link
              href={student ? `/collections/${student.slug}` : '/collections/school-student'}
              className="group relative flex flex-col justify-end h-[460px] md:h-[540px] rounded-sm overflow-hidden border border-espresso/15 shadow-md hover:shadow-xl transition-all duration-500"
              aria-label="Explore School & Student Collection"
            >
              <Image
                src="/images/collections/school-student-hero.jpg"
                alt="School, study and college backpacks"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

              <div className="relative z-10 p-6 md:p-8">
                <span className="inline-block bg-sage text-espresso text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-sm mb-3 font-semibold">
                  School &amp; Student
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory mb-2 group-hover:text-brass transition-colors">
                  {student?.title || 'School & Student'}
                </h3>
                <p className="text-xs sm:text-sm text-ivory/70 max-w-xs mb-4 leading-relaxed line-clamp-2">
                  {student?.description || 'Practical, durable bags made for school routines and campus life.'}
                </p>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-ivory group-hover:text-brass transition-all">
                  <span>Enter Collection</span>
                  <span className="transition-transform group-hover:translate-x-1.5" aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

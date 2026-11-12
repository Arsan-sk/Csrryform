'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function MaterialStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const details = [
    {
      title: 'Stitching & Finish',
      description: 'Clean line construction, reinforced stress points, and considered proportions for long-term wear.',
      tag: '01 / FINISH',
    },
    {
      title: 'Hardware & Zips',
      description: 'Smooth-gliding closures and brushed-finish pulls designed for seamless daily routines.',
      tag: '02 / HARDWARE',
    },
    {
      title: 'Strap Comfort',
      description: 'Padded straps for study days, balanced drop-lengths for effortless city shoulder carry.',
      tag: '03 / CARRY',
    },
    {
      title: 'Compartment Layout',
      description: 'Thoughtful interiors with dedicated spaces for essentials you reach for throughout the day.',
      tag: '04 / INTERIOR',
    },
  ];

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.fromTo(
      gridRef.current?.children || [],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-ivory overflow-hidden"
      aria-labelledby="material-story-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-12 md:mb-16">
          <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-3">
            THE ART OF CARRYING / 06
          </p>
          <h2
            id="material-story-heading"
            className="font-serif text-3xl sm:text-4xl text-espresso mb-3 tracking-tight"
          >
            A closer look.
          </h2>
          <p className="text-sm sm:text-base text-espresso/70 leading-relaxed">
            The small details that separate a bag you just use from one you genuinely love carrying.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {details.map((item) => (
            <div
              key={item.tag}
              className="p-6 bg-espresso/5 rounded-sm border border-espresso/10 hover:border-wine/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <p className="font-mono text-[10px] text-wine uppercase tracking-widest mb-3">
                  {item.tag}
                </p>
                <h3 className="font-serif text-lg sm:text-xl text-espresso mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-espresso/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

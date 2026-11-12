'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function WhyCarryform() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const pillars = [
    {
      num: '01',
      title: 'A Curated Range',
      desc: 'Every bag is individually selected. No overwhelming walls of product — only styles we genuinely believe in.',
    },
    {
      num: '02',
      title: 'Two Clear Worlds',
      desc: "Equal thought given to women's everyday style and practical student bags. Neither is an afterthought.",
    },
    {
      num: '03',
      title: 'Practical Information',
      desc: 'Real compartments, real closures, real details. We tell you what we know and don’t invent what we don’t.',
    },
    {
      num: '04',
      title: 'Personal Assistance',
      desc: 'Have a question about fit, size, or availability? Message us directly — we’re here to help you find the right one.',
    },
  ];

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
      const items = gridRef.current.children;
      // Stagger animate each pillar with line draw and content lift
      tl.fromTo(
        items,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-espresso/4 overflow-hidden"
      aria-labelledby="why-carryform-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="max-w-xl mb-12 md:mb-16">
          <p className="font-mono text-xs tracking-[0.3em] text-espresso/40 uppercase mb-3">
            THE ART OF CARRYING / 09
          </p>
          <h2
            id="why-carryform-heading"
            className="font-serif text-3xl sm:text-4xl text-espresso tracking-tight"
          >
            Why CARRYFORM.
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="group border-t border-espresso/20 pt-6 sm:pt-8 hover:border-wine/60 transition-colors"
            >
              <span className="font-mono text-2xl font-light text-wine mb-3 sm:mb-4 block transition-transform group-hover:scale-105">
                {pillar.num}
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-espresso mb-2 sm:mb-3 group-hover:text-wine transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-espresso/65 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


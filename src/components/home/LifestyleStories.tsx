'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function LifestyleStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const stories = [
    {
      chapter: 'SCENE 01',
      title: 'The City Morning',
      description:
        'A coffee, keys, a notebook, and the quiet satisfaction of a bag that holds it all without asking for attention.',
      collection: "Women's Edit",
      href: '/collections/womens-edit',
      tag: 'City Routine',
    },
    {
      chapter: 'SCENE 02',
      title: 'The Study Routine',
      description:
        'Notebooks, pens, a water bottle, and the steady rhythm of a semester that demands a pack that can keep up.',
      collection: 'School & Student',
      href: '/collections/school-student',
      tag: 'Study Days',
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

    if (cardsRef.current) {
      tl.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-espresso/5 overflow-hidden"
      aria-labelledby="lifestyle-stories-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-12 md:mb-16">
          <p className="font-mono text-xs tracking-[0.3em] text-espresso/40 uppercase mb-3">
            THE ART OF CARRYING / 07
          </p>
          <h2
            id="lifestyle-stories-heading"
            className="font-serif text-3xl sm:text-4xl text-espresso tracking-tight"
          >
            Everyday stories.
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {stories.map((story) => (
            <div
              key={story.chapter}
              className="group bg-ivory border border-espresso/10 p-8 sm:p-10 rounded-sm flex flex-col justify-between shadow-sm hover:shadow-md hover:border-wine/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <span className="font-mono text-xs text-wine uppercase tracking-widest font-medium">
                    {story.chapter}
                  </span>
                  <span className="text-[11px] text-espresso/40 font-mono uppercase tracking-wider bg-espresso/5 px-2.5 py-0.5 rounded-sm">
                    {story.tag}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-espresso mb-3 sm:mb-4 group-hover:text-wine transition-colors">
                  {story.title}
                </h3>
                <p className="text-sm sm:text-base text-espresso/65 leading-relaxed mb-8">
                  {story.description}
                </p>
              </div>

              <Link
                href={story.href}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-espresso hover:text-wine transition-colors self-start group/link"
              >
                <span>Explore {story.collection}</span>
                <span className="transition-transform group-hover/link:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


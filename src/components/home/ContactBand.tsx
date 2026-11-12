'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ContactInfo } from '@/types/site';
import { buildGenericWhatsAppUrl } from '@/lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

interface ContactBandProps {
  contact: ContactInfo;
}

export function ContactBand({ contact }: ContactBandProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const whatsappUrl = buildGenericWhatsAppUrl(contact.whatsapp);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-ivory border-t border-espresso/10 overflow-hidden"
      aria-labelledby="contact-band-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-espresso/40 uppercase mb-3">
            THE ART OF CARRYING / 10
          </p>
          <h2
            id="contact-band-heading"
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-espresso mb-4 sm:mb-6 tracking-tight"
          >
            Found your kind of carry?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-espresso/65 mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto">
            Let us help you find the right bag. Message us with any questions about availability, sizing, or styling.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-wine text-white text-xs sm:text-sm font-medium rounded-sm hover:bg-wine/90 transition-all shadow-sm hover:shadow-md active:scale-98"
              >
                Chat on WhatsApp
              </a>
            ) : (
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-wine text-white text-xs sm:text-sm font-medium rounded-sm hover:bg-wine/90 transition-all shadow-sm hover:shadow-md active:scale-98"
              >
                Send an enquiry
              </Link>
            )}
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-espresso/20 text-espresso text-xs sm:text-sm font-medium rounded-sm hover:bg-espresso hover:text-ivory transition-colors active:scale-98"
            >
              Visit our contact page
            </Link>
          </div>

          {/* Explicit demo note */}
          <p className="mt-8 text-[11px] text-espresso/40 font-mono">
            Contact details will be updated with verified shop information prior to launch.
          </p>
        </div>
      </div>
    </section>
  );
}


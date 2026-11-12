'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { NavItem } from '@/types/site';
import type { ContactInfo } from '@/types/site';

gsap.registerPlugin(ScrollTrigger);

interface SiteFooterProps {
  contact: ContactInfo;
  navItems: NavItem[];
  brandName: string;
  descriptor: string;
  tagline: string;
}

export function SiteFooter({
  contact,
  navItems,
  brandName,
  descriptor,
  tagline,
}: SiteFooterProps) {
  const currentYear = 2026;
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function handleAdminTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push('/admin');
    }
  }

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="bg-espresso text-ivory/80 mt-auto overflow-hidden" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-block font-serif font-bold text-2xl text-ivory hover:text-brass transition-colors mb-3"
            >
              {brandName}
            </Link>
            <p className="text-sm text-ivory/50 mb-2">{descriptor}</p>
            <p className="text-sm text-ivory/70 italic mb-6">&ldquo;{tagline}&rdquo;</p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {contact.socials.instagram && (
                <a
                  href={contact.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/50 hover:text-ivory transition-colors text-sm"
                  aria-label="Instagram (placeholder)"
                >
                  Instagram
                </a>
              )}
              {contact.socials.facebook && (
                <a
                  href={contact.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/50 hover:text-ivory transition-colors text-sm"
                  aria-label="Facebook (placeholder)"
                >
                  Facebook
                </a>
              )}
              {contact.socials.pinterest && (
                <a
                  href={contact.socials.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/50 hover:text-ivory transition-colors text-sm"
                  aria-label="Pinterest (placeholder)"
                >
                  Pinterest
                </a>
              )}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ivory/40 mb-5">
              Collections
            </h3>
            <ul className="space-y-3">
              {navItems.slice(0, 3).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ivory/70 hover:text-ivory transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info + Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ivory/40 mb-5">
              Info
            </h3>
            <ul className="space-y-3">
              {navItems.slice(3).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ivory/70 hover:text-ivory transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-ivory/70 hover:text-ivory transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
            {contact.address && (
              <div className="mt-6 text-xs text-ivory/40 leading-relaxed">
                <span className="block">{contact.address}</span>
                {contact.openingHours && (
                  <span className="block mt-1">{contact.openingHours}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-ivory/10 flex flex-col items-center gap-3">
          <p className="text-xs text-ivory/30">
            &copy; {currentYear} {brandName}. All rights reserved.
          </p>
          {/* Required credit — must remain */}
          <p className="text-xs text-ivory/25 text-center">
            <a
              href={contact.footerCredit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ivory/50 transition-colors"
            >
              {contact.footerCredit.text}
            </a>
            <button
              type="button"
              className="creator-wave"
              aria-label="Open admin"
              title="Double-click to open admin"
              onDoubleClick={() => router.push('/admin')}
              onKeyDown={handleAdminTriggerKeyDown}
            >
              👋
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import type { NavItem } from '@/types/site';
import { buildGenericWhatsAppUrl } from '@/lib/whatsapp';

interface SiteHeaderProps {
  navItems: NavItem[];
  brandName: string;
  whatsappNumber?: string | null;
}

export function SiteHeader({ navItems, brandName, whatsappNumber }: SiteHeaderProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  const isHome = pathname === '/';
  const isDarkHero = isHome && !scrolled && !menuOpen;
  const whatsappUrl = buildGenericWhatsAppUrl(whatsappNumber);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When at top, always visible and transparent background
      if (currentScrollY <= 15) {
        setVisible(true);
        setScrolled(false);
      } else {
        setScrolled(true);
        // Scroll down: slide up / hide. Scroll up: slide down / show.
        if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
          // scrolling down
          setVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
          // scrolling up
          setVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isDarkHero
          ? 'bg-transparent'
          : 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-espresso/10'
      }`}
      aria-label="Site navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Streamlined navbar height: h-14 (56px) for sleek editorial proportion */}
        <div className="flex items-center justify-between h-14">
          {/* Logo / Wordmark */}
          <Link
            href="/"
            className={`flex-shrink-0 font-serif font-bold text-lg md:text-xl tracking-tight transition-colors ${
              isDarkHero ? 'text-ivory hover:text-brass' : 'text-espresso hover:text-wine'
            }`}
            aria-label={`${brandName} — Home`}
          >
            {brandName}
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => item.children && setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`px-3.5 py-1.5 text-xs lg:text-sm font-medium transition-colors rounded-sm ${
                    isDarkHero
                      ? 'text-ivory/85 hover:text-ivory hover:bg-white/5'
                      : 'text-espresso hover:text-wine hover:bg-espresso/5'
                  }`}
                  aria-expanded={openDropdown === item.href}
                  aria-haspopup={item.children ? 'menu' : undefined}
                >
                  {item.label}
                  {item.children && (
                    <span className="ml-1 opacity-50 text-[10px]">▾</span>
                  )}
                </Link>
                {/* Dropdown */}
                {item.children && openDropdown === item.href && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-ivory border border-espresso/10 rounded-sm shadow-lg py-1 z-50 text-espresso"
                    role="menu"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-xs text-espresso hover:bg-espresso/5 hover:text-wine transition-colors"
                        role="menuitem"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 border text-xs font-medium rounded-sm transition-colors active:scale-98 ${
                  isDarkHero
                    ? 'border-ivory/35 text-ivory hover:border-ivory hover:bg-white/10'
                    : 'border-sage/70 text-espresso hover:border-sage hover:bg-sage/15'
                }`}
              >
                <span className="navbar-whatsapp-dot" aria-hidden="true" />
                WhatsApp
              </a>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-wine text-white text-xs font-medium rounded-sm hover:bg-wine/90 transition-colors shadow-sm active:scale-98"
            >
              Enquire
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-1.5 rounded-sm transition-colors ${
              isDarkHero ? 'text-ivory hover:text-brass' : 'text-espresso hover:text-wine'
            }`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-ivory border-t border-espresso/10 overflow-hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-2.5 text-sm font-medium text-espresso hover:text-wine transition-colors border-b border-espresso/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-3 py-1 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-1.5 text-xs text-espresso/70 hover:text-wine transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 pb-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 mb-2 border border-sage text-espresso text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-sage/15 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="navbar-whatsapp-dot" aria-hidden="true" />
                    WhatsApp
                  </a>
                )}
                <Link
                  href="/contact"
                  className="block w-full text-center px-4 py-2.5 bg-wine text-white text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-wine/90 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Enquire about a bag
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

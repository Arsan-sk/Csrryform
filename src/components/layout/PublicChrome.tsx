'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import type { ContactInfo, NavItem } from '@/types/site';

interface PublicChromeProps {
  children: React.ReactNode;
  contact: ContactInfo;
  navItems: NavItem[];
  brandName: string;
  descriptor: string;
  tagline: string;
}

export function PublicChrome({
  children,
  contact,
  navItems,
  brandName,
  descriptor,
  tagline,
}: PublicChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdminRoute) {
    return <main id="main-content" className="flex-1">{children}</main>;
  }

  return (
    <>
      <SiteHeader navItems={navItems} brandName={brandName} whatsappNumber={contact.whatsapp} />
      <main id="main-content" className="flex-1">{children}</main>
      <SiteFooter
        contact={contact}
        navItems={navItems}
        brandName={brandName}
        descriptor={descriptor}
        tagline={tagline}
      />
      <FloatingWhatsApp phoneNumber={contact.whatsapp} />
    </>
  );
}

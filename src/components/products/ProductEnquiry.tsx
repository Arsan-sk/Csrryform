'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

interface ProductEnquiryProps {
  product: Product;
  whatsappNumber: string | null;
}

export function ProductEnquiry({ product, whatsappNumber }: ProductEnquiryProps) {
  const waUrl = buildWhatsAppUrl(whatsappNumber, {
    productName: product.name,
    productSlug: product.slug,
  });

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {waUrl ? (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-wine text-white text-sm font-medium rounded-sm hover:bg-wine/90 transition-colors shadow-sm"
        >
          <span>Ask about this bag on WhatsApp</span>
          <span aria-hidden="true">→</span>
        </a>
      ) : (
        <Link
          href={`/contact?product=${encodeURIComponent(product.slug)}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-wine text-white text-sm font-medium rounded-sm hover:bg-wine/90 transition-colors shadow-sm"
        >
          <span>Enquire about this bag</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}

      <Link
        href={`/contact?product=${encodeURIComponent(product.slug)}`}
        className="inline-flex items-center justify-center px-6 py-4 border border-espresso/20 text-espresso text-sm font-medium rounded-sm hover:bg-espresso hover:text-ivory transition-colors"
      >
        <span>Email / Message</span>
      </Link>
    </div>
  );
}


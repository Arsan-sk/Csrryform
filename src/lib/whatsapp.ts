// CARRYFORM — WhatsApp enquiry URL builder
// PRD §5.4: Prefill concise message with product name and slug.
// Never invent or hardcode a phone number.

interface WhatsAppEnquiryOptions {
  productName?: string;
  productSlug?: string;
  baseUrl?: string; // e.g. https://carryform.in
}

export function buildWhatsAppUrl(
  whatsappNumber: string | null | undefined,
  options: WhatsAppEnquiryOptions = {}
): string | null {
  if (!whatsappNumber) return null;

  // Strip non-digits; prepend country code if missing
  const digits = whatsappNumber.replace(/\D/g, '');
  if (!digits) return null;

  let message = 'Hi, I am interested in a bag from CARRYFORM.';

  if (options.productName) {
    const productUrl =
      options.productSlug && options.baseUrl
        ? ` ${options.baseUrl}/products/${options.productSlug}`
        : '';
    message = `Hi, I am interested in the ${options.productName}.${productUrl} Could you please help me with availability and pricing?`;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function buildGenericWhatsAppUrl(whatsappNumber: string | null | undefined): string | null {
  return buildWhatsAppUrl(whatsappNumber, {});
}


'use client';

import { buildGenericWhatsAppUrl } from '@/lib/whatsapp';

interface FloatingWhatsAppProps {
  phoneNumber: string | null | undefined;
}

export function FloatingWhatsApp({ phoneNumber }: FloatingWhatsAppProps) {
  const whatsappUrl = buildGenericWhatsAppUrl(phoneNumber);

  if (!whatsappUrl) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Chat with CARRYFORM on WhatsApp"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.55 0 .24 5.3.24 11.83c0 2.08.54 4.1 1.57 5.88L.14 23.99l6.42-1.64a11.8 11.8 0 0 0 5.52 1.37h.01c6.52 0 11.83-5.31 11.83-11.84 0-3.16-1.23-6.13-3.42-8.38ZM12.09 21.7h-.01a9.82 9.82 0 0 1-5.01-1.37l-.36-.21-3.81.97 1.02-3.71-.23-.38a9.82 9.82 0 0 1-1.5-5.17C2.19 6.4 6.62 1.97 12.08 1.97a9.78 9.78 0 0 1 6.96 2.89 9.79 9.79 0 0 1 2.88 6.96c0 5.46-4.43 9.88-9.83 9.88Zm5.42-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.51-1.78-1.69-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}

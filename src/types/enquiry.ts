// CARRYFORM — Enquiry / contact form types

export interface EnquiryFormData {
  name: string;
  phone?: string;
  email?: string;
  productSlug?: string;
  message: string;
  consent: boolean;
  // Honeypot
  website?: string;
}

export interface EnquiryResult {
  success: boolean;
  message: string;
}


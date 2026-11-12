// CARRYFORM — Zod validation for enquiry form

import { z } from 'zod';

export const EnquirySchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(100),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email').optional(),
  productSlug: z.string().optional(),
  message: z.string().min(10, 'Please add a brief message').max(2000),
  consent: z.boolean(),
  website: z.string().max(0, 'Bot detected').optional(), // honeypot
}).refine(
  (data) => data.phone || data.email,
  { message: 'Please provide a phone number or email address', path: ['phone'] }
);

export type ValidatedEnquiry = z.infer<typeof EnquirySchema>;


import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContactForm } from '@/components/contact/ContactForm';
import contactData from '@/data/contact.json';

export const metadata: Metadata = {
  title: 'Contact & Enquiries',
  description: 'Reach out to CARRYFORM for bag enquiries, store visits, and product styling assistance.',
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-8">
        {/* Left: Info */}
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-4">
            GET IN TOUCH
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-espresso mb-6">
            Let&apos;s talk about your carry.
          </h1>
          <p className="text-base text-espresso/70 leading-relaxed mb-8">
            Whether you want to check availability, confirm exact dimensions for a student backpack,
            or arrange a showroom visit, our team is ready to assist.
          </p>

          <div className="space-y-6 border-t border-espresso/10 pt-8 text-sm">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-espresso/50 mb-1">
                Showroom Location
              </h3>
              <p className="text-espresso font-medium">{contactData.address}</p>
              <p className="text-xs text-espresso/40 mt-1 font-mono">
                *(Note: Sample showroom address for prototype demonstration)*
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-espresso/50 mb-1">
                Direct Communication
              </h3>
              <p className="text-espresso">
                WhatsApp: Available for immediate inquiries during showroom hours.
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-espresso/50 mb-1">
                Social Showroom
              </h3>
              <div className="flex gap-4 text-wine font-medium">
                <a href={contactData.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Instagram
                </a>
                <a href={contactData.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Facebook
                </a>
                <a href={contactData.socials.pinterest} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Pinterest
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="bg-espresso/5 p-8 md:p-10 rounded-sm">
          <h2 className="font-serif text-2xl text-espresso mb-2">Send an Enquiry</h2>
          <p className="text-sm text-espresso/60 mb-6">
            Fill in your details below and we will get back to you shortly.
          </p>
          <ContactForm initialProductSlug={product} />
        </div>
      </div>
    </div>
  );
}


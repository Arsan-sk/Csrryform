import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'How CARRYFORM handles personal enquiries and visitor privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Privacy' }]} />

      <div className="mt-8 mb-12">
        <h1 className="font-serif text-3xl md:text-5xl text-espresso mb-6">
          Privacy Notice
        </h1>
        <p className="text-sm font-mono text-espresso/40">
          Last updated: November 2026
        </p>
      </div>

      <div className="space-y-8 text-espresso/80 text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-espresso mb-3">1. Information We Collect</h2>
          <p>
            CARRYFORM collects personal information only when you voluntarily submit an enquiry via our contact form
            or initiate communication through WhatsApp. This typically includes your name, contact method (phone number
            or email address), and the nature of your product enquiry.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-espresso mb-3">2. How We Use Your Information</h2>
          <p>
            Your information is used strictly to respond to your questions, verify bag availability, and provide showroom
            assistance. We do not sell, rent, or distribute your personal details to third-party marketing services.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-espresso mb-3">3. Cookies and Analytics</h2>
          <p>
            The website operates with minimal technical cookies required to serve page routes and maintain responsive navigation.
            Any anonymous metrics collected are used solely to improve showroom navigation and user experience.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-espresso mb-3">4. Prototype Disclosure</h2>
          <p className="p-4 bg-espresso/5 rounded-sm border-l-2 border-wine">
            <strong>Demonstration Status:</strong> This website is currently running in showcase/prototype mode. 
            All demonstration catalogue specifications and sample contact credentials should be verified with the official 
            shop management prior to final commercial launch.
          </p>
        </section>
      </div>
    </div>
  );
}


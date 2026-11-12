import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About CARRYFORM',
  description: 'The story and philosophy behind CARRYFORM — Bags, accessories, and the art of carrying.',
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <div className="mt-8 mb-16">
        <p className="font-mono text-xs tracking-[0.3em] text-wine uppercase mb-4">
          OUR STORY
        </p>
        <h1 className="font-serif text-4xl md:text-6xl text-espresso mb-8 leading-tight">
          Every day has a way to carry.
        </h1>
        <p className="text-lg md:text-xl text-espresso/70 leading-relaxed font-serif italic border-l-2 border-wine pl-6 mb-12">
          &ldquo;We created CARRYFORM because finding the right bag shouldn&apos;t feel like wading through an endless sea of identical shapes.&rdquo;
        </p>
      </div>

      <div className="space-y-12 text-espresso/80 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-espresso mb-4">The Art of Carrying</h2>
          <p className="mb-4">
            A bag is an intimate everyday object. It accompanies you on quiet commutes, high-stakes presentations,
            weekend adventures, and busy school mornings. It holds your tools, your essentials, and small pieces of your life.
          </p>
          <p>
            At CARRYFORM, we view carrying as an intentional act. We focus on accessories that combine clean lines, tactile
            materials, and unpretentious utility.
          </p>
        </section>

        <section className="bg-espresso/5 p-8 rounded-sm">
          <h2 className="font-serif text-2xl text-espresso mb-4">Two Complementary Worlds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-lg text-wine mb-2">The Women&apos;s Edit</h3>
              <p className="text-sm text-espresso/70">
                Thoughtfully proportioned handbags, unstructured shoulder bags, roomy totes, and effortless slings. 
                Designed to bring considered character to your personal style.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-sage mb-2">School &amp; Student</h3>
              <p className="text-sm text-espresso/70">
                Dependable, practical backpacks tailored for students, academics, and commuters. Prioritising 
                durability, sensible compartment organisation, and comfortable carrying.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-espresso mb-4">Our Merchandising Approach</h2>
          <p>
            We don&apos;t invent spurious claims or make promises our products can&apos;t keep. If a bag has verified 
            measurements and padded laptop compartments, we specify them clearly. If details are being finalised, 
            we tell you to reach out directly to inspect them.
          </p>
        </section>
      </div>
    </div>
  );
}


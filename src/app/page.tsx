import { getActiveProducts, getCollections, getLandingPageConfig } from '@/lib/data';
import { HeroShowroom } from '@/components/home/HeroShowroom';
import { CarryformProofPoints } from '@/components/home/CarryformProofPoints';
import { BrandIntroduction } from '@/components/home/BrandIntroduction';
import { CollectionDoors } from '@/components/home/CollectionDoors';
import { HomeDynamicSections } from '@/components/home/HomeDynamicSections';
import { WhyCarryform } from '@/components/home/WhyCarryform';
import { ContactBand } from '@/components/home/ContactBand';
import contactData from '@/data/contact.json';

export default async function HomePage() {
  const [allProducts, collections, landingPage] = await Promise.all([
    getActiveProducts(),
    getCollections(),
    getLandingPageConfig(),
  ]);

  // Build slug-indexed lookup
  const bySlug = new Map(allProducts.map((p) => [p.slug, p]));

  // Chapter 4 — Showroom Carousel (dynamic products, fallback to first 4)
  const initialShowroom = landingPage?.showroomSlugs?.length
    ? (landingPage.showroomSlugs.map((s) => bySlug.get(s)).filter(Boolean) as typeof allProducts)
    : allProducts.slice(0, 4);

  // Chapter 5 — Art Gallery / Ready for a New Beginning (dynamic products, max 3, fallback to student)
  const initialArtGallery = landingPage?.artGallerySlugs?.length
    ? (landingPage.artGallerySlugs
        .slice(0, 3)
        .map((s) => bySlug.get(s))
        .filter(Boolean) as typeof allProducts)
    : allProducts.filter((p) => p.audience === 'student').slice(0, 3);

  // Selected Pieces Grid (dynamic products, max 6, fallback)
  const initialSelectedPieces = landingPage?.selectedPiecesSlugs?.length
    ? (landingPage.selectedPiecesSlugs
        .slice(0, 6)
        .map((s) => bySlug.get(s))
        .filter(Boolean) as typeof allProducts)
    : allProducts.slice(0, 6);

  return (
    <>
      {/* 01 & 02: Hero Showroom with Zipper Reveal (100% full screen height & width, hardcoded image) */}
      <HeroShowroom />
      <CarryformProofPoints />

      {/* 03: Chapter 2 — Brand Introduction (Dedicated Atelier Craftsmanship, hardcoded image) */}
      <BrandIntroduction />

      {/* 04: Chapter 3 — Two Worlds Collection Doors (Dedicated Collection Photography, hardcoded 2 images) */}
      <CollectionDoors collections={collections} />

      {/* 05–09: Dynamic Landing-Page Sections:
          - Chapter 4: Curated Showroom Stage (dynamic products)
          - Chapter 5: Art Gallery / Ready for a New Beginning (dynamic products, max 3)
          - Chapter 6: Material Story (architectural details, no products)
          - Lifestyle Stories (brand imagery)
          - Selected Pieces Grid (dynamic products, max 6)
          Synced with Supabase on the server and live client repository in browser! */}
      <HomeDynamicSections
        initialShowroom={initialShowroom}
        initialArtGallery={initialArtGallery}
        initialSelectedPieces={initialSelectedPieces}
        allProducts={allProducts}
        landingPageConfig={landingPage}
      />

      {/* 10: Why CARRYFORM — Four Pillars */}
      <WhyCarryform />

      {/* 11: Contact Band */}
      <ContactBand contact={contactData} />
    </>
  );
}

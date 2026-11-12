import { getActiveProducts, getCollections } from '@/lib/data';
import { HeroShowroom } from '@/components/home/HeroShowroom';
import { BrandIntroduction } from '@/components/home/BrandIntroduction';
import { CollectionDoors } from '@/components/home/CollectionDoors';
import { CuratedProductStage } from '@/components/home/CuratedProductStage';
import { StudentSpotlight } from '@/components/home/StudentSpotlight';
import { MaterialStory } from '@/components/home/MaterialStory';
import { LifestyleStories } from '@/components/home/LifestyleStories';
import { FeaturedProductGrid } from '@/components/home/FeaturedProductGrid';
import { WhyCarryform } from '@/components/home/WhyCarryform';
import { ContactBand } from '@/components/home/ContactBand';
import contactData from '@/data/contact.json';

export default async function HomePage() {
  const [allProducts, collections] = await Promise.all([
    getActiveProducts(),
    getCollections(),
  ]);

  const womensProducts = allProducts.filter((p) => p.audience === 'womens');
  const studentProducts = allProducts.filter((p) => p.audience === 'student');

  // Curated Showcase Stage: 4 signature hero pieces (2 women's, 2 student)
  const curatedShowcase = [
    womensProducts[0],  // Forma Structured Handbag (demo-womens-01)
    studentProducts[0], // Orbit School Backpack (demo-student-01)
    womensProducts[1],  // Arc Shoulder Bag (demo-womens-02)
    studentProducts[1], // Campus Daypack (demo-student-02)
  ].filter(Boolean);

  // Student Spotlight: 3 distinct student editions (never repeated on the page)
  const studentSpotlight = studentProducts.slice(2, 5);
  // [Stride School Bag (demo-student-03), Study Route Backpack (demo-student-04), Everyday Classic Pack (demo-student-05)]

  // Selected Pieces Grid: 6 distinct pieces (4 women's, 2 student - never repeated on the page)
  const selectedGridPieces = [
    womensProducts[2],  // Daylight Tote (demo-womens-03)
    womensProducts[3],  // Linea Crossbody (demo-womens-04)
    womensProducts[4],  // Muse Mini Bag (demo-womens-05)
    studentProducts[5], // Campus Utility Pack (demo-student-06)
    womensProducts[5],  // Everyday Hobo (demo-womens-06)
    studentProducts[6], // Daily Study Backpack (demo-student-07)
  ].filter(Boolean);

  return (
    <>
      {/* 01 & 02: Hero Showroom with Zipper Reveal (100% full screen height & width) */}
      <HeroShowroom />

      {/* 03: Brand Introduction — Dedicated Atelier Craftsmanship Photography */}
      <BrandIntroduction />

      {/* 04: Two Worlds — Collection Doors (Dedicated Collection Photography) */}
      <CollectionDoors collections={collections} />

      {/* 05: Curated Edit — Product Showcase Stage (4 unique pieces) */}
      <CuratedProductStage products={curatedShowcase} />

      {/* 06: Student Spotlight — School & Student Hero Chapter (3 distinct student bags) */}
      <StudentSpotlight products={studentSpotlight} />

      {/* 07: Material Story — A Closer Look */}
      <MaterialStory />

      {/* 08: Lifestyle Stories — Everyday Scenes */}
      <LifestyleStories />

      {/* 09: Selected Pieces Grid — 6 distinct bags */}
      <FeaturedProductGrid products={selectedGridPieces} />

      {/* 10: Why CARRYFORM — Four Pillars */}
      <WhyCarryform />

      {/* 11: Contact Band */}
      <ContactBand contact={contactData} />
    </>
  );
}


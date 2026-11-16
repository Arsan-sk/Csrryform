'use client';

import React, { useState, useEffect } from 'react';
import type { NormalisedProduct, Product } from '@/types/product';
import type { LandingPageConfig } from '@/types/site';
import { CuratedProductStage } from './CuratedProductStage';
import { StudentSpotlight } from './StudentSpotlight';
import { MaterialStory } from './MaterialStory';
import { LifestyleStories } from './LifestyleStories';
import { FeaturedProductGrid } from './FeaturedProductGrid';
import { localRepository } from '@/lib/data/local-repository';
import { normaliseProduct } from '@/lib/data/provider';

interface HomeDynamicSectionsProps {
  initialShowroom: NormalisedProduct[];
  initialArtGallery: NormalisedProduct[];
  initialSelectedPieces: NormalisedProduct[];
  allProducts: NormalisedProduct[];
  landingPageConfig: LandingPageConfig;
}

export function HomeDynamicSections({
  initialShowroom,
  initialArtGallery,
  initialSelectedPieces,
  allProducts,
  landingPageConfig,
}: HomeDynamicSectionsProps) {
  const [showroom, setShowroom] = useState<NormalisedProduct[]>(initialShowroom);
  const [artGallery, setArtGallery] = useState<NormalisedProduct[]>(initialArtGallery);
  const [selectedPieces, setSelectedPieces] = useState<NormalisedProduct[]>(initialSelectedPieces);

  useEffect(() => {
    function syncFromLocalRepository() {
      try {
        const content = localRepository.getContent();
        if (!content) return;

        // Combine server products and local products
        const productMap = new Map<string, NormalisedProduct>();
        allProducts.forEach((p) => productMap.set(p.slug, p));

        // Override or supplement with any products edited in admin
        if (content.products && Array.isArray(content.products)) {
          content.products.forEach((p: Product) => {
            productMap.set(p.slug, normaliseProduct(p));
          });
        }

        const lp = content.site?.landingPage || landingPageConfig;
        if (!lp) return;

        // 1. Chapter 4 — Showroom (Curated Stage)
        if (lp.showroomSlugs && lp.showroomSlugs.length > 0) {
          const matched = lp.showroomSlugs
            .map((slug) => productMap.get(slug))
            .filter((p): p is NormalisedProduct => Boolean(p));
          if (matched.length > 0) {
            setShowroom(matched);
          }
        }

        // 2. Chapter 5 — Art Gallery / Ready for a New Beginning (Max 3)
        if (lp.artGallerySlugs && lp.artGallerySlugs.length > 0) {
          const matched = lp.artGallerySlugs
            .slice(0, 3)
            .map((slug) => productMap.get(slug))
            .filter((p): p is NormalisedProduct => Boolean(p));
          if (matched.length > 0) {
            setArtGallery(matched);
          }
        }

        // 3. Selected Pieces Grid (Max 6)
        if (lp.selectedPiecesSlugs && lp.selectedPiecesSlugs.length > 0) {
          const matched = lp.selectedPiecesSlugs
            .slice(0, 6)
            .map((slug) => productMap.get(slug))
            .filter((p): p is NormalisedProduct => Boolean(p));
          if (matched.length > 0) {
            setSelectedPieces(matched);
          }
        }
      } catch (err) {
        console.warn('[CARRYFORM] Could not sync local showroom selections:', err);
      }
    }

    // Run sync immediately on client mount
    syncFromLocalRepository();

    // Listen for custom event dispatched by localRepository when admin saves
    window.addEventListener('carryform-content-updated', syncFromLocalRepository);
    window.addEventListener('storage', syncFromLocalRepository);

    return () => {
      window.removeEventListener('carryform-content-updated', syncFromLocalRepository);
      window.removeEventListener('storage', syncFromLocalRepository);
    };
  }, [allProducts, landingPageConfig]);

  return (
    <>
      {/* 05: Chapter 4 — Curated Showroom Stage (dynamic products) */}
      <CuratedProductStage products={showroom} />

      {/* 06: Chapter 5 — Art Gallery / Ready for a New Beginning (dynamic products, max 3) */}
      <StudentSpotlight products={artGallery} />

      {/* 07: Chapter 6 — Material Story (A Closer Look — architectural details, no products) */}
      <MaterialStory />

      {/* 08: Lifestyle Stories — Everyday Scenes */}
      <LifestyleStories />

      {/* 09: Selected Pieces Grid (dynamic products, max 6) */}
      <FeaturedProductGrid products={selectedPieces} />
    </>
  );
}

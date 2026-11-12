'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import type { ProductImage } from '@/types/product';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const prevImage = useCallback(() => {
    setSelectedIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setSelectedIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (images.length <= 1) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prevImage, nextImage, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-espresso/5 rounded-sm flex items-center justify-center border border-espresso/10">
        <span className="font-mono text-xs text-espresso/40 uppercase tracking-wider">No image available</span>
      </div>
    );
  }

  const activeImage = images[selectedIdx] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Feature View with smooth Motion transition */}
      <div className="relative aspect-[4/5] bg-espresso/5 rounded-sm overflow-hidden shadow-sm border border-espresso/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage.url}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage.url}
              alt={activeImage.alt || productName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Counter badge if multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 font-mono text-[10px] text-ivory bg-espresso/70 backdrop-blur-xs px-2.5 py-1 rounded-sm tracking-widest uppercase">
            {selectedIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails if multiple images exist */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-20 h-24 flex-shrink-0 bg-espresso/5 rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                selectedIdx === idx
                  ? 'border-wine shadow-sm scale-102'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-espresso/30'
              }`}
              aria-label={`View image ${idx + 1} of ${images.length}`}
              aria-current={selectedIdx === idx}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} view ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


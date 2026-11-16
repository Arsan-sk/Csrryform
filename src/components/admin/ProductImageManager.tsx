'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { ProductImage, ImageRole } from '@/types/product';

interface ProductImageManagerProps {
  images: ProductImage[];
  productName: string;
  onChange: (images: ProductImage[]) => void;
}

export function ProductImageManager({ images, productName, onChange }: ProductImageManagerProps) {
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newRole, setNewRole] = useState<ImageRole>('gallery');
  const [urlError, setUrlError] = useState('');
  const [previewError, setPreviewError] = useState<Record<number, boolean>>({});

  function validateUrl(url: string) {
    if (!url.trim()) return 'Image URL cannot be empty';
    if (!url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
      return 'URL must start with / (local asset) or https:// (external image)';
    }
    return '';
  }

  function handleAddImage() {
    const error = validateUrl(newUrl);
    if (error) {
      setUrlError(error);
      return;
    }
    setUrlError('');

    const newImage: ProductImage = {
      url: newUrl.trim(),
      alt: newAlt.trim() || productName || 'Product view',
      role: images.length === 0 ? 'primary' : newRole,
      sortOrder: images.length,
    };

    // If marked as primary, demote any existing primary image to gallery
    let updated = [...images];
    if (newImage.role === 'primary') {
      updated = updated.map((img) => (img.role === 'primary' ? { ...img, role: 'gallery' as ImageRole } : img));
    }

    updated.push(newImage);
    onChange(updated);
    setNewUrl('');
    setNewAlt('');
    setNewRole('gallery');
  }

  function handleRemoveImage(index: number) {
    const filtered = images.filter((_, i) => i !== index);
    // If we removed the primary image and there are others, promote the first one to primary
    if (filtered.length > 0 && !filtered.some((img) => img.role === 'primary')) {
      filtered[0] = { ...filtered[0], role: 'primary' };
    }
    onChange(filtered);
  }

  function handleSetPrimary(index: number) {
    const updated = images.map((img, i) => ({
      ...img,
      role: (i === index ? 'primary' : img.role === 'primary' ? 'gallery' : img.role) as ImageRole,
    }));
    onChange(updated);
  }

  function handleUpdateField(index: number, field: keyof ProductImage, value: string | number) {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg text-espresso">Product Photography &amp; Assets</h3>
          <p className="text-xs text-espresso/60 mt-0.5">
            Reference local photography (e.g. <code>/images/products/...</code>) or hosted HTTPS image URLs.
          </p>
        </div>
        <span className="text-xs font-mono text-espresso/40 uppercase tracking-wider">
          {images.length} {images.length === 1 ? 'Asset' : 'Assets'}
        </span>
      </div>

      {/* Existing Images List */}
      {images.length === 0 ? (
        <div className="border border-dashed border-espresso/20 rounded-sm p-6 text-center bg-espresso/3">
          <p className="text-xs font-mono text-espresso/50 uppercase tracking-widest mb-1">No photography assigned</p>
          <p className="text-xs text-espresso/60">Add a primary image URL below to showcase this bag in the showroom.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {images.map((image, index) => {
            const hasError = previewError[index];
            return (
              <div
                key={index}
                className="border border-espresso/15 bg-white/60 p-3.5 rounded-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors hover:border-espresso/30"
              >
                {/* Image Thumbnail with Fallback */}
                <div className="relative w-16 h-20 bg-espresso/5 border border-espresso/10 rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {!hasError && image.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt || productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                      onError={() => setPreviewError((prev) => ({ ...prev, [index]: true }))}
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-espresso/40 text-center px-1">
                      {hasError ? 'Broken' : 'No preview'}
                    </span>
                  )}
                  {image.role === 'primary' && (
                    <span className="absolute bottom-0 inset-x-0 bg-wine text-white text-[8px] font-mono uppercase text-center py-0.5">
                      Primary
                    </span>
                  )}
                </div>

                {/* Details Form Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2.5 w-full">
                  <div className="sm:col-span-6">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/50 block mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      value={image.url}
                      onChange={(e) => handleUpdateField(index, 'url', e.target.value)}
                      className="admin-input py-1 px-2 text-xs w-full"
                      placeholder="/images/products/..."
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/50 block mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => handleUpdateField(index, 'alt', e.target.value)}
                      className="admin-input py-1 px-2 text-xs w-full"
                      placeholder="Descriptive alt text"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-espresso/50 block mb-1">
                      Role
                    </label>
                    <select
                      value={image.role}
                      onChange={(e) => handleUpdateField(index, 'role', e.target.value)}
                      className="admin-input py-1 px-2 text-xs w-full"
                    >
                      <option value="primary">Primary</option>
                      <option value="gallery">Gallery</option>
                      <option value="detail">Detail</option>
                      <option value="lifestyle">Lifestyle</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {image.role !== 'primary' && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="text-xs text-espresso/60 hover:text-wine hover:underline whitespace-nowrap"
                      title="Make this the primary showcase image"
                    >
                      Make primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="p-1 text-espresso/40 hover:text-wine text-base"
                    title="Remove asset"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Image Form */}
      <div className="border border-espresso/15 bg-espresso/5 p-4 rounded-sm mt-3">
        <p className="text-xs font-mono uppercase tracking-wider text-wine mb-3">Add Photography Reference</p>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="text-xs font-medium text-espresso block mb-1">
              Image URL / Path <span className="text-wine">*</span>
            </label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => {
                setNewUrl(e.target.value);
                setUrlError('');
              }}
              placeholder="/images/products/demo-bag.jpg or https://..."
              className="admin-input py-1.5 px-2.5 text-xs w-full"
            />
            {urlError && <p className="text-[11px] text-wine mt-1">{urlError}</p>}
          </div>
          <div className="sm:col-span-4">
            <label className="text-xs font-medium text-espresso block mb-1">Alt Text</label>
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              placeholder="e.g. Front view of handbag"
              className="admin-input py-1.5 px-2.5 text-xs w-full"
            />
          </div>
          <div className="sm:col-span-2 flex flex-col justify-end">
            <button
              type="button"
              onClick={handleAddImage}
              className="admin-primary text-xs py-2 px-3 w-full"
            >
              + Add Image
            </button>
          </div>
        </div>
        <p className="text-[11px] text-espresso/50 mt-2">
          Tip: In commercial production with Supabase Storage, images are uploaded directly to the <code>product-media</code> bucket.
        </p>
      </div>
    </div>
  );
}

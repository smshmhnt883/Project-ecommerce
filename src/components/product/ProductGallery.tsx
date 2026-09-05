'use client';

import React, { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  thumbnail: string;
  badge?: string;
}

export function ProductGallery({ images, productName, thumbnail, badge }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row gap-4">
        {/* Thumbnail Strip (Left on sm+, below on mobile) */}
        {images.length > 1 && (
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 shrink-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border p-1 bg-[#FAF8F5] shrink-0 transition-all ${
                  activeImageIndex === idx
                    ? 'border-ayur-green-900 ring-1 ring-ayur-green-900'
                    : 'border-ayur-border/80 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* Main Stage Image (1:1 aspect) */}
        <div className="relative flex-1 aspect-square rounded-md overflow-hidden bg-[#FAF8F5] border border-ayur-border p-6 sm:p-10 flex items-center justify-center group">
          <img
            src={images[activeImageIndex] || thumbnail}
            alt={productName}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-103"
          />

          {/* Click to Zoom Overlay button */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            className="absolute bottom-4 right-4 p-2 rounded-md bg-white border border-ayur-border text-ayur-charcoal-800 hover:text-ayur-green-900 shadow-xs transition-colors"
            aria-label="Zoom image"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-4 bg-ayur-green-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm">
              {badge}
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-white p-2 rounded-md hover:bg-white/20 transition-colors"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-md bg-white p-4">
            <img
              src={images[activeImageIndex] || thumbnail}
              alt={productName}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

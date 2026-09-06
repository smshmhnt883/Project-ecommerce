'use client';

import React, { useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  thumbnail: string;
  badge?: string;
}

export function ProductGallery({ images, productName, thumbnail, badge }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const displayImages = images.length > 0 ? images : [thumbnail];
  const minSwipeDistance = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeImageIndex < displayImages.length - 1) {
      setActiveImageIndex((prev) => prev + 1);
    } else if (isRightSwipe && activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  const nextImage = () => {
    if (activeImageIndex < displayImages.length - 1) {
      setActiveImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row gap-4 w-full">
        {/* Thumbnail Strip (Left on sm+, below on mobile) */}
        {displayImages.length > 1 && (
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 shrink-0 py-1">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 min-h-[44px] rounded-md overflow-hidden border p-1 bg-[#FAF8F5] shrink-0 transition-all ${
                  activeImageIndex === idx
                    ? 'border-ayur-green-900 ring-2 ring-ayur-green-900'
                    : 'border-ayur-border/80 opacity-70 hover:opacity-100'
                }`}
                aria-label={`View image ${idx + 1} of ${displayImages.length}`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* Main Stage Image (1:1 aspect) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 aspect-square rounded-md overflow-hidden bg-[#FAF8F5] border border-ayur-border p-6 sm:p-10 flex items-center justify-center group touch-pan-y"
        >
          <img
            src={displayImages[activeImageIndex] || thumbnail}
            alt={productName}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-103 select-none"
            draggable={false}
          />

          {/* Swipe Arrow Buttons on Mobile */}
          {displayImages.length > 1 && (
            <>
              {activeImageIndex > 0 && (
                <button
                  type="button"
                  onClick={prevImage}
                  className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/90 shadow-md border border-ayur-border flex items-center justify-center text-ayur-charcoal-700"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {activeImageIndex < displayImages.length - 1 && (
                <button
                  type="button"
                  onClick={nextImage}
                  className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/90 shadow-md border border-ayur-border flex items-center justify-center text-ayur-charcoal-700"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* Mobile Pagination Indicator Dots */}
          {displayImages.length > 1 && (
            <div className="sm:hidden absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
              {displayImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`transition-all rounded-full ${
                    activeImageIndex === idx
                      ? 'w-4 h-1.5 bg-ayur-green-900'
                      : 'w-1.5 h-1.5 bg-ayur-charcoal-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Click to Zoom Overlay button */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md bg-white/95 border border-ayur-border text-ayur-charcoal-800 hover:text-ayur-green-900 shadow-sm transition-colors"
            aria-label="Zoom product image"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-ayur-green-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xs">
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
            className="absolute top-4 right-4 text-white p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-white/20 transition-colors"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-md bg-white p-4">
            <img
              src={displayImages[activeImageIndex] || thumbnail}
              alt={productName}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

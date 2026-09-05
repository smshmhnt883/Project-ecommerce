'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product?.size || '');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isSaved = isInWishlist(product.id);
  const currentSize = selectedSize || product.size;

  const handleAddToCart = () => {
    setIsAdded(true);
    addToCart(product, quantity, currentSize);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-md max-w-3xl w-full overflow-hidden shadow-xl border border-ayur-border z-10 flex flex-col md:flex-row">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 text-ayur-charcoal-400 hover:text-ayur-charcoal-800 rounded-md hover:bg-ayur-cream transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Gallery */}
          <div className="w-full md:w-1/2 p-6 bg-[#FAF8F5] flex flex-col justify-between border-r border-ayur-border/60">
            <div className="aspect-square rounded-md overflow-hidden bg-white border border-ayur-border p-4 mb-4 flex items-center justify-center">
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Thumbnail dots/images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`w-12 h-12 rounded-md overflow-hidden border p-0.5 bg-white shrink-0 transition-all ${
                      selectedImage === idx ? 'border-ayur-green-900' : 'border-ayur-border opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-ayur-green-800 uppercase tracking-wider">
                {product.category}
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-ayur-charcoal-900 mt-1 mb-2 font-medium">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-ayur-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xs font-bold text-ayur-charcoal-900">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-ayur-charcoal-500">({product.reviewCount} customer reviews)</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-ayur-border">
                <span className="text-2xl font-bold text-ayur-charcoal-900">₹{product.price}</span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-sm text-ayur-charcoal-400 line-through">₹{product.mrp}</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-ayur-charcoal-700 leading-relaxed line-clamp-3 mb-4">
                {product.shortDescription}
              </p>

              {/* Pack Sizes */}
              {product.availableSizes && product.availableSizes.length > 1 && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-ayur-charcoal-800 block mb-1.5">
                    Select Size:
                  </span>
                  <div className="flex gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                          currentSize === size
                            ? 'border-ayur-green-900 bg-ayur-green-900 text-white'
                            : 'border-ayur-border text-ayur-charcoal-800 hover:bg-ayur-cream'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t border-ayur-border">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-ayur-border rounded-lg bg-white px-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-ayur-charcoal-600 hover:text-ayur-charcoal-900"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-ayur-charcoal-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-ayur-charcoal-600 hover:text-ayur-charcoal-900"
                  >
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className="flex-1 py-3 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-lg border transition-colors ${
                    isSaved
                      ? 'border-ayur-terracotta-500 bg-ayur-terracotta-50 text-ayur-terracotta-600'
                      : 'border-ayur-border text-ayur-charcoal-600 hover:text-ayur-green-900'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* View full page */}
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="w-full text-center py-2 text-xs font-medium text-ayur-green-800 hover:underline flex items-center justify-center gap-1"
              >
                <span>View Full Product Specifications & Ayurvedic Ingredients</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

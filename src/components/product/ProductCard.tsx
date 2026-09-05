'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const isSaved = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, product.size);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-md border border-ayur-border overflow-hidden hover:border-ayur-charcoal-400 transition-colors flex flex-col">
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF8F5] p-3 sm:p-4 flex items-center justify-center border-b border-ayur-border/50">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          <img
            src={product.thumbnail || product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-300"
          />
        </Link>

        {/* Crisp rectangular Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-ayur-green-900 text-white text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${
            isSaved
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-white/95 border-ayur-border text-ayur-charcoal-600 hover:text-ayur-green-900 hover:border-ayur-charcoal-400'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full py-1.5 bg-white text-ayur-charcoal-900 hover:bg-ayur-green-900 hover:text-white border border-ayur-border rounded-md text-[11px] font-medium tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white">
        {/* Category & Size */}
        <div className="flex items-center justify-between text-[11px] text-ayur-charcoal-500 mb-1">
          <span className="font-medium uppercase tracking-wider text-ayur-green-900">
            {product.category}
          </span>
          <span>{product.size}</span>
        </div>

        {/* Product Title */}
        <Link
          href={`/products/${product.slug}`}
          className="font-medium text-xs sm:text-sm text-ayur-charcoal-900 hover:text-ayur-green-900 line-clamp-2 transition-colors mb-1.5 flex-1 leading-snug"
        >
          {product.name}
        </Link>

        {/* Rating and Review count */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center text-ayur-amber-600">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-semibold text-ayur-charcoal-900 ml-1">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-[11px] text-ayur-charcoal-400">({product.reviewCount})</span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-3 pt-1 border-t border-ayur-border/40">
          <span className="text-sm sm:text-base font-semibold text-ayur-charcoal-900">
            ₹{product.price}
          </span>
          {product.mrp > product.price && (
            <>
              <span className="text-xs text-ayur-charcoal-400 line-through">
                ₹{product.mrp}
              </span>
              <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className={`w-full py-2 px-3 rounded-md text-xs font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 ${
            !product.inStock
              ? 'bg-ayur-charcoal-100 text-ayur-charcoal-400 cursor-not-allowed border border-ayur-border'
              : isAdding
              ? 'bg-ayur-green-900 text-white'
              : 'bg-ayur-cream/80 text-ayur-green-950 hover:bg-ayur-green-900 hover:text-white border border-ayur-border'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Bag</span>
            </>
          ) : !product.inStock ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

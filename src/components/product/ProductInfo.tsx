'use client';

import React from 'react';
import { Star, ShoppingBag, Heart, ArrowRight, Check } from 'lucide-react';
import { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onAddToWishlist: () => void;
  isInWishlist: boolean;
  isAdding: boolean;
}

export function ProductInfo({
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  isInWishlist,
  isAdding,
}: ProductInfoProps) {
  return (
    <>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-ayur-green-800">
            {product.category}
          </span>
          <span className="text-xs text-ayur-charcoal-500 font-mono">SKU: {product.sku}</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-medium mt-1">
          {product.name}
        </h1>
        {product.hindiName && (
          <p className="text-sm text-ayur-charcoal-600 font-serif mt-0.5">
            {product.hindiName}
          </p>
        )}

        {/* Rating jump */}
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex items-center text-ayur-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? 'fill-current' : 'text-ayur-border'
                }`}
              />
            ))}
            <span className="text-xs font-bold text-ayur-charcoal-900 ml-1.5">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-ayur-charcoal-400">•</span>
          <a
            href="#reviews"
            className="text-xs text-ayur-green-800 hover:underline font-medium"
          >
            {product.reviewCount} customer reviews
          </a>
        </div>
      </div>

      {/* Price block */}
      <div className="p-4 bg-white rounded-xl border border-ayur-border space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-ayur-charcoal-900">
            ₹{product.price}
          </span>
          {product.mrp > product.price && (
            <>
              <span className="text-base text-ayur-charcoal-400 line-through">
                MRP ₹{product.mrp}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-[11px] text-ayur-charcoal-500">
          Inclusive of all applicable taxes • Free shipping on orders above ₹499
        </p>
      </div>

      {/* Short Description */}
      <p className="text-xs sm:text-sm text-ayur-charcoal-700 leading-relaxed">
        {product.shortDescription}
      </p>

      {/* Size selector */}
      {product.availableSizes && product.availableSizes.length > 1 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-ayur-charcoal-900 block">
            Select Pack Size:
          </span>
          <div className="flex gap-2.5">
            {product.availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  selectedSize === size
                    ? 'border-ayur-green-900 bg-ayur-green-900 text-white shadow-xs'
                    : 'border-ayur-border text-ayur-charcoal-800 bg-white hover:bg-ayur-cream'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Stepper & Add to Bag / Buy Now */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          {/* Quantity */}
          <div className="flex items-center border border-ayur-border rounded-lg bg-white px-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-ayur-charcoal-600 hover:text-ayur-charcoal-900"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 text-xs font-bold text-ayur-charcoal-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-ayur-charcoal-600 hover:text-ayur-charcoal-900"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={onAddToCart}
            disabled={!product.inStock || isAdding}
            className="flex-1 py-3.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isAdding ? (
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

          {/* Wishlist button */}
          <button
            type="button"
            onClick={onAddToWishlist}
            className={`p-3.5 rounded-lg border transition-all ${
              isInWishlist
                ? 'border-ayur-terracotta-500 bg-ayur-terracotta-50 text-ayur-terracotta-600'
                : 'border-ayur-border bg-white text-ayur-charcoal-600 hover:text-ayur-green-900'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Buy Now CTA */}
        <button
          type="button"
          onClick={onBuyNow}
          disabled={!product.inStock}
          className="w-full py-3.5 bg-ayur-cream hover:bg-ayur-sand/80 text-ayur-green-950 border border-ayur-border font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>BUY IT NOW (INSTANT CHECKOUT)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

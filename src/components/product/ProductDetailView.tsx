'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useReviews } from '@/context/ReviewContext';
import { PRODUCTS } from '@/lib/data/products';
import { getProductRatingBreakdown } from '@/lib/data/reviews';
import { ProductCard } from '@/components/product/ProductCard';

import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductPincodeChecker } from '@/components/product/ProductPincodeChecker';
import { ProductTabs } from '@/components/product/ProductTabs';
import { ProductReviewSection } from '@/components/product/ProductReviewSection';

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getProductReviews, addReview } = useReviews();

  const [selectedSize, setSelectedSize] = useState(product.size);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const isSaved = isInWishlist(product.id);
  const productReviews = getProductReviews(product.id);
  const ratingBreakdown = getProductRatingBreakdown(
    productReviews,
    product.rating,
    product.reviewCount
  );

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, selectedSize);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    router.push('/checkout');
  };

  const handleReviewSubmit = (reviewData: any) => {
    addReview(reviewData);
  };

  // Related products from same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="py-6 sm:py-10 bg-ayur-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-ayur-charcoal-500 mb-6">
          <Link href="/" className="hover:text-ayur-green-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-ayur-charcoal-400" />
          <Link href="/shop" className="hover:text-ayur-green-900 transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-ayur-charcoal-400" />
          <Link
            href={`/category/${product.categorySlug}`}
            className="hover:text-ayur-green-900 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-ayur-charcoal-400" />
          <span className="text-ayur-charcoal-800 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Main Product Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column: Multi-Shot Gallery with Zoom */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            <ProductGallery
              images={product.images}
              productName={product.name}
              thumbnail={product.thumbnail}
              badge={product.badge}
            />
          </div>

          {/* Right Column: Product Info & Commerce Controls */}
          <div className="lg:col-span-5 space-y-5">
            <ProductInfo
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onAddToWishlist={() => toggleWishlist(product)}
              isInWishlist={isSaved}
              isAdding={isAdding}
            />

            <ProductPincodeChecker />

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-ayur-border/60 text-center">
              <div className="p-2 rounded-lg bg-white border border-ayur-border/60">
                <ShieldCheck className="w-4 h-4 text-ayur-green-800 mx-auto mb-1" />
                <span className="text-[10px] font-semibold text-ayur-charcoal-800 block">100% Genuine</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-ayur-border/60">
                <Truck className="w-4 h-4 text-ayur-green-800 mx-auto mb-1" />
                <span className="text-[10px] font-semibold text-ayur-charcoal-800 block">Safe Dispatch</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-ayur-border/60">
                <RotateCcw className="w-4 h-4 text-ayur-green-800 mx-auto mb-1" />
                <span className="text-[10px] font-semibold text-ayur-charcoal-800 block">7-Day Transit Care</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Accordions Section */}
        <ProductTabs product={product} />

        {/* Reviews Section */}
        <ProductReviewSection
          product={product}
          reviews={productReviews}
          ratingBreakdown={ratingBreakdown}
          onReviewSubmit={handleReviewSubmit}
        />

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-ayur-border">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-ayur-green-800 block mb-1">
                  COMPLEMENTARY FORMULATIONS
                </span>
                <h3 className="font-serif text-2xl text-ayur-green-950 font-normal">
                  Related Products
                </h3>
              </div>
              <Link
                href={`/category/${product.categorySlug}`}
                className="text-xs font-semibold text-ayur-green-900 hover:underline uppercase"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-[58px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-ayur-border px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            src={product.thumbnail || product.images[0]}
            alt=""
            className="w-10 h-10 rounded border border-ayur-border object-contain bg-[#FAF8F5] shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ayur-charcoal-900 truncate">
              {product.name}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-ayur-green-950">₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="text-[10px] text-ayur-charcoal-400 line-through">₹{product.mrp}</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="px-5 py-2.5 min-h-[44px] bg-ayur-green-900 hover:bg-ayur-green-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
        >
          {isAdding ? (
            <span>Added</span>
          ) : !product.inStock ? (
            <span>Out of Stock</span>
          ) : (
            <span>Add to Bag</span>
          )}
        </button>
      </div>
    </div>
  );
}

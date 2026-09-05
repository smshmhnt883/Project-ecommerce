'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { AccountNav } from '@/components/account/AccountNav';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="py-8 sm:py-12 bg-ayur-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal mb-8">
          Saved Wishlist ({wishlist.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          <div className="lg:col-span-8">
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-2xl border border-ayur-border p-12 text-center shadow-soft">
                <div className="w-16 h-16 rounded-full bg-ayur-cream flex items-center justify-center text-ayur-terracotta-500 mx-auto mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg text-ayur-charcoal-900 font-medium">
                  Your wishlist is waiting for something special.
                </h3>
                <p className="text-xs text-ayur-charcoal-600 mt-1 max-w-sm mx-auto">
                  Save your beloved classical oils, herbal toothpastes, and nourishing gels to revisit anytime.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  <span>EXPLORE PRODUCTS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-ayur-border p-4 shadow-soft flex gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-ayur-cream/30 border border-ayur-border shrink-0">
                        <img
                          src={product.thumbnail || product.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold text-ayur-green-800 uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-medium text-xs text-ayur-charcoal-900 hover:text-ayur-green-900 truncate block"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-baseline gap-2 mt-1 text-xs">
                          <span className="font-bold text-ayur-charcoal-900">₹{product.price}</span>
                          {product.mrp > product.price && (
                            <span className="text-[10px] text-ayur-charcoal-400 line-through">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveToCart(product)}
                        className="px-3 py-1.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 text-ayur-charcoal-400 hover:text-red-600 rounded text-center"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

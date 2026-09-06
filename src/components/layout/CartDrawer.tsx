'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart, CheckCircle2, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    couponDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
  } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const progressPercent = Math.min(100, Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-200"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-full max-w-md bg-ayur-ivory shadow-drawer flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-ayur-border bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-ayur-green-900" />
              <h2 className="text-base font-semibold text-ayur-charcoal-900">
                Your Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-ayur-charcoal-600 hover:text-ayur-charcoal-900 rounded-full hover:bg-ayur-cream"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-ayur-cream/80 px-5 py-3 border-b border-ayur-border text-xs">
            {freeShippingRemaining > 0 ? (
              <p className="text-ayur-charcoal-800">
                Add <span className="font-semibold text-ayur-green-900">₹{freeShippingRemaining}</span> more for <span className="font-semibold text-ayur-terracotta-600">FREE Pan-India Delivery</span>!
              </p>
            ) : (
              <p className="text-ayur-green-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-ayur-green-800" />
                <span>You unlocked FREE Pan-India Delivery!</span>
              </p>
            )}
            <div className="w-full bg-ayur-border h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-ayur-green-800 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-ayur-border">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-ayur-cream flex items-center justify-center text-ayur-charcoal-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif text-ayur-charcoal-900">Your bag is empty</h3>
                <p className="text-xs text-ayur-charcoal-600 mt-1 max-w-xs">
                  Discover authentic Ayurvedic rituals and pure herbal wellness essentials.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 bg-ayur-green-900 text-white rounded-md text-xs font-semibold tracking-wider hover:bg-ayur-green-800 transition-colors uppercase"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="py-4 flex gap-4">
                  <div className="w-18 h-18 rounded-md overflow-hidden bg-[#FAF8F5] border border-ayur-border shrink-0 p-1.5 flex items-center justify-center">
                    <img
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-xs font-medium text-ayur-charcoal-900 hover:text-ayur-green-900 line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-ayur-charcoal-400 hover:text-red-600 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-ayur-charcoal-600 mt-0.5">
                      Pack: <span className="font-medium text-ayur-charcoal-800">{item.selectedSize}</span>
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-ayur-charcoal-900">
                        ₹{item.product.price}
                      </span>
                      {item.product.mrp > item.product.price && (
                        <span className="text-xs text-ayur-charcoal-400 line-through">
                          ₹{item.product.mrp}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Stepper */}
                      <div className="flex items-center border border-ayur-border rounded-md bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center hover:bg-ayur-cream text-ayur-charcoal-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-ayur-charcoal-900 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center hover:bg-ayur-cream text-ayur-charcoal-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Move to Wishlist shortcut */}
                      <button
                        type="button"
                        onClick={() => {
                          toggleWishlist(item.product);
                        }}
                        className={`text-[11px] min-h-[36px] flex items-center gap-1 font-medium transition-colors p-1 ${
                          isInWishlist(item.product.id)
                            ? 'text-ayur-terracotta-600'
                            : 'text-ayur-charcoal-600 hover:text-ayur-green-900'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>{isInWishlist(item.product.id) ? 'Saved' : 'Wishlist'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-ayur-border bg-white space-y-4">
              {/* Coupon Bar */}
              <div className="bg-ayur-ivory p-3 rounded-lg border border-ayur-border">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-ayur-green-800 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-ayur-amber-600" />
                      <span>{appliedCoupon.code} applied (-₹{couponDiscount})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-red-600 font-medium hover:underline p-1 min-h-[36px] flex items-center"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="Coupon (e.g. WELCOME10)"
                        className="flex-1 bg-white border border-ayur-border rounded-md px-3 py-2 text-base sm:text-xs uppercase focus:outline-none focus:border-ayur-green-800 min-h-[44px]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 min-h-[44px] bg-ayur-green-900 text-white text-xs font-semibold rounded-md hover:bg-ayur-green-800 flex items-center justify-center transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-ayur-charcoal-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ayur-charcoal-900">₹{subtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-ayur-green-800 font-medium">
                    <span>Coupon Savings</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Pan-India Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-ayur-green-800 font-semibold uppercase text-[11px]">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="border-t border-ayur-border pt-2 flex justify-between text-sm font-semibold text-ayur-charcoal-900">
                  <span>Estimated Total</span>
                  <span className="text-base text-ayur-green-950 font-bold">₹{total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full min-h-[44px] text-center py-2.5 px-3 border border-ayur-green-900 text-ayur-green-900 rounded-md font-medium text-xs tracking-wider uppercase hover:bg-ayur-cream transition-colors flex items-center justify-center"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full min-h-[44px] text-center py-2.5 px-3 bg-ayur-green-900 text-white rounded-md font-medium text-xs tracking-wider uppercase hover:bg-ayur-green-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

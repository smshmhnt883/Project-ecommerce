'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart,
  ArrowRight,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function CartPage() {
  const {
    cart,
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

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponCodeInput('');
    }
  };

  const handleSaveForLater = (product: (typeof cart)[0]['product']) => {
    toggleWishlist(product);
    removeFromCart(product.id);
  };

  const progressPercent = Math.min(
    100,
    Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100)
  );

  return (
    <div className="py-8 sm:py-12 bg-ayur-ivory min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl sm:text-4xl text-ayur-green-950 font-normal mb-8">
          Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-ayur-border p-12 text-center max-w-lg mx-auto shadow-soft my-8">
            <div className="w-20 h-20 rounded-full bg-ayur-cream flex items-center justify-center text-ayur-charcoal-400 mx-auto mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-xl text-ayur-charcoal-900 font-medium">
              Your bag is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-ayur-charcoal-600 mt-2 leading-relaxed">
              Explore authentic Patanjali formulations, handcrafted oils, classical churnas, and Vedic foods to nourish your everyday vitality.
            </p>
            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-md"
              >
                <span>CONTINUE SHOPPING</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Box */}
              <div className="bg-white p-4 sm:p-5 rounded-md border border-ayur-border shadow-xs">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                  {freeShippingRemaining > 0 ? (
                    <p className="text-ayur-charcoal-800">
                      Add <span className="font-bold text-ayur-green-900">₹{freeShippingRemaining}</span> more to unlock <span className="font-bold text-ayur-terracotta-600">FREE Pan-India Delivery</span>!
                    </p>
                  ) : (
                    <p className="text-ayur-green-900 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-ayur-green-800" />
                      <span>Congratulations! You qualify for FREE Pan-India Delivery.</span>
                    </p>
                  )}
                  <span className="font-bold text-xs text-ayur-green-900">{progressPercent}%</span>
                </div>
                <div className="w-full bg-ayur-sand/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-ayur-green-800 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-md border border-ayur-border shadow-xs divide-y divide-ayur-border overflow-hidden">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-[#FAF8F5] border border-ayur-border shrink-0 p-1.5 flex items-center justify-center">
                        <img
                          src={item.product.thumbnail || item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold text-ayur-green-800 uppercase tracking-wider block">
                          {item.product.category}
                        </span>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-serif text-sm sm:text-base font-medium text-ayur-charcoal-900 hover:text-ayur-green-900 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-ayur-charcoal-500 mt-0.5">
                          Pack Size: <span className="font-medium text-ayur-charcoal-800">{item.selectedSize}</span>
                        </p>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-base font-bold text-ayur-charcoal-900">
                            ₹{item.product.price}
                          </span>
                          {item.product.mrp > item.product.price && (
                            <span className="text-xs text-ayur-charcoal-400 line-through">
                              ₹{item.product.mrp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stepper, Total, Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-ayur-border/60">
                      <div className="flex items-center border border-ayur-border rounded-lg bg-white px-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-ayur-charcoal-600 hover:text-ayur-charcoal-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-ayur-charcoal-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-ayur-charcoal-600 hover:text-ayur-charcoal-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm sm:text-base font-bold text-ayur-charcoal-900">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSaveForLater(item.product)}
                          className="text-[11px] text-ayur-charcoal-600 hover:text-ayur-green-900 flex items-center gap-1"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Save for Later</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/shop"
                  className="text-xs font-semibold tracking-wider text-ayur-green-900 hover:underline uppercase"
                >
                  ← Continue Browsing Products
                </Link>
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Coupon Redemption Box */}
              <div className="bg-white p-5 rounded-2xl border border-ayur-border shadow-soft space-y-3">
                <h3 className="font-serif text-sm font-semibold text-ayur-charcoal-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-ayur-amber-600" />
                  <span>Redeem Coupon Code</span>
                </h3>

                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">{appliedCoupon.code}</p>
                      <p className="text-[11px] text-emerald-700">You saved ₹{couponDiscount}!</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-red-600 font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => {
                          setCouponCodeInput(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="e.g. WELCOME10, SAVE100"
                        className="flex-1 px-3 py-2 text-xs bg-ayur-ivory border border-ayur-border rounded-lg uppercase focus:outline-none focus:border-ayur-green-800"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {['WELCOME10', 'SAVE100', 'FREESHIP'].map((promoCode) => (
                        <button
                          key={promoCode}
                          type="button"
                          onClick={() => applyCoupon(promoCode)}
                          className="text-[10px] font-mono bg-ayur-cream px-2 py-0.5 rounded border border-ayur-border/80 text-ayur-green-900 hover:bg-ayur-sand/60"
                        >
                          {promoCode}
                        </button>
                      ))}
                    </div>
                  </form>
                )}
              </div>

              {/* Price Breakdown Sidebar */}
              <div className="bg-white p-6 rounded-2xl border border-ayur-border shadow-soft space-y-4">
                <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900 border-b border-ayur-border pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs text-ayur-charcoal-700">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-ayur-charcoal-900">₹{subtotal}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Standard Pan-India Shipping</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="font-bold text-emerald-800 text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                          FREE
                        </span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-ayur-charcoal-500 text-[11px]">
                    <span>Taxes</span>
                    <span>Included in MRP</span>
                  </div>

                  <div className="border-t border-ayur-border pt-3 flex justify-between items-baseline text-sm font-bold text-ayur-charcoal-900">
                    <span className="text-base">Grand Total</span>
                    <span className="text-2xl text-ayur-green-950 font-bold">₹{total}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-widest uppercase transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 text-[11px] text-ayur-charcoal-500 space-y-1 text-center">
                  <p className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-ayur-green-800" />
                    <span>Safe & Encrypted 256-Bit Checkout</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

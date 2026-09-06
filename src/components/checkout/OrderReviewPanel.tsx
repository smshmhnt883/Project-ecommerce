'use client';

import React, { useState } from 'react';
import { Tag, Sparkles, X, ArrowRight } from 'lucide-react';

interface OrderReviewPanelProps {
  cart: any[];
  subtotal: number;
  shippingCharge: number;
  couponDiscount: number;
  grandTotal: number;
  appliedCoupon: any;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  deliveryMethod: string;
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
}

export function OrderReviewPanel({
  cart,
  subtotal,
  shippingCharge,
  couponDiscount,
  grandTotal,
  appliedCoupon,
  applyCoupon,
  removeCoupon,
  deliveryMethod,
  setCurrentStep,
}: OrderReviewPanelProps) {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = (code: string) => {
    if (!code.trim()) return;
    setIsApplyingCoupon(true);
    applyCoupon(code.trim().toUpperCase());
    setCouponCodeInput('');
    setIsApplyingCoupon(false);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ayur-border shadow-soft space-y-6 animate-in fade-in">
      <div className="border-b border-ayur-border pb-4">
        <h2 className="font-serif text-lg sm:text-xl text-ayur-charcoal-900 font-semibold flex items-center gap-2">
          <Tag className="w-5 h-5 text-ayur-green-800" />
          <span>Step 3: Coupon & Order Review</span>
        </h2>
        <p className="text-xs text-ayur-charcoal-600 mt-1">
          Apply promo coupons and review your itemized Ayurvedic cart.
        </p>
      </div>

      <div className="p-4 bg-ayur-ivory rounded-xl border border-ayur-border space-y-3">
        <h4 className="font-serif text-sm font-semibold text-ayur-charcoal-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-ayur-green-800" />
          <span>Have a Coupon Code?</span>
        </h4>

        {appliedCoupon ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-700" />
              <div>
                <p className="text-xs font-bold text-emerald-950 font-mono">
                  {appliedCoupon.code} APPLIED
                </p>
                <p className="text-[11px] text-emerald-800">
                  {appliedCoupon.description} (Saved ₹{couponDiscount})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-red-200"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                placeholder="e.g. WELCOME10"
                className="flex-1 px-3 py-2.5 min-h-[44px] text-base sm:text-xs bg-white border border-ayur-border rounded-md uppercase font-mono tracking-wider focus:outline-none focus:border-ayur-green-800"
              />
              <button
                type="button"
                onClick={() => handleApplyCoupon(couponCodeInput)}
                disabled={isApplyingCoupon || !couponCodeInput.trim()}
                className="px-5 py-2.5 min-h-[44px] bg-ayur-green-900 hover:bg-ayur-green-800 disabled:opacity-50 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center"
              >
                Apply
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-ayur-charcoal-600">
              <span>Recommended Coupon:</span>
              <button
                type="button"
                onClick={() => handleApplyCoupon('WELCOME10')}
                className="px-2.5 py-0.5 bg-white hover:bg-emerald-50 border border-emerald-600 text-emerald-800 rounded font-mono font-bold transition-colors inline-flex items-center gap-1"
              >
                <span>WELCOME10</span>
                <span className="text-[10px] font-sans font-normal text-emerald-700">(10% OFF)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border border-ayur-border rounded-xl divide-y divide-ayur-border overflow-hidden">
        <div className="p-3 bg-ayur-cream/50 font-semibold text-xs text-ayur-charcoal-800 flex justify-between items-center">
          <span>Itemized Products ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          <span>Subtotal</span>
        </div>
        {cart.map((item) => (
          <div
            key={`${item.product.id}-${item.selectedSize}`}
            className="p-3 sm:p-4 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-[#FAF8F5] p-1 border border-ayur-border shrink-0 flex items-center justify-center">
                <img
                  src={item.product.thumbnail || item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-semibold text-ayur-charcoal-900 line-clamp-1">
                  {item.product.name}
                </p>
                <p className="text-ayur-charcoal-500 mt-0.5">
                  Pack: {item.selectedSize} • Qty: {item.quantity} × ₹{item.product.price}
                </p>
              </div>
            </div>
            <span className="font-bold text-ayur-charcoal-900 shrink-0 ml-4">
              ₹{item.product.price * item.quantity}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white rounded-xl border border-ayur-border space-y-2 text-xs text-ayur-charcoal-700">
        <div className="flex justify-between">
          <span>Items Subtotal</span>
          <span className="font-semibold text-ayur-charcoal-900">₹{subtotal}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-800 font-semibold">
            <span>Coupon Discount ({appliedCoupon?.code})</span>
            <span>-₹{couponDiscount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping Fee ({deliveryMethod === 'express' ? 'Priority Air' : 'Standard'})</span>
          <span className="font-semibold text-ayur-charcoal-900">
            {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
          </span>
        </div>
        <div className="border-t border-ayur-border pt-2 flex justify-between items-baseline text-sm font-bold text-ayur-charcoal-900">
          <span className="text-base text-ayur-green-950">Total Payable</span>
          <span className="text-xl text-ayur-green-950 font-bold">₹{grandTotal}</span>
        </div>
      </div>

      <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="w-full sm:w-auto px-5 py-3 min-h-[44px] border border-ayur-border rounded-lg text-xs font-semibold text-ayur-charcoal-700 hover:bg-ayur-cream transition-colors flex items-center justify-center"
        >
          Back to Delivery
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="w-full sm:w-auto px-8 py-3 min-h-[44px] bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <span>Proceed to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

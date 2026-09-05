'use client';

import React from 'react';
import { Truck, CheckCircle2, ArrowRight } from 'lucide-react';

interface ShippingStepProps {
  selectedAddress: any;
  deliveryMethod: 'standard' | 'express';
  setDeliveryMethod: (val: 'standard' | 'express') => void;
  subtotal: number;
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
}

export function ShippingStep({
  selectedAddress,
  deliveryMethod,
  setDeliveryMethod,
  subtotal,
  setCurrentStep,
}: ShippingStepProps) {
  const standardShippingFee = subtotal >= 499 ? 0 : 50;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ayur-border shadow-soft space-y-6 animate-in fade-in">
      <div className="border-b border-ayur-border pb-4">
        <h2 className="font-serif text-lg sm:text-xl text-ayur-charcoal-900 font-semibold flex items-center gap-2">
          <Truck className="w-5 h-5 text-ayur-green-800" />
          <span>Step 2: Delivery & Shipping Method</span>
        </h2>
        <p className="text-xs text-ayur-charcoal-600 mt-1">
          Delivering to:{' '}
          <span className="font-semibold text-ayur-charcoal-900">
            {selectedAddress?.fullName}, {selectedAddress?.city}, {selectedAddress?.state} ({selectedAddress?.pincode})
          </span>
        </p>
      </div>

      {subtotal >= 499 ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-950">Eligible for Free Delivery</h4>
            <p className="mt-0.5 text-emerald-800">
              Your subtotal of ₹{subtotal} exceeds ₹499. You qualify for 100% Free Standard Pan-India Delivery!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-950">Standard Delivery Charge: ₹50</h4>
            <p className="mt-0.5 text-amber-800">
              Add ₹{499 - subtotal} more worth of items to unlock Free Pan-India Delivery!
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <label
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
            deliveryMethod === 'standard'
              ? 'border-ayur-green-900 bg-ayur-cream/30'
              : 'border-ayur-border bg-white hover:border-ayur-green-700/50'
          }`}
        >
          <div className="flex gap-3">
            <input
              type="radio"
              name="delivery"
              checked={deliveryMethod === 'standard'}
              onChange={() => setDeliveryMethod('standard')}
              className="accent-ayur-green-900 mt-1 w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-ayur-charcoal-900">
                  Standard Pan-India Delivery
                </h4>
                {standardShippingFee === 0 && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                    FREE
                  </span>
                )}
              </div>
              <p className="text-xs text-ayur-charcoal-600 mt-1">
                Delivery Window: 3–5 business days dispatch directly from Haridwar Herbal Packaging Center.
              </p>
            </div>
          </div>
          <span className="text-sm font-bold text-ayur-charcoal-900 shrink-0 ml-4">
            {standardShippingFee === 0 ? '₹0' : '₹50'}
          </span>
        </label>

        <label
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
            deliveryMethod === 'express'
              ? 'border-ayur-green-900 bg-ayur-cream/30'
              : 'border-ayur-border bg-white hover:border-ayur-green-700/50'
          }`}
        >
          <div className="flex gap-3">
            <input
              type="radio"
              name="delivery"
              checked={deliveryMethod === 'express'}
              onChange={() => setDeliveryMethod('express')}
              className="accent-ayur-green-900 mt-1 w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-ayur-charcoal-900">
                  Priority Air Express Delivery
                </h4>
                <span className="text-[10px] font-bold text-ayur-amber-900 bg-ayur-amber-100 px-2 py-0.5 rounded">
                  Fastest
                </span>
              </div>
              <p className="text-xs text-ayur-charcoal-600 mt-1">
                Delivery Window: 1–2 business days via BlueDart Air with priority batch handling.
              </p>
            </div>
          </div>
          <span className="text-sm font-bold text-ayur-charcoal-900 shrink-0 ml-4">₹49</span>
        </label>
      </div>

      <div className="pt-4 flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="px-5 py-2.5 border border-ayur-border rounded-lg text-xs font-semibold text-ayur-charcoal-700 hover:bg-ayur-cream transition-colors"
        >
          Back to Address
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="px-8 py-3 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 shadow-md"
        >
          <span>Continue to Order Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

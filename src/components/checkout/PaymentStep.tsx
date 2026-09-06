'use client';

import React from 'react';
import { Lock, QrCode, CreditCard, Building, Wallet, ShieldCheck } from 'lucide-react';

interface PaymentStepProps {
  paymentMethod: 'online' | 'cod';
  setPaymentMethod: (val: 'online' | 'cod') => void;
  selectedAddress: any;
  deliveryMethod: string;
  shippingCharge: number;
  grandTotal: number;
  isProcessingOrder: boolean;
  onCompleteOrder: () => void;
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
}

export function PaymentStep({
  paymentMethod,
  setPaymentMethod,
  selectedAddress,
  deliveryMethod,
  shippingCharge,
  grandTotal,
  isProcessingOrder,
  onCompleteOrder,
  setCurrentStep,
}: PaymentStepProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ayur-border shadow-soft space-y-6 animate-in fade-in">
      <div className="border-b border-ayur-border pb-4">
        <h2 className="font-serif text-lg sm:text-xl text-ayur-charcoal-900 font-semibold flex items-center gap-2">
          <Lock className="w-5 h-5 text-ayur-green-800" />
          <span>Step 4: Select Payment Method & Place Order</span>
        </h2>
        <p className="text-xs text-ayur-charcoal-600 mt-1">
          Choose between Instant Online Payment powered by Razorpay or Cash on Delivery (COD).
        </p>
      </div>

      <div className="p-4 bg-ayur-ivory rounded-xl border border-ayur-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="font-bold text-ayur-charcoal-900 uppercase tracking-wider block mb-1">
            Delivering To:
          </span>
          <p className="font-semibold text-ayur-charcoal-900">{selectedAddress?.fullName}</p>
          <p className="text-ayur-charcoal-600">
            {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
          </p>
          <p className="text-ayur-charcoal-600">Mobile: +91 {selectedAddress?.phone}</p>
        </div>
        <div>
          <span className="font-bold text-ayur-charcoal-900 uppercase tracking-wider block mb-1">
            Shipping Method:
          </span>
          <p className="text-ayur-charcoal-800 font-medium">
            {deliveryMethod === 'express' ? 'Priority Air Express (1–2 Days)' : 'Standard Pan-India (3–5 Days)'}
          </p>
          <p className="text-emerald-800 font-semibold mt-1">
            Delivery Fee: {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div
          className={`rounded-xl border-2 transition-all overflow-hidden ${
            paymentMethod === 'online' ? 'border-ayur-green-900 bg-white shadow-xs' : 'border-ayur-border bg-white'
          }`}
        >
          <label
            onClick={() => setPaymentMethod('online')}
            className="p-4 sm:p-5 flex items-start justify-between cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <input
                type="radio"
                name="paymentCategory"
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
                className="accent-ayur-green-900 w-4 h-4 mt-0.5 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ayur-charcoal-900">
                    Online Payment (UPI, Cards, Net Banking, Wallets)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    Powered by Razorpay
                  </span>
                </div>
                <p className="text-xs text-ayur-charcoal-600 mt-1">
                  Instant and 100% secure payment via Google Pay, PhonePe, Paytm, BHIM, RuPay, Visa, Mastercard, and Net Banking.
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-ayur-charcoal-600">
                  <span className="inline-flex items-center gap-1 bg-ayur-ivory px-2 py-1 rounded border border-ayur-border">
                    <QrCode className="w-3.5 h-3.5 text-ayur-green-900" />
                    <span>UPI & QR</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-ayur-ivory px-2 py-1 rounded border border-ayur-border">
                    <CreditCard className="w-3.5 h-3.5 text-ayur-green-900" />
                    <span>All Cards</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-ayur-ivory px-2 py-1 rounded border border-ayur-border">
                    <Building className="w-3.5 h-3.5 text-ayur-green-900" />
                    <span>Net Banking</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-ayur-ivory px-2 py-1 rounded border border-ayur-border">
                    <Wallet className="w-3.5 h-3.5 text-ayur-green-900" />
                    <span>Wallets</span>
                  </span>
                </div>
              </div>
            </div>
          </label>

          {paymentMethod === 'online' && (
            <div className="px-5 py-3.5 bg-ayur-cream/30 border-t border-ayur-border text-xs text-ayur-charcoal-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Official 256-bit SSL encrypted Razorpay checkout modal will launch upon clicking below.
              </span>
            </div>
          )}
        </div>

        <div
          className={`rounded-xl border-2 transition-all overflow-hidden ${
            paymentMethod === 'cod' ? 'border-ayur-green-900 bg-white shadow-xs' : 'border-ayur-border bg-white'
          }`}
        >
          <label
            onClick={() => setPaymentMethod('cod')}
            className="p-4 sm:p-5 flex items-start justify-between cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <input
                type="radio"
                name="paymentCategory"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="accent-ayur-green-900 w-4 h-4 mt-0.5 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ayur-charcoal-900">
                    Cash on Delivery (COD)
                  </span>
                </div>
                <p className="text-xs text-ayur-charcoal-600 mt-1">
                  Pay via Cash or doorstep UPI when your authentic Patanjali parcel is delivered.
                </p>
              </div>
            </div>
            <span className="text-[10px] text-ayur-charcoal-600 font-medium">Pay upon delivery</span>
          </label>

          {paymentMethod === 'cod' && (
            <div className="px-5 py-3.5 bg-ayur-ivory border-t border-ayur-border text-xs text-ayur-charcoal-700">
              <p className="font-medium text-ayur-charcoal-900">✓ Cash & UPI accepted upon delivery.</p>
              <p className="mt-0.5 text-[11px] text-ayur-charcoal-500">
                Please keep exact change or your mobile UPI ready at the time of delivery.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="w-full sm:w-auto px-5 py-3 min-h-[44px] border border-ayur-border rounded-lg text-xs font-semibold text-ayur-charcoal-700 hover:bg-ayur-cream transition-colors flex items-center justify-center"
        >
          Back to Review
        </button>
        <button
          type="button"
          onClick={onCompleteOrder}
          disabled={isProcessingOrder}
          className="w-full sm:w-auto px-8 py-4 min-h-[48px] bg-ayur-green-900 hover:bg-ayur-green-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 text-center"
        >
          {isProcessingOrder ? (
            paymentMethod === 'online' ? (
              <span>Launching Razorpay Gateway...</span>
            ) : (
              <span>Placing COD Order in InsForge...</span>
            )
          ) : (
            <>
              <Lock className="w-4 h-4 shrink-0" />
              <span>
                {paymentMethod === 'online'
                  ? `PAY VIA RAZORPAY (₹${grandTotal})`
                  : `CONFIRM & PLACE COD ORDER (₹${grandTotal})`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

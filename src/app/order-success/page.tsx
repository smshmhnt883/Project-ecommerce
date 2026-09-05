'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, MapPin, CreditCard, Truck } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getOrderById, orders } = useOrders();

  const order = (orderId ? getOrderById(orderId) : null) || orders[0];

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-serif text-2xl text-ayur-charcoal-900 mb-2">Order Confirmed</h2>
        <p className="text-xs text-ayur-charcoal-600 mb-6">Your order has been recorded successfully.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account/orders"
            className="px-6 py-2.5 bg-ayur-green-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-green-800 transition-colors shadow-sm cursor-pointer relative z-10"
          >
            View Order History
          </Link>
          <Link
            href="/shop"
            className="px-6 py-2.5 bg-white border border-ayur-border text-ayur-charcoal-800 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-cream transition-colors cursor-pointer relative z-10"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-ayur-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Confirmed Banner */}
        <div className="bg-white rounded-2xl border border-ayur-border p-6 sm:p-10 shadow-soft text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed & Placed
          </span>

          <h1 className="font-serif text-2xl sm:text-4xl text-ayur-green-950 font-normal mt-3 mb-2">
            Thank you for your order!
          </h1>

          <p className="text-xs sm:text-sm text-ayur-charcoal-600 max-w-md mx-auto leading-relaxed">
            Your authentic Patanjali formulations have been scheduled for dispatch at our Haridwar logistics center.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs font-mono bg-ayur-ivory px-4 py-2.5 rounded-lg border border-ayur-border">
            <span>
              Order ID: <strong className="text-ayur-green-950">{order.id}</strong>
            </span>
            <span className="text-ayur-border">•</span>
            <span>Date: {order.createdAt}</span>
            <span className="text-ayur-border">•</span>
            <span className="text-emerald-800 font-semibold">
              Est. Delivery: {order.estimatedDelivery}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/account/orders/${order.id}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer relative z-10"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Status</span>
            </Link>
            <Link
              href="/account/orders"
              className="w-full sm:w-auto px-6 py-3.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer relative z-10"
            >
              <span>View Order History</span>
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-ayur-cream text-ayur-green-950 border border-ayur-border rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors text-center cursor-pointer relative z-10"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details Receipt Card */}
        <div className="bg-white rounded-2xl border border-ayur-border p-6 sm:p-8 shadow-soft space-y-6">
          <h2 className="font-serif text-base font-semibold text-ayur-charcoal-900 border-b border-ayur-border pb-3">
            Order Receipt & Delivery Summary
          </h2>

          {/* Delivery & Payment block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-ayur-ivory rounded-xl border border-ayur-border">
              <div className="flex items-center gap-1.5 font-bold text-ayur-charcoal-900 uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5 text-ayur-green-800" />
                <span>Shipping Address</span>
              </div>
              <p className="font-semibold text-ayur-charcoal-900">{order.shippingAddress.fullName}</p>
              <p className="text-ayur-charcoal-600 mt-0.5">{order.shippingAddress.addressLine1}</p>
              <p className="text-ayur-charcoal-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-ayur-charcoal-600 mt-1">Mobile: +91 {order.shippingAddress.phone}</p>
            </div>

            <div className="p-4 bg-ayur-ivory rounded-xl border border-ayur-border">
              <div className="flex items-center gap-1.5 font-bold text-ayur-charcoal-900 uppercase tracking-wider mb-2">
                <CreditCard className="w-3.5 h-3.5 text-ayur-green-800" />
                <span>Payment & Shipping</span>
              </div>
              <p className="text-ayur-charcoal-800">
                Method: <span className="uppercase font-bold">{order.paymentMethod}</span>
              </p>
              <p className="text-ayur-charcoal-600 mt-0.5">
                Delivery: {order.deliveryMethod === 'express' ? 'Priority Express Air' : 'Standard Pan-India'}
              </p>
              <p className="text-amber-800 font-semibold mt-1">Payment Status: Pending (Demo Order Recorded)</p>
            </div>
          </div>

          {/* Ordered items list */}
          <div className="border border-ayur-border rounded-xl divide-y divide-ayur-border overflow-hidden">
            <div className="p-3 bg-ayur-cream/50 font-semibold text-xs text-ayur-charcoal-800">
              Purchased Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </div>
            {order.items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="p-3 sm:p-4 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.thumbnail || item.product.images[0]}
                    alt=""
                    className="w-12 h-12 rounded object-cover border border-ayur-border"
                  />
                  <div>
                    <p className="font-semibold text-ayur-charcoal-900">{item.product.name}</p>
                    <p className="text-ayur-charcoal-500">
                      Pack: {item.selectedSize} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-ayur-charcoal-900">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-2 border-t border-ayur-border/80 space-y-1.5 text-xs text-ayur-charcoal-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-ayur-charcoal-900">₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Discount ({order.couponCode || 'Coupon'})</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
            </div>
            <div className="border-t border-ayur-border pt-2 flex justify-between text-sm font-bold text-ayur-charcoal-900">
              <span>Total Paid</span>
              <span className="text-xl text-ayur-green-950 font-bold">₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs">Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

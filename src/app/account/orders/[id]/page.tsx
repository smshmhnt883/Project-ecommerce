'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';
import { AccountNav } from '@/components/account/AccountNav';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function OrderTrackingDetailPage({ params }: { params: { id: string } }) {
  const { getOrderById, orders } = useOrders();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const order = getOrderById(params.id) || orders[0];

  if (!order) {
    return notFound();
  }

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.selectedSize);
    });
    showToast(`Items from order ${order.id} added to bag!`, 'success');
  };

  return (
    <div className="py-8 sm:py-12 bg-ayur-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-ayur-green-900 hover:underline uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ayur-border shadow-soft flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-ayur-green-800 uppercase tracking-wider block">
                  Logistics Tracking
                </span>
                <h1 className="font-serif text-xl sm:text-2xl text-ayur-charcoal-900 font-medium mt-0.5">
                  Order {order.id}
                </h1>
                <p className="text-xs text-ayur-charcoal-500 mt-1">
                  Placed on {order.createdAt} • Estimated Delivery:{' '}
                  <strong className="text-emerald-900">{order.estimatedDelivery}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleReorder}
                className="px-5 py-2.5 bg-ayur-cream hover:bg-ayur-sand/80 text-ayur-green-950 rounded-lg text-xs font-semibold uppercase tracking-wider border border-ayur-border flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-order Items</span>
              </button>
            </div>

            {/* 7-Stage Order Timeline */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ayur-border shadow-soft space-y-6">
              <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900 border-b border-ayur-border pb-3">
                Shipment Progress Timeline
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-ayur-border">
                {order.trackingTimeline.map((step, idx) => (
                  <div key={step.stage} className="relative flex items-start gap-4 text-xs">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step.completed
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border-2 border-ayur-border text-ayur-charcoal-400'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px]">{idx + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4
                          className={`font-semibold text-sm ${
                            step.completed ? 'text-ayur-charcoal-900' : 'text-ayur-charcoal-500'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-[11px] font-mono text-ayur-charcoal-500">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-ayur-charcoal-600 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                      {step.current && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Current Stage in Transit</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-5 rounded-2xl border border-ayur-border shadow-soft space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-ayur-charcoal-900 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-ayur-green-800" />
                  <span>Delivery Destination</span>
                </div>
                <p className="font-semibold text-ayur-charcoal-900">{order.shippingAddress.fullName}</p>
                <p className="text-ayur-charcoal-600 leading-relaxed">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                </p>
                <p className="text-ayur-charcoal-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-ayur-charcoal-600">Mobile: +91 {order.shippingAddress.phone}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-ayur-border shadow-soft space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-ayur-charcoal-900 uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-ayur-green-800" />
                  <span>Payment & Logistics</span>
                </div>
                <p className="text-ayur-charcoal-800">
                  Payment Mode: <strong className="uppercase">{order.paymentMethod}</strong>
                </p>
                <p className="text-ayur-charcoal-600">
                  Courier Partner: Bluedart Express AWB #849204812
                </p>
                <p className="text-amber-800 font-semibold">
                  Payment Status: {order.paymentStatus.toUpperCase()} (Demo Order - Gateway Pending)
                </p>
              </div>
            </div>

            {/* Itemized Receipt */}
            <div className="bg-white rounded-2xl border border-ayur-border shadow-soft p-6 space-y-4">
              <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900 border-b border-ayur-border pb-3">
                Purchased Formulations
              </h3>

              <div className="divide-y divide-ayur-border">
                {order.items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-sm bg-[#FAF8F5] p-1 border border-ayur-border shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.thumbnail || item.product.images[0]}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-medium text-xs text-ayur-charcoal-900 hover:text-ayur-green-900"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-[11px] text-ayur-charcoal-500">
                          Pack: {item.selectedSize} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-ayur-charcoal-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-ayur-border space-y-1.5 text-xs text-ayur-charcoal-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ayur-charcoal-900">₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount ({order.couponCode || 'Promo'})</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                </div>
                <div className="border-t border-ayur-border pt-2 flex justify-between text-sm font-bold text-ayur-charcoal-900">
                  <span>Total Amount Paid</span>
                  <span className="text-lg text-ayur-green-950 font-bold">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

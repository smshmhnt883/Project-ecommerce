'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AccountNav } from '@/components/account/AccountNav';
import { useOrders } from '@/context/OrderContext';

export default function OrdersListPage() {
  const { orders } = useOrders();

  return (
    <div className="py-8 sm:py-12 bg-ayur-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal mb-8">
          Order History & Tracking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          <div className="lg:col-span-8 space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-ayur-border text-center shadow-soft">
                <div className="w-16 h-16 rounded-full bg-ayur-cream flex items-center justify-center text-ayur-charcoal-400 mx-auto mb-4">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg text-ayur-charcoal-900 font-medium">No Orders Yet</h3>
                <p className="text-xs text-ayur-charcoal-600 mt-1 max-w-sm mx-auto">
                  Your past and current orders will be visible here with complete shipment tracking.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-block px-6 py-2.5 bg-ayur-green-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-green-800"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-ayur-border shadow-soft overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-4 sm:p-5 bg-ayur-ivory border-b border-ayur-border flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-ayur-charcoal-500 block">Order Placed</span>
                        <span className="font-semibold text-ayur-charcoal-900">{order.createdAt}</span>
                      </div>
                      <div>
                        <span className="text-ayur-charcoal-500 block">Total Amount</span>
                        <span className="font-bold text-ayur-charcoal-900">₹{order.total}</span>
                      </div>
                      <div>
                        <span className="text-ayur-charcoal-500 block">Ship To</span>
                        <span className="font-semibold text-ayur-charcoal-900 truncate max-w-[120px] block">
                          {order.shippingAddress.fullName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-ayur-green-950">{order.id}</span>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="px-3.5 py-1.5 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </Link>
                    </div>
                  </div>

                  {/* Products in this order */}
                  <div className="p-4 sm:p-5 divide-y divide-ayur-border">
                    {order.items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedSize}`}
                        className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.product.thumbnail || item.product.images[0]}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover border border-ayur-border bg-white"
                          />
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="text-xs font-semibold text-ayur-charcoal-900 hover:text-ayur-green-900 line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-[11px] text-ayur-charcoal-500 mt-0.5">
                              Pack: {item.selectedSize} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          <span className="font-bold text-ayur-charcoal-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Status */}
                  <div className="p-4 bg-ayur-cream/30 border-t border-ayur-border flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-ayur-charcoal-700">
                        Status:{' '}
                        <strong className="text-emerald-900 uppercase">
                          {order.orderStatus.replace(/_/g, ' ')}
                        </strong>
                      </span>
                    </div>

                    <span className="text-ayur-charcoal-600 text-[11px]">
                      Est. Delivery: <strong>{order.estimatedDelivery}</strong>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

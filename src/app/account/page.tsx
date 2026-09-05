'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
} from 'lucide-react';
import { AccountNav } from '@/components/account/AccountNav';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAddresses } from '@/context/AddressContext';

export default function AccountOverviewPage() {
  const { user, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const { wishlistCount } = useWishlist();
  const { addresses } = useAddresses();

  const recentOrder = orders[0];

  return (
    <div className="py-8 sm:py-12 bg-ayur-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal mb-8">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <AccountNav />
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-ayur-border shadow-soft flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ayur-green-50 text-ayur-green-900 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-ayur-charcoal-900">{orders.length}</span>
                  <p className="text-xs text-ayur-charcoal-600">Total Orders</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-ayur-border shadow-soft flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ayur-terracotta-50 text-ayur-terracotta-600 flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-ayur-charcoal-900">{wishlistCount}</span>
                  <p className="text-xs text-ayur-charcoal-600">Wishlist Items</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-ayur-border shadow-soft flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ayur-cream text-ayur-green-800 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-ayur-charcoal-900">{addresses.length}</span>
                  <p className="text-xs text-ayur-charcoal-600">Saved Addresses</p>
                </div>
              </div>
            </div>

            {/* Recent Order Preview */}
            <div className="bg-white p-6 rounded-2xl border border-ayur-border shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-ayur-border pb-3">
                <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900">
                  Most Recent Order
                </h3>
                <Link
                  href="/account/orders"
                  className="text-xs font-semibold text-ayur-green-800 hover:underline flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentOrder ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-ayur-charcoal-900">{recentOrder.id}</span>
                      <span className="text-ayur-charcoal-500 ml-2">Placed on {recentOrder.createdAt}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Status: {recentOrder.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="p-4 bg-ayur-ivory rounded-xl border border-ayur-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-ayur-border shrink-0">
                        <img
                          src={recentOrder.items[0]?.product.thumbnail || recentOrder.items[0]?.product.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-ayur-charcoal-900">
                          {recentOrder.items[0]?.product.name}
                          {recentOrder.items.length > 1 && ` + ${recentOrder.items.length - 1} other item(s)`}
                        </h4>
                        <p className="text-[11px] text-ayur-charcoal-500 mt-0.5">
                          Total: <strong className="text-ayur-charcoal-900">₹{recentOrder.total}</strong> • Paid via {recentOrder.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/account/orders/${recentOrder.id}`}
                      className="px-4 py-2 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ayur-charcoal-600">You haven&apos;t placed any orders yet.</p>
              )}
            </div>

            {/* Quick Ayurvedic Care Tip */}
            <div className="bg-[#FAF8F5] p-5 rounded-md border border-ayur-border flex items-start gap-3.5">
              <div className="p-2.5 bg-ayur-green-900 text-white rounded-md shrink-0">
                <Leaf className="w-4 h-4 text-ayur-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-ayur-charcoal-900">
                  Ayurvedic Ritucharya (Seasonal Living) Tip
                </h4>
                <p className="text-xs text-ayur-charcoal-700 leading-relaxed">
                  Support your natural Agni (digestive fire) by pairing Pure Cow Desi Ghee with warm meals, and incorporate pure Damask Rose Water to soothe Pitta balance throughout the day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

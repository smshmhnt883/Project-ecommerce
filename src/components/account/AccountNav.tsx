'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useOrders } from '@/context/OrderContext';

export function AccountNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { orders } = useOrders();

  const links = [
    { href: '/account', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/account/orders', label: `Orders (${orders.length})`, icon: Package },
    { href: '/account/wishlist', label: `Wishlist (${wishlistCount})`, icon: Heart },
    { href: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
    { href: '/account/profile', label: 'Profile & Security', icon: User },
  ];

  return (
    <aside className="bg-white rounded-md border border-ayur-border p-5 shadow-xs space-y-6">
      {/* User profile capsule */}
      <div className="flex items-center gap-3 pb-5 border-b border-ayur-border">
        <div className="w-10 h-10 rounded-md bg-ayur-green-900 text-white font-serif text-base font-bold flex items-center justify-center shrink-0">
          {user?.name ? user.name[0].toUpperCase() : 'A'}
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-sm font-semibold text-ayur-charcoal-900 truncate">
            {user?.name || 'Ayurveda Member'}
          </h3>
          <p className="text-xs text-ayur-charcoal-500 truncate">{user?.email || 'member@patanjali.in'}</p>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 uppercase tracking-wider mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            <span>Verified Customer</span>
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-ayur-green-900 text-white shadow-xs'
                  : 'text-ayur-charcoal-700 hover:bg-ayur-cream hover:text-ayur-green-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}

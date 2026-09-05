'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ayur-ivory border-t border-ayur-border px-2 py-1.5 shadow-md">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center p-1.5 text-[11px] font-medium transition-colors ${
            pathname === '/' ? 'text-ayur-green-900 font-semibold' : 'text-ayur-charcoal-600'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center p-1.5 text-[11px] font-medium transition-colors ${
            pathname === '/shop' ? 'text-ayur-green-900 font-semibold' : 'text-ayur-charcoal-600'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Shop</span>
        </Link>

        <Link
          href="/account/wishlist"
          className={`flex flex-col items-center p-1.5 text-[11px] font-medium transition-colors relative ${
            pathname === '/account/wishlist' ? 'text-ayur-green-900 font-semibold' : 'text-ayur-charcoal-600'
          }`}
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-ayur-terracotta-500 text-white text-[9px] font-bold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center p-1.5 text-[11px] font-medium text-ayur-charcoal-600 relative"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Bag</span>
          {itemCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-ayur-green-900 text-white text-[9px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>

        <Link
          href="/account"
          className={`flex flex-col items-center p-1.5 text-[11px] font-medium transition-colors ${
            pathname.startsWith('/account') && pathname !== '/account/wishlist'
              ? 'text-ayur-green-900 font-semibold'
              : 'text-ayur-charcoal-600'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Account</span>
        </Link>
      </div>
    </div>
  );
}

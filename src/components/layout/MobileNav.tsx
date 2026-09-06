'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface MobileNavProps {
  onOpenSearch?: () => void;
}

export function MobileNav({ onOpenSearch }: MobileNavProps) {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ayur-ivory/95 backdrop-blur-md border-t border-ayur-border px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 text-[10px] font-medium transition-colors ${
            pathname === '/' ? 'text-ayur-green-900 font-bold' : 'text-ayur-charcoal-600 hover:text-ayur-green-900'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${pathname === '/' ? 'stroke-[2.5px]' : ''}`} />
          <span>Home</span>
        </Link>

        <Link
          href="/shop"
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 text-[10px] font-medium transition-colors ${
            pathname === '/shop' ? 'text-ayur-green-900 font-bold' : 'text-ayur-charcoal-600 hover:text-ayur-green-900'
          }`}
        >
          <Compass className={`w-5 h-5 mb-0.5 ${pathname === '/shop' ? 'stroke-[2.5px]' : ''}`} />
          <span>Shop</span>
        </Link>

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search authentic products"
          className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 text-[10px] font-medium text-ayur-charcoal-600 hover:text-ayur-green-900 transition-colors"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Search</span>
        </button>

        <button
          type="button"
          onClick={openCart}
          aria-label={`Shopping bag with ${itemCount} items`}
          className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 text-[10px] font-medium text-ayur-charcoal-600 hover:text-ayur-green-900 transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-ayur-green-900 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </div>
          <span>Bag</span>
        </button>

        <Link
          href="/account"
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 text-[10px] font-medium transition-colors ${
            pathname.startsWith('/account')
              ? 'text-ayur-green-900 font-bold'
              : 'text-ayur-charcoal-600 hover:text-ayur-green-900'
          }`}
        >
          <User className={`w-5 h-5 mb-0.5 ${pathname.startsWith('/account') ? 'stroke-[2.5px]' : ''}`} />
          <span>Account</span>
        </Link>
      </div>
    </nav>
  );
}

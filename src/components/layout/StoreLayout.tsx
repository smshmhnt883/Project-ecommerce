'use client';

import React, { useState, ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { SearchOverlay } from './SearchOverlay';
import { MobileNav } from './MobileNav';

export function StoreLayout({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-ayur-ivory text-ayur-charcoal-800">
      {/* Sticky Header */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out Mini Cart Drawer */}
      <CartDrawer />

      {/* Search Modal Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Bottom Sticky Navigation on Mobile */}
      <MobileNav />
    </div>
  );
}

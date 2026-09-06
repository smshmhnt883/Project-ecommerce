'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Percent,
  LogOut,
  Package,
  MapPin,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '@/lib/data/categories';
import { CONCERNS } from '@/lib/data/concerns';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const [concernsDropdown, setConcernsDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdown(false);
    setConcernsDropdown(false);
    setAccountDropdown(false);
  }, [pathname]);

  return (
    <header className="w-full z-40 sticky top-0 transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="w-full max-w-full bg-ayur-green-900 text-ayur-ivory text-[11px] sm:text-xs py-2 px-3 sm:px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-ayur-green-800 box-border overflow-hidden">
        <span className="truncate max-w-full">Authentic Ayurvedic & Natural Products • Free Pan-India Delivery on orders above ₹499</span>
        <span className="hidden md:inline text-ayur-amber-400 font-semibold shrink-0">• Use code WELCOME10 for 10% OFF</span>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full max-w-full transition-colors duration-200 box-border ${
          isScrolled
            ? 'bg-ayur-ivory shadow-xs border-b border-ayur-border py-2.5 sm:py-3'
            : 'bg-ayur-ivory border-b border-ayur-border py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] box-border">
          <div className="flex items-center justify-between gap-1 sm:gap-4 w-full">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 sm:p-2 min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center text-ayur-charcoal-800 hover:text-ayur-green-900 transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Left Nav for Desktop */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-ayur-charcoal-800">
              <Link
                href="/shop"
                className={`hover:text-ayur-green-800 transition-colors tracking-wide ${
                  pathname === '/shop' ? 'text-ayur-green-800 font-semibold' : ''
                }`}
              >
                Shop All
              </Link>

              {/* Categories Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesDropdown(true)}
                onMouseLeave={() => setCategoriesDropdown(false)}
              >
                <button
                  className="flex items-center gap-1 hover:text-ayur-green-800 transition-colors py-2 tracking-wide"
                  aria-expanded={categoriesDropdown}
                >
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>

                {categoriesDropdown && (
                  <div className="absolute top-full left-0 w-[520px] bg-white rounded-lg shadow-hover border border-ayur-border p-5 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        className="group flex items-start gap-3 p-2 rounded-md hover:bg-ayur-cream/60 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-sm overflow-hidden bg-[#FAF8F5] p-1 border border-ayur-border/60 shrink-0 flex items-center justify-center">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-ayur-charcoal-900 group-hover:text-ayur-green-900">
                            {cat.name}
                          </div>
                          <div className="text-xs text-ayur-charcoal-600 line-clamp-1">{cat.shortDesc}</div>
                        </div>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-2 border-t border-ayur-border/60 flex justify-between items-center text-xs">
                      <span className="text-ayur-charcoal-600">100% Authentic Patanjali Formulations</span>
                      <Link href="/shop" className="text-ayur-green-800 font-semibold hover:underline">
                        View All Categories →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Shop by Concern Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setConcernsDropdown(true)}
                onMouseLeave={() => setConcernsDropdown(false)}
              >
                <button
                  className="flex items-center gap-1 hover:text-ayur-green-800 transition-colors py-2 tracking-wide"
                  aria-expanded={concernsDropdown}
                >
                  <span>By Concern</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {concernsDropdown && (
                  <div className="absolute top-full left-0 w-[420px] bg-white rounded-lg shadow-hover border border-ayur-border p-4 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    {CONCERNS.map((c) => (
                      <Link
                        key={c.id}
                        href={`/shop?concern=${c.slug}`}
                        className="p-2.5 rounded-md hover:bg-ayur-cream/60 transition-colors text-sm font-medium text-ayur-charcoal-800 hover:text-ayur-green-900"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/shop?category=hair-care"
                className="hover:text-ayur-green-800 transition-colors tracking-wide"
              >
                Hair Care
              </Link>
              <Link
                href="/shop?category=personal-care"
                className="hover:text-ayur-green-800 transition-colors tracking-wide"
              >
                Personal Care
              </Link>
              <Link
                href="/combos"
                className="hover:text-ayur-green-800 transition-colors tracking-wide flex items-center gap-1 text-ayur-terracotta-700"
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Combos</span>
              </Link>
            </nav>

            {/* Center Brand Identity (Neutral Editorial Wordmark - No Fake Logo) */}
            <div className="flex-1 lg:flex-initial text-center min-w-0 px-1 sm:px-2">
              <Link href="/" className="inline-block group max-w-full">
                <div className="flex flex-col items-center">
                  <span className="font-serif tracking-[0.10em] sm:tracking-[0.22em] text-sm sm:text-lg lg:text-2xl font-normal text-ayur-green-950 uppercase group-hover:text-ayur-green-800 transition-colors truncate max-w-full block">
                    Ayurveda & Botanicals
                  </span>
                  <span className="text-[8px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.25em] text-ayur-charcoal-600 uppercase font-medium mt-0.5 truncate max-w-full block">
                    Authentic Patanjali Marketplace
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              {/* Search Modal Trigger */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 sm:p-2.5 text-ayur-charcoal-800 hover:text-ayur-green-900 hover:bg-ayur-cream/60 rounded-full transition-colors relative shrink-0"
                aria-label="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link - Hidden on mobile (<640px) as it is in bottom nav & account */}
              <Link
                href="/account/wishlist"
                className="hidden sm:flex p-2.5 text-ayur-charcoal-800 hover:text-ayur-green-900 hover:bg-ayur-cream/60 rounded-full transition-colors relative shrink-0"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-ayur-terracotta-500 text-white text-[10px] font-semibold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account Menu - Hidden on mobile (<640px) as it is in bottom nav & mobile menu */}
              <div className="relative hidden sm:block shrink-0">
                <button
                  type="button"
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  className="p-2 text-ayur-charcoal-800 hover:text-ayur-green-900 hover:bg-ayur-cream/60 rounded-full transition-colors flex items-center"
                  aria-label="My Account"
                >
                  {isAuthenticated && user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-ayur-gold-500/40"
                    />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </button>

                {accountDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-hover border border-ayur-border py-2 z-50 animate-in fade-in duration-150"
                    onMouseLeave={() => setAccountDropdown(false)}
                  >
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-4 py-2 border-b border-ayur-border/60 flex items-center gap-2.5">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-ayur-border shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-ayur-cream text-ayur-green-900 font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-ayur-border">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs text-ayur-charcoal-600">Signed in as</p>
                            <p className="text-sm font-semibold text-ayur-charcoal-900 truncate">{user.name}</p>
                            <p className="text-xs text-ayur-charcoal-600 truncate">{user.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setAccountDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ayur-charcoal-800 hover:bg-ayur-cream/60"
                        >
                          <UserIcon className="w-4 h-4 text-ayur-green-800" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setAccountDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ayur-charcoal-800 hover:bg-ayur-cream/60"
                        >
                          <Package className="w-4 h-4 text-ayur-green-800" />
                          <span>Orders & Tracking</span>
                        </Link>
                        <Link
                          href="/account/addresses"
                          onClick={() => setAccountDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ayur-charcoal-800 hover:bg-ayur-cream/60"
                        >
                          <MapPin className="w-4 h-4 text-ayur-green-800" />
                          <span>Saved Addresses</span>
                        </Link>
                        <div className="border-t border-ayur-border/60 my-1"></div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setAccountDropdown(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-ayur-border/60">
                          <p className="text-xs text-ayur-charcoal-600">Ayurveda Member</p>
                          <p className="text-xs text-ayur-charcoal-700 mt-1">
                            Access orders, addresses & wishlist
                          </p>
                        </div>
                        <Link
                          href="/login"
                          onClick={() => setAccountDropdown(false)}
                          className="block px-4 py-2 text-sm font-medium text-ayur-green-900 hover:bg-ayur-cream/60"
                        >
                          Sign In / Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 bg-ayur-green-900 text-ayur-ivory hover:bg-ayur-green-800 rounded-full transition-colors relative shrink-0 shadow-xs"
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-semibold tracking-wide">BAG</span>
                {itemCount > 0 && (
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-ayur-amber-500 text-ayur-green-950 text-[10px] sm:text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-ayur-ivory h-[100dvh] shadow-2xl flex flex-col z-10 overflow-y-auto touch-pan-y overscroll-contain">
            <div className="p-4 border-b border-ayur-border flex items-center justify-between shrink-0 bg-ayur-ivory sticky top-0 z-20">
              <div>
                <div className="font-serif text-lg tracking-wider text-ayur-green-950 uppercase">
                  Ayurveda & Botanicals
                </div>
                <div className="text-[10px] tracking-widest text-ayur-charcoal-600 uppercase">
                  Patanjali Store
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-ayur-charcoal-600 hover:text-ayur-charcoal-900 rounded-md"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-4 flex-1 pb-[max(8rem,calc(5rem+env(safe-area-inset-bottom)))]">
              {/* Prominent Auth Block at Top */}
              <div className="p-3.5 bg-ayur-cream/80 border border-ayur-border rounded-xl shadow-xs">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-ayur-green-900 text-white flex items-center justify-center font-serif text-base font-semibold shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-ayur-charcoal-600 font-medium">Welcome back,</div>
                        <div className="text-sm font-semibold text-ayur-charcoal-900 truncate">
                          {user.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-ayur-border/60">
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 text-center py-2 px-3 text-xs font-medium bg-ayur-green-900 text-white rounded-lg hover:bg-ayur-green-950 transition-colors"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 text-center py-2 px-3 text-xs font-medium bg-white border border-ayur-border text-ayur-charcoal-800 rounded-lg hover:bg-ayur-cream transition-colors"
                      >
                        My Orders
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className="py-2 px-3 text-xs font-medium border border-ayur-border text-ayur-terracotta-700 bg-white rounded-lg hover:bg-ayur-cream transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-ayur-charcoal-600 mb-1">
                      Sign in for personalized Ayurvedic wellness & express checkout
                    </div>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold tracking-wide bg-ayur-green-900 text-white rounded-lg shadow-sm hover:bg-ayur-green-950 transition-colors min-h-[44px]"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Sign In / Register</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Search */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-ayur-border text-sm text-ayur-charcoal-600 min-h-[44px] hover:border-ayur-gold/50 transition-colors"
              >
                <Search className="w-4 h-4 text-ayur-charcoal-400" />
                <span>Search authentic products...</span>
              </button>

              <div className="space-y-1">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-md text-base font-medium text-ayur-charcoal-900 hover:bg-ayur-cream"
                >
                  Shop All Products
                </Link>
                <Link
                  href="/combos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-md text-base font-medium text-ayur-terracotta-700 hover:bg-ayur-cream"
                >
                  Combos & Bundles
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-md text-base font-medium text-ayur-charcoal-900 hover:bg-ayur-cream"
                >
                  Track Orders
                </Link>
              </div>

              {/* Categories list */}
              <div className="pt-2 border-t border-ayur-border">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-ayur-charcoal-600 mb-2">
                  Browse by Category
                </p>
                <div className="space-y-0.5">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 rounded-md text-sm text-ayur-charcoal-800 hover:bg-ayur-cream"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Concerns list */}
              <div className="pt-2 border-t border-ayur-border">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-ayur-charcoal-600 mb-2">
                  Browse by Concern
                </p>
                <div className="space-y-0.5">
                  {CONCERNS.map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?concern=${c.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 rounded-md text-sm text-ayur-charcoal-800 hover:bg-ayur-cream"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

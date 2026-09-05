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
      <div className="bg-ayur-green-900 text-ayur-ivory text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-ayur-green-800">
        <span>Authentic Ayurvedic & Natural Products • Free Pan-India Delivery on orders above ₹499</span>
        <span className="hidden md:inline text-ayur-amber-400 font-semibold">• Use code WELCOME10 for 10% OFF</span>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-colors duration-200 ${
          isScrolled
            ? 'bg-ayur-ivory shadow-xs border-b border-ayur-border py-3'
            : 'bg-ayur-ivory border-b border-ayur-border py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-ayur-charcoal-800 hover:text-ayur-green-900 transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
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
            <div className="flex-1 lg:flex-initial text-center">
              <Link href="/" className="inline-block group">
                <div className="flex flex-col items-center">
                  <span className="font-serif tracking-[0.22em] text-lg sm:text-2xl font-normal text-ayur-green-950 uppercase group-hover:text-ayur-green-800 transition-colors">
                    Ayurveda & Botanicals
                  </span>
                  <span className="text-[10px] tracking-[0.25em] text-ayur-charcoal-600 uppercase font-medium mt-0.5">
                    Authentic Patanjali Marketplace
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Search Modal Trigger */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2.5 text-ayur-charcoal-800 hover:text-ayur-green-900 hover:bg-ayur-cream/60 rounded-full transition-colors relative"
                aria-label="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/account/wishlist"
                className="p-2.5 text-ayur-charcoal-800 hover:text-ayur-green-900 hover:bg-ayur-cream/60 rounded-full transition-colors relative"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-ayur-terracotta-500 text-white text-[10px] font-semibold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account Menu */}
              <div className="relative">
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
                className="flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 bg-ayur-green-900 text-ayur-ivory hover:bg-ayur-green-800 rounded-full transition-colors relative"
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs font-semibold tracking-wide">BAG</span>
                {itemCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-ayur-amber-500 text-ayur-green-950 text-xs font-bold flex items-center justify-center ml-0.5">
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
          <div className="relative w-4/5 max-w-sm bg-ayur-ivory h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-ayur-border flex items-center justify-between">
              <div>
                <div className="font-serif text-lg tracking-wider text-ayur-green-950 uppercase">
                  Ayurveda & Botanicals
                </div>
                <div className="text-[10px] tracking-widest text-ayur-charcoal-600 uppercase">
                  Patanjali Store
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-ayur-charcoal-600 hover:text-ayur-charcoal-900"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-4 flex-1">
              {/* Quick Search */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-ayur-border text-sm text-ayur-charcoal-600"
              >
                <Search className="w-4 h-4 text-ayur-charcoal-400" />
                <span>Search authentic products...</span>
              </button>

              <div className="space-y-1">
                <Link
                  href="/shop"
                  className="block py-2.5 px-3 rounded-md text-base font-medium text-ayur-charcoal-900 hover:bg-ayur-cream"
                >
                  Shop All Products
                </Link>
                <Link
                  href="/combos"
                  className="block py-2.5 px-3 rounded-md text-base font-medium text-ayur-terracotta-700 hover:bg-ayur-cream"
                >
                  Combos & Bundles
                </Link>
                <Link
                  href="/account/orders"
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
                      className="block py-2 px-3 rounded-md text-sm text-ayur-charcoal-800 hover:bg-ayur-cream"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer Auth */}
            <div className="p-4 border-t border-ayur-border bg-ayur-cream/50">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-ayur-charcoal-900">
                    Signed in as {user.name}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/account"
                      className="flex-1 text-center py-2 text-xs font-medium bg-ayur-green-900 text-white rounded-md"
                    >
                      Account
                    </Link>
                    <button
                      onClick={logout}
                      className="px-3 py-2 text-xs font-medium border border-ayur-border rounded-md text-ayur-charcoal-800"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 text-sm font-medium bg-ayur-green-900 text-white rounded-md"
                  >
                    Sign In / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

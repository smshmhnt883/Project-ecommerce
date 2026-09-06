'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, TrendingUp, History, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products';
import { CATEGORIES } from '@/lib/data/categories';
import { Product } from '@/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  'Dant Kanti',
  'Aloe Vera Gel',
  'Pure Cow Ghee',
  'Kesh Kanti Hair Oil',
  'Special Chyawanprash',
  'Giloy Ghanvati',
  'Ashwagandha',
  'Rose Water',
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [liveResults, setLiveResults] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('patanjali_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      } else {
        setRecentSearches(['Dant Kanti', 'Cow Ghee', 'Aloe Vera']);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setLiveResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Live filter results as user types via InsForge API with fallback
  useEffect(() => {
    if (!query.trim()) {
      setLiveResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { getProducts } = await import('@/lib/api/products');
        const matches = await getProducts({ search: query.trim(), limit: 6 });
        setLiveResults(matches);
      } catch (err) {
        const q = query.toLowerCase().trim();
        const matches = PRODUCTS.filter((p) => {
          const matchName = p.name.toLowerCase().includes(q);
          const matchHindi = p.hindiName?.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          return matchName || matchHindi || matchCategory;
        }).slice(0, 6);
        setLiveResults(matches);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    // Save to recents
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('patanjali_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('patanjali_recent_searches');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Main Search Panel */}
      <div className="relative min-h-screen sm:min-h-0 sm:max-w-3xl sm:mx-auto sm:my-8 bg-ayur-ivory sm:rounded-md shadow-xl border border-ayur-border z-10 flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-ayur-border flex items-center gap-3">
          <Search className="w-5 h-5 text-ayur-charcoal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit(query);
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
            placeholder="Search for Dant Kanti, Aloe Vera, Cow Ghee, Kesh Kanti..."
            className="w-full bg-transparent text-base sm:text-lg text-ayur-charcoal-900 placeholder-ayur-charcoal-400 focus:outline-none min-h-[44px]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-ayur-charcoal-400 hover:text-ayur-charcoal-800"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-xs font-semibold text-ayur-charcoal-600 hover:text-ayur-charcoal-900 rounded-md hover:bg-ayur-cream uppercase tracking-wider transition-colors"
            aria-label="Close search"
          >
            <span className="hidden sm:inline">ESC</span>
            <X className="w-5 h-5 sm:hidden" />
          </button>
        </div>

        {/* Search Suggestions & Live Results */}
        <div className="p-5 sm:p-6 space-y-6 flex-1 overflow-y-auto max-h-[70vh]">
          {/* Live Search Results when query present */}
          {query.trim().length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-ayur-charcoal-600">
                  Matching Products ({liveResults.length})
                </span>
                {liveResults.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit(query)}
                    className="text-xs text-ayur-green-800 font-medium hover:underline flex items-center gap-1"
                  >
                    <span>View all results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {liveResults.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-ayur-charcoal-700">No products found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-ayur-charcoal-500 mt-1">
                    Try searching for &ldquo;Hair Cleanser&rdquo;, &ldquo;Ghee&rdquo;, &ldquo;Toothpaste&rdquo;, or &ldquo;Aloe Vera&rdquo;
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {liveResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-3 p-2.5 bg-white rounded-md border border-ayur-border hover:border-ayur-green-900 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-sm overflow-hidden bg-[#FAF8F5] p-1 border border-ayur-border/50 shrink-0 flex items-center justify-center">
                        <img
                          src={product.thumbnail || product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-ayur-green-800 font-medium uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <h4 className="text-xs font-semibold text-ayur-charcoal-900 group-hover:text-ayur-green-900 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-ayur-charcoal-900">₹{product.price}</span>
                          {product.mrp > product.price && (
                            <span className="text-[10px] text-ayur-charcoal-400 line-through">₹{product.mrp}</span>
                          )}
                          <span className="text-[10px] text-emerald-700 font-medium">
                            {product.discount}% off
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Initial Overlay State: Trending, Recent, Categories */
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ayur-charcoal-600">
                      <History className="w-3.5 h-3.5" />
                      <span>Recent Searches</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-xs text-ayur-charcoal-500 hover:text-red-600"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSearchSubmit(term)}
                        className="px-3 py-1.5 bg-white border border-ayur-border rounded-full text-xs text-ayur-charcoal-800 hover:border-ayur-green-800 hover:text-ayur-green-900 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ayur-charcoal-600 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-ayur-amber-600" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSearchSubmit(term)}
                      className="px-3 py-1.5 bg-ayur-cream/80 border border-ayur-border rounded-full text-xs text-ayur-charcoal-900 hover:bg-ayur-green-900 hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse Popular Categories */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ayur-charcoal-600 mb-3">
                  Featured Categories
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CATEGORIES.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="p-3 bg-white rounded-lg border border-ayur-border hover:border-ayur-green-800 text-center transition-all group"
                    >
                      <p className="text-xs font-medium text-ayur-charcoal-900 group-hover:text-ayur-green-900">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-ayur-charcoal-500 mt-0.5">{cat.itemCount} Products</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#FAF8F5] border-t border-ayur-border text-center text-xs text-ayur-charcoal-600 sm:rounded-b-md flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-ayur-green-900" />
          <span>Authentic Patanjali batch formulations sourced directly from Haridwar.</span>
        </div>
      </div>
    </div>
  );
}

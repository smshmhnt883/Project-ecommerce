'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  ChevronDown,
  X,
  Star,
  RotateCcw,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { SortOption, Product } from '@/types';
import { PRODUCTS } from '@/lib/data/products';
import { CATEGORIES } from '@/lib/data/categories';
import { CONCERNS } from '@/lib/data/concerns';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getProducts } from '@/lib/api/products';
import { ShopFilters, FilterState } from './ShopFilters';
import { ActiveFilterChips } from './ActiveFilterChips';

interface ShopCatalogProps {
  initialCategory?: string;
  initialConcern?: string;
  initialSearchQuery?: string;
  pageTitle?: string;
  pageDescription?: string;
}

export function ShopCatalog({
  initialCategory,
  initialConcern,
  initialSearchQuery = '',
  pageTitle,
  pageDescription,
}: ShopCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read URL query parameters
  const categoryParam = searchParams.get('category');
  const concernParam = searchParams.get('concern');

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getProducts();
        if (isMounted && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.warn('Catalog fetch:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter States - Single source of truth initialized with URL or prop
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam || initialCategory || null
  );
  const [selectedConcern, setSelectedConcern] = useState<string | null>(
    concernParam || initialConcern || null
  );
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search query state if on search page
  const [searchQuery] = useState(initialSearchQuery);

  // Synchronize state with URL search params (Back, Forward, Refresh, Direct links)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else if (pathname === '/shop' || !initialCategory) {
      setSelectedCategory(null);
    }

    const con = searchParams.get('concern');
    if (con) {
      setSelectedConcern(con);
    } else if (pathname === '/shop' || !initialConcern) {
      setSelectedConcern(null);
    }
  }, [searchParams, pathname, initialCategory, initialConcern]);

  // URL-synchronized category update handler
  const handleCategorySelect = useCallback(
    (categorySlug: string | null) => {
      setSelectedCategory(categorySlug);
      const params = new URLSearchParams(searchParams.toString());
      if (categorySlug) {
        params.set('category', categorySlug);
      } else {
        params.delete('category');
      }
      const qs = params.toString();
      const targetUrl = qs ? `/shop?${qs}` : '/shop';
      router.push(targetUrl, { scroll: false });
    },
    [router, searchParams]
  );

  // URL-synchronized concern update handler
  const handleConcernSelect = useCallback(
    (concernSlug: string | null) => {
      setSelectedConcern(concernSlug);
      const params = new URLSearchParams(searchParams.toString());
      if (concernSlug) {
        params.set('concern', concernSlug);
      } else {
        params.delete('concern');
      }
      const qs = params.toString();
      const targetUrl = qs ? `/shop?${qs}` : '/shop';
      router.push(targetUrl, { scroll: false });
    },
    [router, searchParams]
  );

  // Reset all filters
  const resetAllFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedConcern(null);
    setMaxPrice(1000);
    setMinRating(null);
    setInStockOnly(false);
    setMinDiscount(0);
    setSortOption('recommended');
    router.push('/shop', { scroll: false });
  }, [router]);

  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    if (updates.selectedCategory !== undefined) setSelectedCategory(updates.selectedCategory);
    if (updates.selectedConcern !== undefined) setSelectedConcern(updates.selectedConcern);
    if (updates.maxPrice !== undefined) setMaxPrice(updates.maxPrice);
    if (updates.minRating !== undefined) setMinRating(updates.minRating);
    if (updates.inStockOnly !== undefined) setInStockOnly(updates.inStockOnly);
    if (updates.minDiscount !== undefined) setMinDiscount(updates.minDiscount);
  }, []);

  const handleRemoveFilter = useCallback((key: keyof FilterState) => {
    switch(key) {
      case 'selectedCategory': handleCategorySelect(null); break;
      case 'selectedConcern': handleConcernSelect(null); break;
      case 'maxPrice': setMaxPrice(1000); break;
      case 'minRating': setMinRating(null); break;
      case 'inStockOnly': setInStockOnly(false); break;
      case 'minDiscount': setMinDiscount(0); break;
    }
  }, [handleCategorySelect, handleConcernSelect]);

  const filterState: FilterState = useMemo(() => ({
    selectedCategory,
    selectedConcern,
    maxPrice,
    minRating,
    inStockOnly,
    minDiscount,
  }), [selectedCategory, selectedConcern, maxPrice, minRating, inStockOnly, minDiscount]);

  // Derived filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((product) => {
        const matchName = product.name.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        const matchIngredients = product.ingredients.some((i) =>
          i.name.toLowerCase().includes(q)
        );
        return matchName || matchCat || matchIngredients;
      });
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((product) => product.categorySlug === selectedCategory);
    }

    // Concern filter
    if (selectedConcern) {
      result = result.filter((product) => product.concernSlugs.includes(selectedConcern));
    }

    // Price filter
    if (maxPrice < 1000) {
      result = result.filter((product) => product.price <= maxPrice);
    }

    // Rating filter
    if (minRating !== null) {
      result = result.filter((product) => product.rating >= minRating);
    }

    // Stock filter
    if (inStockOnly) {
      result = result.filter((product) => product.inStock);
    }

    // Discount filter
    if (minDiscount > 0) {
      result = result.filter((product) => product.discount >= minDiscount);
    }

    // Sorting without mutating source
    return result.slice().sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'bestseller':
          return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'recommended':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedConcern,
    maxPrice,
    minRating,
    inStockOnly,
    minDiscount,
    sortOption,
  ]);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedConcern ? 1 : 0) +
    (maxPrice < 1000 ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0);

  const currentCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);
  const currentConcernObj = CONCERNS.find((c) => c.slug === selectedConcern);

  const title = selectedCategory && currentCategoryObj
    ? currentCategoryObj.name
    : selectedConcern && currentConcernObj
    ? currentConcernObj.name
    : searchQuery
    ? `Search results for: "${searchQuery}"`
    : 'All Authentic Patanjali Products';

  const description = selectedCategory && currentCategoryObj
    ? currentCategoryObj.description
    : selectedConcern && currentConcernObj
    ? currentConcernObj.description
    : 'Explore 100% genuine Ayurvedic formulations crafted with Himalayan botanicals and classical Vedic wisdom.';

  return (
    <div className="py-8 sm:py-12 bg-ayur-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-ayur-charcoal-500 mb-6">
          <Link href="/" className="hover:text-ayur-green-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-ayur-charcoal-400" />
          <Link href="/shop" className="hover:text-ayur-green-900 transition-colors">
            Shop
          </Link>
          {(selectedCategory || selectedConcern || searchQuery) && (
            <>
              <ChevronRight className="w-3 h-3 text-ayur-charcoal-400" />
              <span className="text-ayur-charcoal-800 font-medium truncate max-w-xs">{title}</span>
            </>
          )}
        </nav>

        {/* Page Title & Context Header */}
        <div className="mb-8 pb-6 border-b border-ayur-border">
          <h1 className="font-serif text-2xl sm:text-4xl text-ayur-green-950 font-normal">{title}</h1>
          <p className="text-xs sm:text-sm text-ayur-charcoal-600 mt-2 max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Controls Toolbar: Result Count, Active Filter Chips, Mobile Trigger, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] bg-white border border-ayur-border rounded-lg text-xs font-semibold text-ayur-charcoal-800 shadow-soft"
            >
              <Filter className="w-4 h-4" />
              <span>Filters ({activeFilterCount})</span>
            </button>

            <span className="text-xs text-ayur-charcoal-600">
              Showing <span className="font-semibold text-ayur-charcoal-900">{filteredProducts.length}</span> authentic {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-ayur-charcoal-600 font-medium hidden sm:inline">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none bg-white border border-ayur-border rounded-lg px-3.5 py-2.5 min-h-[44px] pr-8 text-base sm:text-xs font-medium text-ayur-charcoal-900 shadow-soft focus:outline-none focus:border-ayur-green-800"
              >
                <option value="recommended">Recommended</option>
                <option value="bestseller">Popular Bestsellers</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Additions</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-ayur-charcoal-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        <ActiveFilterChips
          filterState={filterState}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={resetAllFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Catalog Body: Left Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar Filters */}
          <ShopFilters
            filterState={filterState}
            onFilterChange={handleFilterChange}
            categories={CATEGORIES}
            concerns={CONCERNS}
            products={products}
            activeFilterCount={activeFilterCount}
            onResetFilters={resetAllFilters}
            onCategorySelect={handleCategorySelect}
          />

          {/* Right Product Grid Column */}
          <div className="col-span-1 lg:col-span-9">
            <ProductGrid
              products={filteredProducts}
              onResetFilters={resetAllFilters}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-ayur-border flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900">
                Filters ({activeFilterCount})
              </h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-ayur-charcoal-600 hover:text-ayur-charcoal-900 rounded-md"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6 flex-1 touch-pan-y overscroll-contain overflow-y-auto">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ayur-charcoal-800 mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleCategorySelect(null);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left text-xs px-3 py-2.5 min-h-[44px] flex items-center rounded-md font-medium transition-colors ${
                      selectedCategory === null ? 'bg-ayur-green-900 text-white' : 'text-ayur-charcoal-700 hover:bg-ayur-cream'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        handleCategorySelect(cat.slug);
                        setMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left text-xs px-3 py-2.5 min-h-[44px] flex items-center rounded-md font-medium transition-colors ${
                        selectedCategory === cat.slug ? 'bg-ayur-green-900 text-white' : 'text-ayur-charcoal-700 hover:bg-ayur-cream'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-ayur-border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ayur-charcoal-800">
                    Max Price
                  </h4>
                  <span className="text-xs font-bold text-ayur-green-900">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={25}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-ayur-green-900 h-6 cursor-pointer"
                />
              </div>

              {/* In Stock */}
              <div className="pt-4 border-t border-ayur-border">
                <label className="flex items-center gap-2.5 text-xs text-ayur-charcoal-800 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-ayur-green-900 accent-ayur-green-900"
                  />
                  <span className="font-medium">In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-ayur-border bg-ayur-ivory flex gap-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 py-2.5 min-h-[44px] border border-ayur-border rounded-lg text-xs font-semibold text-ayur-charcoal-800 hover:bg-ayur-cream transition-colors flex items-center justify-center"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 min-h-[44px] bg-ayur-green-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-ayur-green-800 transition-colors flex items-center justify-center"
              >
                Show {filteredProducts.length} Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { Star, Check } from 'lucide-react';
import { Product } from '@/types';

export interface FilterState {
  selectedCategory: string | null;
  selectedConcern: string | null;
  maxPrice: number;
  minRating: number | null;
  inStockOnly: boolean;
  minDiscount: number;
}

interface ShopFiltersProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  categories: any[];
  concerns: any[];
  products: Product[];
  activeFilterCount: number;
  onResetFilters: () => void;
  onCategorySelect: (slug: string | null) => void;
}

export function ShopFilters({
  filterState,
  onFilterChange,
  categories,
  products,
  activeFilterCount,
  onResetFilters,
  onCategorySelect
}: ShopFiltersProps) {
  const { selectedCategory, maxPrice, minRating, inStockOnly, minDiscount } = filterState;

  return (
    <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-xl border border-ayur-border shadow-soft sticky top-28 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-ayur-border">
        <h3 className="font-serif text-base font-semibold text-ayur-charcoal-900">
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-ayur-charcoal-500 hover:text-red-600"
          >
            Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-ayur-charcoal-800 mb-3">
          Categories
        </h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto no-scrollbar">
          <button
            type="button"
            onClick={() => onCategorySelect(null)}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition-colors flex justify-between items-center ${
              selectedCategory === null
                ? 'bg-ayur-green-900 text-white font-medium'
                : 'text-ayur-charcoal-700 hover:bg-ayur-cream'
            }`}
          >
            <span>All Categories</span>
            <span>{products.length}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategorySelect(cat.slug)}
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition-colors flex justify-between items-center ${
                selectedCategory === cat.slug
                  ? 'bg-ayur-green-900 text-white font-medium'
                  : 'text-ayur-charcoal-700 hover:bg-ayur-cream'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              <span className="text-[11px] opacity-70">
                {products.filter((p) => p.categorySlug === cat.slug).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
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
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-ayur-green-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-ayur-charcoal-500 mt-1">
          <span>₹50</span>
          <span>₹1,000+</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4 border-t border-ayur-border">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ayur-charcoal-800 mb-2.5">
          Rating
        </h4>
        <div className="space-y-1">
          {[4.5, 4.0].map((ratingVal) => (
            <button
              key={ratingVal}
              type="button"
              onClick={() => onFilterChange({ minRating: minRating === ratingVal ? null : ratingVal })}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                minRating === ratingVal
                  ? 'bg-ayur-cream font-semibold text-ayur-green-900'
                  : 'hover:bg-ayur-cream/50 text-ayur-charcoal-700'
              }`}
            >
              <div className="flex items-center gap-1.5 text-ayur-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-ayur-charcoal-800">{ratingVal}★ & above</span>
              </div>
              {minRating === ratingVal && <Check className="w-3.5 h-3.5 text-ayur-green-800" />}
            </button>
          ))}
        </div>
      </div>

      {/* Discounts */}
      <div className="pt-4 border-t border-ayur-border">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ayur-charcoal-800 mb-2.5">
          Discounts
        </h4>
        <div className="space-y-1 text-xs">
          {[10, 15].map((disc) => (
            <button
              key={disc}
              type="button"
              onClick={() => onFilterChange({ minDiscount: minDiscount === disc ? 0 : disc })}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                minDiscount === disc
                  ? 'bg-ayur-cream font-semibold text-ayur-green-900'
                  : 'hover:bg-ayur-cream/50 text-ayur-charcoal-700'
              }`}
            >
              <span>{disc}% and above</span>
              {minDiscount === disc && <Check className="w-3.5 h-3.5 text-ayur-green-800" />}
            </button>
          ))}
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-4 border-t border-ayur-border">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-ayur-charcoal-800">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="rounded border-ayur-border text-ayur-green-900 focus:ring-ayur-green-900 w-4 h-4"
          />
          <span>In Stock Products Only</span>
        </label>
      </div>
    </aside>
  );
}

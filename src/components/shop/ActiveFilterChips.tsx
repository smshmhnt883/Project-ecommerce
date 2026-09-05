'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { FilterState } from './ShopFilters';
import { CATEGORIES } from '@/lib/data/categories';
import { CONCERNS } from '@/lib/data/concerns';

interface ActiveFilterChipsProps {
  filterState: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

export function ActiveFilterChips({
  filterState,
  onRemoveFilter,
  onClearAll,
  activeFilterCount,
}: ActiveFilterChipsProps) {
  if (activeFilterCount === 0) return null;

  const { selectedCategory, selectedConcern, maxPrice, minRating, inStockOnly, minDiscount } = filterState;

  const currentCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);
  const currentConcernObj = CONCERNS.find((c) => c.slug === selectedConcern);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-ayur-border/60">
      <span className="text-xs text-ayur-charcoal-500 font-medium">Active Filters:</span>

      {selectedCategory && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ayur-cream text-ayur-green-950 border border-ayur-border">
          <span>Category: {currentCategoryObj?.name || selectedCategory}</span>
          <button onClick={() => onRemoveFilter('selectedCategory')} aria-label="Remove category filter">
            <X className="w-3 h-3 hover:text-red-600" />
          </button>
        </span>
      )}

      {selectedConcern && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ayur-cream text-ayur-green-950 border border-ayur-border">
          <span>Concern: {currentConcernObj?.name || selectedConcern}</span>
          <button onClick={() => onRemoveFilter('selectedConcern')} aria-label="Remove concern filter">
            <X className="w-3 h-3 hover:text-red-600" />
          </button>
        </span>
      )}

      {maxPrice < 1000 && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ayur-cream text-ayur-green-950 border border-ayur-border">
          <span>Max ₹{maxPrice}</span>
          <button onClick={() => onRemoveFilter('maxPrice')} aria-label="Remove price filter">
            <X className="w-3 h-3 hover:text-red-600" />
          </button>
        </span>
      )}

      {minRating !== null && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ayur-cream text-ayur-green-950 border border-ayur-border">
          <span>{minRating}★ & above</span>
          <button onClick={() => onRemoveFilter('minRating')} aria-label="Remove rating filter">
            <X className="w-3 h-3 hover:text-red-600" />
          </button>
        </span>
      )}

      {inStockOnly && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ayur-cream text-ayur-green-950 border border-ayur-border">
          <span>In Stock Only</span>
          <button onClick={() => onRemoveFilter('inStockOnly')} aria-label="Remove in-stock filter">
            <X className="w-3 h-3 hover:text-red-600" />
          </button>
        </span>
      )}

      {minDiscount > 0 && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ayur-cream text-ayur-green-950 border border-ayur-border">
          <span>{minDiscount}%+ Discount</span>
          <button onClick={() => onRemoveFilter('minDiscount')} aria-label="Remove discount filter">
            <X className="w-3 h-3 hover:text-red-600" />
          </button>
        </span>
      )}

      <button
        onClick={onClearAll}
        className="text-xs text-red-600 font-semibold hover:underline ml-2 flex items-center gap-1"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
}

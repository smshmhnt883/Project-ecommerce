'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { PackageSearch, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  emptyMessage = 'No Ayurvedic products match your selected criteria.',
  onResetFilters,
}: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-md border border-ayur-border my-6">
        <div className="w-12 h-12 rounded-md bg-[#FAF8F5] border border-ayur-border flex items-center justify-center text-ayur-green-900 mx-auto mb-3">
          <PackageSearch className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg text-ayur-charcoal-900 font-medium">No Products Found</h3>
        <p className="text-xs text-ayur-charcoal-600 mt-1 max-w-sm mx-auto">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-ayur-green-900 text-white rounded-md text-xs font-medium tracking-wider uppercase hover:bg-ayur-green-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}

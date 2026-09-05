'use client';

import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '@/lib/data/products';
import { getProducts } from '@/lib/api/products';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Product } from '@/types';

type BestsellerTab = 'all' | 'personal-care' | 'hair-care' | 'wellness' | 'food';

export function BestsellersSection() {
  const [activeTab, setActiveTab] = useState<BestsellerTab>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    let isMounted = true;
    async function loadBestsellers() {
      try {
        const data = await getProducts({ bestseller: true });
        if (isMounted && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.warn('Bestsellers fetch warning:', e);
      }
    }
    loadBestsellers();
    return () => {
      isMounted = false;
    };
  }, []);

  const tabs: { id: BestsellerTab; label: string }[] = [
    { id: 'all', label: 'All Bestsellers' },
    { id: 'personal-care', label: 'Personal Care' },
    { id: 'hair-care', label: 'Hair Care' },
    { id: 'wellness', label: 'Health & Wellness' },
    { id: 'food', label: 'Vedic Foods' },
  ];

  const filteredProducts = products.filter((p) => {
    if (!p.bestseller) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'personal-care') return p.categorySlug === 'personal-care' || p.categorySlug === 'skin-care';
    if (activeTab === 'hair-care') return p.categorySlug === 'hair-care';
    if (activeTab === 'wellness') return p.categorySlug === 'health-wellness';
    if (activeTab === 'food') return p.categorySlug === 'food-beverages';
    return true;
  }).slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-ayur-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title & Tab Navigation */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-ayur-green-800 block mb-2">
            TIME-TESTED FAVORITES
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-ayur-green-950 font-normal">
            Everyday Bestsellers
          </h2>
          <p className="text-xs sm:text-sm text-ayur-charcoal-600 mt-2">
            Our most cherished formulations, trusted by millions across Indian households.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 sm:mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-xs font-medium tracking-wider transition-colors whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-ayur-green-900 border-ayur-green-900 text-white'
                  : 'bg-white border-ayur-border text-ayur-charcoal-700 hover:bg-ayur-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}

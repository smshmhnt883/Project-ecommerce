'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products';
import { getProducts } from '@/lib/api/products';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Product } from '@/types';

export function FeaturedSection() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(
    PRODUCTS.filter((p) => p.featured).slice(0, 8)
  );

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        const data = await getProducts({ featured: true, limit: 8 });
        if (isMounted && data.length > 0) {
          setFeaturedProducts(data);
        }
      } catch (e) {
        console.warn('Featured products fetch error:', e);
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-ayur-ivory border-b border-ayur-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-ayur-green-800 block mb-2">
              CURATED SELECTION
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-ayur-green-950 font-normal">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ayur-green-900 hover:text-ayur-terracotta-600 uppercase group transition-colors"
          >
            <span>View Complete Range</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {featuredProducts.map((product) => (
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

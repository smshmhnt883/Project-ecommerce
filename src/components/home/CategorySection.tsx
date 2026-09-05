'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';

export function CategorySection() {
  return (
    <section id="categories" className="py-12 sm:py-16 bg-white border-b border-ayur-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ayur-green-900 block mb-1">
              Curated Ayurvedic Range
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ayur-green-900 hover:underline uppercase transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Clean 6-Category Grid with Real Packaging */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group bg-[#FAF8F5] rounded-md overflow-hidden border border-ayur-border hover:border-ayur-charcoal-400 transition-colors flex flex-col"
            >
              {/* Category Real Packaging Showcase */}
              <div className="aspect-square w-full bg-white p-3 sm:p-4 flex items-center justify-center border-b border-ayur-border/50">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Category Label */}
              <div className="p-3 bg-[#FAF8F5] flex flex-col flex-1">
                <h3 className="font-serif text-xs sm:text-sm font-semibold text-ayur-charcoal-900 group-hover:text-ayur-green-900 transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-ayur-charcoal-500 line-clamp-1 mt-0.5">
                  {cat.shortDesc}
                </p>
                <div className="mt-2 pt-1.5 border-t border-ayur-border/40 flex items-center justify-between text-[10px] text-ayur-charcoal-400">
                  <span>{cat.itemCount} {cat.itemCount === 1 ? 'Product' : 'Products'}</span>
                  <span className="font-medium text-ayur-green-900 group-hover:translate-x-0.5 transition-transform">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

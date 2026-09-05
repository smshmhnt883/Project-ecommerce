'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CONCERNS } from '@/lib/data/concerns';

export function ConcernSection() {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-ayur-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-ayur-green-900 block mb-1">
            Ayurvedic Daily Focus
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal">
            Shop by Health Need & Concern
          </h2>
          <p className="text-xs sm:text-sm text-ayur-charcoal-600 mt-2">
            Targeted herbal formulations crafted to balance mind, body, and daily lifestyle.
          </p>
        </div>

        {/* 6 Concerns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONCERNS.map((concern) => (
            <Link
              key={concern.id}
              href={`/concern/${concern.slug}`}
              className="group bg-white rounded-md border border-ayur-border p-4 hover:border-ayur-charcoal-400 transition-colors flex items-start gap-4"
            >
              {/* Product Thumbnail related to concern */}
              <div className="w-14 h-14 rounded-sm bg-[#FAF8F5] p-1.5 border border-ayur-border/50 shrink-0 flex items-center justify-center">
                <img
                  src={concern.image}
                  alt={concern.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Concern Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-sm font-semibold text-ayur-charcoal-900 group-hover:text-ayur-green-900 transition-colors truncate">
                  {concern.name}
                </h3>
                <p className="text-[11px] text-ayur-charcoal-600 line-clamp-2 mt-1 leading-relaxed">
                  {concern.description}
                </p>
                <div className="mt-2 text-[11px] font-medium text-ayur-green-900 flex items-center gap-1 group-hover:underline">
                  <span>View Products</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

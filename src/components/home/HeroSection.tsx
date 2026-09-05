'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, Leaf } from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products';

export function HeroSection() {
  // Highlight 3 authentic hero products from our real cropped packaging
  const heroProducts = [
    PRODUCTS.find((p) => p.id === 'pat-005'), // Pure Cow Desi Ghee
    PRODUCTS.find((p) => p.id === 'pat-007'), // Special Chyawanprash
    PRODUCTS.find((p) => p.id === 'pat-001'), // Dant Kanti Toothpaste
  ].filter(Boolean);

  return (
    <section className="relative bg-[#FAF8F5] border-b border-ayur-border py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Restrained Editorial Headline & Copy */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-white border border-ayur-border text-ayur-green-950 text-[11px] font-medium tracking-widest uppercase">
              <Leaf className="w-3.5 h-3.5 text-ayur-green-900" />
              <span>Ayurvedic Pharmacopeia Heritage</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ayur-green-950 font-normal leading-[1.2] tracking-tight">
              Authentic Patanjali Formulations
              <span className="block italic font-serif text-ayur-green-800 text-2xl sm:text-3xl lg:text-4xl mt-1.5 font-normal">
                Everyday Herbal Care & Vedic Staples
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-ayur-charcoal-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Prepared under stringent Ayurvedic standards at Haridwar. Explore genuine whole-food staples, pure cow desi ghee, multi-flora honey, and classical rasayanas delivered across India.
            </p>

            {/* Structured CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-7 py-3 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-md text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                <span>Shop All Formulations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="#categories"
                className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-ayur-cream text-ayur-green-950 border border-ayur-border rounded-md text-xs font-semibold tracking-wider uppercase transition-colors text-center"
              >
                Browse Categories
              </Link>
            </div>

            {/* Authentic Trust Signals */}
            <div className="pt-4 border-t border-ayur-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-ayur-charcoal-700">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-ayur-green-900" />
                <span>100% Genuine Packaging</span>
              </div>
              <span className="text-ayur-border hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-ayur-green-900" />
                <span>Direct Haridwar Sourcing</span>
              </div>
              <span className="text-ayur-border hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span>Free Delivery Above ₹499</span>
              </div>
            </div>
          </div>

          {/* Right Column: Grounded Product Showcase Grid */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-md border border-ayur-border p-4 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-ayur-border/60">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ayur-green-900 block">
                    Featured Packaging
                  </span>
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-ayur-charcoal-900">
                    Real Product Catalog Highlights
                  </h3>
                </div>
                <Link
                  href="/shop"
                  className="text-xs text-ayur-green-900 hover:underline font-medium"
                >
                  View All (10) →
                </Link>
              </div>

              {/* 3 Real Products Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {heroProducts.map((prod) => {
                  if (!prod) return null;
                  return (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      className="group flex flex-col bg-[#FAF8F5] rounded-md border border-ayur-border/80 p-2.5 hover:border-ayur-charcoal-400 transition-colors"
                    >
                      <div className="aspect-square w-full rounded-sm overflow-hidden bg-white p-2 flex items-center justify-center mb-2 border border-ayur-border/40">
                        <img
                          src={prod.thumbnail || prod.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] text-ayur-charcoal-500 uppercase font-medium line-clamp-1">
                        {prod.category}
                      </span>
                      <h4 className="text-xs font-semibold text-ayur-charcoal-900 line-clamp-1 group-hover:text-ayur-green-900">
                        {prod.name}
                      </h4>
                      <div className="mt-auto pt-1 flex items-baseline gap-1">
                        <span className="text-xs font-bold text-ayur-charcoal-900">
                          ₹{prod.price}
                        </span>
                        <span className="text-[10px] text-ayur-charcoal-400 line-through">
                          ₹{prod.mrp}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Banner Footer Note */}
              <div className="mt-4 pt-3 border-t border-ayur-border/50 flex items-center justify-between text-[11px] text-ayur-charcoal-600">
                <span>Certified authentic Patanjali batch packaging</span>
                <span className="font-medium text-ayur-green-900">100% Herbal Actives</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INGREDIENTS_SPOTLIGHT } from '@/lib/data/ayurveda';
import { ArrowRight } from 'lucide-react';

export function IngredientSpotlightSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeIngredient = INGREDIENTS_SPOTLIGHT[selectedIdx];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-ayur-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-ayur-green-800 block mb-2">
            BOTANICAL HERITAGE
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-ayur-green-950 font-normal">
            Sacred Botanical Ingredients
          </h2>
          <p className="text-xs sm:text-sm text-ayur-charcoal-600 mt-2">
            Explore the traditional virtues and classical botanical identity behind our formulations.
          </p>
        </div>

        {/* Horizontal Herb Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {INGREDIENTS_SPOTLIGHT.map((herb, idx) => (
            <button
              key={herb.name}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap border ${
                selectedIdx === idx
                  ? 'bg-ayur-green-900 border-ayur-green-900 text-white'
                  : 'bg-white border-ayur-border text-ayur-charcoal-700 hover:bg-ayur-cream'
              }`}
            >
              {herb.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Active Ingredient Feature Card */}
        <div className="bg-[#FAF8F5] rounded-md border border-ayur-border p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Visual */}
            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-md overflow-hidden border border-ayur-border bg-white">
                <img
                  src={activeIngredient.image}
                  alt={activeIngredient.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Botanical Dossier */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ayur-terracotta-600 uppercase tracking-wider">
                    {activeIngredient.category}
                  </span>
                  <span className="text-ayur-border">•</span>
                  <span className="text-xs italic text-ayur-charcoal-600 font-serif">
                    {activeIngredient.botanicalName}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal mt-1">
                  {activeIngredient.name}
                </h3>
                <p className="text-xs font-medium text-ayur-green-800 mt-0.5">
                  Sanskrit: {activeIngredient.sanskritName}
                </p>
              </div>

              <p className="text-sm text-ayur-charcoal-800 leading-relaxed">
                {activeIngredient.description}
              </p>

              <div className="p-3.5 bg-white rounded-lg border border-ayur-border/80 text-xs">
                <span className="font-semibold text-ayur-charcoal-900 block mb-1">
                  Traditional Ayurvedic Role:
                </span>
                <p className="text-ayur-charcoal-600 leading-relaxed">
                  {activeIngredient.traditionalRole}
                </p>
              </div>

              {/* Products containing this herb */}
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ayur-charcoal-600 block mb-2">
                  Featured In Authentically Formulated Products:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeIngredient.foundInProducts.map((prod) => (
                    <Link
                      key={prod.slug}
                      href={`/products/${prod.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-ayur-cream border border-ayur-border rounded-md text-xs font-medium text-ayur-charcoal-800 transition-colors"
                    >
                      <span>{prod.name}</span>
                      <ArrowRight className="w-3 h-3 text-ayur-green-800" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

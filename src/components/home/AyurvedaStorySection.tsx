'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Sun } from 'lucide-react';

export function AyurvedaStorySection() {
  return (
    <section className="py-16 sm:py-20 bg-ayur-green-950 text-ayur-ivory border-b border-ayur-green-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Visual */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-md overflow-hidden border border-ayur-green-800 aspect-[4/3] bg-ayur-green-900">
              <img
                src="/products/patanjali-chyawanprash.jpg"
                alt="Ayurvedic Rasayana Craftsmanship"
                className="w-full h-full object-contain p-8 bg-ayur-green-900/60"
              />
              <div className="absolute bottom-0 inset-x-0 bg-ayur-green-950/90 border-t border-ayur-green-800 p-4">
                <span className="text-[10px] uppercase tracking-widest text-ayur-amber-400 font-semibold block">
                  Himalayan Foothills Preparation
                </span>
                <p className="font-serif text-sm text-white font-normal mt-0.5">
                  Classical Ghanvati, Rasayana, and Taila paka formulations crafted at Haridwar.
                </p>
              </div>
            </div>
          </div>

          {/* Right Copy & Principles */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-ayur-green-900 text-ayur-amber-400 text-[10px] font-semibold tracking-widest uppercase border border-ayur-green-800">
              <Sun className="w-3.5 h-3.5" />
              <span>Haridwar Heritage</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight text-white">
              Rooted in Classical <br />
              <span className="italic font-serif text-ayur-amber-300">Ayurvedic Wisdom</span>
            </h2>

            <p className="text-xs sm:text-sm text-ayur-sand/80 leading-relaxed">
              Classical Ayurveda teaches that genuine wellness begins with balance. Patanjali pairs time-honored botanical recipes with modern analytical standardization to ensure every batch is pure, effective, and unadulterated.
            </p>

            {/* Feature Pillars */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-md bg-ayur-green-900 text-ayur-amber-400 shrink-0 border border-ayur-green-800">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">Direct Farm Herb Harvesting</h4>
                  <p className="text-[11px] sm:text-xs text-ayur-sand/70 mt-0.5 leading-relaxed">
                    Sourced from indigenous forest collection networks and organic farms across India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-md bg-ayur-green-900 text-ayur-amber-400 shrink-0 border border-ayur-green-800">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">Pharmacopeial Quality Standards</h4>
                  <p className="text-[11px] sm:text-xs text-ayur-sand/70 mt-0.5 leading-relaxed">
                    Formulated adhering to Ayurvedic Pharmacopoeia of India (API) standards and strict testing.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-ayur-cream text-ayur-green-950 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <span>Explore Formulations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

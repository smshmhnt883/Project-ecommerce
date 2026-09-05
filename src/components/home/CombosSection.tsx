'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { COMBOS } from '@/lib/data/combos';
import { PRODUCTS } from '@/lib/data/products';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export function CombosSection() {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddBundleToCart = (combo: (typeof COMBOS)[0]) => {
    combo.productIds.forEach((pid) => {
      const prod = PRODUCTS.find((p) => p.id === pid);
      if (prod) {
        addToCart(prod, 1, prod.size);
      }
    });
    showToast(`Added entire "${combo.name}" bundle to your bag!`, 'success');
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-ayur-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ayur-green-900 block mb-1">
              Curated Everyday Sets
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal">
              Ayurvedic Wellness Bundles
            </h2>
          </div>
          <Link
            href="/combos"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ayur-green-900 hover:underline uppercase transition-colors"
          >
            <span>View All Bundles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bundle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {COMBOS.map((combo) => (
            <div
              key={combo.id}
              className="bg-[#FAF8F5] rounded-md border border-ayur-border overflow-hidden hover:border-ayur-charcoal-400 transition-colors flex flex-col justify-between"
            >
              {/* Packaging Image & Badge */}
              <div className="relative aspect-square w-full overflow-hidden bg-white p-4 flex items-center justify-center border-b border-ayur-border/50">
                <img
                  src={combo.image}
                  alt={combo.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-ayur-green-900 text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                  {combo.badge}
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-white border border-ayur-border text-ayur-green-950 text-[10px] font-semibold px-2 py-0.5 rounded-sm shadow-xs">
                  Save {combo.discount}%
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1 bg-[#FAF8F5]">
                <span className="text-[10px] font-semibold text-ayur-green-900 uppercase tracking-wider block mb-1">
                  {combo.tagline}
                </span>
                <h3 className="font-serif text-sm font-semibold text-ayur-charcoal-900 mb-1.5 leading-snug">
                  {combo.name}
                </h3>
                <p className="text-[11px] text-ayur-charcoal-600 line-clamp-2 leading-relaxed mb-3">
                  {combo.description}
                </p>

                {/* Items included list */}
                <div className="bg-white p-2.5 rounded-sm border border-ayur-border/60 mb-4 flex-1">
                  <span className="text-[10px] font-semibold text-ayur-charcoal-700 uppercase tracking-wider block mb-1">
                    Set Contains:
                  </span>
                  <ul className="space-y-1">
                    {combo.includes.map((item, idx) => (
                      <li key={idx} className="text-[11px] text-ayur-charcoal-700 flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-ayur-green-800 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-2 border-t border-ayur-border/40">
                  <div className="flex items-baseline gap-2 mb-2.5">
                    <span className="text-base font-semibold text-ayur-charcoal-900">₹{combo.price}</span>
                    <span className="text-xs text-ayur-charcoal-400 line-through">₹{combo.mrp}</span>
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded-sm">
                      Save ₹{combo.mrp - combo.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddBundleToCart(combo)}
                    className="w-full py-2 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-md text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Set to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

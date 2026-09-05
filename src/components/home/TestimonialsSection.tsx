'use client';

import React from 'react';
import Link from 'next/link';
import { Star, CheckCircle } from 'lucide-react';
import { SEED_REVIEWS } from '@/lib/data/reviews';
import { PRODUCTS } from '@/lib/data/products';

export function TestimonialsSection() {
  const testimonials = SEED_REVIEWS.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-ayur-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-ayur-green-900 block mb-1">
            Verified Customer Notes
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal">
            Customer Experiences
          </h2>
          <p className="text-xs sm:text-sm text-ayur-charcoal-600 mt-1.5">
            Authentic feedback from households using Patanjali products across India.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {testimonials.map((t) => {
            const product = PRODUCTS.find((p) => p.id === t.productId);
            return (
              <div
                key={t.id}
                className="bg-[#FAF8F5] rounded-md border border-ayur-border p-4 hover:border-ayur-charcoal-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  {/* Rating & Verified badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex text-ayur-amber-600">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    {t.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200/50">
                        <CheckCircle className="w-3 h-3 text-emerald-700" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Comment */}
                  <h4 className="text-xs font-semibold text-ayur-charcoal-900 mb-1 leading-snug">
                    &ldquo;{t.title}&rdquo;
                  </h4>
                  <p className="text-[11px] sm:text-xs text-ayur-charcoal-700 leading-relaxed line-clamp-4">
                    {t.comment}
                  </p>
                </div>

                {/* Author & Product attribution */}
                <div className="pt-3 mt-3 border-t border-ayur-border/50">
                  <div className="flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-semibold text-ayur-charcoal-900">{t.userName}</p>
                      <p className="text-[10px] text-ayur-charcoal-500">{t.userLocation}</p>
                    </div>
                    <span className="text-[10px] text-ayur-charcoal-400">{t.date}</span>
                  </div>

                  {product && (
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-2 pt-2 border-t border-ayur-border/40 text-[11px] font-medium text-ayur-green-900 hover:underline flex items-center gap-2"
                    >
                      <div className="w-5 h-5 rounded-xs overflow-hidden bg-white shrink-0 border border-ayur-border/40 p-0.5">
                        <img
                          src={product.thumbnail || product.images[0]}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="truncate">{product.name}</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

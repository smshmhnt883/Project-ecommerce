'use client';

import React from 'react';
import { ShieldCheck, Lock, RefreshCw, Truck } from 'lucide-react';

export function TrustBar() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: '100% Genuine Products',
      subtitle: 'Authentic Patanjali batch packaging',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      subtitle: 'Encrypted UPI, Cards, Net Banking & COD',
    },
    {
      icon: RefreshCw,
      title: 'Direct Dispatch',
      subtitle: 'Fresh inventory direct from central hubs',
    },
    {
      icon: Truck,
      title: 'Pan-India Express',
      subtitle: 'Fast delivery across 28,000+ PIN codes',
    },
  ];

  return (
    <section className="bg-white border-b border-ayur-border py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#FAF8F5] border border-ayur-border flex items-center justify-center text-ayur-green-900 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-ayur-charcoal-900 leading-snug">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-ayur-charcoal-500 mt-0.5 leading-tight">
                    {b.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

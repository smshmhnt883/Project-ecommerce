'use client';

import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Product } from '@/types';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  const toggleAccordion = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto mb-16 bg-white rounded-2xl border border-ayur-border divide-y divide-ayur-border shadow-soft overflow-hidden">
      {/* 1. Full Description */}
      <div>
        <button
          type="button"
          onClick={() => toggleAccordion('description')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-ayur-cream/40 transition-colors"
        >
          <span className="font-serif text-base font-semibold text-ayur-charcoal-900">
            Full Description & Craftsmanship
          </span>
          <ChevronDown
            className={`w-4 h-4 text-ayur-charcoal-500 transition-transform ${
              expandedSection === 'description' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'description' && (
          <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-ayur-charcoal-700 leading-relaxed">
            <p>{product.description}</p>
          </div>
        )}
      </div>

      {/* 2. Authentic Ingredients */}
      <div>
        <button
          type="button"
          onClick={() => toggleAccordion('ingredients')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-ayur-cream/40 transition-colors"
        >
          <span className="font-serif text-base font-semibold text-ayur-charcoal-900">
            Authentic Ayurvedic Ingredients
          </span>
          <ChevronDown
            className={`w-4 h-4 text-ayur-charcoal-500 transition-transform ${
              expandedSection === 'ingredients' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'ingredients' && (
          <div className="px-6 pb-6 pt-2 space-y-3">
            <p className="text-xs text-ayur-charcoal-600">
              Formulated using classical botanical actives referenced in Ayurvedic Dravyaguna texts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {product.ingredients.map((ing, idx) => (
                <div key={idx} className="p-3 bg-ayur-ivory rounded-lg border border-ayur-border">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-ayur-charcoal-900">{ing.name}</span>
                    {ing.botanicalName && (
                      <span className="text-[11px] font-serif italic text-ayur-green-800">
                        {ing.botanicalName}
                      </span>
                    )}
                  </div>
                  {ing.purpose && (
                    <p className="text-[11px] text-ayur-charcoal-600 mt-1">{ing.purpose}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Ayurvedic Benefits */}
      <div>
        <button
          type="button"
          onClick={() => toggleAccordion('benefits')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-ayur-cream/40 transition-colors"
        >
          <span className="font-serif text-base font-semibold text-ayur-charcoal-900">
            Traditional Benefits & Daily Use
          </span>
          <ChevronDown
            className={`w-4 h-4 text-ayur-charcoal-500 transition-transform ${
              expandedSection === 'benefits' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'benefits' && (
          <div className="px-6 pb-6 pt-2">
            <ul className="space-y-2 text-xs sm:text-sm text-ayur-charcoal-700">
              {product.benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-ayur-green-800 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4. How to Use & Rituals */}
      <div>
        <button
          type="button"
          onClick={() => toggleAccordion('usage')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-ayur-cream/40 transition-colors"
        >
          <span className="font-serif text-base font-semibold text-ayur-charcoal-900">
            How to Use & Storage
          </span>
          <ChevronDown
            className={`w-4 h-4 text-ayur-charcoal-500 transition-transform ${
              expandedSection === 'usage' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'usage' && (
          <div className="px-6 pb-6 pt-2 space-y-3 text-xs sm:text-sm text-ayur-charcoal-700">
            <div>
              <h5 className="font-semibold text-ayur-charcoal-900 mb-1">Recommended Usage:</h5>
              <p className="leading-relaxed">{product.usage}</p>
            </div>
            {product.storage && (
              <div>
                <h5 className="font-semibold text-ayur-charcoal-900 mb-1">Storage Guidelines:</h5>
                <p className="leading-relaxed">{product.storage}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Manufacturer & Product Information */}
      <div>
        <button
          type="button"
          onClick={() => toggleAccordion('info')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-ayur-cream/40 transition-colors"
        >
          <span className="font-serif text-base font-semibold text-ayur-charcoal-900">
            Manufacturer & Compliance Information
          </span>
          <ChevronDown
            className={`w-4 h-4 text-ayur-charcoal-500 transition-transform ${
              expandedSection === 'info' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSection === 'info' && (
          <div className="px-6 pb-6 pt-2 text-xs space-y-2 text-ayur-charcoal-700">
            <p>
              <span className="font-semibold text-ayur-charcoal-900">Manufactured By: </span>
              {product.manufacturer.name}
            </p>
            <p>
              <span className="font-semibold text-ayur-charcoal-900">Manufacturing Facility: </span>
              {product.manufacturer.address}
            </p>
            <p>
              <span className="font-semibold text-ayur-charcoal-900">Ayurvedic Drug License: </span>
              {product.manufacturer.license}
            </p>
            {product.manufacturer.fssai && (
              <p>
                <span className="font-semibold text-ayur-charcoal-900">FSSAI Registration: </span>
                {product.manufacturer.fssai}
              </p>
            )}
            <p>
              <span className="font-semibold text-ayur-charcoal-900">Shelf Life: </span>
              {product.manufacturer.shelfLife}
            </p>
            <p>
              <span className="font-semibold text-ayur-charcoal-900">Country of Origin: </span>
              {product.manufacturer.countryOfOrigin}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

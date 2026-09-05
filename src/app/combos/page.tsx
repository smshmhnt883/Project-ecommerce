import { CombosSection } from '@/components/home/CombosSection';
import Link from 'next/link';
import { ChevronRight, Percent } from 'lucide-react';

export const metadata = {
  title: 'Curated Combos & Gifting Sets | Authentic Patanjali Store',
  description: 'Hand-picked Ayurvedic wellness kits, hair care rituals, and gifting bundles with exclusive bundle discounts.',
};

export default function CombosPage() {
  return (
    <div className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-ayur-charcoal-500 mb-6">
          <Link href="/" className="hover:text-ayur-green-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-ayur-charcoal-400" />
          <span className="text-ayur-charcoal-800 font-medium">Combos & Bundles</span>
        </nav>

        <div className="pb-6 border-b border-ayur-border">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-ayur-green-50 border border-ayur-green-200 text-ayur-green-900 text-[11px] font-medium uppercase tracking-wider mb-2">
            <Percent className="w-3 h-3 text-ayur-green-800" />
            <span>Value Bundles</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal">
            Curated Ayurvedic Combos & Bundles
          </h1>
          <p className="text-xs sm:text-sm text-ayur-charcoal-600 mt-2 max-w-2xl leading-relaxed">
            Thoughtfully paired collections designed for daily living. Authentic Patanjali product sets with special bundle savings.
          </p>
        </div>
      </div>

      <CombosSection />
    </div>
  );
}

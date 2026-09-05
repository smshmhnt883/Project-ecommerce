'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Thank you for subscribing to Ayurvedic wellness updates!', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-ayur-green-950 text-ayur-sand/90 pt-16 pb-12 border-t border-ayur-green-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-ayur-green-800/80">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-ayur-green-900/80 text-ayur-amber-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">100% Authentic</h4>
              <p className="text-xs text-ayur-sand/70 mt-0.5 leading-relaxed">Direct from Patanjali Food & Herbal Park, Haridwar.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-ayur-green-900/80 text-ayur-amber-500 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">Pan-India Delivery</h4>
              <p className="text-xs text-ayur-sand/70 mt-0.5 leading-relaxed">Free standard delivery on all orders above ₹499.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-ayur-green-900/80 text-ayur-amber-500 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">Hassle-Free Returns</h4>
              <p className="text-xs text-ayur-sand/70 mt-0.5 leading-relaxed">7-day replacement for transit damaged products.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-ayur-green-900/80 text-ayur-amber-500 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">Secure Payments</h4>
              <p className="text-xs text-ayur-sand/70 mt-0.5 leading-relaxed">Encrypted UPI, Cards, Net Banking & COD.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-14 border-b border-ayur-green-800/80 text-sm">
          {/* Col 1: Shop */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-xs tracking-widest uppercase">SHOP</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/category/personal-care" className="hover:text-white transition-colors">Personal Care</Link></li>
              <li><Link href="/category/hair-care" className="hover:text-white transition-colors">Hair Care</Link></li>
              <li><Link href="/category/skin-care" className="hover:text-white transition-colors">Skin Care</Link></li>
              <li><Link href="/category/health-wellness" className="hover:text-white transition-colors">Health & Wellness</Link></li>
              <li><Link href="/category/food-beverages" className="hover:text-white transition-colors">Food & Beverages</Link></li>
              <li><Link href="/category/home-care" className="hover:text-white transition-colors">Home Care</Link></li>
              <li><Link href="/combos" className="hover:text-white transition-colors text-ayur-terracotta-500 font-medium">Curated Combos</Link></li>
            </ul>
          </div>

          {/* Col 2: Customer Care */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-xs tracking-widest uppercase">CUSTOMER CARE</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><span className="text-ayur-sand/70">Support: Mon-Sat 9 AM - 7 PM</span></li>
              <li><span className="text-ayur-sand/70">Email: support@ayur-marketplace.in</span></li>
              <li><span className="text-ayur-sand/70">Toll Free: 1800-180-4180</span></li>
            </ul>
          </div>

          {/* Col 3: Account */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-xs tracking-widest uppercase">ACCOUNT</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Register Account</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Previous Orders</Link></li>
              <li><Link href="/account/addresses" className="hover:text-white transition-colors">Saved Addresses</Link></li>
              <li><Link href="/account/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div className="space-y-3">
            <h5 className="text-white font-semibold text-xs tracking-widest uppercase">LEGAL & POLICIES</h5>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Refund & Replacement Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Shipping & Dispatch Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">FSSAI & GMP Compliance</span></li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h5 className="text-white font-semibold text-xs tracking-widest uppercase">DISCOVER WELLNESS</h5>
            <p className="text-xs text-ayur-sand/70 leading-relaxed">
              Subscribe to receive updates on authentic Ayurvedic formulations, seasonal wellness tips, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-ayur-green-900 border border-ayur-green-800 rounded-md py-2.5 px-3 text-xs text-white placeholder-ayur-sand/50 focus:outline-none focus:border-ayur-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-ayur-amber-500 hover:bg-ayur-amber-600 text-ayur-green-950 font-semibold text-xs py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            {isSubscribed && (
              <p className="text-[11px] text-emerald-400">✓ You are subscribed to updates.</p>
            )}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ayur-sand/60">
          <div className="text-center md:text-left">
            <p>© {new Date().getFullYear()} Ayurveda & Botanicals Marketplace. Selling authentic Patanjali products in India.</p>
            <p className="text-[11px] text-ayur-sand/50 mt-1">
              Disclaimer: Statements regarding traditional Ayurvedic properties are derived from classical texts and are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-[11px] bg-ayur-green-900/60 px-3 py-1.5 rounded border border-ayur-green-800/80">
            <span className="font-semibold text-ayur-sand/80">ACCEPTED PAYMENTS:</span>
            <span>UPI</span>
            <span>•</span>
            <span>RuPay</span>
            <span>•</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>Net Banking</span>
            <span>•</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

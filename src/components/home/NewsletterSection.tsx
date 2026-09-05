'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      showToast('Please provide a valid email address.', 'error');
      return;
    }

    setIsSuccess(true);
    showToast('You are now subscribed to Ayurvedic updates!', 'success');
  };

  return (
    <section className="py-16 sm:py-20 bg-ayur-cream/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-full bg-ayur-green-900 text-white flex items-center justify-center mx-auto mb-4">
          <Mail className="w-5 h-5" />
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl text-ayur-green-950 font-normal">
          Discover Everyday Wellness
        </h2>

        <p className="text-xs sm:text-sm text-ayur-charcoal-700 mt-2 max-w-md mx-auto leading-relaxed">
          Get product updates, offers and wellness inspiration.
        </p>

        {isSuccess ? (
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl inline-flex items-center gap-2 text-emerald-900 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you for subscribing! Your ₹100 welcome code has been sent.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-ayur-border text-xs sm:text-sm bg-white text-ayur-charcoal-900 placeholder-ayur-charcoal-400 focus:outline-none focus:border-ayur-green-800"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-ayur-green-900 hover:bg-ayur-green-800 text-white font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {error && <p className="text-xs text-red-600 mt-2 text-left">{error}</p>}
            <p className="text-[11px] text-ayur-charcoal-500 mt-2.5">
              By subscribing, you agree to receive authentic Ayurvedic updates. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-ayur-ivory min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-ayur-border shadow-soft p-6 sm:p-10 space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-ayur-green-800 block mb-1">
            ACCOUNT RECOVERY
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal">
            Reset Password
          </h1>
          <p className="text-xs text-ayur-charcoal-600 mt-2">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-3 text-center animate-in fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-semibold text-sm">Recovery Link Dispatched</h4>
            <p className="text-emerald-800 leading-relaxed">
              We have sent a secure password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block px-5 py-2 bg-ayur-green-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-ayur-charcoal-800 block mb-1">
                Registered Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@example.com"
                  className="w-full pl-3 pr-10 py-2.5 bg-ayur-ivory border border-ayur-border rounded-lg text-xs focus:outline-none focus:border-ayur-green-800"
                />
                <Mail className="w-4 h-4 text-ayur-charcoal-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>SEND RECOVERY LINK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-ayur-border text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-ayur-green-900 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';

  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms & Conditions to proceed.');
      return;
    }

    const res = await register({ name, email, phone, password });
    if (res.success) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'patanjali_pending_reg',
          JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
          })
        );
      }
      setIsSuccess(true);
      setTimeout(() => {
        router.push(
          `/verify?email=${encodeURIComponent(email.trim())}&redirect=${encodeURIComponent(redirectTarget)}`
        );
      }, 1000);
    } else {
      setErrorMessage(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-ayur-border shadow-soft p-6 sm:p-10 space-y-6">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-ayur-green-800 block mb-1">
          JOIN AYURVEDIC WELLNESS
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-ayur-green-950 font-normal">
          Create an Account
        </h1>
        <p className="text-xs text-ayur-charcoal-600 mt-2">
          Enjoy personalized orders, seamless pan-India delivery, and authentic Patanjali care.
        </p>
      </div>

      {isSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Account created! Redirecting to email verification...</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <div className="space-y-4">
        <GoogleSignInButton
          redirectTarget={redirectTarget}
          text="Continue with Google"
        />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-ayur-border w-full"></div>
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-ayur-charcoal-500 font-medium shrink-0">
            or register with email
          </span>
          <div className="border-t border-ayur-border w-full"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="font-semibold text-ayur-charcoal-800 block mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Chandra"
            className="w-full px-3 py-2.5 bg-ayur-ivory border border-ayur-border rounded-lg text-xs focus:outline-none focus:border-ayur-green-800"
          />
        </div>

        <div>
          <label className="font-semibold text-ayur-charcoal-800 block mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. ramesh.chandra@example.com"
            className="w-full px-3 py-2.5 bg-ayur-ivory border border-ayur-border rounded-lg text-xs focus:outline-none focus:border-ayur-green-800"
          />
        </div>

        <div>
          <label className="font-semibold text-ayur-charcoal-800 block mb-1">
            Mobile Number (10 Digits) *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-ayur-border bg-ayur-cream text-ayur-charcoal-600 text-xs">
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="9876543210"
              className="w-full px-3 py-2.5 bg-ayur-ivory border border-ayur-border rounded-r-lg text-xs focus:outline-none focus:border-ayur-green-800"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-ayur-charcoal-800 block mb-1">
            Password (Min. 6 Characters) *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-3 pr-10 py-2.5 bg-ayur-ivory border border-ayur-border rounded-lg text-xs focus:outline-none focus:border-ayur-green-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-ayur-charcoal-400 hover:text-ayur-charcoal-700 absolute right-2.5 top-1/2 -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="font-semibold text-ayur-charcoal-800 block mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 bg-ayur-ivory border border-ayur-border rounded-lg text-xs focus:outline-none focus:border-ayur-green-800"
          />
        </div>

        <div className="flex items-start pt-1">
          <input
            type="checkbox"
            id="agree-terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded text-ayur-green-900 accent-ayur-green-900 w-3.5 h-3.5 mt-0.5"
          />
          <label htmlFor="agree-terms" className="ml-2 text-[11px] text-ayur-charcoal-600 leading-tight">
            I agree to the Patanjali store Terms of Service and Privacy Policy.
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-ayur-green-900 hover:bg-ayur-green-800 text-white rounded-lg font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-md mt-2"
        >
          {isLoading ? (
            <span>Creating Account...</span>
          ) : (
            <>
              <span>CREATE ACCOUNT</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-ayur-border text-center text-xs text-ayur-charcoal-600">
        <span>Already have an account? </span>
        <Link href={`/login${redirectTarget !== '/account' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`} className="font-semibold text-ayur-green-900 hover:underline">
          Sign In Here
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="py-12 sm:py-20 bg-ayur-ivory min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-xs text-ayur-charcoal-500">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
